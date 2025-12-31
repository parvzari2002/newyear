import { NextRequest, NextResponse } from 'next/server'
import { ContentItem, UserType } from '@/lib/types'
import { getContentByType, shuffleArray } from '@/lib/data'
import {
  getAllContent,
  createContent,
  updateContent,
  deleteContent,
  initDatabase,
} from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    // Initialize database if needed
    await initDatabase()
    
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') as UserType | null

    const allContent = await getAllContent()
    let filteredContent = allContent

    if (type) {
      filteredContent = getContentByType(type, allContent)
    }

    // Shuffle for variety
    const shuffled = shuffleArray(filteredContent)

    return NextResponse.json(shuffled)
  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Initialize database if needed
    await initDatabase()
    
    const body = await request.json()
    const content: ContentItem = body

    const created = await createContent(content)

    return NextResponse.json({ success: true, content: created })
  } catch (error) {
    console.error('Error creating content:', error)
    return NextResponse.json({ error: 'Failed to create content' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Initialize database if needed
    await initDatabase()
    
    const body = await request.json()
    const { id, ...updates } = body

    const updated = await updateContent(id, updates)

    if (!updated) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, content: updated })
  } catch (error) {
    console.error('Error updating content:', error)
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Initialize database if needed
    await initDatabase()
    
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const deleted = await deleteContent(id)

    if (!deleted) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting content:', error)
    return NextResponse.json({ error: 'Failed to delete content' }, { status: 500 })
  }
}

