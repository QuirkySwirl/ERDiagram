import OpenAI from 'openai';
import { DiagramType, ProcessSchemaOptions } from '../types';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
  throw new Error('OpenAI API key is not set in environment variables');
}

const openai = new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true // Note: In production, proxy through backend
});

export interface ProcessSchemaResult {
  diagram: string;
  documentation: string;
  supplementaryDiagrams?: string[];
}

export async function processSchemaDescription(
  input: string, 
  options: ProcessSchemaOptions = { 
    primaryDiagramType: 'er',
    includeAdditionalDiagrams: true 
  }
): Promise<ProcessSchemaResult> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert system architect that converts natural language descriptions into technical documentation with Mermaid.js diagrams.`
        },
        {
          role: "user",
          content: `Create a ${options.primaryDiagramType} diagram and documentation for: ${input}`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    // Simple parsing for demo - in production, use more robust parsing
    const diagramMatch = content.match(/```mermaid\n([\s\S]*?)\n```/);
    const diagram = diagramMatch ? diagramMatch[1] : '';
    const documentation = content.replace(/```mermaid\n[\s\S]*?\n```/, '').trim();

    return {
      diagram,
      documentation
    };
  } catch (error) {
    console.error('Error processing schema:', error);
    throw error;
  }
}