import { create } from 'zustand';
import { DiagramType } from '../types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Store {
  messages: Message[];
  currentDiagram: string;
  diagramType: DiagramType;
  documentation: string;
  addMessage: (message: Message) => void;
  setDiagram: (diagram: string, type?: DiagramType) => void;
  setDocumentation: (doc: string) => void;
}

export const useStore = create<Store>((set) => ({
  messages: [],
  currentDiagram: '',
  diagramType: 'er',
  documentation: '',
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  setDiagram: (diagram, type = 'er') => 
    set({ currentDiagram: diagram, diagramType: type }),
  setDocumentation: (doc) => set({ documentation: doc }),
}));