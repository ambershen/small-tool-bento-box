import { Link } from 'react-router-dom';
import { Files, FileText, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col h-full">
      {/* Hero Section */}
      <div className="border-b-2 border-brand-black p-12 md:p-24 bg-brand-white transition-colors duration-300 dark:border-brand-white dark:bg-brand-black">
        <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase leading-none mb-8 dark:text-brand-white">
          PDF<br/>Expert
        </h1>
        <p className="text-xl md:text-2xl font-mono max-w-2xl leading-relaxed border-l-4 border-brand-black pl-6 dark:border-brand-white dark:text-brand-white">
          Simple, secure, and fast tools to manage your PDF documents.
          Merge multiple files or convert content to Markdown with ease.
        </p>
      </div>

      {/* Grid Section */}
      <div className="grid md:grid-cols-3 flex-1 dark:bg-brand-black">
        <Link to="/merge" className="group block border-b-2 md:border-b-0 md:border-r-2 border-brand-black relative overflow-hidden hover:bg-brand-black transition-colors duration-500 dark:border-brand-white dark:hover:bg-brand-white">
          <div className="p-12 h-full flex flex-col justify-between min-h-[400px]">
            <div>
              <div className="mb-8 inline-flex h-20 w-20 items-center justify-center border-2 border-brand-black bg-brand-white text-brand-black group-hover:invert transition-all dark:border-brand-white dark:bg-brand-black dark:text-brand-white">
                <Files className="h-10 w-10" />
              </div>
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-4 text-brand-black group-hover:text-brand-white transition-colors dark:text-brand-white dark:group-hover:text-brand-black">
                Merge PDF
              </h2>
              <p className="font-mono text-brand-black/60 group-hover:text-brand-white/80 max-w-md transition-colors dark:text-brand-white/60 dark:group-hover:text-brand-black/80">
                Combine multiple PDF files into a single document. Drag and drop to reorder.
              </p>
            </div>
            
            <div className="flex items-center text-lg font-bold uppercase tracking-widest text-brand-black group-hover:text-brand-white mt-12 dark:text-brand-white dark:group-hover:text-brand-black">
              Start Merging <ArrowRight className="ml-4 h-6 w-6 transform group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
        </Link>

        <Link to="/markdown" className="group block border-b-2 md:border-b-0 md:border-r-2 border-brand-black relative overflow-hidden hover:bg-brand-black transition-colors duration-500 dark:border-brand-white dark:hover:bg-brand-white">
          <div className="p-12 h-full flex flex-col justify-between min-h-[400px]">
            <div>
              <div className="mb-8 inline-flex h-20 w-20 items-center justify-center border-2 border-brand-black bg-brand-white text-brand-black group-hover:invert transition-all dark:border-brand-white dark:bg-brand-black dark:text-brand-white">
                <FileText className="h-10 w-10" />
              </div>
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-4 text-brand-black group-hover:text-brand-white transition-colors dark:text-brand-white dark:group-hover:text-brand-black">
                To Markdown
              </h2>
              <p className="font-mono text-brand-black/60 group-hover:text-brand-white/80 max-w-md transition-colors dark:text-brand-white/60 dark:group-hover:text-brand-black/80">
                Extract text and tables from PDF files and convert them to clean Markdown format.
              </p>
            </div>
            
            <div className="flex items-center text-lg font-bold uppercase tracking-widest text-brand-black group-hover:text-brand-white mt-12 dark:text-brand-white dark:group-hover:text-brand-black">
              Start Converting <ArrowRight className="ml-4 h-6 w-6 transform group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
        </Link>

        <Link to="/fill-form" className="group block relative overflow-hidden hover:bg-brand-black transition-colors duration-500 dark:hover:bg-brand-white">
          <div className="p-12 h-full flex flex-col justify-between min-h-[400px]">
            <div>
              <div className="mb-8 inline-flex h-20 w-20 items-center justify-center border-2 border-brand-black bg-brand-white text-brand-black group-hover:invert transition-all dark:border-brand-white dark:bg-brand-black dark:text-brand-white">
                <FileText className="h-10 w-10" />
              </div>
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-4 text-brand-black group-hover:text-brand-white transition-colors dark:text-brand-white dark:group-hover:text-brand-black">
                Fill Form
              </h2>
              <p className="font-mono text-brand-black/60 group-hover:text-brand-white/80 max-w-md transition-colors dark:text-brand-white/60 dark:group-hover:text-brand-black/80">
                Upload a PDF form, fill in the fields, and download the completed document.
              </p>
            </div>
            
            <div className="flex items-center text-lg font-bold uppercase tracking-widest text-brand-black group-hover:text-brand-white mt-12 dark:text-brand-white dark:group-hover:text-brand-black">
              Start Filling <ArrowRight className="ml-4 h-6 w-6 transform group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
