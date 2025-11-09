interface FileItemProps {
  id: string;
  name: string;
  size: number;
  icon: React.ReactNode;
  onRemove: (id: string) => void;
}

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoCapitalize?: string;
  autoCorrect?: string;
}