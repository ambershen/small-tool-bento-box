import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Github } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BrutalistCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  url: string;
  route?: string;
  githubUrl?: string;
  className?: string;
  color?: string;
}

export function BrutalistCard({
  title,
  description,
  icon,
  url,
  route,
  githubUrl,
  className = '',
}: BrutalistCardProps) {
  const navigate = useNavigate();

  const handleLaunch = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (route) {
      navigate(route);
    } else {
      window.open(url, '_blank');
    }
  };

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      className={`
        group relative flex flex-col h-full
        bg-transparent
        border-t-[1px] border-[#0A0A0C]
        pt-6 pb-12 pr-6
        transition-all duration-300
        hover:bg-[#0A0A0C]/[0.02]
        ${className}
      `}
      onClick={() => handleLaunch()}
    >
      {/* Number/Icon Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="text-[#0A0A0C] scale-75 origin-top-left opacity-60 group-hover:opacity-100 transition-opacity">
          {icon}
        </div>
        <motion.div 
          variants={{
            rest: { x: 0, opacity: 0 },
            hover: { x: 5, opacity: 1 }
          }}
        >
          <ArrowRight className="w-6 h-6 text-[#0A0A0C]" />
        </motion.div>
      </div>
      
      {/* Content */}
      <div className="flex-1 flex flex-col gap-4">
        <h3 className="text-3xl md:text-4xl font-display font-bold uppercase tracking-tighter leading-[0.9] text-[#0A0A0C] group-hover:underline decoration-2 underline-offset-4">
          {title}
        </h3>
        
        <p className="text-[#0A0A0C] font-serif text-lg leading-snug max-w-sm">
          {description}
        </p>
      </div>

      {/* Footer/Links */}
      <div className="mt-8 flex items-center gap-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button 
          onClick={handleLaunch}
          className="font-mono text-xs font-bold uppercase tracking-widest border-b border-[#0A0A0C] pb-0.5 hover:text-[#D14A61] hover:border-[#D14A61] transition-colors"
        >
          Launch Tool
        </button>
        
        {githubUrl && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(githubUrl, '_blank');
            }}
            className="text-[#0A0A0C] hover:text-[#82667F] transition-colors"
            title="View Source"
          >
            <Github size={16} />
          </button>
        )}
      </div>
    </motion.div>
  );
}
