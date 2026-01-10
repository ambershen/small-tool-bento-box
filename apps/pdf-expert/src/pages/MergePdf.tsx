import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileUpload } from '@/components/file-upload';
import { uploadFiles, mergePdfs, getDownloadUrl } from '@/lib/api';
import { Loader2, Download, RefreshCw, AlertCircle, Files } from 'lucide-react';

export default function MergePdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isMerging, setIsMerging] = useState(false);
  const [mergedFile, setMergedFile] = useState<{ filename: string; size: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (newFiles: File[]) => {
    setFiles(newFiles);
    setMergedFile(null);
    setError(null);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError("Please select at least 2 PDF files to merge.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const uploaded = await uploadFiles(files);
      
      setIsUploading(false);
      setIsMerging(true);

      const filenames = uploaded.map(f => f.server_name);
      const result = await mergePdfs(filenames);
      
      setMergedFile({
        filename: result.output_filename,
        size: result.file_size
      });
    } catch (err: unknown) {
      console.error(err);
      const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      setError(message || "An error occurred during processing.");
    } finally {
      setIsUploading(false);
      setIsMerging(false);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setMergedFile(null);
    setError(null);
  };

  return (
    <div className="flex flex-col h-full">
        <div className="border-b-2 border-brand-black p-8 md:p-12 bg-brand-white transition-colors duration-300 dark:border-brand-white dark:bg-brand-black">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 dark:text-brand-white">Merge PDF</h2>
            <p className="text-xl font-mono text-brand-black/60 max-w-2xl dark:text-brand-white/60">Combine multiple PDF documents into one.</p>
        </div>

        <div className="flex-1 p-8 md:p-12 bg-brand-white transition-colors duration-300 dark:bg-brand-black">
            <div className="max-w-4xl mx-auto">
                <Card className="border-2 border-brand-black bg-brand-white dark:border-brand-white dark:bg-brand-black">
                    <CardContent className="p-8 space-y-8">
                    {!mergedFile ? (
                        <>
                        <FileUpload 
                            value={files} 
                            onChange={handleFileChange} 
                            multiple={true}
                            description="Drag & drop PDFs here, or click to select multiple files"
                        />

                        {error && (
                            <div className="flex items-center gap-4 text-sm font-bold uppercase tracking-wide text-brand-coral border-2 border-brand-coral bg-brand-coral/5 p-4">
                                <AlertCircle className="h-5 w-5" />
                                {error}
                            </div>
                        )}

                        <div className="flex justify-end">
                            <Button 
                                onClick={handleMerge} 
                                disabled={files.length < 2 || isUploading || isMerging}
                                className="w-full sm:w-auto min-w-[200px]"
                                size="lg"
                            >
                            {isUploading ? (
                                <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
                                </>
                            ) : isMerging ? (
                                <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Merging...
                                </>
                            ) : (
                                "Merge PDFs"
                            )}
                            </Button>
                        </div>
                        </>
                    ) : (
                        <div className="text-center py-12 space-y-8">
                            <div className="inline-flex h-24 w-24 items-center justify-center border-2 border-brand-black bg-brand-black text-brand-white dark:border-brand-white dark:bg-brand-white dark:text-brand-black">
                                <Files className="h-10 w-10" />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-3xl font-black uppercase tracking-tighter dark:text-brand-white">Success!</h3>
                                <p className="text-xl font-mono text-brand-black/60 dark:text-brand-white/60">
                                    Your new PDF ({ (mergedFile.size / 1024 / 1024).toFixed(2) } MB) is ready.
                                </p>
                            </div>

                            <div className="w-full h-[600px] border-2 border-brand-black bg-brand-white dark:border-brand-white dark:bg-brand-black">
                                <iframe 
                                    src={getDownloadUrl(mergedFile.filename, true)} 
                                    className="w-full h-full"
                                    title="PDF Preview"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
                                <a href={getDownloadUrl(mergedFile.filename)} download>
                                <Button size="lg" className="w-full sm:w-auto bg-brand-purple border-brand-purple text-brand-white hover:bg-brand-white hover:text-brand-purple dark:hover:bg-brand-black">
                                    <Download className="mr-2 h-5 w-5" /> Download Merged PDF
                                </Button>
                                </a>
                                <Button variant="outline" size="lg" onClick={handleReset} className="w-full sm:w-auto">
                                    <RefreshCw className="mr-2 h-5 w-5" /> Merge More Files
                                </Button>
                            </div>
                        </div>
                    )}
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
