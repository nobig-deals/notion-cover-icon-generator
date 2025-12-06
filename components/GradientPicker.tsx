'use client';

import { cn } from '@/lib/utils';

export interface Gradient {
  name: string;
  start: string;
  end: string;
  angle: number;
}

const GRADIENTS: Gradient[] = [
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

interface GradientPickerProps {
  selectedGradient: Gradient | null;
  onSelectGradient: (gradient: Gradient) => void;
}

export default function GradientPicker({ selectedGradient, onSelectGradient }: GradientPickerProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-slate-700">Choose Background Gradient</h3>
      <div className="grid grid-cols-4 gap-2">
        {GRADIENTS.map((gradient) => (
          <button
            key={gradient.name}
            onClick={() => onSelectGradient(gradient)}
            className={cn(
              "relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105",
              selectedGradient?.name === gradient.name
                ? "border-blue-500 ring-2 ring-blue-200"
                : "border-slate-200 hover:border-slate-300"
            )}
            title={gradient.name}
          >
            <div
              className="w-full h-full"
              style={{
                background: `linear-gradient(${gradient.angle}deg, ${gradient.start}, ${gradient.end})`,
              }}
            />
            {selectedGradient?.name === gradient.name && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
