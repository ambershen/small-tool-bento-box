import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { ThemeToggle } from '../components/ThemeToggle';

interface ProcessingStats {
  originalSize: number;
  processedSize: number;
  compressionRatio: number;
  originalDimensions?: [number, number];
  newDimensions?: [number, number];
  pixelReduction?: number;
}

interface ResultsData {
  jobId: string;
  status: string;
  stats: ProcessingStats;
}

export default function Results() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [results, setResults] = useState<ResultsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showComparison, setShowComparison] = useState(true);
  const [imageError, setImageError] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  useEffect(() => {
    if (!jobId) {
      navigate('/');
      return;
    }

    const fetchResults = async () => {
      try {
        const response = await fetch(`/api/status/${jobId}`);
        if (!response.ok) {
          throw new Error('Failed to get results');
        }
        
        const data = await response.json();
        
        if (data.status !== 'completed') {
          // If not completed, redirect to processing page
          navigate(`/processing/${jobId}`);
          return;
        }
        
        setResults(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Results fetch error:', error);
        toast.error('Failed to load results');
        navigate('/');
      }
    };

    fetchResults();
  }, [jobId, navigate]);

  const handleDownload = async () => {
    if (!jobId) return;
    
    setIsDownloading(true);
    
    try {
      const response = await fetch(`/api/download/${jobId}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Download failed' }));
        throw new Error(errorData.error || 'Download failed');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `processed_${jobId}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Image downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error(error instanceof Error ? error.message : 'Download failed');
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-white dark:bg-brand-black text-brand-black dark:text-brand-white flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-brand-black dark:border-brand-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-mono text-xs font-bold uppercase tracking-widest">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-brand-white dark:bg-brand-black text-brand-black dark:text-brand-white flex items-center justify-center font-sans">
        <div className="text-center">
          <p className="font-serif text-xl mb-8">Results not found</p>
          <button
            onClick={() => navigate('/')}
            className="bg-brand-black text-brand-white dark:bg-brand-white dark:text-brand-black px-8 py-3 rounded-none font-bold uppercase tracking-widest hover:bg-brand-coral hover:text-brand-white dark:hover:bg-brand-coral dark:hover:text-brand-white transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-white dark:bg-brand-black text-brand-black dark:text-brand-white font-sans selection:bg-brand-black selection:text-brand-white dark:selection:bg-brand-white dark:selection:text-brand-black transition-colors duration-300">
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
      <main className="relative z-10 container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b-[1px] border-brand-black dark:border-brand-white pb-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 font-mono text-xs font-bold uppercase tracking-widest hover:text-brand-coral transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
          
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="flex items-center space-x-2 font-mono text-xs font-bold uppercase tracking-widest hover:text-brand-coral transition-colors"
            >
              {showComparison ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{showComparison ? 'Hide' : 'Show'} Comparison</span>
            </button>
            <ThemeToggle />
          </div>
        </div>

        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-brand-black dark:bg-brand-white rounded-full flex items-center justify-center mx-auto mb-6">
            <Download className="w-10 h-10 text-brand-white dark:text-brand-black" />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Processing Complete!</h1>
          <p className="font-serif text-xl text-brand-black/60 dark:text-brand-white/60">Your image has been successfully optimized</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-zinc-900 border-[1px] border-brand-black dark:border-brand-white p-8 text-center transition-colors duration-300">
            <div className="text-4xl font-black text-brand-coral mb-2 uppercase tracking-tighter">
              {results.stats.compressionRatio.toFixed(1)}%
            </div>
            <div className="font-mono text-[10px] uppercase tracking-widest opacity-40">Size Reduction</div>
            <div className="font-mono text-xs mt-4 opacity-60">
              {formatFileSize(results.stats.originalSize)} → {formatFileSize(results.stats.processedSize)}
            </div>
          </div>
          
          {results.stats.originalDimensions && results.stats.newDimensions && (
            <div className="bg-white dark:bg-zinc-900 border-[1px] border-brand-black dark:border-brand-white p-8 text-center transition-colors duration-300">
              <div className="text-3xl font-black text-brand-coral mb-2 uppercase tracking-tighter">
                {results.stats.newDimensions[0]} × {results.stats.newDimensions[1]}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-widest opacity-40">New Dimensions</div>
              <div className="font-mono text-xs mt-4 opacity-60">
                Original: {results.stats.originalDimensions[0]} × {results.stats.originalDimensions[1]}
              </div>
            </div>
          )}
          
          <div className="bg-white dark:bg-zinc-900 border-[1px] border-brand-black dark:border-brand-white p-8 text-center transition-colors duration-300">
            <div className="text-3xl font-black text-brand-coral mb-2 uppercase tracking-tighter">
              {formatFileSize(results.stats.processedSize)}
            </div>
            <div className="font-mono text-[10px] uppercase tracking-widest opacity-40">Final Size</div>
            <div className="font-mono text-xs mt-4 opacity-60">
              Saved {formatFileSize(results.stats.originalSize - results.stats.processedSize)}
            </div>
          </div>
        </div>

        {/* Image Comparison */}
        {showComparison && (
          <div className="bg-white dark:bg-zinc-900 border-[1px] border-brand-black dark:border-brand-white p-8 mb-8 transition-colors duration-300">
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest mb-8 opacity-40 border-b border-brand-black/10 dark:border-brand-white/10 pb-2">Before & After Comparison</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Original Image */}
              <div className="space-y-4">
                <h4 className="font-bold uppercase tracking-tight text-sm opacity-60">Original</h4>
                <div className="bg-brand-white dark:bg-zinc-800 p-2 border border-brand-black/5 dark:border-brand-white/5">
                  <img
                    src={`/api/original/${jobId}`}
                    alt="Original"
                    className="w-full h-auto max-h-[500px] object-contain"
                    onError={() => setImageError(true)}
                  />
                </div>
                <div className="font-mono text-[10px] uppercase tracking-widest opacity-40 text-center">
                  {formatFileSize(results.stats.originalSize)}
                  {results.stats.originalDimensions && (
                    <> • {results.stats.originalDimensions[0]} × {results.stats.originalDimensions[1]} px</>
                  )}
                </div>
              </div>

              {/* Processed Image */}
              <div className="space-y-4">
                <h4 className="font-bold uppercase tracking-tight text-sm text-brand-coral">Processed</h4>
                <div className="bg-brand-white dark:bg-zinc-800 p-2 border border-brand-black/5 dark:border-brand-white/5">
                  <img
                    src={`/api/preview/${jobId}`}
                    alt="Processed"
                    className="w-full h-auto max-h-[500px] object-contain"
                    onError={() => setImageError(true)}
                  />
                </div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-brand-coral text-center font-bold">
                  {formatFileSize(results.stats.processedSize)}
                  {results.stats.newDimensions && (
                    <> • {results.stats.newDimensions[0]} × {results.stats.newDimensions[1]} px</>
                  )}
                </div>
              </div>
            </div>

            {imageError && (
              <div className="text-center font-serif text-sm opacity-40 mt-8">
                <p>Unable to load image preview. You can still download the processed image.</p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center justify-center space-x-3 bg-brand-black text-brand-white dark:bg-brand-white dark:text-brand-black px-12 py-4 rounded-none font-bold uppercase tracking-widest text-lg hover:bg-brand-coral hover:text-brand-white dark:hover:bg-brand-coral dark:hover:text-brand-white transition-colors disabled:opacity-50"
          >
            <Download className="w-5 h-5" />
            <span>{isDownloading ? 'Downloading...' : 'Download Image'}</span>
          </button>

          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center space-x-3 bg-white dark:bg-zinc-900 border border-brand-black dark:border-brand-white text-brand-black dark:text-brand-white px-12 py-4 rounded-none font-bold uppercase tracking-widest text-lg hover:bg-brand-black hover:text-brand-white dark:hover:bg-brand-white dark:hover:text-brand-black transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Process Another</span>
          </button>
        </div>

        {/* Tips */}
        <div className="mt-16 bg-brand-black dark:bg-brand-white text-brand-white dark:text-brand-black p-8 transition-colors duration-300">
          <h3 className="font-mono text-xs font-bold uppercase tracking-widest mb-6 text-brand-coral">💡 Optimization Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm opacity-80">
            <div>
              <h4 className="font-bold uppercase tracking-tight mb-3">Quality Compression</h4>
              <ul className="space-y-2 font-serif">
                <li>• Best for web images and email attachments</li>
                <li>• Maintains original dimensions</li>
                <li>• Reduces file size without visible quality loss</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold uppercase tracking-tight mb-3">Pixel Reduction</h4>
              <ul className="space-y-2 font-serif">
                <li>• Perfect for thumbnails and previews</li>
                <li>• Significantly reduces file size</li>
                <li>• Great for bandwidth-limited scenarios</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
