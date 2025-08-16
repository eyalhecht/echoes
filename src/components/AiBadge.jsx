import React from 'react';
import { Sparkles } from 'lucide-react';

function AiBadge({ onClick, className = "" }) {
    return (
        <div
            className={`
                inline-flex items-center gap-1.5 rounded-full
                bg-gradient-to-r from-blue-500 to-purple-600
                text-white font-medium px-2.5 py-1 text-xs
                shadow-sm border border-white/20
                transition-all duration-200
                ${onClick ? 'cursor-pointer hover:shadow-md hover:scale-105 active:scale-95' : ''}
                ${className}
            `}
            onClick={onClick}
        >
            <Sparkles className="h-3 w-3 fill-current" />
            <span>AI Analyzed</span>
        </div>
    );
}

export default AiBadge;