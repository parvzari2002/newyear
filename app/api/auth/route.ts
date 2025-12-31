import { NextRequest, NextResponse } from 'next/server'

// Admin credentials - secure and private
// Can be overridden with environment variables for additional security
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'parvzari2002'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Parvej2026#'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    // Secure authentication check
    // Credentials are stored server-side and never exposed to clients
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Authentication successful
      return NextResponse.json({ success: true, authenticated: true })
    }

    // Return generic error to prevent credential enumeration
    return NextResponse.json(
      { success: false, authenticated: false, error: 'Invalid credentials' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Authentication error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}

