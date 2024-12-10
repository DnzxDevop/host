'use client'

import { useState, useEffect } from 'react'
import { Folder, File, ArrowLeft } from 'lucide-react'
import { FileModal } from './FileModal'

interface FileItem {
  name: string
  type: 'file' | 'directory'
}

export default function FileExplorer({ initialPath = '/' }) {
  const [currentPath, setCurrentPath] = useState(initialPath)
  const [files, setFiles] = useState<FileItem[]>([])
  const [selectedFile, setSelectedFile] = useState<string | null>(null)

  useEffect(() => {
    fetchFiles(currentPath)
  }, [currentPath])

  const fetchFiles = async (path: string) => {
    const response = await fetch(`/api/files?path=${encodeURIComponent(path)}`)
    const data = await response.json()
    setFiles(data)
  }

  const navigateUp = () => {
    const parentPath = currentPath.split('/').slice(0, -1).join('/')
    setCurrentPath(parentPath || '/')
  }

  const navigateTo = (item: FileItem) => {
    if (item.type === 'directory') {
      setCurrentPath(`${currentPath}${currentPath.endsWith('/') ? '' : '/'}${item.name}`)
    } else {
      setSelectedFile(`${currentPath}${currentPath.endsWith('/') ? '' : '/'}${item.name}`)
    }
  }

  return (
    <div>
      <div className="flex items-center mb-4 bg-gray-900 text-white">
        <button onClick={navigateUp} className="mr-2 ">
          <ArrowLeft className="w-5 h-5 " />
        </button>
        <span className="font-mono">{currentPath}</span>
      </div>
      <ul className="space-y-2">
        {files.map((item) => (
          <li
            key={item.name}
            className="flex items-center p-2 hover:bg-gray-800 cursor-pointer text-white"
            onClick={() => navigateTo(item)}
          >
            {item.type === 'directory' ? (
              <Folder className="w-5 h-5 mr-2 text-blue-500" />
            ) : (
              <File className="w-5 h-5 mr-2 text-gray-500" />
            )}
            {item.name}
          </li>
        ))}
      </ul>
      <FileModal
        isOpen={!!selectedFile}
        onClose={() => setSelectedFile(null)}
        filePath={selectedFile || ''}
      />
    </div>
  )
}

