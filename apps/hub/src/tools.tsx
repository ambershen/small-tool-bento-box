import { FileText, Image as ImageIcon, QrCode } from 'lucide-react';

export const tools = [
  {
    title: 'Image Processor',
    description:
      'High-fidelity compression meets brutal efficiency. Shrink your footprint without sacrificing a single pixel. Local, fast, and uncompromising.',
    icon: <ImageIcon size={24} />,
    route: '/imageprocessor',
    url: 'https://traeimage-compressorepwd.vercel.app/',
    previewUrl: 'https://traeimage-compressorepwd.vercel.app/',
    githubUrl: 'https://github.com/ambershen/image-processor',
    color: '#10B981',
    className: 'md:col-span-2 md:row-span-2',
  },
  {
    title: 'QR Code Gen',
    description:
      'Turning raw data into modular geometry. Instant generation for URLs and credentials, stripped of the noise.',
    icon: <QrCode size={24} />,
    route: '/qrcode',
    url: 'https://traeqrcodeka3i.vercel.app/',
    previewUrl: 'https://traeqrcodeka3i.vercel.app/',
    githubUrl: 'https://github.com/ambershen/qrcode-gen',
    color: '#3B82F6',
    className: 'md:col-span-1 md:row-span-1',
  },
  {
    title: 'PDF Expert',
    description:
      'The definitive architecture for your documents. Merge and organize with clinical precision, entirely on your terms.',
    icon: <FileText size={24} />,
    route: '/pdfexpert',
    url: 'https://traepdf-expertoute.vercel.app/',
    previewUrl: 'https://traepdf-expertoute.vercel.app/',
    githubUrl: 'https://github.com/ambershen/pdf-expert',
    color: '#F43F5E',
    className: 'md:col-span-1 md:row-span-1',
  },
];
