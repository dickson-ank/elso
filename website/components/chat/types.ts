interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  files?: File[];
  timestamp: Date;
}

interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
}

interface HeaderProps {
  userName: string;
  onLogout: () => void;
}

interface ChatPageProps {
  onLogout: () => void;
}

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onMobileUploadToggle: () => void;
  fileCount: number;
}

interface MessageBubbleProps {
  message: Message;
}

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
}

interface UploadAreaProps {
  uploadedFiles: UploadedFile[];
  onFileUpload: (files: FileList) => void;
  onRemoveFile: (fileId: string) => void;
}
