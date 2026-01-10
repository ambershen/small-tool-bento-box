import { useState, useEffect } from 'react';
import { FiDownload, FiCopy, FiSun, FiMoon, FiLink, FiImage, FiGrid } from 'react-icons/fi';
import QRCode from 'qrcode';

function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, Math.min(w, h) / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

async function composeQrWithLogo(qrDataUrl: string, logoDataUrl: string, opts: { sizeRatio: number; paddingRatio: number; rounded: boolean; darkMode: boolean; }) {
  const canBitmap = typeof createImageBitmap === 'function';
  const safeSizeRatio = Math.min(Math.max(opts.sizeRatio, 0.10), 0.30);
  const safePaddingRatio = Math.min(Math.max(opts.paddingRatio, 0), 0.08);
  if (canBitmap) {
    const qrBlob = await fetch(qrDataUrl).then(r => r.blob());
    const logoBlob = await fetch(logoDataUrl).then(r => r.blob());
    const qrBmp = await createImageBitmap(qrBlob);
    const logoBmp = await createImageBitmap(logoBlob);
    const size = Math.max(qrBmp.width, qrBmp.height);
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not available');
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(qrBmp, 0, 0, size, size);
    const boxSize = Math.round(size * safeSizeRatio);
    const padding = Math.round(size * safePaddingRatio);
    const centerX = Math.round(size / 2 - boxSize / 2);
    const centerY = Math.round(size / 2 - boxSize / 2);
    // Use Light theme color for backdrop instead of pure white to match palette
    const backdropColor = '#F2EDE7'; 
    ctx.fillStyle = backdropColor;
    if (opts.rounded) {
      drawRoundedRect(ctx, centerX, centerY, boxSize, boxSize, Math.round(boxSize * 0.12));
      ctx.fill();
    } else {
      ctx.fillRect(centerX, centerY, boxSize, boxSize);
    }
    const maxLogoW = boxSize - padding * 2;
    const maxLogoH = boxSize - padding * 2;
    const logoAspect = logoBmp.width / logoBmp.height;
    const fitW = maxLogoW;
    const fitH = Math.round(fitW / logoAspect);
    let drawW = fitW;
    let drawH = fitH;
    if (drawH > maxLogoH) {
      drawH = maxLogoH;
      drawW = Math.round(drawH * logoAspect);
    }
    const drawX = Math.round(size / 2 - drawW / 2);
    const drawY = Math.round(size / 2 - drawH / 2);
    ctx.drawImage(logoBmp, drawX, drawY, drawW, drawH);
    return canvas.toDataURL('image/png');
  }
  return await new Promise<string>((resolve, reject) => {
    const qrImg = new Image();
    qrImg.onload = () => {
      const size = Math.max(qrImg.width, qrImg.height);
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(qrImg, 0, 0, size, size);
      const logoImg = new Image();
      logoImg.onload = () => {
        const boxSize = Math.round(size * safeSizeRatio);
        const padding = Math.round(size * safePaddingRatio);
        const centerX = Math.round(size / 2 - boxSize / 2);
        const centerY = Math.round(size / 2 - boxSize / 2);
        const backdropColor = '#F2EDE7';
        ctx.fillStyle = backdropColor;
        if (opts.rounded) {
          drawRoundedRect(ctx, centerX, centerY, boxSize, boxSize, Math.round(boxSize * 0.12));
          ctx.fill();
        } else {
          ctx.fillRect(centerX, centerY, boxSize, boxSize);
        }
        const maxLogoW = boxSize - padding * 2;
        const maxLogoH = boxSize - padding * 2;
        const logoAspect = logoImg.width / logoImg.height;
        const fitW = maxLogoW;
        const fitH = Math.round(fitW / logoAspect);
        let drawW = fitW;
        let drawH = fitH;
        if (drawH > maxLogoH) {
          drawH = maxLogoH;
          drawW = Math.round(drawH * logoAspect);
        }
        const drawX = Math.round(size / 2 - drawW / 2);
        const drawY = Math.round(size / 2 - drawH / 2);
        ctx.drawImage(logoImg, drawX, drawY, drawW, drawH);
        resolve(canvas.toDataURL('image/png'));
      };
      logoImg.onerror = () => reject(new Error('Failed to load logo image'));
      logoImg.src = logoDataUrl;
    };
    qrImg.onerror = () => reject(new Error('Failed to load QR image'));
    qrImg.src = qrDataUrl;
  });
}

export default function Home() {
  const [url, setUrl] = useState('');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [logoSizeRatio, setLogoSizeRatio] = useState(0.18);
  const [logoPaddingRatio, setLogoPaddingRatio] = useState(0.04);
  const [logoRounded, setLogoRounded] = useState(true);

  // Load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      // Default to system preference
      setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    if (!logoDataUrl) return;
    if (!url.trim()) return;
    if (isGenerating) return;
    const t = setTimeout(() => {
      generateQRCode();
    }, 250);
    return () => clearTimeout(t);
  }, [logoDataUrl, logoSizeRatio, logoPaddingRatio, logoRounded]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const generateQRCode = async () => {
    if (!url.trim()) {
      return;
    }
    
    setIsGenerating(true);
    try {
      const dataUrl = await QRCode.toDataURL(url, {
        width: 512, // Increased resolution for better quality
        height: 512,
        margin: 2,
        color: {
          dark: '#0A0A0C',
          light: '#F2EDE7'
        },
        errorCorrectionLevel: logoDataUrl ? 'H' : 'M'
      });
      let finalUrl = dataUrl;
      if (logoDataUrl) {
        try {
          finalUrl = await composeQrWithLogo(dataUrl, logoDataUrl, {
            sizeRatio: logoSizeRatio,
            paddingRatio: logoPaddingRatio,
            rounded: logoRounded,
            darkMode: isDarkMode
          });
        } catch (e) {
          console.error('Logo composition failed, using plain QR:', e);
          finalUrl = dataUrl;
        }
      }
      setQrCodeDataUrl(finalUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeDataUrl) return;
    
    const link = document.createElement('a');
    link.download = `qrcode-${Date.now()}.png`;
    link.href = qrCodeDataUrl;
    link.click();
  };

  const copyToClipboard = async () => {
    if (!qrCodeDataUrl) return;
    
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 transition-colors duration-300 flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center mb-8 md:mb-12 border-b-2 border-current pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 grid grid-cols-2 gap-1">
            <div className="border-2 border-current"></div>
            <div className="border-2 border-current"></div>
            <div className="border-2 border-current"></div>
            <div className="bg-current"></div>
          </div>
          <h1 className="text-xl md:text-2xl font-medium tracking-tight whitespace-nowrap">
            QR GENERATOR
          </h1>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-current hover:text-[var(--c-light)] transition-colors rounded-none"
          aria-label="Toggle Theme"
        >
          {isDarkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
        </button>
      </nav>

      <main className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-[1600px] mx-auto w-full">
        {/* Left Column - Configuration */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Section 01: Source */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-current pb-2 opacity-60">
              <span className="font-mono text-sm">01</span>
              <h2 className="text-sm font-bold uppercase tracking-wider">Source Content</h2>
            </div>
            
            <div className="brutal-card p-6 md:p-8 space-y-4">
              <label className="flex items-center gap-2 text-sm font-bold uppercase mb-2">
                <FiLink /> Target URL
              </label>
              <div className="flex gap-0">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="brutal-input flex-grow border-r-0 focus:z-10"
                  onKeyPress={(e) => e.key === 'Enter' && generateQRCode()}
                />
                <button 
                  onClick={generateQRCode}
                  disabled={!url.trim() || isGenerating}
                  className="brutal-btn border-l-2 px-6 disabled:opacity-50"
                  style={{ boxShadow: 'none', transform: 'none' }}
                >
                  {isGenerating ? '...' : 'GENERATE'}
                </button>
              </div>
            </div>
          </section>

          {/* Section 02: Configuration */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-current pb-2 opacity-60">
              <span className="font-mono text-sm">02</span>
              <h2 className="text-sm font-bold uppercase tracking-wider">Configuration</h2>
            </div>

            <div className="brutal-card p-6 md:p-8 space-y-8">
               {/* Logo Upload */}
               <div className="space-y-4">
                  <label className="flex items-center gap-2 text-sm font-bold uppercase">
                    <FiImage /> Brand Logo (Optional)
                  </label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="brutal-btn cursor-pointer w-full justify-center py-8 border-dashed hover:border-solid bg-transparent hover:bg-[var(--c-light)] dark:hover:bg-[var(--c-dark)] text-sm">
                      <span className="flex flex-col items-center gap-2">
                         <span className="text-2xl">+</span>
                         <span>UPLOAD IMAGE</span>
                      </span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/svg+xml"
                        onChange={(e) => {
                          const file = e.target.files && e.target.files[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = () => {
                            const result = reader.result as string;
                            setLogoDataUrl(result);
                          };
                          reader.readAsDataURL(file);
                        }}
                        className="hidden"
                      />
                    </label>

                    {logoDataUrl && (
                      <div className="relative h-full min-h-[120px] flex items-center justify-center border-2 border-current p-4">
                         <img src={logoDataUrl} alt="Logo Preview" className="max-h-20 max-w-full object-contain" />
                         <button
                            onClick={() => setLogoDataUrl(null)}
                            className="absolute top-2 right-2 p-1 hover:bg-red-500 hover:text-white transition-colors"
                            aria-label="Remove Logo"
                          >
                            ×
                          </button>
                      </div>
                    )}
                  </div>
               </div>

               {/* Logo Settings */}
               {logoDataUrl && (
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4 border-t border-current/20">
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-mono uppercase">
                          <span>Size Ratio</span>
                          <span>{Math.round(logoSizeRatio * 100)}%</span>
                        </div>
                        <input
                            type="range"
                            min={10} max={30}
                            value={Math.round(logoSizeRatio * 100)}
                            onChange={(e) => setLogoSizeRatio(parseInt(e.target.value, 10) / 100)}
                            className="w-full"
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-mono uppercase">
                          <span>Padding</span>
                          <span>{Math.round(logoPaddingRatio * 100)}%</span>
                        </div>
                        <input
                            type="range"
                            min={0} max={8}
                            value={Math.round(logoPaddingRatio * 100)}
                            onChange={(e) => setLogoPaddingRatio(parseInt(e.target.value, 10) / 100)}
                            className="w-full"
                        />
                    </div>
                    <div className="sm:col-span-2">
                         <label className="flex items-center gap-3 font-medium uppercase cursor-pointer select-none group">
                            <div className={`w-5 h-5 border-2 border-current flex items-center justify-center transition-all ${logoRounded ? 'bg-current' : 'group-hover:bg-current/10'}`}>
                                {logoRounded && <div className="w-1.5 h-1.5 bg-[var(--c-light)] dark:bg-[var(--c-dark)]"></div>}
                            </div>
                            <input
                              type="checkbox"
                              checked={logoRounded}
                              onChange={(e) => setLogoRounded(e.target.checked)}
                              className="hidden"
                            />
                            <span className="text-sm">Rounded Logo Background</span>
                        </label>
                    </div>
                 </div>
               )}
            </div>
          </section>
        </div>

        {/* Right Column - Preview */}
        <div className="lg:col-span-5 space-y-6">
           <div className="flex items-center gap-3 border-b border-current pb-2 opacity-60">
              <span className="font-mono text-sm">03</span>
              <h2 className="text-sm font-bold uppercase tracking-wider">Preview Output</h2>
            </div>

            <div className="sticky top-8">
               <div className="brutal-card p-6 md:p-8 flex flex-col items-center justify-center min-h-[400px] gap-8 bg-[var(--c-light)] dark:bg-[var(--c-dark)]">
                  {qrCodeDataUrl ? (
                    <>
                      <div className="p-4 bg-white border-2 border-black dark:border-white shadow-[8px_8px_0_0_#0A0A0C] dark:shadow-[8px_8px_0_0_#F2EDE7] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0_0_#0A0A0C] dark:hover:shadow-[10px_10px_0_0_#F2EDE7]">
                         <img src={qrCodeDataUrl} alt="QR Code" className="w-full max-w-[280px] h-auto block" style={{ imageRendering: 'pixelated' }} />
                      </div>
                      <div className="w-full grid grid-cols-2 gap-4">
                         <button onClick={downloadQRCode} className="brutal-btn w-full justify-center bg-[var(--c-blue)] text-white border-[var(--c-blue)] hover:bg-[var(--c-blue)] hover:opacity-90">
                            <FiDownload /> Save PNG
                         </button>
                         <button onClick={copyToClipboard} className="brutal-btn w-full justify-center">
                            <FiCopy /> {copied ? 'Copied' : 'Copy'}
                         </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-current opacity-30 gap-4">
                       <FiGrid className="w-16 h-16" />
                       <p className="font-mono text-sm uppercase">Waiting for input...</p>
                    </div>
                  )}
               </div>
            </div>
        </div>
      </main>

      <footer className="mt-12 py-6 border-t border-current text-center font-mono text-xs uppercase opacity-40">
        <p>System Status: Operational • v2.0.0 Elegant Brutalism</p>
      </footer>
    </div>
  );
}
