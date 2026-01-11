import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { BrutalistCard } from '../components/BrutalistCard';
import { tools } from '../tools';

export function Home() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* Masthead */}
      <header className="px-6 py-20 md:py-32 border-b-[1px] border-[#0A0A0C] relative overflow-hidden">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-8">
            <h1 className="text-[12vw] md:text-[10vw] leading-[0.8] font-black tracking-tighter uppercase text-[#0A0A0C]">
              SMALL<br />
              TOOL<br />
              <span className="ml-[10vw] md:ml-[12vw] text-transparent stroke-text">BENTO</span><br />
              BOX<span className="text-[#D14A61]">.</span>
            </h1>
          </div>
          
          <div className="col-span-12 md:col-span-4 flex flex-col justify-end items-start md:items-end mt-12 md:mt-0">
             <p className="font-serif text-xl md:text-2xl leading-snug max-w-xs text-left md:text-right mb-8">
               A curated collection of raw digital utility.
             </p>
             
             <div className="flex flex-col items-start md:items-end gap-2 font-mono text-xs uppercase tracking-widest opacity-60">
               <span>Vol. 1.0 — {currentYear}</span>
               <span>By Amber Shen</span>
             </div>
          </div>
        </div>
        
        <motion.div 
          initial={{ y: 0 }}
          animate={{ y: 10 }}
          transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
          className="absolute bottom-8 left-6 md:left-1/2 md:-translate-x-1/2"
        >
          <ArrowDown className="w-6 h-6" />
        </motion.div>
      </header>

      {/* Collection Grid */}
      <main id="collection" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#0A0A0C] border-b-[1px] border-[#0A0A0C]">
        {tools.map((tool, index) => (
          <motion.div
            key={tool.title}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={tool.className?.includes('col-span-2') ? 'md:col-span-2' : ''}
          >
            <BrutalistCard {...tool} className="h-full border-t-0" />
          </motion.div>
        ))}

        {/* Coming Soon / Manifesto Block */}
        <div className="min-h-[400px] p-8 flex flex-col justify-between bg-[#0A0A0C] text-[#F2EDE7]">
           <div className="font-mono text-xs uppercase tracking-widest border-b border-[#F2EDE7]/20 pb-4 mb-8">
             Manifesto
           </div>
           
           <div className="space-y-6">
             <h3 className="font-display text-4xl font-bold uppercase leading-none">
               Utility is<br/>Beauty.
             </h3>
             <p className="font-serif text-lg opacity-80 leading-relaxed">
               Tools can be both functional and beautiful. Carefully crafted for you.
             </p>
           </div>
           
           <div className="pt-12">
             <span className="inline-block px-3 py-1 border border-[#F2EDE7] rounded-full text-xs uppercase tracking-widest">
               More Coming Soon
             </span>
           </div>
        </div>
      </main>

      {/* CSS for outline text effect */}
      <style>{`
        .stroke-text {
          -webkit-text-stroke: 2px #0A0A0C;
          color: transparent;
        }
        @media (min-width: 768px) {
          .stroke-text {
            -webkit-text-stroke: 3px #0A0A0C;
          }
        }
      `}</style>
    </>
  );
}
