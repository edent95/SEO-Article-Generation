
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center p-8 border-b border-slate-200 dark:border-slate-700">
      <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400 mb-2">
        SEO Article Optimizer
      </h1>
      <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
        Your AI-powered SEO expert. Transform your content into a high-ranking masterpiece ready for publishing.
      </p>
    </header>
  );
};

export default Header;
