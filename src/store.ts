import { create } from 'zustand';
import { DiagramType } from './types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Store {
  messages: Message[];
  currentDiagram: string;
  diagramType: DiagramType;
  documentation: string;
  supplementaryDiagrams: string[];
  addMessage: (message: Message) => void;
  setDiagram: (diagram: string, type?: DiagramType) => void;
  setDocumentation: (doc: string) => void;
  setSupplementaryDiagrams: (diagrams: string[]) => void;
}

export const useStore = create<Store>((set) => ({
  messages: [],
  diagramType: 'er',
  currentDiagram: `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE_ITEM : contains
    CUSTOMER {
        string name
        string email
    }
    ORDER {
        int orderNumber
        string deliveryAddress
    }
    LINE_ITEM {
        string product
        int quantity
    }`,
  documentation: `# E-Commerce Database Documentation

## Overview
This documentation describes the database schema for our e-commerce system.

## Entity-Relationship Diagram
\`\`\`mermaid
erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE_ITEM : contains
    CUSTOMER {
        string name
        string email
    }
    ORDER {
        int orderNumber
        string deliveryAddress
    }
    LINE_ITEM {
        string product
        int quantity
    }
\`\`\`

## Tables and Relationships
...`,
  supplementaryDiagrams: [],
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  setDiagram: (diagram, type = 'er') => 
    set({ currentDiagram: diagram, diagramType: type }),
  setDocumentation: (doc) => set({ documentation: doc }),
  setSupplementaryDiagrams: (diagrams) => set({ supplementaryDiagrams: diagrams }),
}));