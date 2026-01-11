import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ThemeToggle } from '../components/ThemeToggle';

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
      <div className="min-h-screen bg-brand-white dark:bg-brand-black text-brand-black dark:text-brand-white flex items-center justify-center font-sans">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-brand-coral" />
          <p className="font-mono text-xs font-bold uppercase tracking-widest">Loading...</p>
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
      <main className="relative z-10 container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b-[1px] border-brand-black dark:border-brand-white pb-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 font-mono text-xs font-bold uppercase tracking-widest hover:text-brand-coral transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
          <ThemeToggle />
        </div>

        <div className="text-center space-y-12">
          {/* Status Icon */}
          <div className="flex justify-center">
            {status?.status === 'completed' ? (
              <div className="w-20 h-20 bg-brand-black dark:bg-brand-white rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-brand-white dark:text-brand-black" />
              </div>
            ) : status?.status === 'failed' ? (
              <div className="w-20 h-20 bg-brand-coral rounded-full flex items-center justify-center">
                <XCircle className="w-10 h-10 text-white" />
              </div>
            ) : (
              <div className="w-20 h-20 bg-brand-black/5 dark:bg-brand-white/5 rounded-full flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-brand-coral animate-spin" />
              </div>
            )}
          </div>

          {/* Status Text */}
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">
              {status?.status === 'completed' && 'Processing Complete!'}
              {status?.status === 'failed' && 'Processing Failed'}
              {(status?.status === 'pending' || status?.status === 'processing') && 'Processing Image'}
            </h1>
            <p className="font-serif text-xl text-brand-black/60 dark:text-brand-white/60">
              {status?.status === 'completed' && 'Your image has been successfully processed.'}
              {status?.status === 'failed' && (status?.error || 'An error occurred during processing.')}
              {(status?.status === 'pending' || status?.status === 'processing') && 'Please wait while we optimize your image...'}
            </p>
          </div>

          {/* Progress Bar */}
          {(status?.status === 'pending' || status?.status === 'processing') && (
            <div className="w-full max-w-md mx-auto">
              <div className="flex justify-between font-mono text-[10px] uppercase tracking-widest mb-4 opacity-60">
                <span>Progress</span>
                <span>{status?.progress || 0}%</span>
              </div>
              <div className="w-full bg-brand-black/5 dark:bg-brand-white/5 rounded-none h-1">
                <div 
                  className="bg-brand-coral h-1 transition-all duration-500 ease-out"
                  style={{ width: `${status?.progress || 0}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Processing Steps */}
          <div className="bg-white dark:bg-zinc-900 border-[1px] border-brand-black dark:border-brand-white p-8 max-w-md mx-auto text-left transition-colors duration-300">
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest mb-6 opacity-40 border-b border-brand-black/10 dark:border-brand-white/10 pb-2">Processing Steps</h3>
            <div className="space-y-4">
              {[
                { threshold: 10, label: 'Image uploaded and validated' },
                { threshold: 30, label: 'Image processing in progress' },
                { threshold: 80, label: 'Optimization algorithms applied' },
                { threshold: 100, label: 'Processing completed' }
              ].map((step, i) => (
                <div key={i} className={`flex items-center space-x-4 transition-colors duration-300 ${
                  (status?.progress || 0) >= step.threshold ? 'text-brand-black dark:text-brand-white' : 'text-brand-black/20 dark:text-brand-white/20'
                }`}>
                  <div className={`w-2 h-2 rounded-none transform rotate-45 ${
                    (status?.progress || 0) >= step.threshold ? 'bg-brand-coral' : 'bg-brand-black/10 dark:bg-brand-white/10'
                  }`} />
                  <span className="font-serif text-base">{step.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Preview Stats (if available) */}
          {status?.stats && (
            <div className="bg-white dark:bg-zinc-900 border-[1px] border-brand-black dark:border-brand-white p-8 max-w-md mx-auto transition-colors duration-300">
              <h3 className="font-mono text-xs font-bold uppercase tracking-widest mb-6 opacity-40 border-b border-brand-black/10 dark:border-brand-white/10 pb-2">Results</h3>
              <div className="grid grid-cols-2 gap-y-6 gap-x-8 text-left">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest opacity-40">Original</span>
                  <div className="font-bold text-lg leading-tight mt-1">
                    {formatFileSize(status.stats.originalSize)}
                  </div>
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest opacity-40">Processed</span>
                  <div className="font-bold text-lg leading-tight mt-1 text-brand-coral">
                    {formatFileSize(status.stats.processedSize)}
                  </div>
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest opacity-40">Reduction</span>
                  <div className="font-bold text-lg leading-tight mt-1 text-brand-coral">
                    {status.stats.compressionRatio.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {status?.status === 'completed' && (
            <div className="pt-8">
              <button
                onClick={() => navigate(`/results/${jobId}`)}
                className="bg-brand-black text-brand-white dark:bg-brand-white dark:text-brand-black px-12 py-4 rounded-none font-bold uppercase tracking-widest text-lg hover:bg-brand-coral hover:text-brand-white dark:hover:bg-brand-coral dark:hover:text-brand-white transition-colors"
              >
                View Results
              </button>
            </div>
          )}

          {status?.status === 'failed' && (
            <div className="pt-8">
              <button
                onClick={() => navigate('/')}
                className="bg-brand-black text-brand-white dark:bg-brand-white dark:text-brand-black px-12 py-4 rounded-none font-bold uppercase tracking-widest text-lg hover:bg-brand-coral hover:text-brand-white dark:hover:bg-brand-coral dark:hover:text-brand-white transition-colors"
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
