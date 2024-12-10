import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const BASE_DIR = path.join(process.cwd(), 'public', 'files')

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const requestedPath = searchParams.get('path') || '/'

  const fullPath = path.join(BASE_DIR, requestedPath)

  try {
    const stats = await fs.stat(fullPath)

    if (stats.isDirectory()) {
      const files = await fs.readdir(fullPath)
      const filePromises = files.map(async (file) => {
        const filePath = path.join(fullPath, file)
        const fileStats = await fs.stat(filePath)
        return {
          name: file,
          type: fileStats.isDirectory() ? 'directory' : 'file',
        }
      })
      const fileList = await Promise.all(filePromises)
      return NextResponse.json(fileList)
    } else {
      const fileBuffer = await fs.readFile(fullPath)
      const response = new NextResponse(fileBuffer)
      
      const ext = path.extname(fullPath).toLowerCase()
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
    return NextResponse.json({ error: 'File or directory not found' }, { status: 404 })
  }
}

export async function PUT(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const requestedPath = searchParams.get('path') || '/'

  const fullPath = path.join(BASE_DIR, requestedPath)

  try {
    const content = await request.text()
    await fs.writeFile(fullPath, content, 'utf-8')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to save file' }, { status: 500 })
  }
}

