'use client';

import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Search, Upload, Download, Maximize2, RotateCcw, ArrowDownToLine, Palette, X } from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';
import UnsplashSearch from '@/components/UnsplashSearch';
import { type Gradient } from '@/components/GradientPicker';
import IconSearch from '@/components/IconSearch';
import type { CanvasHandle, CoverGradient } from '@/components/Canvas';
import type { IconCanvasHandle } from '@/components/IconCanvas';
import { cn } from '@/lib/utils';

const Canvas = dynamic(() => import('@/components/Canvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-[5/2] bg-gray-100 rounded-lg animate-pulse flex items-center justify-center border">
      <p className="text-gray-400 text-sm">Loading canvas...</p>
    </div>
  ),
});

const IconCanvas = dynamic(() => import('@/components/IconCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full flex justify-center bg-gray-100 rounded-lg animate-pulse p-4 border">
      <div className="w-[280px] h-[280px] flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading canvas...</p>
      </div>
    </div>
  ),
});

// Cover background gradients - vibrant
const COVER_GRADIENTS_VIBRANT: CoverGradient[] = [
  { name: 'Blue Purple', start: '#667eea', end: '#764ba2', angle: 135 },
  { name: 'Pink Orange', start: '#f857a6', end: '#ff5858', angle: 135 },
  { name: 'Green Blue', start: '#11998e', end: '#38ef7d', angle: 135 },
  { name: 'Yellow Pink', start: '#fa709a', end: '#fee140', angle: 135 },
  { name: 'Purple Pink', start: '#c471f5', end: '#fa71cd', angle: 135 },
  { name: 'Ocean Blue', start: '#2e3192', end: '#1bffff', angle: 135 },
  { name: 'Sunset', start: '#ff6b6b', end: '#feca57', angle: 135 },
  { name: 'Forest', start: '#134e5e', end: '#71b280', angle: 135 },
  { name: 'Royal', start: '#141e30', end: '#243b55', angle: 135 },
  { name: 'Peach', start: '#ed4264', end: '#ffedbc', angle: 135 },
  { name: 'Mint', start: '#00d2ff', end: '#3a7bd5', angle: 135 },
  { name: 'Rose', start: '#f12711', end: '#f5af19', angle: 135 },
];

// Cover background gradients - pastel
const COVER_GRADIENTS_PASTEL: CoverGradient[] = [
  { name: 'Pastel Pink-Peach', start: '#FFD1DC', end: '#FFDAB9', angle: 135 },
  { name: 'Pastel Blue-Mint', start: '#AEC6CF', end: '#B5EAD7', angle: 135 },
  { name: 'Pastel Mint-Green', start: '#B5EAD7', end: '#C1E1C1', angle: 135 },
  { name: 'Pastel Lavender-Pink', start: '#E6E6FA', end: '#FFD1DC', angle: 135 },
  { name: 'Pastel Peach-Yellow', start: '#FFDAB9', end: '#FDFD96', angle: 135 },
  { name: 'Pastel Yellow-Mint', start: '#FDFD96', end: '#B5EAD7', angle: 135 },
  { name: 'Pastel Coral-Peach', start: '#F8B195', end: '#FFDAB9', angle: 135 },
  { name: 'Pastel Green-Cyan', start: '#C1E1C1', end: '#C0E8F9', angle: 135 },
  { name: 'Pastel Purple-Lavender', start: '#D8BFD8', end: '#E6E6FA', angle: 135 },
  { name: 'Pastel Orange-Yellow', start: '#FFB347', end: '#FDFD96', angle: 135 },
  { name: 'Pastel Cyan-Blue', start: '#C0E8F9', end: '#AEC6CF', angle: 135 },
  { name: 'Pastel Rose-Coral', start: '#FAA0A0', end: '#F8B195', angle: 135 },
];

// Cover pastel colors
const COVER_PASTELS = [
  { name: 'Pastel Pink', color: '#FFD1DC' },
  { name: 'Pastel Blue', color: '#AEC6CF' },
  { name: 'Pastel Mint', color: '#B5EAD7' },
  { name: 'Pastel Lavender', color: '#E6E6FA' },
  { name: 'Pastel Peach', color: '#FFDAB9' },
  { name: 'Pastel Yellow', color: '#FDFD96' },
  { name: 'Pastel Coral', color: '#F8B195' },
  { name: 'Pastel Green', color: '#C1E1C1' },
  { name: 'Pastel Purple', color: '#D8BFD8' },
  { name: 'Pastel Orange', color: '#FFB347' },
  { name: 'Pastel Cyan', color: '#C0E8F9' },
  { name: 'Pastel Rose', color: '#FAA0A0' },
];

export default function Home() {
  // Cover Generator States
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [coverBackgroundType, setCoverBackgroundType] = useState<'image' | 'gradient' | 'solid'>('image');
  const [coverSelectedGradient, setCoverSelectedGradient] = useState<CoverGradient | null>(null);
  const [coverSelectedSolidColor, setCoverSelectedSolidColor] = useState<string | null>(null);
  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const canvasRef = useRef<CanvasHandle | null>(null);
  const logoRef = useRef<HTMLImageElement | null>(null);

  // Icon Generator States
  const [backgroundType, setBackgroundType] = useState<'gradient' | 'solid'>('gradient');
  const [selectedGradient, setSelectedGradient] = useState<Gradient | null>(null);
  const [selectedSolidColor, setSelectedSolidColor] = useState<string | null>(null);
  const [selectedIconSvg, setSelectedIconSvg] = useState<string | null>(null);
  const [selectedIconName, setSelectedIconName] = useState<string | null>(null);
  const [iconColor, setIconColor] = useState<string>('#ffffff');
  const [iconSize, setIconSize] = useState<number>(140);
  const [borderRadius, setBorderRadius] = useState<number>(0);
  const [exportFormat, setExportFormat] = useState<'png' | 'jpeg'>('png');
  const iconCanvasRef = useRef<IconCanvasHandle | null>(null);

  // Cover Generator Handlers
  const handleLogoUpload = (img: HTMLImageElement) => {
    logoRef.current = img;
    setLogoImage(img);
  };

  const handleCenterLogo = () => {
    if (canvasRef.current) {
      canvasRef.current.centerLogo();
    }
  };

  const handleResetTransform = () => {
    if (logoRef.current) {
      const img = new Image();
      img.onload = () => setLogoImage(img);
      img.src = logoRef.current.src;
    }
  };

  const handleFixedHeight = () => {
    if (canvasRef.current) {
      canvasRef.current.setLogoFixedHeight();
    }
  };

  const handleExportCover = () => {
    if (!canvasRef.current) return;

    try {
      const dataURL = canvasRef.current.exportToDataURL();
      if (!dataURL) return;

      fetch(dataURL)
        .then((res) => res.blob())
        .then((blob) => {
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = `notion-cover-${timestamp}.jpg`;
          link.click();
        });
    } catch (error) {
      console.error('Error exporting cover:', error);
    }
  };

  // Icon Generator Handlers
  const handleExportIcon = () => {
    if (!iconCanvasRef.current) return;

    try {
      const dataURL = iconCanvasRef.current.exportToDataURL(exportFormat);
      if (!dataURL) return;

      fetch(dataURL)
        .then((res) => res.blob())
        .then((blob) => {
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = `notion-icon-${timestamp}.${exportFormat === 'png' ? 'png' : 'jpg'}`;
          link.click();
        });
    } catch (error) {
      console.error('Error exporting icon:', error);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
            Notion Cover & Icon Generator
          </h1>
          <p className="text-slate-600 text-sm">Create custom covers (1500x600px) and icons (280x280px) for Notion</p>
        </div>

        {/* Tabs */}
        <Tabs.Root defaultValue="cover" className="w-full">
          <Tabs.List className="flex gap-2 bg-white rounded-lg p-1 shadow-sm border mb-6">
            <Tabs.Trigger
              value="cover"
              className="flex-1 px-4 py-3 rounded-md text-sm font-medium transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-slate-600 data-[state=inactive]:hover:bg-slate-50"
            >
              Cover Generator
            </Tabs.Trigger>
            <Tabs.Trigger
              value="icon"
              className="flex-1 px-4 py-3 rounded-md text-sm font-medium transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-slate-600 data-[state=inactive]:hover:bg-slate-50"
            >
              Icon Generator
            </Tabs.Trigger>
          </Tabs.List>

          {/* Cover Generator Tab */}
          <Tabs.Content value="cover">
            <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6 space-y-6">
              {/* Canvas */}
              <div className="space-y-3">
                <Canvas
                  ref={canvasRef}
                  backgroundImage={coverBackgroundType === 'image' ? backgroundImage : null}
                  backgroundGradient={coverBackgroundType === 'gradient' ? coverSelectedGradient : null}
                  backgroundSolidColor={coverBackgroundType === 'solid' ? coverSelectedSolidColor : null}
                  logoImage={logoImage}
                  onLogoTransform={() => {}}
                />
              </div>

              {/* Background Type Selector */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-slate-700">Background Type</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setCoverBackgroundType('image');
                      setCoverSelectedGradient(null);
                      setCoverSelectedSolidColor(null);
                    }}
                    className={cn(
                      "flex-1 px-3 py-2 border-2 rounded-lg transition-all text-sm font-medium",
                      coverBackgroundType === 'image' ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-300 hover:border-slate-400"
                    )}
                  >
                    Image
                  </button>
                  <button
                    onClick={() => {
                      setCoverBackgroundType('gradient');
                      setBackgroundImage(null);
                      setCoverSelectedSolidColor(null);
                    }}
                    className={cn(
                      "flex-1 px-3 py-2 border-2 rounded-lg transition-all text-sm font-medium",
                      coverBackgroundType === 'gradient' ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-300 hover:border-slate-400"
                    )}
                  >
                    Gradient
                  </button>
                  <button
                    onClick={() => {
                      setCoverBackgroundType('solid');
                      setBackgroundImage(null);
                      setCoverSelectedGradient(null);
                    }}
                    className={cn(
                      "flex-1 px-3 py-2 border-2 rounded-lg transition-all text-sm font-medium",
                      coverBackgroundType === 'solid' ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-300 hover:border-slate-400"
                    )}
                  >
                    Solid Pastel
                  </button>
                </div>
              </div>

              {/* Background Options */}
              {coverBackgroundType === 'gradient' && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-slate-700">Vibrant Gradients</h3>
                    <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
                      {COVER_GRADIENTS_VIBRANT.map((gradient) => (
                        <button
                          key={gradient.name}
                          onClick={() => setCoverSelectedGradient(gradient)}
                          className={cn(
                            "aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105",
                            coverSelectedGradient?.name === gradient.name
                              ? "border-blue-500 ring-2 ring-blue-200"
                              : "border-slate-200"
                          )}
                          title={gradient.name}
                        >
                          <div
                            className="w-full h-full"
                            style={{
                              background: `linear-gradient(${gradient.angle}deg, ${gradient.start}, ${gradient.end})`,
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-slate-700">Pastel Gradients</h3>
                    <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
                      {COVER_GRADIENTS_PASTEL.map((gradient) => (
                        <button
                          key={gradient.name}
                          onClick={() => setCoverSelectedGradient(gradient)}
                          className={cn(
                            "aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105",
                            coverSelectedGradient?.name === gradient.name
                              ? "border-blue-500 ring-2 ring-blue-200"
                              : "border-slate-200"
                          )}
                          title={gradient.name}
                        >
                          <div
                            className="w-full h-full"
                            style={{
                              background: `linear-gradient(${gradient.angle}deg, ${gradient.start}, ${gradient.end})`,
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {coverBackgroundType === 'solid' && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-slate-700">Choose Pastel Color</h3>
                  <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
                    {COVER_PASTELS.map((pastel) => (
                      <button
                        key={pastel.name}
                        onClick={() => setCoverSelectedSolidColor(pastel.color)}
                        className={cn(
                          "aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105",
                          coverSelectedSolidColor === pastel.color
                            ? "border-blue-500 ring-2 ring-blue-200"
                            : "border-slate-200"
                        )}
                        title={pastel.name}
                      >
                        <div
                          className="w-full h-full"
                          style={{ backgroundColor: pastel.color }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Background Image Search - only show when image type selected */}
                {coverBackgroundType === 'image' && (
                  <div className="relative">
                    <button
                      onClick={() => setShowSearch(!showSearch)}
                      className={cn(
                        "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all font-medium",
                        backgroundImage
                          ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      )}
                    >
                      <Search className="w-4 h-4" />
                      {backgroundImage ? "✓ Background Set" : "Search Background"}
                    </button>
                    {backgroundImage && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setBackgroundImage(null);
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md transition-colors"
                        title="Remove background"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}

                {/* Logo Upload */}
                <div className="relative">
                  <label
                    className={cn(
                      "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all font-medium cursor-pointer",
                      logoImage
                        ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    )}
                  >
                    <Upload className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const img = new Image();
                            img.onload = () => handleLogoUpload(img);
                            img.src = event.target?.result as string;
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    {logoImage ? "✓ Logo Uploaded" : "Upload Logo"}
                  </label>
                  {logoImage && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setLogoImage(null);
                        logoRef.current = null;
                      }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md transition-colors"
                      title="Remove logo"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Export */}
                <button
                  onClick={handleExportCover}
                  disabled={!backgroundImage && !coverSelectedGradient && !coverSelectedSolidColor && !logoImage}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all font-medium disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4" />
                  Download JPG
                </button>
              </div>

              {/* Logo Controls - Only show when logo is uploaded */}
              {logoImage && (
                <div className="space-y-2 pt-3 border-t">
                  <div className="flex gap-2">
                    <button
                      onClick={handleCenterLogo}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all text-sm font-medium"
                    >
                      <Maximize2 className="w-4 h-4" />
                      Center
                    </button>
                    <button
                      onClick={handleFixedHeight}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all text-sm font-medium"
                    >
                      <ArrowDownToLine className="w-4 h-4" />
                      250px Height
                    </button>
                    <button
                      onClick={handleResetTransform}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all text-sm font-medium"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => canvasRef.current?.setLogoColor('white')}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border-2 border-slate-300 rounded-lg hover:bg-slate-50 transition-all text-sm font-medium"
                    >
                      <Palette className="w-4 h-4" />
                      White
                    </button>
                    <button
                      onClick={() => canvasRef.current?.setLogoColor('black')}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white border-2 border-slate-900 rounded-lg hover:bg-slate-800 transition-all text-sm font-medium"
                    >
                      <Palette className="w-4 h-4" />
                      Black
                    </button>
                  </div>
                </div>
              )}

              {/* Search Panel */}
              {coverBackgroundType === 'image' && showSearch && (
                <div className="border-t pt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  <UnsplashSearch
                    onSelectImage={(url) => {
                      setBackgroundImage(url);
                      setShowSearch(false);
                    }}
                  />
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mt-4">
              <p className="text-sm text-blue-900">
                <strong>Pro tip:</strong> Drag logo to move • Use corners to resize • Shift+drag to rotate
              </p>
            </div>
          </Tabs.Content>

          {/* Icon Generator Tab */}
          <Tabs.Content value="icon">
            <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6">
              <div className="flex gap-6">
                {/* Left Side - Controls (80%) */}
                <div className="flex-1 space-y-4">
                  {/* Background Type Selector */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-slate-700">Background Type</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setBackgroundType('gradient');
                          setSelectedSolidColor(null);
                        }}
                        className={cn(
                          "flex-1 px-3 py-2 border-2 rounded-lg transition-all text-xs font-medium",
                          backgroundType === 'gradient' ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-300 hover:border-slate-400"
                        )}
                      >
                        Gradient
                      </button>
                      <button
                        onClick={() => {
                          setBackgroundType('solid');
                          setSelectedGradient(null);
                        }}
                        className={cn(
                          "flex-1 px-3 py-2 border-2 rounded-lg transition-all text-xs font-medium",
                          backgroundType === 'solid' ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-300 hover:border-slate-400"
                        )}
                      >
                        Solid Pastel
                      </button>
                    </div>
                  </div>

                  {/* Background Options */}
                  <>
                    {/* Gradient Picker */}
                    {backgroundType === 'gradient' && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-slate-700">Choose Background Gradient</h3>
                        <div className="grid grid-cols-6 gap-1.5">
                        {[
                        { name: 'Blue Purple', start: '#667eea', end: '#764ba2', angle: 135 },
                        { name: 'Pink Orange', start: '#f857a6', end: '#ff5858', angle: 135 },
                        { name: 'Green Blue', start: '#11998e', end: '#38ef7d', angle: 135 },
                        { name: 'Yellow Pink', start: '#fa709a', end: '#fee140', angle: 135 },
                        { name: 'Purple Pink', start: '#c471f5', end: '#fa71cd', angle: 135 },
                        { name: 'Ocean Blue', start: '#2e3192', end: '#1bffff', angle: 135 },
                        { name: 'Sunset', start: '#ff6b6b', end: '#feca57', angle: 135 },
                        { name: 'Forest', start: '#134e5e', end: '#71b280', angle: 135 },
                        { name: 'Royal', start: '#141e30', end: '#243b55', angle: 135 },
                        { name: 'Peach', start: '#ed4264', end: '#ffedbc', angle: 135 },
                        { name: 'Mint', start: '#00d2ff', end: '#3a7bd5', angle: 135 },
                        { name: 'Rose', start: '#f12711', end: '#f5af19', angle: 135 },
                      ].map((gradient) => (
                        <button
                          key={gradient.name}
                          onClick={() => setSelectedGradient(gradient)}
                          className={cn(
                            "aspect-square rounded-md overflow-hidden border-2 transition-all hover:scale-105",
                            selectedGradient?.name === gradient.name
                              ? "border-blue-500 ring-2 ring-blue-200"
                              : "border-slate-200"
                          )}
                          title={gradient.name}
                        >
                          <div
                            className="w-full h-full"
                            style={{
                              background: `linear-gradient(${gradient.angle}deg, ${gradient.start}, ${gradient.end})`,
                            }}
                          />
                        </button>
                      ))}
                    </div>
                    </div>
                  )}

                  {/* Pastel Colors Picker */}
                  {backgroundType === 'solid' && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-slate-700">Choose Pastel Color</h3>
                      <div className="grid grid-cols-6 gap-1.5">
                        {[
                          { name: 'Pastel Pink', color: '#FFD1DC', iconColor: '#C41E3A' },
                          { name: 'Pastel Blue', color: '#AEC6CF', iconColor: '#0047AB' },
                          { name: 'Pastel Mint', color: '#B5EAD7', iconColor: '#00563F' },
                          { name: 'Pastel Lavender', color: '#E6E6FA', iconColor: '#5D3FD3' },
                          { name: 'Pastel Peach', color: '#FFDAB9', iconColor: '#CC5500' },
                          { name: 'Pastel Yellow', color: '#FDFD96', iconColor: '#E49B0F' },
                          { name: 'Pastel Coral', color: '#F8B195', iconColor: '#CD5C5C' },
                          { name: 'Pastel Green', color: '#C1E1C1', iconColor: '#2D5016' },
                          { name: 'Pastel Purple', color: '#D8BFD8', iconColor: '#663399' },
                          { name: 'Pastel Orange', color: '#FFB347', iconColor: '#D2691E' },
                          { name: 'Pastel Cyan', color: '#C0E8F9', iconColor: '#008B8B' },
                          { name: 'Pastel Rose', color: '#FAA0A0', iconColor: '#B91646' },
                        ].map((pastel) => (
                          <button
                            key={pastel.name}
                            onClick={() => {
                              setSelectedSolidColor(pastel.color);
                              setIconColor(pastel.iconColor);
                            }}
                            className={cn(
                              "aspect-square rounded-md overflow-hidden border-2 transition-all hover:scale-105",
                              selectedSolidColor === pastel.color
                                ? "border-blue-500 ring-2 ring-blue-200"
                                : "border-slate-200"
                            )}
                            title={pastel.name}
                          >
                            <div
                              className="w-full h-full"
                              style={{
                                backgroundColor: pastel.color,
                              }}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  </>

                  {/* Icon Search */}
                  <div className="space-y-2 border-t pt-3">
                    <h3 className="text-sm font-medium text-slate-700">Search & Select Icon</h3>
                    <IconSearch
                      onSelectIcon={(svg, name) => {
                        setSelectedIconSvg(svg);
                        setSelectedIconName(name);
                      }}
                      selectedIconName={selectedIconName}
                    />
                  </div>

                  {/* Icon Settings */}
                  {selectedIconSvg && (
                    <div className="space-y-3 border-t pt-3">
                      <h3 className="text-sm font-medium text-slate-700">Icon Settings</h3>

                      {/* Icon Color */}
                      <div className="space-y-1.5">
                        <label className="text-xs text-slate-600">Icon Color</label>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setIconColor('#ffffff')}
                            className={cn(
                              "flex-1 px-3 py-1.5 bg-white border-2 rounded-lg transition-all text-xs font-medium",
                              iconColor === '#ffffff' ? "border-blue-500 ring-2 ring-blue-200" : "border-slate-300"
                            )}
                          >
                            White
                          </button>
                          <button
                            onClick={() => setIconColor('#000000')}
                            className={cn(
                              "flex-1 px-3 py-1.5 bg-slate-900 text-white border-2 rounded-lg transition-all text-xs font-medium",
                              iconColor === '#000000' ? "border-blue-500 ring-2 ring-blue-200" : "border-slate-900"
                            )}
                          >
                            Black
                          </button>
                          <div className="w-16 relative">
                            <input
                              type="color"
                              value={iconColor}
                              onChange={(e) => setIconColor(e.target.value)}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div
                              className="w-full h-full rounded-lg border-2 border-slate-300"
                              style={{ backgroundColor: iconColor }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Icon Size */}
                      <div className="space-y-1.5">
                        <label className="text-xs text-slate-600">Icon Size: {iconSize}px</label>
                        <input
                          type="range"
                          min="80"
                          max="280"
                          value={iconSize}
                          onChange={(e) => setIconSize(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>

                      {/* Border Radius */}
                      <div className="space-y-1.5">
                        <label className="text-xs text-slate-600">Border Radius</label>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setBorderRadius(0)}
                            className={cn(
                              "flex-1 px-3 py-1.5 border-2 rounded-lg transition-all text-xs font-medium",
                              borderRadius === 0 ? "border-blue-500 ring-2 ring-blue-200" : "border-slate-300 hover:border-slate-400"
                            )}
                          >
                            0px (Square)
                          </button>
                          <button
                            onClick={() => setBorderRadius(20)}
                            className={cn(
                              "flex-1 px-3 py-1.5 border-2 rounded-lg transition-all text-xs font-medium",
                              borderRadius === 20 ? "border-blue-500 ring-2 ring-blue-200" : "border-slate-300 hover:border-slate-400"
                            )}
                          >
                            20px (Rounded)
                          </button>
                          <button
                            onClick={() => setBorderRadius(140)}
                            className={cn(
                              "flex-1 px-3 py-1.5 border-2 rounded-lg transition-all text-xs font-medium",
                              borderRadius === 140 ? "border-blue-500 ring-2 ring-blue-200" : "border-slate-300 hover:border-slate-400"
                            )}
                          >
                            Circle
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Export Format */}
                  <div className="space-y-2 border-t pt-3">
                    <label className="text-xs text-slate-600">Export Format</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setExportFormat('png')}
                        className={cn(
                          "flex-1 px-3 py-1.5 border-2 rounded-lg transition-all text-xs font-medium",
                          exportFormat === 'png' ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-300 hover:border-slate-400"
                        )}
                      >
                        PNG (Transparent)
                      </button>
                      <button
                        onClick={() => setExportFormat('jpeg')}
                        className={cn(
                          "flex-1 px-3 py-1.5 border-2 rounded-lg transition-all text-xs font-medium",
                          exportFormat === 'jpeg' ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-300 hover:border-slate-400"
                        )}
                      >
                        JPG
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Side - Preview & Export (20%) */}
                <div className="w-80 flex flex-col gap-4">
                  {/* Preview */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-slate-700">Preview (280x280px)</h3>
                    <div className="w-full aspect-square border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center">
                      <IconCanvas
                        ref={iconCanvasRef}
                        gradient={selectedGradient}
                        solidColor={selectedSolidColor}
                        iconSvg={selectedIconSvg}
                        iconColor={iconColor}
                        iconSize={iconSize}
                        borderRadius={borderRadius}
                      />
                    </div>
                  </div>

                  {/* Export Button */}
                  <button
                    onClick={handleExportIcon}
                    disabled={(!selectedGradient && !selectedSolidColor) || !selectedIconSvg}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all font-medium disabled:cursor-not-allowed"
                  >
                    <Download className="w-4 h-4" />
                    Download {exportFormat.toUpperCase()}
                  </button>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mt-4">
              <p className="text-sm text-blue-900">
                <strong>Pro tip:</strong> Choose a gradient, select an icon, customize colors and size, then download!
              </p>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </main>
  );
}
