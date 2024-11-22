import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useStore } from '../store';
import { processSchemaDescription } from '../lib/ai';

export const ChatInterface: React.FC = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addMessage, setDiagram, setDocumentation } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    addMessage({ role: 'user', content: input });

    try {
      const result = await processSchemaDescription(input);
      setDiagram(result.diagram);
      setDocumentation(result.documentation);
      addMessage({
        role: 'assistant',
        content: 'Schema processed successfully! Check the diagram and documentation below.',
      });
    } catch (error) {
      addMessage({
        role: 'assistant',
        content: 'Sorry, there was an error processing your schema. Please try again.',
      });
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <div className="h-[400px] overflow-y-auto border-b dark:border-gray-700 mb-4">
        {useStore.getState().messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}
          >
            <div
              className={`inline-block p-3 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your database schema..."
          className="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <Send className="w-6 h-6" />
          )}
        </button>
      </form>
    </div>
  );
};