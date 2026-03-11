import React from 'react';

interface QuestionCardProps {
  question: string;
  image?: string;
  children?: React.ReactNode;
}

export function QuestionCard({ question, image, children }: QuestionCardProps) {
  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto">
      <div className="flex items-start gap-4 mb-8 w-full">
        <div className="flex-shrink-0 flex flex-col items-center">
          <div className="w-16 h-16 bg-math-dark-teal rounded-xl flex items-center justify-center transform rotate-12 mb-1">
            <div className="w-10 h-10 border-2 border-math-mint/30 rounded-lg flex items-center justify-center">
              <span className="text-white font-black">M</span>
            </div>
          </div>
          <span className="text-math-teal font-bold text-xs uppercase tracking-wider">Mathy</span>
        </div>

        <div className="relative flex-1 bg-white border-2 border-math-teal/20 rounded-2xl p-4 shadow-sm">
          <p className="text-sm md:text-base font-medium text-math-slate leading-relaxed">
            {question}
          </p>

          <div className="absolute left-0 top-6 -translate-x-full overflow-hidden">
            <div className="w-4 h-4 bg-white border-2 border-math-teal/20 transform rotate-45 -mr-2"></div>
          </div>
        </div>
      </div>

      {image && (
        <div className="w-full bg-white/50 border border-dashed border-math-teal/30 rounded-2xl p-4 mb-8 flex items-center justify-center">
          <img src={image} alt="Question diagram" className="max-h-48 object-contain" />
        </div>
      )}

      <div className="w-full">
        {children}
      </div>
    </div>
  );
}
