import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileUpload } from '@/components/file-upload';
import { uploadFiles, analyzeForm, fillForm, getDownloadUrl } from '@/lib/api';
import { Loader2, Download, RefreshCw, AlertCircle, FileText, ArrowLeft } from 'lucide-react';

export default function FillForm() {
  const [file, setFile] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isFilling, setIsFilling] = useState(false);
  const [fields, setFields] = useState<Record<string, { type: string; value: string; label: string }> | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [uploadedFilename, setUploadedFilename] = useState<string | null>(null);
  const [filledFile, setFilledFile] = useState<{ filename: string; size: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (newFiles: File[]) => {
    if (newFiles.length === 0) {
        setFile([]);
        setFields(null);
        return;
    }
    
    setFile([newFiles[0]]); // Only allow 1 file
    setFilledFile(null);
    setError(null);
    setFields(null);
    setIsUploading(true);

    try {
      const uploaded = await uploadFiles([newFiles[0]]);
      const serverName = uploaded[0].server_name;
      setUploadedFilename(serverName);
      
      setIsUploading(false);
      setIsAnalyzing(true);
      
      const result = await analyzeForm(serverName);
      setFields(result.fields);
      
      // Initialize form values
      const initialValues: Record<string, string> = {};
      Object.entries(result.fields).forEach(([key, data]) => {
          initialValues[key] = data.value || '';
      });
      setFormValues(initialValues);
      
    } catch (err: unknown) {
      console.error(err);
      const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      setError(message || "Failed to analyze PDF form.");
      setFile([]);
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };

  const handleInputChange = (key: string, value: string) => {
      setFormValues(prev => ({ ...prev, [key]: value }));
  };

  const handleFill = async () => {
      if (!uploadedFilename) return;
      
      setIsFilling(true);
      setError(null);
      
      try {
          const result = await fillForm(uploadedFilename, formValues);
          setFilledFile({
              filename: result.output_filename,
              size: result.file_size
          });
      } catch (err: unknown) {
          console.error(err);
          const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
          setError(message || "Failed to fill PDF form.");
      } finally {
          setIsFilling(false);
      }
  };

  const handleReset = () => {
    setFile([]);
    setFields(null);
    setFormValues({});
    setUploadedFilename(null);
    setFilledFile(null);
    setError(null);
  };

  const handleBack = () => {
    setFilledFile(null);
    setError(null);
  };

  return (
    <div className="flex flex-col h-full">
        <div className="border-b-2 border-brand-black p-8 md:p-12 bg-brand-white transition-colors duration-300 dark:border-brand-white dark:bg-brand-black">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 dark:text-brand-white">Fill Form</h2>
            <p className="text-xl font-mono text-brand-black/60 max-w-2xl dark:text-brand-white/60">Complete PDF forms online.</p>
        </div>

        <div className="flex-1 p-8 md:p-12 bg-brand-white transition-colors duration-300 dark:bg-brand-black">
            <div className="max-w-4xl mx-auto">
                <Card className="border-2 border-brand-black bg-brand-white dark:border-brand-white dark:bg-brand-black">
                    <CardContent className="p-8 space-y-8">
                    {!filledFile ? (
                        <>
                        {!fields ? (
                             <>
                                <FileUpload 
                                    value={file} 
                                    onChange={handleFileChange} 
                                    multiple={false}
                                    description="Drag & drop a PDF form here"
                                />
                                {isUploading && <div className="text-center font-mono dark:text-brand-white">Uploading...</div>}
                                {isAnalyzing && <div className="text-center font-mono dark:text-brand-white">Analyzing form fields...</div>}
                             </>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between border-b-2 border-brand-black pb-4 dark:border-brand-white">
                                    <h3 className="text-2xl font-bold uppercase dark:text-brand-white">Form Fields</h3>
                                    <Button variant="ghost" onClick={handleReset} size="sm">Change File</Button>
                                </div>
                                
                                {Object.keys(fields).length === 0 ? (
                                    <div className="text-center py-8 text-brand-black/60 font-mono dark:text-brand-white/60">
                                        No fillable fields found in this PDF.
                                    </div>
                                ) : (
                                    <div className="grid gap-6 md:grid-cols-2">
                                        {Object.entries(fields).map(([key, data]) => (
                                            <div key={key} className="space-y-2">
                                                <label className="text-sm font-bold uppercase tracking-wide dark:text-brand-white">{data.label || key}</label>
                                                <input 
                                                    className="flex h-10 w-full rounded-none border-2 border-brand-black bg-brand-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-brand-white dark:bg-brand-black dark:text-brand-white"
                                                    value={formValues[key] || ''}
                                                    onChange={(e) => handleInputChange(key, e.target.value)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="flex justify-end pt-4 border-t-2 border-brand-black dark:border-brand-white">
                                    <Button 
                                        onClick={handleFill} 
                                        disabled={isFilling || Object.keys(fields).length === 0}
                                        className="w-full sm:w-auto min-w-[200px]"
                                        size="lg"
                                    >
                                    {isFilling ? (
                                        <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Filling...
                                        </>
                                    ) : (
                                        "Generate PDF"
                                    )}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="flex items-center gap-4 text-sm font-bold uppercase tracking-wide text-brand-coral border-2 border-brand-coral bg-brand-coral/5 p-4">
                                <AlertCircle className="h-5 w-5" />
                                {error}
                            </div>
                        )}
                        </>
                    ) : (
                        <div className="text-center py-12 space-y-8">
                            <div className="inline-flex h-24 w-24 items-center justify-center border-2 border-brand-black bg-brand-black text-brand-white dark:border-brand-white dark:bg-brand-white dark:text-brand-black">
                                <FileText className="h-10 w-10" />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-3xl font-black uppercase tracking-tighter dark:text-brand-white">Success!</h3>
                                <p className="text-xl font-mono text-brand-black/60 dark:text-brand-white/60">
                                    Your filled PDF ({ (filledFile.size / 1024 / 1024).toFixed(2) } MB) is ready.
                                </p>
                            </div>

                            <div className="w-full h-[600px] border-2 border-brand-black bg-brand-white dark:border-brand-white dark:bg-brand-black">
                                <iframe 
                                    src={getDownloadUrl(filledFile.filename, true)} 
                                    className="w-full h-full"
                                    title="PDF Preview"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
                                <Button variant="outline" size="lg" onClick={handleBack} className="w-full sm:w-auto">
                                    <ArrowLeft className="mr-2 h-5 w-5" /> Continue Editing
                                </Button>
                                <a href={getDownloadUrl(filledFile.filename)} download>
                                <Button size="lg" className="w-full sm:w-auto bg-brand-purple border-brand-purple text-brand-white hover:bg-brand-white hover:text-brand-purple dark:hover:bg-brand-black">
                                    <Download className="mr-2 h-5 w-5" /> Download PDF
                                </Button>
                                </a>
                                <Button variant="outline" size="lg" onClick={handleReset} className="w-full sm:w-auto">
                                    <RefreshCw className="mr-2 h-5 w-5" /> Fill Another
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
