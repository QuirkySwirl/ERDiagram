import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Printer, Download } from 'lucide-react';
import { useStore } from '../store';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import sql from 'react-syntax-highlighter/dist/esm/languages/hljs/sql';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import mermaid from 'mermaid';

SyntaxHighlighter.registerLanguage('sql', sql);

export const DocumentationView = () => {
  const documentation = useStore((state) => state.documentation);

  useEffect(() => {
    mermaid.contentLoaded();
  }, [documentation]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const blob = new Blob([documentation], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'documentation.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold dark:text-white">Documentation</h2>
        <div className="flex gap-2 no-print">
          <button
            onClick={handlePrint}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            title="Print Documentation"
          >
            <Printer className="w-5 h-5 dark:text-white" />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            title="Download Markdown"
          >
            <Download className="w-5 h-5 dark:text-white" />
          </button>
        </div>
      </div>
      <div className="prose dark:prose-invert max-w-none overflow-auto">
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              const content = String(children).replace(/\n$/, '');
              
              if (!inline && match && match[1] === 'mermaid') {
                return (
                  <div className="mermaid my-4">
                    {content}
                  </div>
                );
              }
              
              return !inline && match ? (
                <SyntaxHighlighter
                  style={docco}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {content}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {documentation}
        </ReactMarkdown>
      </div>
    </div>
  );
};