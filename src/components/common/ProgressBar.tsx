interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full flex items-center gap-4 px-2">
      <button className="text-math-slate hover:text-math-teal transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
      </button>
      
      <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-math-teal transition-all duration-500 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <span className="text-math-teal font-bold text-sm whitespace-nowrap">
        {current}/{total}
      </span>
    </div>
  );
}
