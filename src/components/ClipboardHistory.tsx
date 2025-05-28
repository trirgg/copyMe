// /home/tri/user/project/copyMe/src/components/ClipboardHistory.tsx
import React from 'react';

interface ClipboardHistoryProps {
    history: { id: string; text: string }[];
    onCopy: (itemText: string) => void;
    onDelete: (itemId: string) => void;
}

const ClipboardHistory: React.FC<ClipboardHistoryProps> = ({ history, onCopy, onDelete }) => {
    if (history.length === 0) {
        return (
            <div className="text-center py-10 px-6 bg-gray-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No items yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                    Your clipboard history is empty. Add some items to get started!
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {history.map((clip) => (
                <div
                    key={clip.id}
                    className="flex items-center justify-between bg-item-bg border border-item-border
                               rounded-lg p-3.5 shadow-sm hover:shadow-card-hover
                               transition-all duration-200 ease-in-out group"
                >
                    <pre // Using <pre> to respect whitespace and newlines
                        className="flex-grow mr-3 text-gray-700
                                   break-all whitespace-pre-wrap
                                   text-sm leading-relaxed"
                        title={clip.text.length > 100 ? `${clip.text.substring(0,100)}...` : clip.text} // Show full text on hover if long
                    >
                        {clip.text}
                    </pre>
                    <div className="flex items-center gap-2 flex-shrink-0"> {/* Actions container */}
                        <button
                            onClick={() => onCopy(clip.text)}
                            className="p-1.5 text-primary hover:bg-primary/10 rounded-md
                                       focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1
                                       transition-colors duration-150 ease-in-out"
                            title="Copy this item"
                            aria-label={`Copy item: ${clip.text.substring(0, 30)}...`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => onDelete(clip.id)}
                            className="p-1.5 text-danger hover:bg-danger/10 rounded-md
                                       focus:outline-none focus:ring-2 focus:ring-danger focus:ring-offset-1
                                       transition-colors duration-150 ease-in-out opacity-70 group-hover:opacity-100"
                            title="Delete clip"
                            aria-label={`Delete item: ${clip.text.substring(0, 20)}...`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ClipboardHistory;