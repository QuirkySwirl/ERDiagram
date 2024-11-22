export type DiagramType = 
  | 'er' 
  | 'class' 
  | 'sequence' 
  | 'state' 
  | 'flowchart' 
  | 'mindmap' 
  | 'journey' 
  | 'quadrant';

export interface ProcessSchemaOptions {
  primaryDiagramType?: DiagramType;
  includeAdditionalDiagrams?: boolean;
  journeyTitle?: string;
  quadrantTitle?: string;
}