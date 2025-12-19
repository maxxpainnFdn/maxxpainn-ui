
import React from 'react';
import { FileText } from 'lucide-react';

interface StoryTemplatesProps {
  onSelectTemplate: (template: string) => void;
}

const StoryTemplates = ({ onSelectTemplate }: StoryTemplatesProps) => {
  const templates = [
    "I lost everything in the [CRASH/RUG] but I'm still here fighting because...",
    "Started with $[AMOUNT], made it to $[PEAK], lost it all, but the pain taught me...",
    "Been through [NUMBER] bear markets and each one made me stronger because...",
    "Everyone said I was crazy for staying in crypto, but I believe...",
    "My crypto journey started when [EVENT] and despite all the pain, I'm still here because..."
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <FileText className="text-purple-400 h-4 w-4" />
        <span className="text-sm text-gray-400">Story Templates (click to use)</span>
      </div>
      
      <div className="space-y-1">
        {templates.map((template, index) => (
          <button
            key={index}
            onClick={() => onSelectTemplate(template)}
            className="w-full text-left text-xs text-gray-500 hover:text-purple-400 transition-colors p-2 rounded border border-gray-700 hover:border-purple-500/30"
          >
            {template}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StoryTemplates;
