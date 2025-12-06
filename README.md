# Notion Cover & Icon Generator

A web application for creating custom cover images (1500x600px) and icons (280x280px) for Notion pages.

**Demo:** [https://cover-icon-generator.nobig.deals/](https://cover-icon-generator.nobig.deals/)

## Features

### Cover Generator
- Search and select background images from Unsplash
- Upload and overlay custom logos/images
- Drag, resize, and rotate logo positioning
- Apply color filters to logos (white/black)
- Set logo to fixed 250px height
- Export as high-quality JPG

### Icon Generator
- Choose from gradient or solid pastel backgrounds
- Search and select from 5000+ Tabler icons
- Customize icon color and size
- Adjustable border radius (square, rounded, circle)
- Export as PNG (with transparency) or JPG

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Canvas:** Fabric.js
- **UI Components:** Radix UI, shadcn/ui
- **Icons:** Tabler Icons, Lucide React
- **Image API:** Unsplash

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Unsplash API key (free at [unsplash.com/developers](https://unsplash.com/developers))

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/nobig-deals/notion-cover-icon-generator.git
   cd notion-cover-icon-generator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.local.example .env.local
   ```

4. Add your Unsplash API key to `.env.local`:
   ```
   UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use

### Cover Generator

1. **Search Background**: Enter a search term to find background images from Unsplash
2. **Upload Logo**: Click to upload your logo or image overlay
3. **Position & Resize**: Drag to move, use corners to resize, shift+drag to rotate
4. **Adjust Colors**: Use white/black buttons to apply color filters to logos
5. **Download**: Export as JPG and upload to Notion as a cover

### Icon Generator

1. **Choose Background**: Select a gradient or pastel solid color
2. **Search Icon**: Find an icon from the Tabler icon library
3. **Customize**: Adjust icon color, size, and border radius
4. **Export**: Download as PNG (with transparency) or JPG

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
├── app/
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Main page with tabs
│   └── globals.css       # Global styles
├── components/
│   ├── Canvas.tsx        # Cover canvas with Fabric.js
│   ├── IconCanvas.tsx    # Icon canvas component
│   ├── UnsplashSearch.tsx
│   ├── IconSearch.tsx
│   ├── GradientPicker.tsx
│   └── ...
├── lib/
│   └── utils.ts          # Utility functions
└── package.json
```

## License

MIT

## Credits

- Background images from [Unsplash](https://unsplash.com)
- Icons from [Tabler Icons](https://tabler.io/icons)
- Built with [Next.js](https://nextjs.org)
