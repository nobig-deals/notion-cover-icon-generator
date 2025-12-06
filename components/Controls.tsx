'use client';

interface ControlsProps {
  logoTransform: {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
  } | null;
  onCenter: () => void;
  onReset: () => void;
  hasLogo: boolean;
}

export default function Controls({ logoTransform, onCenter, onReset, hasLogo }: ControlsProps) {
  if (!hasLogo) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
      <h3 className="font-semibold text-gray-900">Logo Controls</h3>

      {logoTransform && (
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-600">Position X:</span>
            <span className="ml-2 font-mono">{Math.round(logoTransform.x)}px</span>
          </div>
          <div>
            <span className="text-gray-600">Position Y:</span>
            <span className="ml-2 font-mono">{Math.round(logoTransform.y)}px</span>
          </div>
          <div>
            <span className="text-gray-600">Width:</span>
            <span className="ml-2 font-mono">{Math.round(logoTransform.width)}px</span>
          </div>
          <div>
            <span className="text-gray-600">Height:</span>
            <span className="ml-2 font-mono">{Math.round(logoTransform.height)}px</span>
          </div>
          <div className="col-span-2">
            <span className="text-gray-600">Rotation:</span>
            <span className="ml-2 font-mono">{Math.round(logoTransform.rotation)}°</span>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={onCenter}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Center Logo
        </button>
        <button
          onClick={onReset}
          className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
        >
          Reset Transform
        </button>
      </div>

      <div className="text-xs text-gray-500 space-y-1">
        <p>💡 <strong>Tip:</strong> Drag the logo to reposition it</p>
        <p>💡 Use the corner handles to resize</p>
        <p>💡 Use the rotation handle (top) to rotate</p>
      </div>
    </div>
  );
}
