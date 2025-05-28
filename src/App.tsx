// /home/tri/user/project/copyMe/src/App.tsx
import React from 'react'; // Removed useState, useEffect
import Header from './components/Header';
import AddItemForm from './components/AddItemForm';
import ClipboardHistory from './components/ClipboardHistory';
import LocalStorageUsage from "./components/LocalStorageUsage.tsx";
import { useAppStore } from './store';
// import {useAppStore} from 'src/store.ts'// Import the Zustand store
import './style.css';

// ClipItem interface can be moved to store.ts or a shared types file if used elsewhere
// interface ClipItem {
//     id: string;
//     text: string;
// }
const LOCAL_STORAGE_KEY = 'copyMeClipboardHistory'; // Still useful for LocalStorageUsage component

const App: React.FC = () => {
    // Get state and actions from the Zustand store
    const history = useAppStore((state) => state.history);
    const showCopiedMessage = useAppStore((state) => state.showCopiedMessage);
    const copiedMessageText = useAppStore((state) => state.copiedMessageText);
    const addItem = useAppStore((state) => state.addItem);
    const deleteItem = useAppStore((state) => state.deleteItem);
    const setCopiedMessage = useAppStore((state) => state.setCopiedMessage);

    // The local storage loading and saving logic is now handled by the Zustand persist middleware.
    // No more useEffect hooks for localStorage here!

    const handleAddItem = (itemText: string) => {
        addItem(itemText); // Call the action from the store
    };

    const displayCopiedMessage = (message: string) => {
        setCopiedMessage(message); // Call the action from the store
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
        deleteItem(itemId); // Call the action from the store
    };

    const handleCopyAll = async () => {
        if (history.length === 0) return;
        const allItemsText = history.map(item => item.text).join('\n\n---\n\n');
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

                {/* Layout for Copy All button and LocalStorageUsage */}
                <div className="flex justify-between items-center mb-4 -mt-2">
                    {history.length > 0 ? (
                        <button
                            onClick={handleCopyAll}
                            className="px-4 py-2 bg-secondary/80 hover:bg-secondary text-white text-xs font-medium rounded-md
                                       transition-colors duration-150 ease-in-out
                                       focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-1"
                            title="Copy all items in the list"
                        >
                            Copy All ({history.length})
                        </button>
                    ) : (
                        <div /> /* Placeholder to maintain layout if button isn't shown */
                    )}
                    <LocalStorageUsage storageKey={LOCAL_STORAGE_KEY} />
                </div>


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