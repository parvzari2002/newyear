import initSqlJs, { Database as SqlJsDatabase } from 'sql.js'
import { ContentItem } from './types'
import { defaultContent } from './data'
import fs from 'fs'
import path from 'path'

let db: SqlJsDatabase | null = null
let sqlJsModule: any = null

// Database file path
const dbPath = path.join(process.cwd(), 'data', 'content.db')
const dbDir = path.join(process.cwd(), 'data')

// Initialize SQL.js
async function initSqlJsModule() {
  if (sqlJsModule) {
    return sqlJsModule
  }

  try {
    // For Node.js/serverless, we need to provide the WASM file
    // sql.js will work in-memory without needing the WASM file in most cases
    sqlJsModule = await initSqlJs({
      locateFile: (file: string) => {
        // In serverless, we can use CDN or bundle the WASM
        // For now, use CDN which works in most environments
        return `https://sql.js.org/dist/${file}`
      },
    })
    return sqlJsModule
  } catch (error) {
    console.error('Failed to initialize SQL.js:', error)
    // Try without locateFile as fallback
    try {
      sqlJsModule = await initSqlJs()
      return sqlJsModule
    } catch (fallbackError) {
      console.error('Fallback SQL.js initialization also failed:', fallbackError)
      throw error
    }
  }
}

// Initialize database
export async function initDatabase(): Promise<SqlJsDatabase> {
  if (db) {
    return db
  }

  try {
    const SQL = await initSqlJsModule()
    
    // Check if we're in a serverless environment
    const isServerless = process.env.NETLIFY || process.env.VERCEL

    if (!isServerless && typeof fs !== 'undefined' && fs.existsSync) {
      // Local development - try to load from file
      try {
        if (fs.existsSync(dbPath)) {
          const buffer = fs.readFileSync(dbPath)
          db = new SQL.Database(buffer)
          console.log('Loaded file-based SQLite database')
        } else {
          // Create new database
          db = new SQL.Database()
          console.log('Created new file-based SQLite database')
        }
      } catch (error) {
        // Fallback to in-memory
        console.log('File-based database failed, using in-memory database')
        db = new SQL.Database()
      }
    } else {
      // Serverless environment - use in-memory database
      db = new SQL.Database()
      console.log('Using in-memory SQLite database (serverless mode)')
    }

    // Create table if it doesn't exist
    db.run(`
      CREATE TABLE IF NOT EXISTS content (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        imageUrl TEXT,
        videoUrl TEXT,
        category TEXT NOT NULL,
        tags TEXT NOT NULL,
        enabled INTEGER NOT NULL DEFAULT 1,
        createdAt TEXT NOT NULL
      )
    `)

    // Initialize with default content if table is empty
    const result = db.exec('SELECT COUNT(*) as count FROM content')
    const count = result.length > 0 && result[0].values.length > 0 
      ? result[0].values[0][0] as number 
      : 0

    if (count === 0) {
      initializeDefaultContent()
    }

    // Save to file if not serverless
    if (!isServerless && typeof fs !== 'undefined' && fs.existsSync) {
      try {
        if (!fs.existsSync(dbDir)) {
          fs.mkdirSync(dbDir, { recursive: true })
        }
        const data = db.export()
        const buffer = Buffer.from(data)
        fs.writeFileSync(dbPath, buffer)
      } catch (error) {
        console.log('Could not save database to file:', error)
      }
    }

    return db
  } catch (error) {
    console.error('Database initialization error:', error)
    throw error
  }
}

function initializeDefaultContent() {
  if (!db) return

  const insert = db.prepare(`
    INSERT INTO content (id, type, title, content, imageUrl, videoUrl, category, tags, enabled, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  for (const item of defaultContent) {
    insert.run([
      item.id,
      item.type,
      item.title,
      item.content,
      item.imageUrl || null,
      item.videoUrl || null,
      JSON.stringify(item.category),
      JSON.stringify(item.tags),
      item.enabled ? 1 : 0,
      item.createdAt,
    ])
  }

  insert.free()
}

// Get database instance (async)
export async function getDatabase(): Promise<SqlJsDatabase> {
  if (!db) {
    return await initDatabase()
  }
  return db
}

// Save database to file (for local development)
async function saveDatabase() {
  if (!db) return

  const isServerless = process.env.NETLIFY || process.env.VERCEL
  if (isServerless || typeof fs === 'undefined' || !fs.existsSync) {
    return // Don't save in serverless
  }

  try {
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true })
    }
    const data = db.export()
    const buffer = Buffer.from(data)
    fs.writeFileSync(dbPath, buffer)
  } catch (error) {
    console.log('Could not save database to file:', error)
  }
}

// Content operations
export async function getAllContent(): Promise<ContentItem[]> {
  const database = await getDatabase()
  const result = database.exec('SELECT * FROM content ORDER BY createdAt DESC')

  if (result.length === 0) {
    return []
  }

  const rows = result[0].values
  return rows.map((row: any) => ({
    id: row[0],
    type: row[1] as ContentItem['type'],
    title: row[2],
    content: row[3],
    imageUrl: row[4] || undefined,
    videoUrl: row[5] || undefined,
    category: JSON.parse(row[6]),
    tags: JSON.parse(row[7]),
    enabled: row[8] === 1,
    createdAt: row[9],
  }))
}

export async function getContentById(id: string): Promise<ContentItem | null> {
  const database = await getDatabase()
  const stmt = database.prepare('SELECT * FROM content WHERE id = ?')
  stmt.bind([id])
  
  if (!stmt.step()) {
    stmt.free()
    return null
  }

  const row = stmt.getAsObject() as any
  stmt.free()

  return {
    id: row.id,
    type: row.type as ContentItem['type'],
    title: row.title,
    content: row.content,
    imageUrl: row.imageUrl || undefined,
    videoUrl: row.videoUrl || undefined,
    category: JSON.parse(row.category),
    tags: JSON.parse(row.tags),
    enabled: row.enabled === 1,
    createdAt: row.createdAt,
  }
}

export async function createContent(item: ContentItem): Promise<ContentItem> {
  const database = await getDatabase()
  const stmt = database.prepare(`
    INSERT INTO content (id, type, title, content, imageUrl, videoUrl, category, tags, enabled, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  stmt.run([
    item.id,
    item.type,
    item.title,
    item.content,
    item.imageUrl || null,
    item.videoUrl || null,
    JSON.stringify(item.category),
    JSON.stringify(item.tags),
    item.enabled ? 1 : 0,
    item.createdAt,
  ])

  stmt.free()
  await saveDatabase()

  return item
}

export async function updateContent(id: string, updates: Partial<ContentItem>): Promise<ContentItem | null> {
  const database = await getDatabase()
  const existing = await getContentById(id)
  if (!existing) return null

  const updated: ContentItem = {
    ...existing,
    ...updates,
    id, // Ensure ID doesn't change
  }

  const stmt = database.prepare(`
    UPDATE content 
    SET type = ?, title = ?, content = ?, imageUrl = ?, videoUrl = ?, 
        category = ?, tags = ?, enabled = ?
    WHERE id = ?
  `)

  stmt.run([
    updated.type,
    updated.title,
    updated.content,
    updated.imageUrl || null,
    updated.videoUrl || null,
    JSON.stringify(updated.category),
    JSON.stringify(updated.tags),
    updated.enabled ? 1 : 0,
    id,
  ])

  stmt.free()
  await saveDatabase()

  return updated
}

export async function deleteContent(id: string): Promise<boolean> {
  const database = await getDatabase()
  const stmt = database.prepare('DELETE FROM content WHERE id = ?')
  stmt.run([id])
  const changes = database.getRowsModified()
  stmt.free()
  await saveDatabase()

  return changes > 0
}

// Close database connection (useful for cleanup)
export function closeDatabase() {
  if (db) {
    db.close()
    db = null
  }
}
