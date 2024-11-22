import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Download, Copy, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';
import { useStore } from '../store';

interface DiagramConfig {
  theme: 'default' | 'forest' | 'dark' | 'neutral';
  diagramPadding: number;
  useMaxWidth: boolean;
}

export const DiagramPreview = () => {
  const { currentDiagram, diagramType } = useStore((state) => ({
    currentDiagram: state.currentDiagram,
    diagramType: state.diagramType,
  }));
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [config, setConfig] = useState<DiagramConfig>({
    theme: 'default',
    diagramPadding: 8,
    useMaxWidth: false,
  });

  useEffect(() => {
    const renderDiagram = async () => {
      if (containerRef.current && currentDiagram) {
        try {
          mermaid.initialize({
            startOnLoad: true,
            theme: config.theme,
            themeVariables: {
              fontFamily: 'ui-sans-serif, system-ui, -apple-system',
              fontSize: '14px',
            },
            journey: {
              diagramPadding: config.diagramPadding,
            },
            sequence: {
              diagramMarginX: config.diagramPadding,
              diagramMarginY: config.diagramPadding,
            },
            flowchart: {
              diagramPadding: config.diagramPadding,
              useMaxWidth: config.useMaxWidth,
            },
          });

          const id = `diagram-${Date.now()}`;
          const { svg } = await mermaid.render(id, currentDiagram);
          containerRef.current.innerHTML = svg;

          // Add dark mode support for SVG
          const svgElement = containerRef.current.querySelector('svg');
          if (svgElement) {
            svgElement.classList.add('dark:text-white');
          }
        } catch (error) {
          console.error('Failed to render diagram:', error);
          containerRef.current.innerHTML = '<div class="text-red-500 p-4">Error rendering diagram. Please check your syntax.</div>';
        }
      }
    };

    renderDiagram();
  }, [currentDiagram, config]);

  const handleCopy = async () => {
    if (currentDiagram) {
      try {
        await navigator.clipboard.writeText(currentDiagram);
        alert('Diagram code copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const handleDownload = () => {
    if (containerRef.current) {
      const svg = containerRef.current.innerHTML;
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `diagram-${diagramType || 'mermaid'}.svg`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const toggleTheme = () => {
    setConfig(prev => ({
      ...prev,
      theme: prev.theme === 'default' ? 'dark' : 'default',
    }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold dark:text-white">
          {diagramType ? `${diagramType.toUpperCase()} Diagram` : 'Diagram'}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setZoom(z => Math.min(z + 0.1, 2))}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5 dark:text-white" />
          </button>
          <button
            onClick={() => setZoom(z => Math.max(z - 0.1, 0.5))}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5 dark:text-white" />
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            title="Toggle Theme"
          >
            <RefreshCw className="w-5 h-5 dark:text-white" />
          </button>
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            title="Copy Diagram Code"
          >
            <Copy className="w-5 h-5 dark:text-white" />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            title="Download SVG"
          >
            <Download className="w-5 h-5 dark:text-white" />
          </button>
        </div>
      </div>
      <div
        className="overflow-auto border rounded-lg p-4 dark:border-gray-700 bg-white dark:bg-gray-900"
        style={{ maxHeight: '600px' }}
      >
        <div
          ref={containerRef}
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top left',
            transition: 'transform 0.2s ease-in-out',
          }}
          className="min-h-[200px]"
        />
      </div>
    </div>
  );
};