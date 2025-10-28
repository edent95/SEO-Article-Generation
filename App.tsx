import React, { useState, useCallback } from 'react';
import { OptimizationResult, StoredKeyword } from './types';
import { optimizeArticleAndGenerateImages } from './services/geminiService';
import Header from './components/Header';
import InputForm from './components/InputForm';
import OutputDisplay from './components/OutputDisplay';

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);

  const handleOptimize = useCallback(async (url: string, tone: string, audience: string) => {
    if (!url.trim() || !url.startsWith('http')) {
      setError("Please enter a valid article URL.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setOptimizationResult(null);

    try {
      const savedKeywordsRaw = localStorage.getItem('preferredKeywords');
      const savedKeywords: StoredKeyword[] = savedKeywordsRaw ? JSON.parse(savedKeywordsRaw) : [];
      const keywordTexts = savedKeywords.map(k => k.text);

      const result = await optimizeArticleAndGenerateImages(url, tone, audience, keywordTexts);
      setOptimizationResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <InputForm onOptimize={handleOptimize} isLoading={isLoading} />
          <OutputDisplay
            result={optimizationResult}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </main>
      <footer className="text-center p-4 text-xs text-slate-500">
        <p>Powered by Gemini API. For educational and demonstrative purposes only.</p>
      </footer>
    </div>
  );
}

export default App;