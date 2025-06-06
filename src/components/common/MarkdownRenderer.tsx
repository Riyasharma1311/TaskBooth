import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
    content: string;
    className?: string;
    maxLines?: number;
}

export const MarkdownRenderer = ({ content, className = '', maxLines }: MarkdownRendererProps) => {
    const truncatedContent = useMemo(() => {
        if (!maxLines) return content;

        const lines = content.split('\n');
        if (lines.length <= maxLines) return content;

        return lines.slice(0, maxLines).join('\n') + '...';
    }, [content, maxLines]);

    return (
        <div className={`markdown-content ${className}`}>
            <ReactMarkdown
                components={{
                    // Customize heading styles
                    h1: ({ children }) => (
                        <h1 className="text-lg font-bold mb-2 text-gray-900">{children}</h1>
                    ),
                    h2: ({ children }) => (
                        <h2 className="text-base font-semibold mb-2 text-gray-900">{children}</h2>
                    ),
                    h3: ({ children }) => (
                        <h3 className="text-sm font-medium mb-1 text-gray-900">{children}</h3>
                    ),

                    // Customize paragraph styles
                    p: ({ children }) => (
                        <p className="text-sm text-gray-700 mb-2 last:mb-0">{children}</p>
                    ),

                    // Customize list styles
                    ul: ({ children }) => (
                        <ul className="list-disc list-inside text-sm text-gray-700 mb-2 space-y-1">{children}</ul>
                    ),
                    ol: ({ children }) => (
                        <ol className="list-decimal list-inside text-sm text-gray-700 mb-2 space-y-1">{children}</ol>
                    ),
                    li: ({ children }) => (
                        <li className="text-sm text-gray-700">{children}</li>
                    ),

                    // Customize code styles
                    code: ({ node, inline, className, children, ...props }: any) => {
                        if (inline) {
                            return (
                                <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-xs font-mono" {...props}>
                                    {children}
                                </code>
                            );
                        }
                        return (
                            <pre className="bg-gray-100 text-gray-800 p-2 rounded text-xs font-mono overflow-x-auto mb-2">
                                <code className={className} {...props}>{children}</code>
                            </pre>
                        );
                    },

                    // Customize blockquote styles
                    blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-gray-300 pl-3 text-sm text-gray-600 italic mb-2">
                            {children}
                        </blockquote>
                    ),

                    // Customize link styles
                    a: ({ href, children }) => (
                        <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-800 underline text-sm"
                        >
                            {children}
                        </a>
                    ),

                    // Customize table styles
                    table: ({ children }) => (
                        <div className="overflow-x-auto mb-2">
                            <table className="min-w-full text-xs border border-gray-200">
                                {children}
                            </table>
                        </div>
                    ),
                    thead: ({ children }) => (
                        <thead className="bg-gray-50">{children}</thead>
                    ),
                    th: ({ children }) => (
                        <th className="px-2 py-1 text-left font-medium text-gray-900 border-b border-gray-200">
                            {children}
                        </th>
                    ),
                    td: ({ children }) => (
                        <td className="px-2 py-1 text-gray-700 border-b border-gray-200">
                            {children}
                        </td>
                    ),

                    // Customize horizontal rule
                    hr: () => <hr className="border-gray-300 my-2" />,

                    // Customize emphasis
                    strong: ({ children }) => (
                        <strong className="font-semibold text-gray-900">{children}</strong>
                    ),
                    em: ({ children }) => (
                        <em className="italic text-gray-700">{children}</em>
                    ),
                }}
            >
                {truncatedContent}
            </ReactMarkdown>
        </div>
    );
};
