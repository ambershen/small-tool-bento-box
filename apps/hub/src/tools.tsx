import { FileText, Image as ImageIcon, QrCode } from 'lucide-react';

export const tools = [
  {
    title: 'Image Processor',
    description:
      'Modern image compression and optimization with pixel-perfect resizing. Features real-time comparison and privacy-first local processing.',
    icon: <ImageIcon size={24} />,
    url: 'https://traeimage-compressorepwd.vercel.app/',
    previewUrl: 'https://traeimage-compressorepwd.vercel.app/',
    githubUrl: 'https://github.com/ambershen/image-processor',
    color: '#10B981',
    className: 'md:col-span-2 md:row-span-2',
  },
  {
    title: 'QR Code Gen',
    description:
      'Instant, customizable QR code generation. Support for URLs, text, and wifi credentials with custom colors and logo embedding.',
    icon: <QrCode size={24} />,
    url: 'https://traeqrcodeka3i.vercel.app/',
    previewUrl: 'https://traeqrcodeka3i.vercel.app/',
    githubUrl: 'https://github.com/ambershen/qrcode-gen',
    color: '#3B82F6',
    className: 'md:col-span-1 md:row-span-1',
  },
  {
    title: 'PDF Expert',
    description:
      'Secure PDF tools for merging, converting, and organizing documents. 100% client-side processing for maximum privacy.',
    icon: <FileText size={24} />,
    url: 'https://traepdf-expertoute.vercel.app/',
    previewUrl: 'https://traepdf-expertoute.vercel.app/',
    githubUrl: 'https://github.com/ambershen/pdf-expert',
    color: '#F43F5E',
    className: 'md:col-span-1 md:row-span-1',
  },
];
