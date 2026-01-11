import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ExternalLink, ArrowLeft, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BentoLogo } from './components/BentoLogo';
import { Home } from './pages/Home';
import { ToolPage } from './pages/ToolPage';
import { tools } from './tools';

function Layout({ children }: { children: React.ReactNode }) {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [isFooterOpen, setIsFooterOpen] = useState(isHomePage);
  const [prevPath, setPrevPath] = useState(location.pathname);

  // Reset footer state when path changes (e.g. navigating from home to subpage)
  if (location.pathname !== prevPath) {
    setPrevPath(location.pathname);
    setIsFooterOpen(location.pathname === '/');
  }

  return (
    <div className="min-h-screen bg-[#F2EDE7] text-[#0A0A0C] font-sans selection:bg-[#0A0A0C] selection:text-[#F2EDE7]">
      {/* Sticky Top Bar / Navigation */}
      <nav className="sticky top-0 z-50 bg-[#F2EDE7]/90 backdrop-blur-sm border-b-[1px] border-[#0A0A0C] px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 group">
             <BentoLogo className="text-[#0A0A0C] group-hover:text-[#D14A61] transition-colors duration-300" />
             <span className="font-mono text-xs font-bold tracking-widest uppercase">Bento Box</span>
          </Link>

          {!isHomePage && (
            <Link 
              to="/" 
              className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest hover:text-[#D14A61] transition-colors border-l border-[#0A0A0C] pl-6"
            >
              <ArrowLeft size={12} />
              <span>Back to Home</span>
            </Link>
          )}
        </div>
        
        <div className="flex items-center gap-6 font-mono text-xs uppercase tracking-widest font-bold">
          <span className="hidden lg:block opacity-40">Issue No. 001 // Free</span>
          <a href="/#collection" className="hidden md:block hover:underline decoration-2 underline-offset-4">Collection</a>
          <a href="#about" className="hidden md:block hover:underline decoration-2 underline-offset-4">About</a>
          <a 
            href="https://github.com/ambershen" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-2 hover:text-[#82667F] transition-colors"
          >
            GitHub <ExternalLink size={12} />
          </a>
        </div>
      </nav>

      <div className="max-w-[1920px] mx-auto">
        {children}

        {/* Footer Toggle for Subpages */}
        {!isHomePage && (
          <button 
            onClick={() => setIsFooterOpen(!isFooterOpen)}
            className="w-full py-2 bg-[#0A0A0C] text-[#F2EDE7] flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] hover:bg-[#D14A61] transition-colors"
          >
            {isFooterOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            {isFooterOpen ? 'Hide Info' : 'Show Info'}
          </button>
        )}

        {/* Footer */}
        <AnimatePresence initial={false}>
          {isFooterOpen && (
            <motion.footer 
              id="about"
              initial={!isHomePage ? { height: 0, opacity: 0 } : false}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#0A0A0C] border-t-[1px] border-[#0A0A0C] overflow-hidden"
            >
              <div className="p-8">
                <h4 className="font-mono text-xs font-bold uppercase tracking-widest mb-4">Connect</h4>
                <ul className="space-y-2 font-serif text-lg">
                  <li><a href="https://github.com/ambershen" target="_blank" rel="noreferrer" className="hover:underline">GitHub</a></li>
                  <li><a href="https://x.com/whosamberella" target="_blank" rel="noreferrer" className="hover:underline">Twitter</a></li>
                </ul>
              </div>
              
              <div className="p-8 lg:col-span-3 bg-[#D14A61] text-white flex flex-col justify-between">
                <div className="w-12 h-12 bg-white rounded-full mb-8" />
                <div>
                  <p className="font-display text-2xl font-bold uppercase mb-2">SmallTool Bento Box</p>
                  <p className="font-mono text-xs opacity-80">
                    © {currentYear} All Rights Reserved. Designed in the spirit of Brutalism.
                  </p>
                </div>
              </div>
            </motion.footer>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          {tools.map((tool) => (
             tool.route && <Route key={tool.route} path={tool.route} element={<ToolPage url={tool.url} />} />
          ))}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
