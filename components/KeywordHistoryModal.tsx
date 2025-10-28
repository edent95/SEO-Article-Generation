import React, { useState, useEffect } from 'react';
import { TrashIcon } from './icons/TrashIcon';
import { XIcon } from './icons/XIcon';
import { StoredKeyword } from '../types';

interface KeywordHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const kdColor = (kd: number) => {
    if (kd <= 30) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    if (kd <= 60) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
};

export const KeywordHistoryModal: React.FC<KeywordHistoryModalProps> = ({ isOpen, onClose }) => {
    const [keywords, setKeywords] = useState<StoredKeyword[]>([]);

    useEffect(() => {
        if (isOpen) {
            try {
                const savedKeywordsRaw = localStorage.getItem('preferredKeywords');
                const savedKeywords: StoredKeyword[] = savedKeywordsRaw ? JSON.parse(savedKeywordsRaw) : [];
                // Sort by most recently used
                savedKeywords.sort((a, b) => new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime());
                setKeywords(savedKeywords);
            } catch (error) {
                console.error("Failed to parse keywords from local storage:", error);
                setKeywords([]);
            }
        }
    }, [isOpen]);

    const handleClearHistory = () => {
        localStorage.removeItem('preferredKeywords');
        setKeywords([]);
    };
    
    if (!isOpen) {
        return null;
    }

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl border border-slate-200 dark:border-slate-700 flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="p-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Saved Keyword History</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                        <XIcon className="h-6 w-6" />
                    </button>
                </header>
                
                <div className="p-1 sm:p-2 flex-grow overflow-y-auto max-h-[60vh]">
                    {keywords.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                                <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                                    <tr>
                                        <th scope="col" className="px-4 py-3">Keyword</th>
                                        <th scope="col" className="px-4 py-3 text-center">Usage</th>
                                        <th scope="col" className="px-4 py-3 text-center">KD</th>
                                        <th scope="col" className="px-4 py-3 text-right">Volume</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {keywords.map((kw) => (
                                        <tr key={kw.text} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600/20">
                                            <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                                                {kw.text}
                                            </th>
                                            <td className="px-4 py-3 text-center">{kw.usageCount}</td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${kdColor(kw.kd)}`}>
                                                    {kw.kd}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right font-mono">{kw.volume.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-slate-500 text-center py-12">
                            You haven't saved any keywords yet. Use the "Confirm & Use Keywords" button on a result to start building your history.
                        </p>
                    )}
                </div>

                <footer className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
                    <button
                        onClick={handleClearHistory}
                        disabled={keywords.length === 0}
                        className="flex items-center text-sm font-medium px-3 py-1.5 rounded-md bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <TrashIcon className="h-4 w-4 mr-1.5" />
                        Clear History
                    </button>
                </footer>
            </div>
        </div>
    );
};