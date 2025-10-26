// Type definitions for API requests and responses

export interface AuthRequest {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: {
    id: string
    email: string
    name: string
  }
}

export interface FileAnalysisRequest {
  files: File[]
}

export interface FileAnalysisResponse {
  fileId: string
  fileName: string
  status: "processing" | "completed" | "failed"
  analysis?: {
    summary: string
    findings: string[]
    recommendations: string[]
    confidence: number
  }
  error?: string
}

export interface ChatRequest {
  message: string
  fileIds: string[]
  conversationId?: string
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

export interface ChatResponse {
  conversationId: string
  message: ChatMessage
  relatedFindings?: string[]
}
