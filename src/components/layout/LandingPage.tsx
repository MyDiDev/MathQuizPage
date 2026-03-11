interface LandingPageProps {
   onStartSinglePlayer: (difficulty: 'beginner' | 'intermediate' | 'advanced') => void;
   onJoinMultiplayer: () => void;
   onOpenAdmin: () => void;
   userRole: 'admin' | 'user' | null;
   onLogout: () => void;
}

export function LandingPage({ onStartSinglePlayer, onJoinMultiplayer, onOpenAdmin, userRole, onLogout }: LandingPageProps) {
   return (
      <div className="min-h-screen bg-math-mint flex flex-col items-center justify-center p-6 bg-[grid-slate-200/[0.05]] bg-[size:40px_40px]">
         <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent pointer-events-none" />

         <div className="absolute top-6 right-6 z-10">
            {userRole ? (
               <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end">
                     <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Conectado como</span>
                     <span className={`text-sm font-black ${userRole === 'admin' ? 'text-math-teal' : 'text-math-dark-teal'}`}>
                        {userRole === 'admin' ? 'Administrador' : 'Estudiante'}
                     </span>
                  </div>
                  <button
                     onClick={onLogout}
                     className="p-2 bg-white text-rose-500 rounded-xl border border-slate-100 shadow-sm hover:bg-rose-50 transition-all group"
                     title="Cerrar Sesión"
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 group-hover:scale-110 transition-transform">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                     </svg>
                  </button>
               </div>
            ) : (
               <button
                  onClick={onOpenAdmin}
                  className="px-6 py-2 bg-white text-math-teal rounded-xl font-bold shadow-sm border border-slate-100 hover:bg-slate-50 transition-all"
               >
                  Iniciar Sesión
               </button>
            )}
         </div>

         <div className="relative w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
               <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-math-teal/10 border border-math-teal/20 text-math-teal font-bold text-sm uppercase tracking-widest">
                  Matemáticas en la Vida Moderna
               </div>
               <h1 className="text-4xl lg:text-6xl font-black text-math-dark-teal leading-tight mb-6">
                  Domina las Matemáticas de la <span className="text-math-teal">Realidad.</span>
               </h1>
               <p className="text-md text-math-slate mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
                  Desde Criptografía hasta IA, pon a prueba tus habilidades en aplicaciones matemáticas del mundo real.
               </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                   {userRole === 'admin' && (
                      <button
                         onClick={onOpenAdmin}
                         className="p-4 bg-math-dark-teal text-white rounded-2xl font-bold shadow-xl shadow-math-dark-teal/20 hover:-translate-y-1 transition-all flex items-center gap-2"
                      >
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 12h11.25" />
                         </svg>
                         Gestionar Preguntas
                      </button>
                   )}
                  <button
                     onClick={onJoinMultiplayer}
                     className="p-4 bg-white border-2 border-slate-200 text-math-slate rounded-2xl font-bold hover:bg-slate-50 transition-all"
                  >
                     Unirse a Multijugador
                  </button>
               </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border-2 border-purple-800">
               <h2 className="text-2xl font-black text-math-dark-teal mb-8">Empieza un Desafío</h2>

               <div className="space-y-6">
                  <div>
                     <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Elige la Dificultad</p>
                     <div className="grid grid-cols-1 gap-3">
                        <button
                           onClick={() => onStartSinglePlayer('beginner')}
                           className="group flex items-center justify-between p-4 rounded-3xl border-2 border-slate-100 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-left"
                        >
                           <div>
                              <h3 className="font-bold text-math-dark-teal group-hover:text-emerald-700 transition-colors">Principiante</h3>
                              <p className="text-xs text-slate-500">Básicos de Aritmética y Lógica</p>
                           </div>
                           <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                 <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                              </svg>
                           </div>
                        </button>

                        <button
                           onClick={() => onStartSinglePlayer('intermediate')}
                           className="group flex items-center justify-between p-4 rounded-3xl border-2 border-slate-100 hover:border-math-teal hover:bg-math-mint/30 transition-all text-left"
                        >
                           <div>
                              <h3 className="font-bold text-math-dark-teal group-hover:text-math-teal transition-colors">Intermedio</h3>
                              <p className="text-xs text-slate-500">Álgebra y Probabilidad</p>
                           </div>
                           <div className="w-8 h-8 rounded-full bg-math-mint flex items-center justify-center text-math-teal">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                              </svg>
                           </div>
                        </button>

                        <button
                           onClick={() => onStartSinglePlayer('advanced')}
                           className="group flex items-center justify-between p-4 rounded-3xl border-2 border-slate-100 hover:border-math-dark-teal hover:bg-slate-50 transition-all text-left"
                        >
                           <div>
                              <h3 className="font-bold text-math-dark-teal transition-colors">Avanzado</h3>
                              <p className="text-xs text-slate-500">Cálculo y Criptografía</p>
                           </div>
                           <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                 <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                              </svg>
                           </div>
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
