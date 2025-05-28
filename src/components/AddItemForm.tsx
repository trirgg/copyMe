// /home/tri/user/project/copyMe/src/components/AddItemForm.tsx
import React, { useState } from 'react';

interface AddItemFormProps {
    onAddItem: (item: string) => void;
}

const AddItemForm: React.FC<AddItemFormProps> = ({ onAddItem }) => {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (inputValue.trim()) {
            onAddItem(inputValue.trim());
            setInputValue('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-3 mb-6">
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Paste or type text here..."
                aria-label="New clipboard item"
                className="flex-grow w-full px-4 py-2.5 border border-gray-300 rounded-lg
                           focus:ring-2 focus:ring-primary focus:border-primary
                           transition-shadow duration-150 ease-in-out outline-none text-gray-700 placeholder-gray-400"
            />
            <button
                type="submit"
                disabled={!inputValue.trim()}
                className="px-5 py-2.5 bg-primary bg-primary   text-white font-semibold rounded-lg
                           hover:bg-primary-dark focus:outline-none focus:ring-2
                           focus:ring-primary focus:ring-offset-1
                           transition-colors duration-150 ease-in-out
                           disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
                Add Clip
            </button>
        </form>
    );
};

export default AddItemForm;