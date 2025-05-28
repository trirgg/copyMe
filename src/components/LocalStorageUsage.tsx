// src/components/LocalStorageUsage.tsx
import React, { useState } from 'react';

interface LocalStorageUsageProps {
    storageKey: string;
}

const formatBytes = (bytes: number, decimals = 2): string => {
    if (!+bytes) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const LocalStorageUsage: React.FC<LocalStorageUsageProps> = ({ storageKey }) => {
    const [usage, setUsage] = useState<string | null>(null); // Start with null or an empty string
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const calculateUsage = () => {
        setIsLoading(true);
        setUsage('Calculating...'); // Provide immediate feedback
        try {
            // Simulate a small delay for better UX if calculation is very fast
            setTimeout(() => {
                const storedData = localStorage.getItem(storageKey);
                if (storedData) {
                    const sizeInBytes = new TextEncoder().encode(storedData).length;
                    setUsage(formatBytes(sizeInBytes));
                } else {
                    setUsage(formatBytes(0));
                }
                setIsLoading(false);
            }, 200); // 200ms delay
        } catch (error) {
            console.error("Error calculating local storage usage:", error);
            setUsage("Error");
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={calculateUsage}
                disabled={isLoading}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-medium rounded-md
                           transition-colors duration-150 ease-in-out
                           focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1
                           disabled:opacity-50 disabled:cursor-not-allowed"
                title="Check current storage usage"
            >
                {isLoading ? 'Checking...' : 'Check Storage'}
            </button>
            {usage && !isLoading && ( // Only show usage if it's calculated and not currently loading
                <div className="text-xs text-gray-500">
                    Usage: <span className="font-medium text-gray-600">{usage}</span>
                </div>
            )}
            {usage === 'Calculating...' && isLoading && ( // Show calculating text if actively calculating
                <div className="text-xs text-gray-500 italic">
                    Calculating...
                </div>
            )}
        </div>
    );
};

export default LocalStorageUsage;