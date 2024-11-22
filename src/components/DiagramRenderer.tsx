import React from 'react';
import { DiagramType } from '../types';

interface DiagramRendererProps {
  diagram: string;
  type?: DiagramType;
  title?: string;
  options?: {
    showScale?: boolean;
    showLegend?: boolean;
    interactive?: boolean;
  };
}

export const DiagramRenderer: React.FC<DiagramRendererProps> = ({
  diagram,
  type = 'er',
  title,
  options = {}
}) => {
  return (
    <div className="diagram-container">
      <div className="diagram-header">
        <h3 className="text-lg font-semibold">{title || `${type.toUpperCase()} Diagram`}</h3>
        <div className="diagram-controls flex gap-2">
          {options.showScale && type === 'journey' && (
            <div className="satisfaction-scale text-sm text-gray-600">
              <span>Satisfaction Scale: 1 (Low) - 5 (High)</span>
            </div>
          )}
          {options.showLegend && type === 'quadrant' && (
            <div className="quadrant-legend text-sm text-gray-600">
              <span>Quadrant Legend</span>
            </div>
          )}
        </div>
      </div>
      <div className="mermaid mt-4">
        {diagram}
      </div>
    </div>
  );
};