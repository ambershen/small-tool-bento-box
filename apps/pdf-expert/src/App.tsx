import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { cn } from './lib/utils'
import Home from './pages/Home'
import MergePdf from './pages/MergePdf'
import PdfToMarkdown from './pages/PdfToMarkdown'
import FillForm from './pages/FillForm'

import { ThemeToggle } from './components/ThemeToggle'

function NavLink({ to, children, number }: { to: string; children: React.ReactNode; number: string }) {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <Link
      to={to}
      className={cn(
        "group relative flex h-full items-center px-6 text-sm font-bold uppercase tracking-widest transition-all duration-300 border-l-2 border-brand-black first:border-l-0 hover:bg-brand-black hover:text-brand-white",
        "dark:border-brand-white dark:hover:bg-brand-white dark:hover:text-brand-black",
        isActive 
          ? "bg-brand-black text-brand-white dark:bg-brand-white dark:text-brand-black" 
          : "text-brand-black dark:text-brand-white"
      )}
    >
      <span className="mr-2 text-xs opacity-50 group-hover:opacity-100 transition-opacity">{number}</span>
      {children}
    </Link>
  )
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-white text-brand-black font-sans selection:bg-brand-coral selection:text-brand-white transition-colors duration-300 dark:bg-brand-black dark:text-brand-white">
      <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b-2 border-brand-black bg-brand-white flex items-stretch justify-between transition-colors duration-300 dark:border-brand-white dark:bg-brand-black">
        <div className="flex items-center h-full">
            <Link to="/" className="flex h-full items-center px-8 border-r-2 border-brand-black hover:bg-brand-coral hover:text-brand-white transition-colors dark:border-brand-white">
              <span className="font-display text-2xl font-black tracking-tighter uppercase">PDF<br/>Exp.</span>
            </Link>
        </div>
        
        <nav className="flex h-full items-stretch">
          <NavLink to="/" number="01">Home</NavLink>
          <NavLink to="/merge" number="02">Merge</NavLink>
          <NavLink to="/markdown" number="03">To Markdown</NavLink>
          <NavLink to="/fill-form" number="04">Fill Form</NavLink>
          <ThemeToggle />
        </nav>
      </header>

      <main className="pt-16 min-h-screen flex flex-col">
        <div className="flex-1 w-full max-w-[1920px] mx-auto border-x-2 border-brand-black border-t-0 min-h-[calc(100vh-4rem)] transition-colors duration-300 dark:border-brand-white">
            {children}
        </div>
      </main>
      
      <footer className="border-t-4 border-brand-black bg-brand-black text-brand-white overflow-hidden transition-colors duration-300 dark:border-brand-white">
        <div className="flex bg-brand-coral py-2 border-b-2 border-brand-black whitespace-nowrap overflow-hidden dark:border-brand-white">
          <div className="animate-marquee flex gap-12 text-sm font-black uppercase tracking-widest text-brand-black">
            <span>Merge PDF</span>
            <span>To Markdown</span>
            <span>Fill Form</span>
            <span>Merge PDF</span>
            <span>To Markdown</span>
            <span>Fill Form</span>
            <span>Merge PDF</span>
            <span>To Markdown</span>
            <span>Fill Form</span>
          </div>
        </div>
        
        <div className="container mx-auto px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
            <div className="space-y-8">
              <h2 className="font-display text-6xl md:text-8xl font-black uppercase leading-none tracking-tighter">
                PDF<br/>Expert<span className="text-brand-coral">.</span>
              </h2>
            </div>
            
            <div className="flex flex-col items-start md:items-end gap-6">
              <div className="p-6 border-2 border-brand-white bg-transparent font-mono text-xs uppercase tracking-[0.2em] hover:bg-brand-white hover:text-brand-black transition-all cursor-pointer">
                © {new Date().getFullYear()} — NO RIGHTS RESERVED. JUST ART.
              </div>
            </div>
          </div>
        </div>

        <div className="h-4 bg-brand-white dark:bg-brand-black transition-colors duration-300" />
      </footer>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/merge" element={<MergePdf />} />
          <Route path="/markdown" element={<PdfToMarkdown />} />
          <Route path="/fill-form" element={<FillForm />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
