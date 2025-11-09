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

interface MessageBubbleProps {
  message: {
    type: "user" | "assistant";
    content: string;
    files?: any[];
    timestamp?: Date;
  };
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

interface ChatAreaProps {
  messages: any[];
  isLoading: boolean;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
}

interface UploadAreaProps {
  uploadedFiles: UploadedFile[];
  onFileUpload: (files: FileList) => void;
  onRemoveFile: (fileId: string) => void;
}
