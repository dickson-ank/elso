const API_BASE_URL = "http://localhost:3000";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AnalysisResponse {
  fileId: string;
  fileName: string;
  analysis: string;
  confidence: number;
  findings: string[];
}

export interface ChatResponse {
  messageId: string;
  content: string;
  timestamp: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error(`[API Error] `, errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  async uploadFiles(files: File[]): Promise<ApiResponse<AnalysisResponse[]>> {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch(`${this.baseUrl}/api/analyze`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "File upload failed";
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  async sendMessage(
    message: string,
    fileIds: string[]
  ): Promise<ApiResponse<ChatResponse>> {
    return this.request<ChatResponse>("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        message,
        fileIds,
      }),
    });
  }

  // ADD THIS NEW METHOD for streaming
  async sendMessageStream(
    messages: Array<{ role: string; content: string }>,
    fileContext?: string,
    onChunk?: (chunk: string) => void,
    onComplete?: (fullText: string) => void,
    onError?: (error: string) => void
  ): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/chat/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages,
          fileContext,
        }),
      });

      if (!response.ok) {
        throw new Error(`Chat request failed: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          if (onComplete) {
            onComplete(fullText);
          }
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;

        if (onChunk) {
          onChunk(chunk);
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Stream failed";
      console.error("[Stream Error]:", errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    }
  }

  async analyzeFiles(
    fileIds: string[]
  ): Promise<ApiResponse<AnalysisResponse[]>> {
    return this.request<AnalysisResponse[]>("/api/analyze", {
      method: "POST",
      body: JSON.stringify({
        fileIds,
      }),
    });
  }

  async getAnalysisHistory(
    limit = 10
  ): Promise<ApiResponse<AnalysisResponse[]>> {
    return this.request<AnalysisResponse[]>(`/api/history?limit=${limit}`);
  }
}

export const apiClient = new ApiClient();
