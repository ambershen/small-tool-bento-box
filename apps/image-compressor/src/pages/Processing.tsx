import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ProcessingStatus {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  stats?: {
    originalSize: number;
    processedSize: number;
    compressionRatio: number;
    originalDimensions?: [number, number];
    newDimensions?: [number, number];
    pixelReduction?: number;
  };
  error?: string;
}

export default function Processing() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<ProcessingStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/status/${jobId}`);
        if (!response.ok) {
          throw new Error('Failed to get status');
        }
        
        const data = await response.json();
        setStatus(data);
        setIsLoading(false);
        
        // If completed, navigate to results after a short delay
        if (data.status === 'completed') {
          setTimeout(() => {
            navigate(`/results/${jobId}`);
          }, 2000);
        }
        
        // If failed, show error
        if (data.status === 'failed') {
          toast.error(data.error || 'Processing failed');
        }
      } catch (error) {
        console.error('Status check error:', error);
        toast.error('Failed to check processing status');
        setIsLoading(false);
      }
    };

    // Initial check
    checkStatus();
    
    // Poll for updates every 2 seconds
    const interval = setInterval(checkStatus, 2000);
    
    return () => clearInterval(interval);
  }, [jobId, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-[#32F08C]" />
          <p className="text-xl">Loading...</p>
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
      <main className="relative z-10 container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
        </div>

        <div className="text-center space-y-8">
          {/* Status Icon */}
          <div className="flex justify-center">
            {status?.status === 'completed' ? (
              <div className="w-20 h-20 bg-[#32F08C] rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-black" />
              </div>
            ) : status?.status === 'failed' ? (
              <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center">
                <XCircle className="w-10 h-10 text-white" />
              </div>
            ) : (
              <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-[#32F08C] animate-spin" />
              </div>
            )}
          </div>

          {/* Status Text */}
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {status?.status === 'completed' && 'Processing Complete!'}
              {status?.status === 'failed' && 'Processing Failed'}
              {(status?.status === 'pending' || status?.status === 'processing') && 'Processing Your Image'}
            </h1>
            <p className="text-gray-400">
              {status?.status === 'completed' && 'Your image has been successfully processed.'}
              {status?.status === 'failed' && (status?.error || 'An error occurred during processing.')}
              {(status?.status === 'pending' || status?.status === 'processing') && 'Please wait while we optimize your image...'}
            </p>
          </div>

          {/* Progress Bar */}
          {(status?.status === 'pending' || status?.status === 'processing') && (
            <div className="w-full max-w-md mx-auto">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Progress</span>
                <span>{status?.progress || 0}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div 
                  className="bg-[#32F08C] h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${status?.progress || 0}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Processing Steps */}
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-4">Processing Steps</h3>
            <div className="space-y-3 text-left">
              <div className={`flex items-center space-x-3 ${
                (status?.progress || 0) >= 10 ? 'text-[#32F08C]' : 'text-gray-500'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  (status?.progress || 0) >= 10 ? 'bg-[#32F08C]' : 'bg-gray-600'
                }`} />
                <span>Image uploaded and validated</span>
              </div>
              <div className={`flex items-center space-x-3 ${
                (status?.progress || 0) >= 30 ? 'text-[#32F08C]' : 'text-gray-500'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  (status?.progress || 0) >= 30 ? 'bg-[#32F08C]' : 'bg-gray-600'
                }`} />
                <span>Image processing in progress</span>
              </div>
              <div className={`flex items-center space-x-3 ${
                (status?.progress || 0) >= 80 ? 'text-[#32F08C]' : 'text-gray-500'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  (status?.progress || 0) >= 80 ? 'bg-[#32F08C]' : 'bg-gray-600'
                }`} />
                <span>Optimization algorithms applied</span>
              </div>
              <div className={`flex items-center space-x-3 ${
                (status?.progress || 0) >= 100 ? 'text-[#32F08C]' : 'text-gray-500'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  (status?.progress || 0) >= 100 ? 'bg-[#32F08C]' : 'bg-gray-600'
                }`} />
                <span>Processing completed</span>
              </div>
            </div>
          </div>

          {/* Preview Stats (if available) */}
          {status?.stats && (
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Processing Results</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Original Size:</span>
                  <div className="font-semibold">
                    {formatFileSize(status.stats.originalSize)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">Processed Size:</span>
                  <div className="font-semibold text-[#32F08C]">
                    {formatFileSize(status.stats.processedSize)}
                  </div>
                </div>
                {status.stats.originalDimensions && (
                  <div>
                    <span className="text-gray-400">Original Dimensions:</span>
                    <div className="font-semibold">
                      {status.stats.originalDimensions[0]} × {status.stats.originalDimensions[1]}
                    </div>
                  </div>
                )}
                {status.stats.newDimensions && (
                  <div>
                    <span className="text-gray-400">New Dimensions:</span>
                    <div className="font-semibold text-[#32F08C]">
                      {status.stats.newDimensions[0]} × {status.stats.newDimensions[1]}
                    </div>
                  </div>
                )}
                <div>
                  <span className="text-gray-400">Size Reduction:</span>
                  <div className="font-semibold text-[#32F08C]">
                    {status.stats.compressionRatio.toFixed(1)}%
                  </div>
                </div>
                {status.stats.pixelReduction && (
                  <div>
                    <span className="text-gray-400">Pixel Reduction:</span>
                    <div className="font-semibold text-[#32F08C]">
                      {status.stats.pixelReduction.toFixed(1)}%
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {status?.status === 'completed' && (
            <div className="space-y-4">
              <button
                onClick={() => navigate(`/results/${jobId}`)}
                className="bg-[#32F08C] text-black px-8 py-3 rounded-lg font-semibold hover:bg-[#28d474] transition-colors"
              >
                View Results
              </button>
            </div>
          )}

          {status?.status === 'failed' && (
            <div className="space-y-4">
              <button
                onClick={() => navigate('/')}
                className="bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}