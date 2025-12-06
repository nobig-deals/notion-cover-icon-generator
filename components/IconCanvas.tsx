'use client';

import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { fabric } from 'fabric';

const ICON_SIZE = 280;

interface IconCanvasProps {
  gradient: { start: string; end: string; angle: number } | null;
  solidColor: string | null;
  iconSvg: string | null;
  iconColor: string;
  iconSize: number;
  borderRadius: number;
}

export interface IconCanvasHandle {
  exportToDataURL: (format?: 'png' | 'jpeg') => string;
}

const IconCanvas = forwardRef<IconCanvasHandle, IconCanvasProps>(
  ({ gradient, solidColor, iconSvg, iconColor, iconSize, borderRadius }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

    useImperativeHandle(ref, () => ({
      exportToDataURL: (format: 'png' | 'jpeg' = 'jpeg') => {
        if (!fabricCanvasRef.current || !canvasRef.current) return '';

        if (borderRadius > 0 && format === 'png') {
          // Create a temporary canvas with border radius
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = ICON_SIZE;
          tempCanvas.height = ICON_SIZE;
          const ctx = tempCanvas.getContext('2d');

          if (ctx) {
            // Draw rounded rectangle clipping path
            ctx.beginPath();
            ctx.moveTo(borderRadius, 0);
            ctx.lineTo(ICON_SIZE - borderRadius, 0);
            ctx.quadraticCurveTo(ICON_SIZE, 0, ICON_SIZE, borderRadius);
            ctx.lineTo(ICON_SIZE, ICON_SIZE - borderRadius);
            ctx.quadraticCurveTo(ICON_SIZE, ICON_SIZE, ICON_SIZE - borderRadius, ICON_SIZE);
            ctx.lineTo(borderRadius, ICON_SIZE);
            ctx.quadraticCurveTo(0, ICON_SIZE, 0, ICON_SIZE - borderRadius);
            ctx.lineTo(0, borderRadius);
            ctx.quadraticCurveTo(0, 0, borderRadius, 0);
            ctx.closePath();
            ctx.clip();

            // Draw the original canvas content
            ctx.drawImage(canvasRef.current, 0, 0);
          }

          return tempCanvas.toDataURL('image/png', 1);
        }

        return fabricCanvasRef.current.toDataURL({
          format: format,
          quality: 1,
          multiplier: 1,
        });
      },
    }));

    // Initialize Fabric canvas
    useEffect(() => {
      if (!canvasRef.current) return;

      const canvas = new fabric.Canvas(canvasRef.current, {
        width: ICON_SIZE,
        height: ICON_SIZE,
        backgroundColor: '#f3f4f6',
      });

      fabricCanvasRef.current = canvas;

      return () => {
        canvas.dispose();
        fabricCanvasRef.current = null;
      };
    }, []);

    // Handle background (gradient or solid color)
    useEffect(() => {
      if (!fabricCanvasRef.current) return;

      const canvas = fabricCanvasRef.current;

      if (solidColor) {
        // Use solid color
        canvas.setBackgroundColor(solidColor, () => {
          canvas.renderAll();
        });
      } else if (gradient) {
        // Convert angle to radians and calculate gradient coordinates
        const angleRad = (gradient.angle * Math.PI) / 180;
        const x1 = ICON_SIZE / 2 - (Math.cos(angleRad) * ICON_SIZE) / 2;
        const y1 = ICON_SIZE / 2 - (Math.sin(angleRad) * ICON_SIZE) / 2;
        const x2 = ICON_SIZE / 2 + (Math.cos(angleRad) * ICON_SIZE) / 2;
        const y2 = ICON_SIZE / 2 + (Math.sin(angleRad) * ICON_SIZE) / 2;

        const gradientFill = new fabric.Gradient({
          type: 'linear',
          coords: { x1, y1, x2, y2 },
          colorStops: [
            { offset: 0, color: gradient.start },
            { offset: 1, color: gradient.end },
          ],
        });

        canvas.setBackgroundColor(gradientFill, () => {
          canvas.renderAll();
        });
      } else {
        canvas.setBackgroundColor('#f3f4f6', () => {
          canvas.renderAll();
        });
      }
    }, [gradient, solidColor]);

    // Handle icon rendering
    useEffect(() => {
      if (!fabricCanvasRef.current) return;

      const canvas = fabricCanvasRef.current;

      // Remove existing icon
      const objects = canvas.getObjects();
      objects.forEach((obj) => {
        if ((obj as fabric.Object & { isIcon?: boolean }).isIcon) {
          canvas.remove(obj);
        }
      });

      if (iconSvg) {
        // Replace fill color in SVG
        const coloredSvg = iconSvg.replace(
          /stroke="[^"]*"/g,
          `stroke="${iconColor}"`
        );

        fabric.loadSVGFromString(coloredSvg, (objects, options) => {
          const svgGroup = fabric.util.groupSVGElements(objects, options);

          if (svgGroup) {
            // Scale to desired size
            const scale = iconSize / Math.max(svgGroup.width || 1, svgGroup.height || 1);

            svgGroup.set({
              left: ICON_SIZE / 2,
              top: ICON_SIZE / 2,
              originX: 'center',
              originY: 'center',
              scaleX: scale,
              scaleY: scale,
              selectable: false,
              evented: false,
            });

            (svgGroup as fabric.Object & { isIcon?: boolean }).isIcon = true;

            canvas.add(svgGroup);
            canvas.renderAll();
          }
        });
      }
    }, [iconSvg, iconColor, iconSize]);

    return (
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          borderRadius: `${borderRadius}px`,
        }}
      />
    );
  }
);

IconCanvas.displayName = 'IconCanvas';

export default IconCanvas;
export { ICON_SIZE };
