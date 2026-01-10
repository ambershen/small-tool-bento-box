import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileUpload } from '@/components/file-upload';
import { uploadFiles, convertToMarkdown, getDownloadUrl } from '@/lib/api';
import { Loader2, Download, RefreshCw, AlertCircle, FileText, Copy, Check } from 'lucide-react';

export default function PdfToMarkdown() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ filename: string; content: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFileChange = (newFiles: File[]) => {
    if (newFiles.length > 1) {
      setFiles([newFiles[newFiles.length - 1]]);
    } else {
      setFiles(newFiles);
    }
    setResult(null);
    setError(null);
  };

  const handleConvert = async () => {
    if (files.length === 0) {
      setError("Please select a PDF file to convert.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const uploaded = await uploadFiles(files);
      if (uploaded.length === 0) throw new Error("Upload failed");
      
      const serverName = uploaded[0].server_name;
      const conversionResult = await convertToMarkdown(serverName);
      
      setResult({
        filename: conversionResult.output_filename,
        content: conversionResult.markdown_content
      });
    } catch (err: unknown) {
      console.error(err);
      const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      setError(message || "An error occurred during processing.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setResult(null);
    setError(null);
    setCopied(false);
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col h-full">
        <div className="border-b-2 border-brand-black p-8 md:p-12 bg-brand-white transition-colors duration-300 dark:border-brand-white dark:bg-brand-black">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 dark:text-brand-white">PDF to Markdown</h2>
            <p className="text-xl font-mono text-brand-black/60 max-w-2xl dark:text-brand-white/60">Extract text and tables from PDF to Markdown format.</p>
        </div>

        <div className="flex-1 p-8 md:p-12 bg-brand-white transition-colors duration-300 dark:bg-brand-black">
            <div className="grid gap-12 lg:grid-cols-2 h-full">
                {/* Left Column: Upload */}
                <div className="space-y-8">
                    <Card className="border-2 border-brand-black bg-brand-white h-full dark:border-brand-white dark:bg-brand-black">
                        <CardContent className="p-8 space-y-8 h-full flex flex-col justify-center">
                            <FileUpload 
                                value={files} 
                                onChange={handleFileChange} 
                                multiple={false}
                                description="Drag & drop a PDF here, or click to select"
                                className={result ? "h-32 p-4" : ""}
                            />

                            {error && (
                                <div className="flex items-center gap-4 text-sm font-bold uppercase tracking-wide text-brand-coral border-2 border-brand-coral bg-brand-coral/5 p-4">
                                    <AlertCircle className="h-5 w-5" />
                                    {error}
                                </div>
                            )}

                            <Button 
                                onClick={handleConvert} 
                                disabled={files.length === 0 || isProcessing}
                                className="w-full"
                                size="lg"
                            >
                                {isProcessing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                                </>
                                ) : (
                                "Convert to Markdown"
                                )}
                            </Button>
                            
                            {result && (
                                <Button variant="outline" onClick={handleReset} className="w-full">
                                    <RefreshCw className="mr-2 h-4 w-4" /> Convert Another File
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Preview */}
                <div className="space-y-8 h-full">
                    <div className="border-2 border-brand-black bg-brand-black h-full min-h-[500px] flex flex-col dark:border-brand-white">
                        <div className="flex items-center justify-between p-6 border-b-2 border-brand-white/10 bg-brand-black transition-colors duration-300">
                            <h3 className="font-bold text-brand-white uppercase tracking-wider flex items-center">
                                <FileText className="mr-2 h-5 w-5 text-brand-coral" /> Preview
                            </h3>
                            {result && (
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-10 border border-brand-white/20 text-brand-white hover:bg-brand-white hover:text-brand-black">
                                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                    <a href={getDownloadUrl(result.filename)} download>
                                        <Button size="sm" className="h-10 bg-brand-coral border-brand-coral text-brand-white hover:bg-brand-white hover:text-brand-coral">
                                            <Download className="mr-2 h-4 w-4" /> Download .md
                                        </Button>
                                    </a>
                                </div>
                            )}
                        </div>
                        
                        <div className="flex-1 p-6 overflow-auto bg-brand-black font-mono text-sm text-brand-white/80 selection:bg-brand-coral selection:text-brand-white transition-colors duration-300">
                            {result ? (
                                <pre className="whitespace-pre-wrap leading-relaxed">{result.content}</pre>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-brand-white/20">
                                    <FileText className="h-24 w-24 mb-6 opacity-20" />
                                    <p className="uppercase tracking-widest text-sm">Converted markdown will appear here</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
