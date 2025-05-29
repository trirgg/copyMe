// src/store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ClipItem {
    id: string;
    text: string;
}

interface AppState {
    history: ClipItem[];
    showCopiedMessage: boolean;
    copiedMessageText: string;
    addItem: (itemText: string) => void;
    deleteItem: (itemId: string) => void;
    setCopiedMessage: (message: string, duration?: number) => void;
    // You might also want actions for copyAll, copyItem if they involve store changes
    // not directly handled by components (though in this case, they mostly don't)
}

const LOCAL_STORAGE_KEY = 'copyMeClipboardHistory';

// @ts-ignore
// @ts-ignore
// @ts-ignore
export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            history: [],
            showCopiedMessage: false,
            copiedMessageText: "Copied to clipboard!",

            addItem: (itemText: string) => {
                const newItem: ClipItem = {
                    id: Date.now().toString(),
                    text: itemText,
                };
                set((state) => ({ history: [newItem, ...state.history] }));
            },

            deleteItem: (itemId: string) => {
                set((state) => ({
                    history: state.history.filter((item) => item.id !== itemId),
                }));
            },

            setCopiedMessage: (message: string, duration: number = 2500) => {
                // @ts-ignore
                set({ copiedMessageText: message, showCopiedMessage: true });
                setTimeout(() => {
                    set({ showCopiedMessage: false });
                }, duration);
            },
        }),
        {
            name: LOCAL_STORAGE_KEY, // Name of the item in localStorage
            storage: createJSONStorage(() => localStorage), // Use localStorage
            partialize: (state) => ({ history: state.history }), // Only persist the 'history' part of the store

        }
    )
);

// Optional: To load initial store from localStorage immediately when the store is defined
// This is an alternative to relying solely on persists rehydration if you need synchronous access on first load.
// However, persist middleware handles this well.
const initialHistory = (() => {
    try {
        const storedHistory = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedHistory) {
            const parsed = JSON.parse(storedHistory);
            if (parsed.store && Array.isArray(parsed.store.history)) {
                // Validate structure
                if (parsed.store.history.every((item: any) => typeof item.id === 'string' && typeof item.text === 'string')) {
                   return parsed.store.history;
                }
            }
        }
    } catch (e) {
        console.error("Failed to parse initial history from localStorage", e);
    }
    return [];
})();
if (initialHistory.length > 0) {
    useAppStore.setState({ history: initialHistory });
}