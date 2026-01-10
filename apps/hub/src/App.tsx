import { ToolCard } from '@smalltool/ui';
import { Box, Github } from 'lucide-react';
import { motion } from 'framer-motion';
import { tools } from './tools';

function App() {
  return (
    <div className="min-h-screen bg-background text-text p-6 md:p-12 font-sans selection:bg-primary/20">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 animate-fade-in">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/10 rounded-xl">
                <Box className="text-primary" size={24} />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white">SmallTool Bento Box</h1>
            </div>
            <p className="text-muted max-w-md">
              A personal collection of daily utility tools, built for performance and privacy.
            </p>
          </div>

          <div className="flex gap-3">
            <a
              href="https://github.com/ambershen"
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-full bg-surface hover:bg-surfaceHover border border-white/5 transition-colors text-muted hover:text-white"
            >
              <Github size={20} />
            </a>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[240px]">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={tool.className}
            >
              <ToolCard {...tool} className="h-full" />
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="md:col-span-1 md:row-span-1 rounded-3xl bg-surface border border-white/5 p-6 flex flex-col justify-center items-center text-center space-y-4 hover:bg-surfaceHover transition-colors group"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-500/20 to-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <span className="text-2xl">🚀</span>
            </div>
            <div>
              <h3 className="text-white font-bold mb-1">More Coming Soon</h3>
              <p className="text-sm text-muted">Constantly building and adding new utilities to this collection.</p>
            </div>
          </motion.div>
        </div>

        <footer className="pt-12 border-t border-white/5 flex justify-between items-center text-sm text-muted">
          <p>© {new Date().getFullYear()} Amber Shen. All rights reserved.</p>
          <p>Built with React, Vite & Tailwind</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
