import React from 'react';

export const MagicIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M5 3v4" />
        <path d="M19 17v4" />
        <path d="M3 5h4" />
        <path d="M17 19h4" />
        <path d="M12 3a3 3 0 0 0-3 3" />
        <path d="M12 21a3 3 0 0 0 3-3" />
        <path d="M3 12a3 3 0 0 0 3-3" />
        <path d="M21 12a3 3 0 0 0-3 3" />
        <path d="M12 6a3 3 0 0 0-3 3" />
        <path d="M12 18a3 3 0 0 0 3-3" />
        <path d="M6 12a3 3 0 0 0-3 3" />
        <path d="M18 12a3 3 0 0 0 3-3" />
    </svg>
);
