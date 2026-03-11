interface FeedbackToastProps {
  isCorrect: boolean;
  onShowExplanation: () => void;
  onNext: () => void;
}

export function FeedbackToast({ isCorrect, onShowExplanation, onNext }: FeedbackToastProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 md:p-8 z-50 animate-in slide-in-from-bottom-full duration-500 w-full">
      <div className={`max-w-2xl mx-auto rounded-[2.5rem] p-6 shadow-2xl backdrop-blur-xl border-t-2 ${isCorrect ? 'bg-emerald-50/90 border-emerald-100' : 'bg-rose-50/90 border-rose-100'}`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 ${isCorrect ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
              {isCorrect ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <div>
              <h3 className={`text-xl font-black ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                {isCorrect ? '¡Correcto!' : '¡Casi!'}
              </h3>
              <p className="text-sm font-bold text-slate-500">
                {isCorrect ? '¡Buen trabajo! Estás mejorando rápido.' : '¡No te preocupes, cada error es una lección!'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full px-5 sm:flex-row flex-col md:w-auto">
            <button
              onClick={onShowExplanation}
              className="flex-1 md:flex-none px-6 py-3.5 rounded-2xl font-bold text-math-dark-teal bg-white/50 hover:bg-white transition-all border border-slate-200"
            >
              Ver Explicación
            </button>
            <button
              onClick={onNext}
              className={`flex-1 md:flex-none px-10 py-3.5 rounded-2xl font-bold text-white transition-all shadow-lg ${isCorrect ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200' : 'bg-rose-500 hover:bg-rose-600 shadow-rose-200'}`}
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
