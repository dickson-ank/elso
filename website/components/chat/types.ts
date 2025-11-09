export interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  files?: File[]
  timestamp: Date
}

export interface UploadedFile {
  id: string
  file: File
  name: string
  size: number
}
