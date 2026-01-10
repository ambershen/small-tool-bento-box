import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#32F08C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Results not found</p>
          <button
            onClick={() => navigate('/')}
            className="bg-[#32F08C] text-black px-6 py-2 rounded-lg font-medium hover:bg-[#28d474] transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
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
      <main className="relative z-10 container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
          
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            {showComparison ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            <span>{showComparison ? 'Hide' : 'Show'} Comparison</span>
          </button>
        </div>

        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-[#32F08C] rounded-full flex items-center justify-center mx-auto mb-6">
            <Download className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Processing Complete!</h1>
          <p className="text-xl text-gray-400">Your image has been successfully optimized</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 text-center">
            <div className="text-3xl font-bold text-[#32F08C] mb-2">
              {results.stats.compressionRatio.toFixed(1)}%
            </div>
            <div className="text-gray-400">Size Reduction</div>
            <div className="text-sm text-gray-500 mt-2">
              {formatFileSize(results.stats.originalSize)} → {formatFileSize(results.stats.processedSize)}
            </div>
          </div>
          
          {results.stats.originalDimensions && results.stats.newDimensions && (
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 text-center">
              <div className="text-2xl font-bold text-[#32F08C] mb-2">
                {results.stats.newDimensions[0]} × {results.stats.newDimensions[1]}
              </div>
              <div className="text-gray-400">New Dimensions</div>
              <div className="text-sm text-gray-500 mt-2">
                Original: {results.stats.originalDimensions[0]} × {results.stats.originalDimensions[1]}
              </div>
            </div>
          )}
          
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 text-center">
            <div className="text-2xl font-bold text-[#32F08C] mb-2">
              {formatFileSize(results.stats.processedSize)}
            </div>
            <div className="text-gray-400">Final Size</div>
            <div className="text-sm text-gray-500 mt-2">
              Saved {formatFileSize(results.stats.originalSize - results.stats.processedSize)}
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        {results.stats.pixelReduction && (
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 mb-8">
            <h3 className="text-lg font-semibold mb-4">Pixel Reduction Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-400">Pixel Reduction:</span>
                <div className="text-xl font-bold text-[#32F08C]">
                  {results.stats.pixelReduction.toFixed(1)}%
                </div>
              </div>
              <div>
                <span className="text-gray-400">Dimension Change:</span>
                <div className="text-lg font-semibold">
                  {results.stats.originalDimensions && results.stats.newDimensions && (
                    <>
                      {results.stats.originalDimensions[0]} × {results.stats.originalDimensions[1]} → {' '}
                      <span className="text-[#32F08C]">
                        {results.stats.newDimensions[0]} × {results.stats.newDimensions[1]}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Image Comparison */}
        {showComparison && (
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 mb-8">
            <h3 className="text-lg font-semibold mb-6">Before &amp; After Comparison</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Original Image */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-300">Original</h4>
                <div className="bg-gray-800 rounded-lg overflow-hidden">
                  <img
                    src={`/api/original/${jobId}`}
                    alt="Original"
                    className="w-full h-auto max-h-96 object-contain"
                    onError={() => setImageError(true)}
                  />
                </div>
                <div className="text-sm text-gray-400 text-center">
                  {formatFileSize(results.stats.originalSize)}
                  {results.stats.originalDimensions && (
                    <> • {results.stats.originalDimensions[0]} × {results.stats.originalDimensions[1]} px</>
                  )}
                </div>
              </div>

              {/* Processed Image */}
              <div className="space-y-3">
                <h4 className="font-medium text-[#32F08C]">Processed</h4>
                <div className="bg-gray-800 rounded-lg overflow-hidden">
                  <img
                    src={`/api/preview/${jobId}`}
                    alt="Processed"
                    className="w-full h-auto max-h-96 object-contain"
                    onError={() => setImageError(true)}
                  />
                </div>
                <div className="text-sm text-gray-400 text-center">
                  {formatFileSize(results.stats.processedSize)}
                  {results.stats.newDimensions && (
                    <> • {results.stats.newDimensions[0]} × {results.stats.newDimensions[1]} px</>
                  )}
                </div>
              </div>
            </div>

            {imageError && (
              <div className="text-center text-gray-400 mt-4">
                <p>Unable to load image preview. You can still download the processed image.</p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center justify-center space-x-2 bg-[#32F08C] text-black px-8 py-3 rounded-lg font-semibold hover:bg-[#28d474] transition-colors disabled:opacity-50"
          >
            <Download className="w-5 h-5" />
            <span>{isDownloading ? 'Downloading...' : 'Download Processed Image'}</span>
          </button>

          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center space-x-2 bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Process Another Image</span>
          </button>
        </div>

        {/* Tips */}
        <div className="mt-12 bg-gray-900/30 rounded-xl p-6 border border-gray-800">
          <h3 className="text-lg font-semibold mb-4">💡 Optimization Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div>
              <h4 className="font-medium text-white mb-2">Quality Compression</h4>
              <ul className="space-y-1">
                <li>• Best for web images and email attachments</li>
                <li>• Maintains original dimensions</li>
                <li>• Reduces file size without visible quality loss</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">Pixel Reduction</h4>
              <ul className="space-y-1">
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