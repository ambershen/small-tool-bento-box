
interface ToolPageProps {
  url: string;
}

export function ToolPage({ url }: ToolPageProps) {
  return (
    <div className="w-full h-[calc(100vh-60px)]">
      <iframe 
        src={url} 
        className="w-full h-full border-0" 
        title="Tool" 
      />
    </div>
  );
}
