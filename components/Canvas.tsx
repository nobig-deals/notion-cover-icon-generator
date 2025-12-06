'use client';

import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { fabric } from 'fabric';

const NOTION_COVER_WIDTH = 1500;
const NOTION_COVER_HEIGHT = 600;

interface CanvasProps {
  backgroundImage: string | null;
  logoImage: HTMLImageElement | null;
  onLogoTransform?: (attrs: { x: number; y: number; width: number; height: number; rotation: number }) => void;
}

export interface CanvasHandle {
  getCanvas: () => fabric.Canvas | null;
  exportToDataURL: () => string;
  centerLogo: () => void;
  setLogoFixedHeight: () => void;
  setLogoColor: (color: string) => void;
}

const Canvas = forwardRef<CanvasHandle, CanvasProps>(({ backgroundImage, logoImage, onLogoTransform }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [logoObj, setLogoObj] = useState<fabric.Image | null>(null);

  useImperativeHandle(ref, () => ({
    getCanvas: () => fabricCanvasRef.current,
    exportToDataURL: () => {
      if (!fabricCanvasRef.current) return '';
      return fabricCanvasRef.current.toDataURL({
        format: 'jpeg',
        quality: 1,
        multiplier: 1,
      });
    },
    centerLogo: () => {
      if (logoObj && fabricCanvasRef.current) {
        logoObj.set({
          left: NOTION_COVER_WIDTH / 2,
          top: NOTION_COVER_HEIGHT / 2,
        });
        logoObj.setCoords();
        fabricCanvasRef.current.renderAll();

        // Trigger the transform callback
        if (onLogoTransform) {
          const scaleX = logoObj.scaleX || 1;
          const scaleY = logoObj.scaleY || 1;
          onLogoTransform({
            x: logoObj.left || 0,
            y: logoObj.top || 0,
            width: (logoObj.width || 0) * scaleX,
            height: (logoObj.height || 0) * scaleY,
            rotation: logoObj.angle || 0,
          });
        }
      }
    },
    setLogoFixedHeight: () => {
      if (logoObj && fabricCanvasRef.current) {
        const targetHeight = 250;
        const originalHeight = logoObj.height || 1;
        const scale = targetHeight / originalHeight;

        logoObj.set({
          scaleX: scale,
          scaleY: scale,
        });
        logoObj.setCoords();
        fabricCanvasRef.current.renderAll();

        // Trigger the transform callback
        if (onLogoTransform) {
          const scaleX = logoObj.scaleX || 1;
          const scaleY = logoObj.scaleY || 1;
          onLogoTransform({
            x: logoObj.left || 0,
            y: logoObj.top || 0,
            width: (logoObj.width || 0) * scaleX,
            height: (logoObj.height || 0) * scaleY,
            rotation: logoObj.angle || 0,
          });
        }
      }
    },
    setLogoColor: (color: string) => {
      if (logoObj && fabricCanvasRef.current) {
        // Create a color filter overlay
        const filter = new fabric.Image.filters.BlendColor({
          color: color,
          mode: 'tint',
          alpha: 1,
        });

        logoObj.filters = [filter];
        logoObj.applyFilters();
        fabricCanvasRef.current.renderAll();
      }
    },
  }), [logoObj, onLogoTransform]);

  // Initialize Fabric canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: NOTION_COVER_WIDTH,
      height: NOTION_COVER_HEIGHT,
      backgroundColor: '#f3f4f6',
    });

    fabricCanvasRef.current = canvas;

    return () => {
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, []);

  // Handle background image
  useEffect(() => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;

    // Remove existing background
    const objects = canvas.getObjects();
    objects.forEach((obj) => {
      if ((obj as fabric.Object & { isBackground?: boolean }).isBackground) {
        canvas.remove(obj);
      }
    });

    if (backgroundImage) {
      fabric.Image.fromURL(
        backgroundImage,
        (img) => {
          if (!img) return;

          img.scaleToWidth(NOTION_COVER_WIDTH);
          img.scaleToHeight(NOTION_COVER_HEIGHT);
          img.set({
            left: 0,
            top: 0,
            selectable: false,
            evented: false,
          });
          (img as fabric.Image & { isBackground?: boolean }).isBackground = true;

          canvas.add(img);
          canvas.sendToBack(img);
          canvas.renderAll();
        },
        { crossOrigin: 'anonymous' }
      );
    }
  }, [backgroundImage]);

  // Handle logo image
  useEffect(() => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;

    // Remove existing logo
    if (logoObj) {
      canvas.remove(logoObj);
      setLogoObj(null);
    }

    if (logoImage) {
      const img = new fabric.Image(logoImage, {
        left: NOTION_COVER_WIDTH / 2,
        top: NOTION_COVER_HEIGHT / 2,
        originX: 'center',
        originY: 'center',
        selectable: true,
        hasControls: true,
        hasBorders: true,
        lockScalingFlip: true,
        // Lock aspect ratio to prevent distortion
        lockUniScaling: true,
      });

      canvas.add(img);
      canvas.setActiveObject(img);
      setLogoObj(img);
      canvas.renderAll();

      // Handle transform events
      const handleModified = () => {
        if (onLogoTransform && img) {
          const scaleX = img.scaleX || 1;
          const scaleY = img.scaleY || 1;
          onLogoTransform({
            x: img.left || 0,
            y: img.top || 0,
            width: (img.width || 0) * scaleX,
            height: (img.height || 0) * scaleY,
            rotation: img.angle || 0,
          });
        }
      };

      img.on('modified', handleModified);
      img.on('moving', handleModified);
      img.on('scaling', handleModified);
      img.on('rotating', handleModified);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logoImage, onLogoTransform]);

  return (
    <div className="w-full border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg bg-gray-100">
      <div
        className="w-full"
        style={{
          aspectRatio: '5 / 2',
          position: 'relative',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
          }}
        />
      </div>
    </div>
  );
});

Canvas.displayName = 'Canvas';

export default Canvas;
export { NOTION_COVER_WIDTH, NOTION_COVER_HEIGHT };
