export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-transparent border-t-primary"></div>
        <p className="mt-4 text-foreground text-sm">Loading...</p>
      </div>
    </div>
  );
}
