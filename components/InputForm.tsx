import React, { useState } from 'react';
import { MagicIcon } from './icons/MagicIcon';
import { HistoryIcon } from './icons/HistoryIcon';
import { KeywordHistoryModal } from './KeywordHistoryModal';

interface InputFormProps {
  onOptimize: (url: string, tone: string, audience: string) => void;
  isLoading: boolean;
}

const TONES = ['Default', 'Professional', 'Casual', 'Witty', 'Authoritative'];

const InputForm: React.FC<InputFormProps> = ({ onOptimize, isLoading }) => {
  const [url, setUrl] = useState<string>('');
  const [tone, setTone] = useState<string>(TONES[0]);
  const [audience, setAudience] = useState<string>('');
  const [showHistory, setShowHistory] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOptimize(url, tone, audience);
  };

  return (
    <>
      <KeywordHistoryModal isOpen={showHistory} onClose={() => setShowHistory(false)} />
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 sticky top-8 z-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Article URL
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/my-awesome-article"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:text-white"
              required
            />
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Our AI will crawl the article at this URL to analyze and optimize its content.
            </p>
          </div>

          <div className="space-y-4 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex justify-between items-center">
                <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">Content Customization</h3>
                <button
                    type="button"
                    onClick={() => setShowHistory(true)}
                    className="flex items-center text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary-focus transition-colors"
                    title="View saved keyword history"
                >
                    <HistoryIcon className="h-4 w-4 mr-1.5" />
                    View Saved Keywords
                </button>
            </div>
            <div>
              <label htmlFor="tone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Tone of Voice
              </label>
              <select
                id="tone"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:text-white"
              >
                {TONES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="audience" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Target Audience (Optional)
              </label>
              <input
                type="text"
                id="audience"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g., Marketing professionals"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-primary-content bg-primary hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-slate-400 disabled:dark:bg-slate-600 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Optimizing...
              </>
            ) : (
              <>
                <MagicIcon className="h-5 w-5 mr-2" />
                Optimize Article
              </>
            )}
          </button>
        </form>
      </div>
    </>
  );
};

export default InputForm;
