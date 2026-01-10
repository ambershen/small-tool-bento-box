# Image Processor

A modern, professional image compression and optimization web application with beautiful animated geometric UI effects.

## Features

### 🎯 Core Functionality
- **Quality Compression**: Reduce file size while maintaining image dimensions
- **Pixel Reduction**: Resize images by reducing pixel count for thumbnails and bandwidth optimization
- **Real-time Processing**: Live progress tracking with detailed status updates
- **Before/After Comparison**: Visual comparison of original vs processed images
- **Batch Processing**: Handle multiple compression scenarios efficiently

### 🎨 User Experience
- **Animated Geometric Background**: Beautiful floating shapes, orbiting elements, and gradient effects
- **Drag & Drop Interface**: Intuitive file upload with visual feedback
- **Dark Theme**: Professional dark UI with green accent colors
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Toast Notifications**: Real-time feedback for user actions

### ⚡ Technical Features
- **Serverless Architecture**: Optimized for Vercel deployment
- **Memory-based Processing**: No file system dependencies
- **Persistent Job Storage**: KV storage with in-memory fallback
- **High-performance Processing**: Sharp.js for fast image manipulation
- **TypeScript**: Full type safety throughout the application

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide React** for icons
- **Sonner** for toast notifications

### Backend
- **Express.js** with TypeScript
- **Sharp.js** for image processing
- **Multer** for file uploads
- **UUID** for job identification
- **Vercel KV** for persistent storage

### Deployment
- **Vercel** serverless functions
- **Vercel KV** for Redis-based storage
- **GitHub** for version control

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ambershen/image-processor.git
cd image-processor
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Development

The application runs with Vite's development server on the frontend and proxies API requests to the Express backend.

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001` (proxied through Vite)

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables if needed
3. Deploy with automatic builds on push

The application is optimized for Vercel's serverless environment with:
- Serverless function handlers
- Memory-based file processing
- KV storage integration
- Automatic scaling

### Alternative Platforms

The application can also be deployed on:
- **Railway**: Full-stack deployment with persistent storage
- **Render**: Web services with automatic deployments
- **DigitalOcean App Platform**: Container-based deployment
- **Heroku**: Traditional PaaS deployment

## Usage

### Quality Compression
1. Select "Quality Compression" processing type
2. Adjust quality level (10-100%)
3. Upload a JPG/JPEG image (up to 50MB)
4. Click "Start Processing"
5. Monitor real-time progress
6. Download the optimized image

### Pixel Reduction
1. Select "Pixel Reduction" processing type
2. Choose resize method:
   - **Percentage reduction**: Reduce by percentage (10-90%)
   - **Maximum dimensions**: Set max width/height in pixels
3. Configure output quality (10-100%)
4. Optional: Disable aspect ratio maintenance
5. Upload and process your image

## API Endpoints

- `POST /api/upload` - Upload image file
- `POST /api/process/:jobId` - Start image processing
- `GET /api/status/:jobId` - Get processing status
- `GET /api/download/:jobId` - Download processed image
- `GET /api/original/:jobId` - Get original image for comparison
- `GET /api/preview/:jobId` - Get processed image preview

## File Structure

```
├── api/                    # Backend API
│   ├── app.ts             # Express application
│   └── index.ts           # Vercel entry point
├── src/                   # Frontend source
│   ├── pages/             # React pages
│   │   ├── Home.tsx       # Main upload interface
│   │   ├── Processing.tsx # Progress tracking
│   │   └── Results.tsx    # Results and download
│   ├── styles/            # CSS styles
│   └── components/        # Reusable components
├── public/                # Static assets
├── vercel.json           # Vercel configuration
└── package.json          # Dependencies and scripts
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit your changes: `git commit -m 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue on GitHub or contact the maintainers.

---

**Built with ❤️ using React, TypeScript, and Sharp.js**