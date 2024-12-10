import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const BASE_DIR = path.join(process.cwd(), 'public', 'files')

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const filePath = path.join(BASE_DIR, ...params.path)

  try {
    const stats = await fs.stat(filePath)

    if (stats.isDirectory()) {
      return NextResponse.json({ error: 'Cannot list directory contents' }, { status: 403 })
    } else {
      const fileBuffer = await fs.readFile(filePath)
      const response = new NextResponse(fileBuffer)
      
      const ext = path.extname(filePath).toLowerCase()
      const mimeTypes: { [key: string]: string } = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.txt': 'text/plain',
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
      }
      
      response.headers.set('Content-Type', mimeTypes[ext] || 'application/octet-stream')
      return response
    }
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }
}

