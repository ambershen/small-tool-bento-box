import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Image, Zap, Settings } from 'lucide-react';
import { toast } from 'sonner';
import '../styles/geometric-animations.css';
import { ThemeToggle } from '../components/ThemeToggle';

interface ProcessingOptions {
  type: 'quality' | 'pixel';
  quality?: number;
  percentage?: number;
  maxWidth?: number;
  maxHeight?: number;
  noAspect?: boolean;
}

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [processingType, setProcessingType] = useState<'quality' | 'pixel'>('quality');
  const [options, setOptions] = useState<ProcessingOptions>({
    type: 'quality',
    quality: 85,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      if (imageFile.size > 50 * 1024 * 1024) { // 50MB limit
        toast.error('File size must be less than 50MB');
        return;
      }
      setSelectedFile(imageFile);
    } else {
      toast.error('Please select a valid image file');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast.error('File size must be less than 50MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleProcessingTypeChange = (type: 'quality' | 'pixel') => {
    setProcessingType(type);
    if (type === 'quality') {
      setOptions({
        type: 'quality',
        quality: 85,
      });
    } else {
      setOptions({
        type: 'pixel',
        quality: 85,
        percentage: 50,
      });
    }
  };

  const handleStartProcessing = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    
    try {
      // Upload file
      const formData = new FormData();
      formData.append('image', selectedFile);
      
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!uploadResponse.ok) {
        const error = await uploadResponse.json();
        throw new Error(error.error || 'Upload failed');
      }
      
      const uploadResult = await uploadResponse.json();
      const jobId = uploadResult.jobId;
      
      // Start processing
      const processResponse = await fetch(`/api/process/${jobId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: processingType,
          options: {
            ...options,
            type: processingType,
          },
        }),
      });
      
      if (!processResponse.ok) {
        const error = await processResponse.json();
        throw new Error(error.error || 'Processing failed to start');
      }
      
      // Navigate to processing page
      navigate(`/processing/${jobId}`);
      
    } catch (error) {
      console.error('Processing error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to start processing');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-white dark:bg-brand-black text-brand-black dark:text-brand-white relative overflow-hidden font-sans selection:bg-brand-black selection:text-brand-white dark:selection:bg-brand-white dark:selection:text-brand-black transition-colors duration-300">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
        <div className="geometric-bg">
          <div className="floating-triangle triangle-1 border-brand-black dark:border-brand-white"></div>
          <div className="floating-triangle triangle-2 border-brand-black dark:border-brand-white"></div>
          <div className="floating-triangle triangle-3 border-brand-black dark:border-brand-white"></div>
          <div className="floating-circle circle-1 border-brand-black dark:border-brand-white"></div>
          <div className="floating-circle circle-2 border-brand-black dark:border-brand-white"></div>
          <div className="floating-square square-1 border-brand-black dark:border-brand-white"></div>
          <div className="floating-square square-2 border-brand-black dark:border-brand-white"></div>
          <div className="floating-hexagon hexagon-1 border-brand-black dark:border-brand-white"></div>
          <div className="floating-diamond diamond-1 border-brand-black dark:border-brand-white"></div>
          <div className="floating-diamond diamond-2 border-brand-black dark:border-brand-white"></div>
        </div>
      </div>

      {/* Content */}
      <main className="relative z-10 container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="relative text-center mb-12">
          <div className="absolute top-0 right-0">
            <ThemeToggle />
          </div>
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-4 text-brand-black dark:text-brand-white">
            Image Processor<span className="text-brand-coral">.</span>
          </h1>
          <p className="font-serif text-xl text-brand-black/70 dark:text-brand-white/70">
            Advanced image compression and optimization
          </p>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12 border-b-[1px] border-brand-black dark:border-brand-white pb-12">
          <h2 className="text-4xl font-bold uppercase tracking-tight mb-4">
            Professional Image Processing
          </h2>
          <p className="font-serif text-xl text-brand-black/60 dark:text-brand-white/60 max-w-2xl mx-auto">
            Reduce file sizes and optimize your images with advanced compression algorithms. 
            Choose between quality compression or pixel reduction for perfect results.
          </p>
        </div>

        {/* Processing Type Selection */}
        <div className="mb-8">
          <h3 className="font-mono text-xs font-bold uppercase tracking-widest mb-4 opacity-60">Choose Processing Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => handleProcessingTypeChange('quality')}
              className={`p-6 text-left border-[1px] transition-all duration-300 ${
                processingType === 'quality'
                  ? 'border-brand-black bg-brand-black text-brand-white dark:border-brand-white dark:bg-brand-white dark:text-brand-black'
                  : 'border-brand-black/20 hover:border-brand-black dark:border-brand-white/20 dark:hover:border-brand-white'
              }`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <Zap className={`w-6 h-6 ${processingType === 'quality' ? 'text-brand-coral' : 'text-brand-black dark:text-brand-white'}`} />
                <h4 className="text-lg font-bold uppercase tracking-tight">Quality Compression</h4>
              </div>
              <p className={`font-serif text-sm ${processingType === 'quality' ? 'opacity-80' : 'opacity-60'}`}>
                Reduce file size while maintaining image dimensions. 
                Perfect for web optimization and storage savings.
              </p>
            </button>

            <button
              onClick={() => handleProcessingTypeChange('pixel')}
              className={`p-6 text-left border-[1px] transition-all duration-300 ${
                processingType === 'pixel'
                  ? 'border-brand-black bg-brand-black text-brand-white dark:border-brand-white dark:bg-brand-white dark:text-brand-black'
                  : 'border-brand-black/20 hover:border-brand-black dark:border-brand-white/20 dark:hover:border-brand-white'
              }`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <Settings className={`w-6 h-6 ${processingType === 'pixel' ? 'text-brand-coral' : 'text-brand-black dark:text-brand-white'}`} />
                <h4 className="text-lg font-bold uppercase tracking-tight">Pixel Reduction</h4>
              </div>
              <p className={`font-serif text-sm ${processingType === 'pixel' ? 'opacity-80' : 'opacity-60'}`}>
                Resize images by reducing pixel count. 
                Ideal for thumbnails and bandwidth optimization.
              </p>
            </button>
          </div>
        </div>

        {/* Processing Options */}
        <div className="mb-8 p-6 bg-white dark:bg-zinc-900 border-[1px] border-brand-black dark:border-brand-white transition-colors duration-300">
          <h3 className="font-mono text-xs font-bold uppercase tracking-widest mb-6 opacity-60">Processing Options</h3>
          
          {processingType === 'quality' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold uppercase tracking-tight mb-4">
                  Quality Level: {options.quality}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={options.quality || 85}
                  onChange={(e) => setOptions({ ...options, quality: parseInt(e.target.value) })}
                  className="w-full h-1 bg-brand-black/10 dark:bg-brand-white/10 rounded-full appearance-none cursor-pointer accent-brand-black dark:accent-brand-white"
                />
                <div className="flex justify-between font-mono text-[10px] uppercase tracking-widest mt-4 opacity-40">
                  <span>Lower quality (smaller file)</span>
                  <span>Higher quality (larger file)</span>
                </div>
              </div>
            </div>
          )}

          {processingType === 'pixel' && (
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-bold uppercase tracking-tight mb-4">
                  Resize Method
                </label>
                <div className="space-y-3">
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      name="resizeMethod"
                      checked={!!options.percentage}
                      onChange={() => setOptions({ 
                        ...options, 
                        percentage: 50, 
                        maxWidth: undefined, 
                        maxHeight: undefined 
                      })}
                      className="w-4 h-4 border-brand-black accent-brand-black dark:border-brand-white dark:accent-brand-white mr-3"
                    />
                    <span className="font-serif text-lg group-hover:text-brand-coral transition-colors">Percentage reduction</span>
                  </label>
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      name="resizeMethod"
                      checked={!options.percentage}
                      onChange={() => setOptions({ 
                        ...options, 
                        percentage: undefined, 
                        maxWidth: 1920, 
                        maxHeight: undefined 
                      })}
                      className="w-4 h-4 border-brand-black accent-brand-black dark:border-brand-white dark:accent-brand-white mr-3"
                    />
                    <span className="font-serif text-lg group-hover:text-brand-coral transition-colors">Maximum dimensions</span>
                  </label>
                </div>
              </div>

              {options.percentage && (
                <div>
                  <label className="block text-sm font-bold uppercase tracking-tight mb-4">
                    Reduction Percentage: {options.percentage}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={options.percentage}
                    onChange={(e) => setOptions({ ...options, percentage: parseInt(e.target.value) })}
                    className="w-full h-1 bg-brand-black/10 dark:bg-brand-white/10 rounded-full appearance-none cursor-pointer accent-brand-black dark:accent-brand-white"
                  />
                </div>
              )}

              {!options.percentage && (
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-widest mb-2 opacity-60">Max Width (px)</label>
                    <input
                      type="number"
                      value={options.maxWidth || ''}
                      onChange={(e) => setOptions({ 
                        ...options, 
                        maxWidth: e.target.value ? parseInt(e.target.value) : undefined 
                      })}
                      className="w-full px-4 py-3 bg-brand-white dark:bg-zinc-800 border-[1px] border-brand-black dark:border-brand-white focus:bg-white dark:focus:bg-black focus:outline-none font-mono"
                      placeholder="e.g., 1920"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-widest mb-2 opacity-60">Max Height (px)</label>
                    <input
                      type="number"
                      value={options.maxHeight || ''}
                      onChange={(e) => setOptions({ 
                        ...options, 
                        maxHeight: e.target.value ? parseInt(e.target.value) : undefined 
                      })}
                      className="w-full px-4 py-3 bg-brand-white dark:bg-zinc-800 border-[1px] border-brand-black dark:border-brand-white focus:bg-white dark:focus:bg-black focus:outline-none font-mono"
                      placeholder="e.g., 1080"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold uppercase tracking-tight mb-4">
                  Output Quality: {options.quality}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={options.quality || 85}
                  onChange={(e) => setOptions({ ...options, quality: parseInt(e.target.value) })}
                  className="w-full h-1 bg-brand-black/10 dark:bg-brand-white/10 rounded-full appearance-none cursor-pointer accent-brand-black dark:accent-brand-white"
                />
              </div>

              <div>
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={options.noAspect || false}
                    onChange={(e) => setOptions({ ...options, noAspect: e.target.checked })}
                    className="w-4 h-4 border-brand-black accent-brand-black dark:border-brand-white dark:accent-brand-white mr-3"
                  />
                  <span className="font-serif text-lg group-hover:text-brand-coral transition-colors">Don't maintain aspect ratio</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* File Upload Area */}
        <div
          className={`border-[2px] border-dashed p-12 text-center transition-all duration-300 cursor-pointer ${
            isDragging
              ? 'border-brand-coral bg-brand-coral/5'
              : selectedFile
              ? 'border-brand-black bg-white dark:border-brand-white dark:bg-zinc-900'
              : 'border-brand-black/20 hover:border-brand-black dark:border-brand-white/20 dark:hover:border-brand-white'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !selectedFile && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg"
            onChange={handleFileInputChange}
            className="hidden"
          />

          {selectedFile ? (
            <div className="space-y-6">
              <div className="w-16 h-16 bg-brand-black dark:bg-brand-white rounded-full flex items-center justify-center mx-auto">
                <Image className="w-8 h-8 text-brand-white dark:text-brand-black" />
              </div>
              <div>
                <h3 className="text-xl font-bold uppercase tracking-tight text-brand-black dark:text-brand-white">File Selected</h3>
                <p className="font-mono text-xs opacity-60 mt-1">{selectedFile.name}</p>
                <p className="font-mono text-[10px] text-brand-coral mt-2 font-bold uppercase tracking-widest">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                className="font-mono text-xs font-bold uppercase tracking-widest border-b-[1px] border-brand-black dark:border-brand-white pb-0.5 hover:text-brand-coral hover:border-brand-coral transition-colors"
              >
                Choose different file
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="w-16 h-16 bg-brand-black/5 dark:bg-brand-white/5 rounded-full flex items-center justify-center mx-auto">
                <Upload className="w-8 h-8 text-brand-black dark:text-brand-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold uppercase tracking-tight">Drop your image here</h3>
                <p className="font-serif text-lg opacity-60">or click to browse files</p>
                <p className="font-mono text-[10px] uppercase tracking-widest opacity-40 mt-4">
                  Supports JPG/JPEG files up to 50MB
                </p>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-brand-black text-brand-white dark:bg-brand-white dark:text-brand-black px-8 py-3 rounded-none font-bold uppercase tracking-widest hover:bg-brand-coral hover:text-brand-white dark:hover:bg-brand-coral dark:hover:text-brand-white transition-colors"
              >
                Choose File
              </button>
            </div>
          )}
        </div>

        {/* Start Processing Button */}
        {selectedFile && (
          <div className="mt-12 text-center">
            <button
              onClick={handleStartProcessing}
              disabled={isUploading}
              className="bg-brand-black text-brand-white dark:bg-brand-white dark:text-brand-black px-12 py-4 rounded-none font-bold uppercase tracking-widest text-lg hover:bg-brand-coral hover:text-brand-white dark:hover:bg-brand-coral dark:hover:text-brand-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Starting...' : 'Start Processing'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
