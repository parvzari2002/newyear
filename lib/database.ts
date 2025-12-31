import Database from 'better-sqlite3'
import { ContentItem } from './types'
import { defaultContent } from './data'
import fs from 'fs'
import path from 'path'

let db: Database.Database | null = null

// Database file path
const dbPath = path.join(process.cwd(), 'data', 'content.db')
const dbDir = path.join(process.cwd(), 'data')

// Initialize database
export function initDatabase(): Database.Database {
  if (db) {
    return db
  }

  try {
    // Check if we're in a serverless environment
    const isServerless = process.env.NETLIFY || process.env.VERCEL || !fs.existsSync

    if (!isServerless) {
      // Local development - try file-based database
      try {
        // Ensure data directory exists
        if (!fs.existsSync(dbDir)) {
          fs.mkdirSync(dbDir, { recursive: true })
        }
        db = new Database(dbPath)
        console.log('Using file-based SQLite database')
      } catch (error) {
        // Fallback to in-memory if file system fails
        console.log('File-based database failed, using in-memory database')
        db = new Database(':memory:')
      }
    } else {
      // Serverless environment - use in-memory database
      db = new Database(':memory:')
      console.log('Using in-memory SQLite database (serverless mode)')
    }

    // Create table if it doesn't exist
    db.exec(`
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
    const count = db.prepare('SELECT COUNT(*) as count FROM content').get() as { count: number }
    if (count.count === 0) {
      initializeDefaultContent()
    }

    return db
  } catch (error) {
    console.error('Database initialization error:', error)
    // Fallback to in-memory database
    db = new Database(':memory:')
    db.exec(`
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
    initializeDefaultContent()
    return db
  }
}

function initializeDefaultContent() {
  if (!db) return

  const insert = db.prepare(`
    INSERT INTO content (id, type, title, content, imageUrl, videoUrl, category, tags, enabled, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const insertMany = db.transaction((items: ContentItem[]) => {
    for (const item of items) {
      insert.run(
        item.id,
        item.type,
        item.title,
        item.content,
        item.imageUrl || null,
        item.videoUrl || null,
        JSON.stringify(item.category),
        JSON.stringify(item.tags),
        item.enabled ? 1 : 0,
        item.createdAt
      )
    }
  })

  insertMany(defaultContent)
}

// Get database instance
export function getDatabase(): Database.Database {
  if (!db) {
    return initDatabase()
  }
  return db
}

// Content operations
export function getAllContent(): ContentItem[] {
  const database = getDatabase()
  const rows = database.prepare('SELECT * FROM content ORDER BY createdAt DESC').all() as any[]

  return rows.map((row) => ({
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
  }))
}

export function getContentById(id: string): ContentItem | null {
  const database = getDatabase()
  const row = database.prepare('SELECT * FROM content WHERE id = ?').get(id) as any

  if (!row) return null

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

export function createContent(item: ContentItem): ContentItem {
  const database = getDatabase()
  const insert = database.prepare(`
    INSERT INTO content (id, type, title, content, imageUrl, videoUrl, category, tags, enabled, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  insert.run(
    item.id,
    item.type,
    item.title,
    item.content,
    item.imageUrl || null,
    item.videoUrl || null,
    JSON.stringify(item.category),
    JSON.stringify(item.tags),
    item.enabled ? 1 : 0,
    item.createdAt
  )

  return item
}

export function updateContent(id: string, updates: Partial<ContentItem>): ContentItem | null {
  const database = getDatabase()
  const existing = getContentById(id)
  if (!existing) return null

  const updated: ContentItem = {
    ...existing,
    ...updates,
    id, // Ensure ID doesn't change
  }

  const update = database.prepare(`
    UPDATE content 
    SET type = ?, title = ?, content = ?, imageUrl = ?, videoUrl = ?, 
        category = ?, tags = ?, enabled = ?
    WHERE id = ?
  `)

  update.run(
    updated.type,
    updated.title,
    updated.content,
    updated.imageUrl || null,
    updated.videoUrl || null,
    JSON.stringify(updated.category),
    JSON.stringify(updated.tags),
    updated.enabled ? 1 : 0,
    id
  )

  return updated
}

export function deleteContent(id: string): boolean {
  const database = getDatabase()
  const result = database.prepare('DELETE FROM content WHERE id = ?').run(id)
  return result.changes > 0
}

// Close database connection (useful for cleanup)
export function closeDatabase() {
  if (db) {
    db.close()
    db = null
  }
}

