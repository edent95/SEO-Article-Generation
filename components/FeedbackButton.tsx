import React, { useState } from 'react';
import { KeywordSuggestion, StoredKeyword } from '../types';
import { BookmarkIcon } from './icons/BookmarkIcon';
import { CheckIcon } from './icons/CheckIcon';

interface FeedbackButtonProps {
    keywords: KeywordSuggestion[];
}

export const FeedbackButton: React.FC<FeedbackButtonProps> = ({ keywords }) => {
    const [isSaved, setIsSaved] = useState(false);

    const handleSaveKeywords = () => {
        const newSuggestions = keywords.map(k => k.suggestion);
        
        try {
            const existingHistoryRaw = localStorage.getItem('preferredKeywords');
            const history: StoredKeyword[] = existingHistoryRaw ? JSON.parse(existingHistoryRaw) : [];
            const historyMap = new Map<string, StoredKeyword>(history.map(k => [k.text, k]));

            const now = new Date().toISOString();

            newSuggestions.forEach(suggestion => {
                const existing = historyMap.get(suggestion.text);
                if (existing) {
                    existing.usageCount += 1;
                    existing.kd = suggestion.kd;
                    existing.volume = suggestion.volume;
                    existing.lastUsed = now;
                } else {
                    historyMap.set(suggestion.text, {
                        text: suggestion.text,
                        kd: suggestion.kd,
                        volume: suggestion.volume,
                        usageCount: 1,
                        lastUsed: now,
                    });
                }
            });
            
            const updatedHistory = Array.from(historyMap.values());
            localStorage.setItem('preferredKeywords', JSON.stringify(updatedHistory));

            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 2500);

        } catch (error) {
            console.error("Failed to save keywords to local storage:", error);
        }
    };

    return (
        <button
            onClick={handleSaveKeywords}
            title="Save suggested keywords to inform future optimizations"
            className={`flex items-center text-xs font-semibold px-2.5 py-1.5 rounded-full transition-colors ${
                isSaved 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' 
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900'
            }`}
        >
            {isSaved ? (
                <>
                    <CheckIcon className="h-4 w-4 mr-1.5" />
                    Keywords Saved!
                </>
            ) : (
                <>
                    <BookmarkIcon className="h-4 w-4 mr-1.5" />
                    Confirm & Use Keywords
                </>
            )}
        </button>
    );
};