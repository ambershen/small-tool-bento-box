import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, Github, Maximize2, X } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface ToolCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  url: string;
  githubUrl?: string;
  previewUrl?: string;
  className?: string;
  color?: string;
}

export function ToolCard({
  title,
  description,
  icon,
  url,
  githubUrl,
  previewUrl,
  className,
  color = '#10B981',
}: ToolCardProps) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <>
      <motion.div
        whileHover={{ y: -5, scale: 1.01 }}
        className={twMerge(
          'relative overflow-hidden rounded-3xl bg-surface p-6 border border-white/5 shadow-xl flex flex-col justify-between group cursor-pointer transition-colors hover:border-white/10',
          className
        )}
        onClick={() => !showPreview && window.open(url, '_blank')}
      >
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
          style={{ background: `radial-gradient(circle at center, ${color}, transparent 70%)` }}
        />

        <div className="relative z-10">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-white shadow-lg"
            style={{ backgroundColor: color }}
          >
            {icon}
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-muted text-sm leading-relaxed">{description}</p>
        </div>

        <div className="relative z-10 mt-6 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(url, '_blank');
            }}
            className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-xl text-sm font-medium transition-colors"
          >
            <ExternalLink size={16} />
            Open
          </button>

          {previewUrl && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowPreview(true);
              }}
              className="flex items-center justify-center p-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors"
              title="Quick Preview"
            >
              <Maximize2 size={16} />
            </button>
          )}

          {githubUrl && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(githubUrl, '_blank');
              }}
              className="flex items-center justify-center p-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors"
              title="View Source"
            >
              <Github size={16} />
            </button>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-6xl h-[85vh] bg-surface rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-surfaceHover">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: color }}>
                    {icon}
                  </div>
                  <h3 className="font-semibold text-white">{title} Preview</h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => window.open(url, '_blank')}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors text-sm font-medium"
                  >
                    Open Full <ExternalLink size={14} />
                  </button>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="p-2 hover:bg-white/10 rounded-lg text-muted hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className="flex-1 bg-background relative">
                <iframe
                  src={previewUrl}
                  className="w-full h-full border-0"
                  title={`${title} Preview`}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted/50 pointer-events-none">
                  If content doesn't load, try opening in full view.
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
