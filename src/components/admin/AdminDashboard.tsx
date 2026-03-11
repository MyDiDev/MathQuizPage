import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/database';

type Question = Database['public']['Tables']['questions']['Row'] & {
   options: Database['public']['Tables']['options']['Row'][];
};

interface AdminDashboardProps {
   onBack: () => void;
}

export function AdminDashboard({ onBack }: AdminDashboardProps) {
   const [questions, setQuestions] = useState<Question[]>([]);
   const [loading, setLoading] = useState(true);
   const [isAdding, setIsAdding] = useState(false);


   const [newQuestion, setNewQuestion] = useState({
      text: '',
      explanation: '',
      difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
      options: [
         { text: '', is_correct: true },
         { text: '', is_correct: false },
         { text: '', is_correct: false },
         { text: '', is_correct: false },
      ]
   });

   useEffect(() => {
      fetchQuestions();
   }, []);

   async function fetchQuestions() {
      setLoading(true);
      const { data, error } = await supabase
         .from('questions')
         .select('*, options(*)');
      if (!error) setQuestions(data as Question[]);
      setLoading(false);
   }

   const handleAddQuestion = async () => {
      const { data: qData, error: qError } = await supabase
         .from('questions')
         .insert({
            question_text: newQuestion.text,
            explanation: newQuestion.explanation,
            difficulty: newQuestion.difficulty
         })
         .select()
         .single();

      if (qError) return alert(qError.message);

      const optionsToInsert = newQuestion.options.map(opt => ({
         question_id: qData.id,
         option_text: opt.text,
         is_correct: opt.is_correct
      }));

      const { error: optError } = await supabase.from('options').insert(optionsToInsert);
      if (optError) return alert(optError.message);

      setIsAdding(false);
      fetchQuestions();
   };

   const deleteQuestion = async (id: string) => {
      if (!confirm('¿Estás seguro?')) return;
      await supabase.from('questions').delete().eq('id', id);
      fetchQuestions();
   };

   return (
      <div className="min-h-screen bg-slate-50 p-6 lg:p-12">
         <div className="max-w-6xl mx-auto">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
               <div>
                  <button onClick={onBack} className="text-sm font-bold text-math-teal hover:underline mb-2 flex items-center gap-2">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                     </svg>
                     Volver al Menú
                  </button>
                  <h1 className="text-4xl font-black text-math-dark-teal">Gestión de Preguntas</h1>
               </div>

               <button
                  onClick={() => setIsAdding(true)}
                  className="px-6 py-3 bg-math-teal text-white rounded-2xl font-bold hover:bg-math-dark-teal transition-all flex items-center gap-2"
               >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Añadir Pregunta
               </button>
            </header>

            {isAdding && (
               <div className="bg-white p-8 rounded-3xl border-2 border-slate-100 mb-12 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
                  <h2 className="text-xl font-bold mb-6 text-math-dark-teal">Nuevo Desafío Matemático</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <div>
                           <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Texto de la Pregunta</label>
                           <textarea
                              value={newQuestion.text}
                              onChange={e => setNewQuestion({ ...newQuestion, text: e.target.value })}
                              className="w-full p-4 rounded-xl border-2 border-slate-100 focus:border-math-teal outline-none transition-all resize-none h-32"
                              placeholder="¿Qué tan probable es que..."
                           />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Explicación</label>
                           <textarea
                              value={newQuestion.explanation}
                              onChange={e => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                              className="w-full p-4 rounded-xl border-2 border-slate-100 focus:border-math-teal outline-none transition-all resize-none h-24"
                              placeholder="Al aplicar el teorema de..."
                           />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Dificultad</label>
                           <select
                              value={newQuestion.difficulty}
                              onChange={e => setNewQuestion({ ...newQuestion, difficulty: e.target.value as any })}
                              className="w-full p-4 rounded-xl border-2 border-slate-100 focus:border-math-teal outline-none transition-all"
                           >
                              <option value="beginner">Principiante</option>
                              <option value="intermediate">Intermedio</option>
                              <option value="advanced">Avanzado</option>
                           </select>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Opciones de Opción Múltiple</label>
                        {newQuestion.options.map((opt, idx) => (
                           <div key={idx} className="flex gap-3">
                              <input
                                 type="text"
                                 value={opt.text}
                                 onChange={e => {
                                    const opts = [...newQuestion.options];
                                    opts[idx].text = e.target.value;
                                    setNewQuestion({ ...newQuestion, options: opts });
                                 }}
                                 className="flex-1 p-4 rounded-xl border-2 border-slate-100 focus:border-math-teal outline-none"
                                 placeholder={`Opción ${idx + 1}`}
                              />
                              <button
                                 onClick={() => {
                                    const opts = newQuestion.options.map((o, i) => ({ ...o, is_correct: i === idx }));
                                    setNewQuestion({ ...newQuestion, options: opts });
                                 }}
                                 className={`px-4 rounded-xl font-bold transition-all ${opt.is_correct ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}
                              >
                                 Correcta
                              </button>
                           </div>
                        ))}

                        <div className="flex gap-4 pt-4">
                           <button onClick={handleAddQuestion} className="btn-primary flex-1">Guardar Pregunta</button>
                           <button onClick={() => setIsAdding(false)} className="btn-secondary flex-1">Cancelar</button>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            <div className="bg-white rounded-3xl border-2 border-slate-100 overflow-hidden shadow-sm">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-slate-50 border-b-2 border-slate-100">
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Pregunta</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Dificultad</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Opciones</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Acciones</th>
                     </tr>
                  </thead>
                  <tbody>
                     {questions.map(q => (
                        <tr key={q.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                           <td className="px-6 py-6 max-w-md">
                              <div className="font-bold text-math-dark-teal mb-1">{q.question_text}</div>
                              <div className="text-xs text-slate-400 line-clamp-1 italic">{q.explanation}</div>
                           </td>
                           <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter
                            ${q.difficulty === 'beginner' ? 'bg-emerald-100 text-emerald-700' :
                                    q.difficulty === 'intermediate' ? 'bg-sky-100 text-sky-700' : 'bg-rose-100 text-rose-700'}
                          `}>
                                 {q.difficulty === 'beginner' ? 'Principiante' : q.difficulty === 'intermediate' ? 'Intermedio' : 'Avanzado'}
                              </span>
                           </td>
                           <td className="px-6 py-4">
                              <div className="flex -space-x-2">
                                 {q.options.map(o => (
                                    <div key={o.id} title={o.option_text} className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold ${o.is_correct ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                                       {o.is_correct ? '✓' : ''}
                                    </div>
                                 ))}
                              </div>
                           </td>
                           <td className="px-6 py-4 text-right">
                              <button
                                 onClick={() => deleteQuestion(q.id)}
                                 className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                              >
                                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                 </svg>
                              </button>
                           </td>
                        </tr>
                     ))}
                     {!loading && questions.length === 0 && (
                        <tr>
                           <td colSpan={4} className="px-6 py-20 text-center text-slate-400 italic">No se encontraron preguntas. ¡Añade tu primer desafío!</td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
}
