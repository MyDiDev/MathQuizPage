interface OptionButtonProps {
  label: string;
  text: string;
  selected?: boolean;
  correct?: boolean;
  incorrect?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export function OptionButton({
  label,
  text,
  selected,
  correct,
  incorrect,
  disabled,
  onClick
}: OptionButtonProps) {
  let borderColor = "border-slate-200";
  let bgColor = "bg-white";
  let labelBg = "bg-slate-100";
  let textColor = "text-math-slate";

  if (selected) {
    borderColor = "border-math-teal";
    bgColor = "bg-math-mint/30";
  }

  if (correct) {
    borderColor = "border-emerald-500";
    bgColor = "bg-emerald-50";
    labelBg = "bg-emerald-500";
  } else if (incorrect) {
    borderColor = "border-rose-500";
    bgColor = "bg-rose-50";
    labelBg = "bg-rose-500";
  }

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`
        w-full flex items-center gap-4 p-4 mb-3 border-2 rounded-2xl transition-all duration-200
        ${borderColor} ${bgColor} ${disabled ? 'cursor-default' : 'hover:border-math-teal hover:shadow-md'}
      `}
    >
      <div className={`
        w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm
        ${labelBg} ${correct || incorrect ? 'text-white' : 'text-slate-500'}
      `}>
        {label}
      </div>
      <span className={`flex-1 text-left font-semibold ${textColor}`}>
        {text}
      </span>
    </button>
  );
}
