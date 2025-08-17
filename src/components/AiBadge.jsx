import React from 'react';
import { Sparkles } from 'lucide-react';

function AiBadge({ onClick, className = "" }) {
    return (
        <button
            className={`
                inline-flex items-center gap-1.5 rounded-full
                bg-gradient-to-r from-blue-500 to-purple-600
                text-white font-medium px-2.5 py-1 text-xs
                shadow-sm border border-white/20
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                hover:ring-2 hover:ring-blue-500 hover:ring-offset-2
                ${className}
            `}
            onClick={onClick}
            disabled={!onClick}
        >
            <Sparkles className="h-3 w-3 fill-current" />
            <span>Ask AI</span>
        </button>
    );
}

export default AiBadge;