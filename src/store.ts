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
    // You might also want actions for copyAll, copyItem if they involve state changes
    // not directly handled by components (though in this case, they mostly don't)
}

const LOCAL_STORAGE_KEY = 'copyMeClipboardHistory';

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
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
                set({ copiedMessageText: message, showCopiedMessage: true });
                setTimeout(() => {
                    set({ showCopiedMessage: false });
                }, duration);
            },
        }),
        {
            name: LOCAL_STORAGE_KEY, // Name of the item in localStorage
            storage: createJSONStorage(() => localStorage), // Use localStorage
            partialize: (state) => ({ history: state.history }), // Only persist the 'history' part of the state
            onRehydrateStorage: (state) => {
                console.log("Hydration finished");
                // You can do something here after the state is rehydrated
                // For example, validate the rehydrated history
                if (state?.history) {
                    const isValidHistory = Array.isArray(state.history) &&
                        state.history.every(item => typeof item.id === 'string' && typeof item.text === 'string');
                    if (!isValidHistory) {
                        console.warn("Rehydrated history is not in the expected format. Clearing.");
                        // This would require an action to clear history if validation fails post-hydration
                        // For simplicity, the initial load validation is good, or you can add a 'clearCorruptedHistory' action.
                        return { ...state, history: [] };
                    }
                }
            }
        }
    )
);

// Optional: To load initial state from localStorage immediately when the store is defined
// This is an alternative to relying solely on persist's rehydration if you need synchronous access on first load.
// However, persist middleware handles this well.
// const initialHistory = (() => {
//     try {
//         const storedHistory = localStorage.getItem(LOCAL_STORAGE_KEY);
//         if (storedHistory) {
//             const parsed = JSON.parse(storedHistory);
//             if (parsed.state && Array.isArray(parsed.state.history)) {
//                 // Validate structure
//                 if (parsed.state.history.every((item: any) => typeof item.id === 'string' && typeof item.text === 'string')) {
//                    return parsed.state.history;
//                 }
//             }
//         }
//     } catch (e) {
//         console.error("Failed to parse initial history from localStorage", e);
//     }
//     return [];
// })();
// if (initialHistory.length > 0) {
//     useAppStore.setState({ history: initialHistory });
// }