// API client for communicating with backend services
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface AnalysisResponse {
  fileId: string
  fileName: string
  analysis: string
  confidence: number
  findings: string[]
}

export interface ChatResponse {
  messageId: string
  content: string
  timestamp: string
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const data = await response.json()
      return {
        success: true,
        data,
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      console.error(`[API Error] ${endpoint}:`, errorMessage)
      return {
        success: false,
        error: errorMessage,
      }
    }
  }

  async uploadFiles(files: File[]): Promise<ApiResponse<AnalysisResponse[]>> {
    try {
      const formData = new FormData()
      files.forEach((file) => {
        formData.append("files", file)
      })

      const response = await fetch(`${this.baseUrl}/api/analyze`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      const data = await response.json()
      return {
        success: true,
        data,
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "File upload failed"
      return {
        success: false,
        error: errorMessage,
      }
    }
  }

  async sendMessage(message: string, fileIds: string[]): Promise<ApiResponse<ChatResponse>> {
    return this.request<ChatResponse>("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        message,
        fileIds,
      }),
    })
  }

  async analyzeFiles(fileIds: string[]): Promise<ApiResponse<AnalysisResponse[]>> {
    return this.request<AnalysisResponse[]>("/api/analyze", {
      method: "POST",
      body: JSON.stringify({
        fileIds,
      }),
    })
  }

  async getAnalysisHistory(limit = 10): Promise<ApiResponse<AnalysisResponse[]>> {
    return this.request<AnalysisResponse[]>(`/api/history?limit=${limit}`)
  }
}

export const apiClient = new ApiClient()
