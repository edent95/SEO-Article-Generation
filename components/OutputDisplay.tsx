import React, { useState, useCallback } from 'react';
import { OptimizationResult } from '../types';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';
import { KeywordVisualization } from './KeywordVisualization';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { FeedbackButton } from './FeedbackButton';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface OutputDisplayProps {
  result: OptimizationResult | null;
  isLoading: boolean;
  error: string | null;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ result, isLoading, error }) => {
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isFetchedContentVisible, setIsFetchedContentVisible] = useState(false);

  const article = result?.article;
  const coverImages = result?.coverImages || [];

  const handleCopyHtml = () => {
    if (article?.refinedContentHtml) {
      navigator.clipboard.writeText(article.refinedContentHtml);
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 2000);
    }
  };

  const handleCopyTitle = () => {
    if (article?.refinedTitle) {
      navigator.clipboard.writeText(article.refinedTitle);
      setCopiedTitle(true);
      setTimeout(() => setCopiedTitle(false), 2000);
    }
  };
  
  const handleDownload = useCallback(() => {
    if (selectedImage !== null && coverImages[selectedImage]) {
      const base64Image = coverImages[selectedImage];
      const link = document.createElement('a');
      link.href = `data:image/jpeg;base64,${base64Image}`;
      link.download = `${article?.refinedTitle.replace(/\s+/g, '-').toLowerCase()}-cover.jpg` || 'cover-photo.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [selectedImage, coverImages, article?.refinedTitle]);


  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 min-h-[500px] flex flex-col items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 animate-pulse-fast mx-auto"></div>
          <div className="w-10 h-10 rounded-full bg-teal-100 dark:teal-900/50 animate-pulse-fast mx-auto -mt-2"></div>
          <p className="text-slate-600 dark:text-slate-400 font-medium">AI is crafting your masterpiece...</p>
          <p className="text-sm text-slate-500">Generating text, keywords, and cover photos.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl shadow-lg border border-red-200 dark:border-red-700 min-h-[500px] flex flex-col items-center justify-center text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-300">Oops! Something went wrong.</h3>
        <p className="text-red-600 dark:text-red-400 mt-2 text-sm max-w-md">{error}</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 min-h-[500px] flex flex-col items-center justify-center text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-400 dark:text-slate-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">Your optimized article will appear here</h3>
        <p className="text-slate-500 mt-1 max-w-sm">Enter an article URL on the left and let our AI work its magic to boost your content's SEO potential.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Optimized Result</h2>
        <div className="bg-slate-100 dark:bg-slate-900/70 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300">Refined Title</h3>
            <button
              onClick={handleCopyTitle}
              className="flex items-center text-xs font-medium px-2 py-1 rounded-md bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              title="Copy title"
            >
              {copiedTitle ? (
                <>
                  <CheckIcon className="h-3 w-3 mr-1 text-green-500" />
                  Copied
                </>
              ) : (
                <>
                  <ClipboardIcon className="h-3 w-3 mr-1" />
                  Copy
                </>
              )}
            </button>
          </div>
          <p className="text-xl font-medium text-primary mt-1 pr-4">{article.refinedTitle}</p>
        </div>
      </div>
      
      {coverImages.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Generated Cover Photos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {coverImages.map((img, index) => (
              <img
                key={index}
                src={`data:image/jpeg;base64,${img}`}
                alt={`Generated cover photo ${index + 1}`}
                className={`w-full aspect-video object-cover rounded-lg cursor-pointer border-4 transition-all ${selectedImage === index ? 'border-primary' : 'border-transparent hover:border-primary/50'}`}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>
           <button
            onClick={handleDownload}
            disabled={selectedImage === null}
            className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-content bg-primary hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-slate-400 disabled:dark:bg-slate-600 disabled:cursor-not-allowed transition-colors"
          >
             <DownloadIcon className="h-4 w-4 mr-2" />
             Download Selected Photo
           </button>
        </div>
      )}

      <div>
        <div className="flex items-center mb-4 justify-between">
          <div className="flex items-center">
            <ChartBarIcon className="h-6 w-6 mr-2 text-primary" />
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Keyword Analysis</h3>
          </div>
          <FeedbackButton keywords={article.keywordAnalysis.suggestedKeywords} />
        </div>
        <div className="space-y-6">
          {article.keywordAnalysis.suggestedKeywords.map((suggestion, index) => (
            <KeywordVisualization key={index} suggestion={suggestion} />
          ))}
        </div>
      </div>

      {article.fetchedContentText && (
        <div>
          <button
            onClick={() => setIsFetchedContentVisible(!isFetchedContentVisible)}
            className="w-full flex justify-between items-center text-left py-3 px-4 bg-slate-100 dark:bg-slate-900/70 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700/50 focus:outline-none transition-colors"
          >
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">Content Fetched from URL</h3>
            <ChevronDownIcon className={`h-5 w-5 text-slate-500 transition-transform duration-200 ${isFetchedContentVisible ? 'rotate-180' : ''}`} />
          </button>
          {isFetchedContentVisible && (
            <div className="mt-2 p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900/70 max-h-60 overflow-y-auto">
              <pre className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap font-sans">
                {article.fetchedContentText}
              </pre>
            </div>
          )}
        </div>
      )}
      
      <div>
        <div className="flex justify-between items-center mb-3 mt-8">
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">Refined Article (HTML)</h3>
          <button
            onClick={handleCopyHtml}
            className="flex items-center text-sm font-medium px-3 py-1.5 rounded-md bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            {copiedHtml ? (
              <>
                <CheckIcon className="h-4 w-4 mr-1.5 text-green-500" />
                Copied!
              </>
            ) : (
              <>
                <ClipboardIcon className="h-4 w-4 mr-1.5" />
                Copy HTML
              </>
            )}
          </button>
        </div>
        <div 
          className="prose prose-slate dark:prose-invert max-w-none p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900/70 overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: article.refinedContentHtml }}
        />
      </div>
    </div>
  );
};

export default OutputDisplay;