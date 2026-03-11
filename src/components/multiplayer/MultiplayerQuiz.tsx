import { useState, useEffect } from 'react';
import { useQuiz } from '../../hooks/useQuiz';
import { ProgressBar } from '../common/ProgressBar';
import { QuestionCard } from '../quiz/QuestionCard';
import { OptionButton } from '../quiz/OptionButton';
import { FeedbackToast } from '../quiz/FeedbackToast';
import { ExplanationCard } from '../quiz/ExplanationCard';
import { broadcastEvent, type MultiplayerEvent } from '../../services/multiplayerService';
import { type Player } from './MultiplayerLobby';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface MultiplayerQuizProps {
  roomName: string;
  initialPlayers: Player[];
  onFinish: () => void;
  channel: RealtimeChannel;
}

export function MultiplayerQuiz({ roomName, initialPlayers, onFinish, channel }: MultiplayerQuizProps) {
  const {
    questions,
    currentIndex,
    currentQuestion,
    selectedOptionId,
    isAnswered,
    isCorrect,
    score,
    loading,
    handleSelectOption,
    nextQuestion
  } = useQuiz(undefined, roomName); // Use roomName as seed for sync

  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    if (!channel) return;

    const subscription = channel.on('broadcast', { event: 'game_event' }, ({ payload }: { payload: MultiplayerEvent }) => {
      if (payload.type === 'PLAYER_SCORED') {
        setPlayers(prev => prev.map(p =>
          p.id === payload.playerId ? { ...p, score: payload.score } : p
        ));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [channel]);

  useEffect(() => {
    if (isAnswered && channel) {
      const myPlayer = initialPlayers.find(p => p.nickname === localStorage.getItem('quiz_nickname'));
      const myPlayerId = myPlayer?.id || 'local';
      broadcastEvent(channel, { type: 'PLAYER_SCORED', playerId: myPlayerId, score, isCorrect });
    }
  }, [score, isAnswered, channel, initialPlayers, isCorrect]);

  if (loading) return (
    <div className="min-h-screen bg-math-mint flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-math-teal border-t-transparent rounded-full animate-spin"></div>
        <span className="text-math-teal font-bold animate-pulse">Sincronizando Sala de Batalla...</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F0F7F6] selection:bg-math-teal/20 pb-40">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">

        <div className="lg:col-span-8">
          <header className="mb-12 flex items-center gap-6">
            <ProgressBar
              current={Math.min(currentIndex + 1, questions.length)}
              total={questions.length}
            />
          </header>

          <main>
            {currentQuestion && (
              <QuestionCard
                question={currentQuestion.question_text}
              >
                <div className="grid grid-cols-1 gap-1">
                  {currentQuestion.options.map((option, idx) => (
                    <OptionButton
                      key={option.id}
                      label={String.fromCharCode(65 + idx)}
                      text={option.option_text}
                      selected={selectedOptionId === option.id}
                      disabled={isAnswered}
                      correct={isAnswered && option.is_correct}
                      incorrect={isAnswered && !option.is_correct && selectedOptionId === option.id}
                      onClick={() => handleSelectOption(option.id)}
                    />
                  ))}
                </div>
              </QuestionCard>
            )}
          </main>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-slate-100 sticky top-12">
            <div className="mb-6">
              <h2 className="text-xl font-black text-math-dark-teal flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-math-teal font-black">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0V9.457c0-.621-.504-1.125-1.125-1.125h-.872M9.507 8.332V4.56c0-.621.504-1.125 1.125-1.125h.872c.621 0 1.125.504 1.125 1.125v3.771" />
                </svg>
                Clasificación
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Sala: {roomName}</p>
            </div>
            <div className="space-y-3">
              {players.sort((a, b) => b.score - a.score).map((p, idx) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 transition-all">
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-xs font-black text-slate-300">#{idx + 1}</span>
                    <span className="font-bold text-math-dark-teal text-sm">{p.nickname}</span>
                  </div>
                  <span className="font-black text-math-teal">{p.score * 100}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {isAnswered && currentIndex < questions.length && (
          <FeedbackToast
            isCorrect={isCorrect}
            onShowExplanation={() => setShowExplanation(true)}
            onNext={nextQuestion}
          />
        )}

        {showExplanation && currentQuestion && (
          <ExplanationCard
            explanation={currentQuestion.explanation || "No se proporcionó explicación."}
            onClose={() => setShowExplanation(false)}
          />
        )}

        {currentIndex >= questions.length && isAnswered && (
          <div className="fixed inset-0 bg-math-dark-teal/90 backdrop-blur-md z-[100] flex items-center justify-center p-6">
            <div className="bg-white rounded-[3rem] p-12 max-w-md w-full text-center shadow-2xl">
              <h2 className="text-4xl font-black text-math-dark-teal mb-2">Ranking Final</h2>
              <p className="text-slate-500 mb-8">¡La victoria pertenece a los matemáticamente superiores!</p>

              <div className="space-y-4 mb-10 text-left">
                {players.sort((a, b) => b.score - a.score).map((p, idx) => (
                  <div key={p.id} className={`flex items-center justify-between p-4 rounded-2xl ${idx === 0 ? 'bg-math-mint/50 border-2 border-math-teal/20' : 'bg-slate-50'}`}>
                    <div className="flex items-center gap-4">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black ${idx === 0 ? 'bg-math-teal text-white' : 'bg-slate-200 text-slate-500 text-xs'}`}>
                        {idx + 1}
                      </span>
                      <span className="font-bold text-math-dark-teal">{p.nickname}</span>
                    </div>
                    <span className="font-black text-math-teal">{p.score * 100} pts</span>
                  </div>
                ))}
              </div>

              <button onClick={onFinish} className="btn-primary w-full">Volver al Lobby</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
