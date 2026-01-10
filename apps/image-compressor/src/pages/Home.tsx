import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Image, Zap, Settings } from 'lucide-react';
import { toast } from 'sonner';
import '../styles/geometric-animations.css';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="geometric-bg">
          <div className="floating-triangle triangle-1"></div>
          <div className="floating-triangle triangle-2"></div>
          <div className="floating-triangle triangle-3"></div>
          <div className="floating-circle circle-1"></div>
          <div className="floating-circle circle-2"></div>
          <div className="floating-square square-1"></div>
          <div className="floating-square square-2"></div>
          <div className="floating-hexagon hexagon-1"></div>
          <div className="floating-diamond diamond-1"></div>
          <div className="floating-diamond diamond-2"></div>
        </div>
      </div>

      {/* Content */}
      <main className="relative z-10 container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#32F08C] to-[#00D4FF] bg-clip-text text-transparent">
            Image Processor
          </h1>
          <p className="text-xl text-gray-300">
            Advanced image compression and optimization
          </p>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Professional Image Processing
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Reduce file sizes and optimize your images with advanced compression algorithms. 
            Choose between quality compression or pixel reduction for perfect results.
          </p>
        </div>

        {/* Processing Type Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Choose Processing Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => handleProcessingTypeChange('quality')}
              className={`p-6 rounded-xl border-2 transition-all ${
                processingType === 'quality'
                  ? 'border-[#32F08C] bg-[#32F08C]/10'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <Zap className="w-6 h-6 text-[#32F08C]" />
                <h4 className="text-lg font-semibold">Quality Compression</h4>
              </div>
              <p className="text-gray-400 text-left">
                Reduce file size while maintaining image dimensions. 
                Perfect for web optimization and storage savings.
              </p>
            </button>

            <button
              onClick={() => handleProcessingTypeChange('pixel')}
              className={`p-6 rounded-xl border-2 transition-all ${
                processingType === 'pixel'
                  ? 'border-[#32F08C] bg-[#32F08C]/10'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <Settings className="w-6 h-6 text-[#32F08C]" />
                <h4 className="text-lg font-semibold">Pixel Reduction</h4>
              </div>
              <p className="text-gray-400 text-left">
                Resize images by reducing pixel count. 
                Ideal for thumbnails and bandwidth optimization.
              </p>
            </button>
          </div>
        </div>

        {/* Processing Options */}
        <div className="mb-8 p-6 bg-gray-900/50 rounded-xl border border-gray-800">
          <h3 className="text-lg font-semibold mb-4">Processing Options</h3>
          
          {processingType === 'quality' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Quality Level: {options.quality}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={options.quality || 85}
                  onChange={(e) => setOptions({ ...options, quality: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Lower quality (smaller file)</span>
                  <span>Higher quality (larger file)</span>
                </div>
              </div>
            </div>
          )}

          {processingType === 'pixel' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Resize Method
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
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
                      className="mr-2"
                    />
                    <span>Percentage reduction</span>
                  </label>
                  <label className="flex items-center">
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
                      className="mr-2"
                    />
                    <span>Maximum dimensions</span>
                  </label>
                </div>
              </div>

              {options.percentage && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Reduction Percentage: {options.percentage}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={options.percentage}
                    onChange={(e) => setOptions({ ...options, percentage: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              )}

              {!options.percentage && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Max Width (px)</label>
                    <input
                      type="number"
                      value={options.maxWidth || ''}
                      onChange={(e) => setOptions({ 
                        ...options, 
                        maxWidth: e.target.value ? parseInt(e.target.value) : undefined 
                      })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-[#32F08C] focus:outline-none"
                      placeholder="e.g., 1920"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Max Height (px)</label>
                    <input
                      type="number"
                      value={options.maxHeight || ''}
                      onChange={(e) => setOptions({ 
                        ...options, 
                        maxHeight: e.target.value ? parseInt(e.target.value) : undefined 
                      })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-[#32F08C] focus:outline-none"
                      placeholder="e.g., 1080"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">
                  Output Quality: {options.quality}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={options.quality || 85}
                  onChange={(e) => setOptions({ ...options, quality: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={options.noAspect || false}
                    onChange={(e) => setOptions({ ...options, noAspect: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm">Don't maintain aspect ratio</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* File Upload Area */}
        <div
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
            isDragging
              ? 'border-[#32F08C] bg-[#32F08C]/10'
              : selectedFile
              ? 'border-[#32F08C] bg-[#32F08C]/5'
              : 'border-gray-700 hover:border-gray-600'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg"
            onChange={handleFileInputChange}
            className="hidden"
          />

          {selectedFile ? (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-[#32F08C] rounded-full flex items-center justify-center mx-auto">
                <Image className="w-8 h-8 text-black" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#32F08C]">File Selected</h3>
                <p className="text-gray-400">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-[#32F08C] hover:text-[#28d474] transition-colors"
              >
                Choose different file
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Drop your image here</h3>
                <p className="text-gray-400">or click to browse files</p>
                <p className="text-sm text-gray-500 mt-2">
                  Supports JPG/JPEG files up to 50MB
                </p>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-[#32F08C] text-black px-6 py-2 rounded-lg font-medium hover:bg-[#28d474] transition-colors"
              >
                Choose File
              </button>
            </div>
          )}
        </div>

        {/* Start Processing Button */}
        {selectedFile && (
          <div className="mt-8 text-center">
            <button
              onClick={handleStartProcessing}
              disabled={isUploading}
              className="bg-[#32F08C] text-black px-8 py-3 rounded-lg font-semibold text-lg hover:bg-[#28d474] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Starting...' : 'Start Processing'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}