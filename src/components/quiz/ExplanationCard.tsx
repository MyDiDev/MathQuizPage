interface ExplanationCardProps {
  explanation: string;
  onClose: () => void;
}

export function ExplanationCard({ explanation, onClose }: ExplanationCardProps) {
  return (
    <div className="fixed inset-0 bg-math-slate/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4 overflow-y-auto pt-16">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="p-6 border-b-2 border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-math-dark-teal">Explicación</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-8">
           <div className="prose prose-slate max-w-none">
              <div className="bg-math-mint/20 p-6 rounded-2xl border-2 border-math-teal/10 mb-6">
                 <p className="text-math-slate leading-relaxed font-medium">
                   {explanation}
                 </p>
              </div>
              
              <div className="space-y-4">
                 <h3 className="text-lg font-bold text-math-teal">Desglose Paso a Paso</h3>
                 <p className="text-sm text-slate-600">
                   Sigue estos pasos para llegar a la respuesta correcta:
                 </p>
                 <div className="space-y-3">
                    <div className="flex gap-4 items-start">
                       <div className="w-6 h-6 rounded-full bg-math-teal text-white flex-shrink-0 flex items-center justify-center text-xs font-bold">1</div>
                       <p className="text-sm text-math-slate">Analiza el problema e identifica los valores dados.</p>
                    </div>
                    <div className="flex gap-4 items-start">
                       <div className="w-6 h-6 rounded-full bg-math-teal text-white flex-shrink-0 flex items-center justify-center text-xs font-bold">2</div>
                       <p className="text-sm text-math-slate">Aplica la fórmula matemática o lógica relevante.</p>
                    </div>
                    <div className="flex gap-4 items-start">
                       <div className="w-6 h-6 rounded-full bg-math-teal text-white flex-shrink-0 flex items-center justify-center text-xs font-bold">3</div>
                       <p className="text-sm text-math-slate">Calcula cuidadosamente para verificar tu resultado.</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
        
        <div className="p-6 bg-slate-50 border-t-2 border-slate-100 flex justify-end">
           <button 
             onClick={onClose}
             className="bg-math-teal text-white px-8 py-3 rounded-2xl font-bold hover:bg-math-dark-teal transition-colors shadow-lg shadow-math-teal/20"
           >
             Entendido
           </button>
        </div>
      </div>
    </div>
  );
}
