// /home/tri/user/project/copyMe/src/App.tsx
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import AddItemForm from './components/AddItemForm';
import ClipboardHistory from './components/ClipboardHistory';
import './style.css'; // Make sure this is imported (usually in main.tsx or here)

interface ClipItem {
    id: string;
    text: string;
}
const LOCAL_STORAGE_KEY = 'copyMeClipboardHistory';

const App: React.FC = () => {
    // const [history, setHistory] = useState<ClipItem[]>([]);
    const [showCopiedMessage, setShowCopiedMessage] = useState(false);
    const [copiedMessageText, setCopiedMessageText] = useState("Copied to clipboard!"); // For dynamic messages

    const [history, setHistory] = useState<ClipItem[]>(() => {
        // Load initial state from local storage
        try {
            const storedHistory = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (storedHistory) {
                const parsedHistory = JSON.parse(storedHistory);
                if (Array.isArray(parsedHistory) &&
                    parsedHistory.every(item => typeof item.id === 'string' && typeof item.text === 'string')) {
                    return parsedHistory;
                }
            }
        } catch (error) {
            console.error("Error loading items from localStorage:", error);
        }
        return []; // Default to empty array if nothing in storage or error
    });


    useEffect(() => {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(history));
        } catch (error) {
            console.error("Error saving items to localStorage:", error);
            // Handle potential errors, e.g., localStorage is full or disabled
            alert("Could not save items. Local storage might be full or disabled.");
        }
    }, [history]);

    useEffect(() => {
        localStorage.setItem('clipboardHistory', JSON.stringify(history));
    }, [history]);

    const handleAddItem = (itemText: string) => {
        const newItem: ClipItem = {
            id: Date.now().toString(), // Generate a unique ID
            text: itemText,
        };
        // Update the state. This will trigger the useEffect above to save.
        setHistory(prevHistory => [newItem, ...prevHistory]);
    };

    const displayCopiedMessage = (message: string) => {
        setCopiedMessageText(message);
        setShowCopiedMessage(true);
        setTimeout(() => setShowCopiedMessage(false), 2500); // Hide message after 2.5 seconds
    };

    const handleCopyItem = async (itemText: string) => {
        try {
            await navigator.clipboard.writeText(itemText);
            displayCopiedMessage(`Copied: "${itemText.substring(0, 30)}${itemText.length > 30 ? '...' : ''}"`);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy. Check browser permissions or console for details.');
        }
    };

    const handleDeleteItem = (itemId: string) => {
        setHistory(prevHistory => prevHistory.filter(item => item.id !== itemId));
    };

    const handleCopyAll = async () => {
        if (history.length === 0) return;

        // Format the history for copying. Each item on a new line.
        // You can customize this format.
        const allItemsText = history.map(item => item.text).join('\n\n---\n\n'); // Join with a separator

        try {
            await navigator.clipboard.writeText(allItemsText);
            displayCopiedMessage(`Copied all ${history.length} items!`);
        } catch (err) {
            console.error('Failed to copy all items: ', err);
            alert('Failed to copy all items. Check browser permissions or console for details.');
        }
    };

    return (
        <div className="min-h-screen bg-light-bg flex flex-col items-center py-8 sm:py-12 px-4">
            {showCopiedMessage && (
                <div className="fixed top-5 right-5 bg-success text-white px-4 py-2 rounded-md shadow-lg transition-all duration-300 ease-in-out animate-fadeInOut">
                    {copiedMessageText}
                </div>
            )}
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-card p-6 sm:p-8 space-y-6">
                <Header />
                <AddItemForm onAddItem={handleAddItem} />

                {/* Button to copy all clipboard items */}
                {history.length > 0 && (
                    <div className="text-right mb-4 -mt-2"> {/* Adjust margin as needed */}
                        <button
                            onClick={handleCopyAll}
                            className="px-4 py-2 bg-secondary/80 hover:bg-secondary text-white text-xs font-medium rounded-md
                                       transition-colors duration-150 ease-in-out
                                       focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-1"
                            title="Copy all items in the list"
                        >
                            Copy All ({history.length})
                        </button>
                    </div>
                )}

                <ClipboardHistory
                    history={history}
                    onCopy={handleCopyItem}
                    onDelete={handleDeleteItem}
                />
            </div>
            <footer className="mt-8 text-center text-sm text-gray-500">
                <p>copyMe - A simple clipboard manager.</p>
            </footer>
        </div>
    );
};

export default App;