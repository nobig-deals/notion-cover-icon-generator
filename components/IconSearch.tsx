'use client';

import React, { useState, useMemo } from 'react';
import * as ReactDOM from 'react-dom/client';
import * as TablerIcons from '@tabler/icons-react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

type IconProps = { size?: number; stroke?: number };
type IconComponent = React.ComponentType<IconProps>;

interface IconSearchProps {
  onSelectIcon: (iconSvg: string, iconName: string) => void;
  selectedIconName: string | null;
}

// Get all Tabler icon names
const iconNames = Object.keys(TablerIcons).filter(
  (name) => name.startsWith('Icon') && name !== 'IconProps'
);

export default function IconSearch({ onSelectIcon, selectedIconName }: IconSearchProps) {
  const [query, setQuery] = useState('');

  const filteredIcons = useMemo(() => {
    if (!query.trim()) {
      return iconNames.slice(0, 48); // Show first 48 icons by default
    }

    const searchTerm = query.toLowerCase();
    return iconNames
      .filter((name) =>
        name.toLowerCase().replace('icon', '').includes(searchTerm)
      )
      .slice(0, 48); // Limit to 48 results
  }, [query]);

  const handleIconClick = (iconName: string) => {
    const IconComponent = (TablerIcons as unknown as Record<string, IconComponent>)[iconName];

    if (IconComponent) {
      // Create a temporary container to render the icon
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      document.body.appendChild(container);

      const root = ReactDOM.createRoot(container);
      root.render(React.createElement(IconComponent, { size: 120, stroke: 2 }));

      // Wait for render and extract SVG
      setTimeout(() => {
        const svgElement = container.querySelector('svg');
        if (svgElement) {
          const svgString = svgElement.outerHTML;
          onSelectIcon(svgString, iconName);
        }

        // Cleanup
        root.unmount();
        document.body.removeChild(container);
      }, 100);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search icons... (e.g., home, user, star)"
          className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-8 gap-1 max-h-64 overflow-y-auto p-1">
        {filteredIcons.map((iconName) => {
          const IconComponent = (TablerIcons as unknown as Record<string, IconComponent>)[iconName];
          const displayName = iconName.replace('Icon', '').replace(/([A-Z])/g, ' $1').trim();

          return (
            <button
              key={iconName}
              onClick={() => handleIconClick(iconName)}
              className={cn(
                "relative aspect-square flex items-center justify-center p-1.5 rounded-md border-2 transition-all hover:bg-slate-50",
                selectedIconName === iconName
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 hover:border-slate-300"
              )}
              title={displayName}
            >
              {IconComponent && <IconComponent size={20} stroke={1.5} />}
              {selectedIconName === iconName && (
                <div className="absolute top-0.5 right-0.5 w-2 h-2 bg-blue-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {filteredIcons.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          No icons found. Try a different search term.
        </div>
      )}
    </div>
  );
}
