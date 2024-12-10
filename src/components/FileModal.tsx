'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface FileModalProps {
  isOpen: boolean
  onClose: () => void
  filePath: string
}

export function FileModal({ isOpen, onClose, filePath }: FileModalProps) {
  const [content, setContent] = useState<string>('')
  const [isImage, setIsImage] = useState(false)
  const [isEditable, setIsEditable] = useState(false)

  useEffect(() => {
    if (isOpen && filePath) {
      fetchFileContent()
    }
  }, [isOpen, filePath])

  const fetchFileContent = async () => {
    try {
      const response = await fetch(`/api/files?path=${encodeURIComponent(filePath)}`)
      const contentType = response.headers.get('Content-Type') || ''

      if (contentType.startsWith('image/')) {
        setIsImage(true)
        setIsEditable(false)
        setContent(filePath)
      } else {
        setIsImage(false)
        setIsEditable(['text/plain', 'text/html', 'text/css', 'application/javascript'].includes(contentType))
        const text = await response.text()
        setContent(text)
      }
    } catch (error) {
      console.error('Error fetching file content:', error)
    }
  }

  const handleSave = async () => {
    if (isEditable) {
      try {
        await fetch(`/api/files?path=${encodeURIComponent(filePath)}`, {
          method: 'PUT',
          body: content,
        })
        onClose()
      } catch (error) {
        console.error('Error saving file:', error)
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-gray-900 text-white">
        <DialogHeader>
          <DialogTitle>{filePath.split('/').pop()}</DialogTitle>
        </DialogHeader>
        {isImage ? (
          <img src={`/files/${filePath}`} alt={filePath} className="max-w-full max-h-[70vh] object-contain" />
        ) : (
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[50vh]"
            readOnly={!isEditable}
          />
        )}
        {isEditable && (
          <div className="flex justify-end space-x-2">
            <Button className='bg-gray-700 hover:bg-gray-800' onClick={onClose}>Cancel</Button>
            <Button className='bg-gray-700 hover:bg-gray-800' onClick={handleSave}>Save</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

