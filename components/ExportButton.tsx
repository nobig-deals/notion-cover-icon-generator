'use client';

import { saveAs } from 'file-saver';
import type { CanvasHandle } from './Canvas';

interface ExportButtonProps {
  stageRef: React.RefObject<CanvasHandle | null>;
  disabled?: boolean;
}

export default function ExportButton({ stageRef, disabled }: ExportButtonProps) {
  const handleExport = () => {
    if (!stageRef.current) return;

    try {
      // Export the canvas as a data URL using the Fabric.js method
      const dataURL = stageRef.current.exportToDataURL();
      if (!dataURL) return;

      // Convert data URL to blob and download
      fetch(dataURL)
        .then((res) => res.blob())
        .then((blob) => {
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
          saveAs(blob, `notion-cover-${timestamp}.jpg`);
        });
    } catch (error) {
      console.error('Error exporting image:', error);
      alert('Failed to export image. Please try again.');
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={disabled}
      className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold text-lg shadow-lg hover:shadow-xl"
    >
      ⬇️ Download Cover Image
    </button>
  );
}
