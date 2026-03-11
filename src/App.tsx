import { useState, useEffect } from 'react';
import { useQuiz } from './hooks/useQuiz';
import { ProgressBar } from './components/common/ProgressBar';
import { QuestionCard } from './components/quiz/QuestionCard';
import { OptionButton } from './components/quiz/OptionButton';
import { FeedbackToast } from './components/quiz/FeedbackToast';
import { ExplanationCard } from './components/quiz/ExplanationCard';
import { LandingPage } from './components/layout/LandingPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { MultiplayerLobby, type Player } from './components/multiplayer/MultiplayerLobby';
import { MultiplayerQuiz } from './components/multiplayer/MultiplayerQuiz';
import { supabase } from './lib/supabase';
import type { RealtimeChannel, Session } from '@supabase/supabase-js';
import { AuthPanel } from './components/auth/AuthPanel';

type AppState = 'landing' | 'quiz' | 'multiplayer' | 'multiplayer-active' | 'admin' | 'auth';
type Role = 'admin' | 'user' | null;
type Difficulty = 'beginner' | 'intermediate' | 'advanced';

function App() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | undefined>();

  const [roomName, setRoomName] = useState('');
  const [multiplayerPlayers, setMultiplayerPlayers] = useState<Player[]>([]);
  const [activeChannel, setActiveChannel] = useState<RealtimeChannel | null>(null);

  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchRole(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchRole(session.user.id);
      } else {
        setRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchRole(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (!error && data) {
      setRole(data.role as Role);
    }
  }

  const {
    questions,
    currentIndex,
    currentQuestion,
    selectedOptionId,
    isAnswered,
    isCorrect,
    score,
    loading,
    error,
    handleSelectOption,
    nextQuestion
  } = useQuiz(selectedDifficulty, roomName);

  const [showExplanation, setShowExplanation] = useState(false);


  const startSinglePlayer = (diff: Difficulty) => {
    setSelectedDifficulty(diff);
    setAppState('quiz');
  };

  const backToMenu = () => {
    if (activeChannel) {
      activeChannel.unsubscribe();
    }
    setAppState('landing');
    setSelectedDifficulty(undefined);
    setShowExplanation(false);
    setRoomName('');
    setMultiplayerPlayers([]);
    setActiveChannel(null);
  };

  const startMultiplayerGame = (name: string, players: Player[]) => {
    setRoomName(name);
    setMultiplayerPlayers(players);
    const channel = supabase.channel(`room:${name}`);
    setActiveChannel(channel);
    setAppState('multiplayer-active');
  };


  if (appState === 'admin') {
    return <AdminDashboard onBack={backToMenu} />;
  }

  if (appState === 'landing') {
    return (
      <>
        <LandingPage
          onStartSinglePlayer={startSinglePlayer}
          onJoinMultiplayer={() => setAppState('multiplayer')}
          onOpenAdmin={() => {
            if (role === 'admin') {
              setAppState('admin');
            } else {
              setShowAuth(true);
            }
          }}
          userRole={role}
          onLogout={() => supabase.auth.signOut()}
        />
        {showAuth && !session && (
          <AuthPanel
            onSuccess={() => setShowAuth(false)}
            onCancel={() => setShowAuth(false)}
          />
        )}
      </>
    );
  }

  if (appState === 'multiplayer') {
    return (
      <MultiplayerLobby
        onStartGame={startMultiplayerGame}
        onBack={backToMenu}
      />
    );
  }

  if (appState === 'multiplayer-active' && activeChannel) {
    return (
      <MultiplayerQuiz
        roomName={roomName}
        initialPlayers={multiplayerPlayers}
        onFinish={backToMenu}
        channel={activeChannel}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-math-mint flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-math-teal border-t-transparent rounded-full animate-spin"></div>
          <span className="text-math-teal font-bold animate-pulse">Cargando Quiz de {selectedDifficulty === 'beginner' ? 'Principiante' : selectedDifficulty === 'intermediate' ? 'Intermedio' : 'Avanzado'}...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-math-mint flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md">
          <h2 className="text-2xl font-bold text-rose-500 mb-2">Error</h2>
          <p className="text-math-slate mb-6">{error}</p>
          <button
            onClick={backToMenu}
            className="btn-primary w-full"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  if (currentIndex >= questions.length && isAnswered) {
    return (
      <div className="min-h-screen bg-math-mint flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl text-center max-w-md w-full border border-slate-100">
          <div className="w-24 h-24 bg-math-teal/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-math-teal">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0V9.457c0-.621-.504-1.125-1.125-1.125h-.872M9.507 8.332V4.56c0-.621.504-1.125 1.125-1.125h.872c.621 0 1.125.504 1.125 1.125v3.771" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-math-dark-teal mb-2">¡Quiz Terminado!</h2>
          <p className="text-math-slate mb-8">
            ¡Dominaste <span className="font-black text-math-teal text-3xl">{score}</span> de {questions.length} desafíos!
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Desafiar de Nuevo
            </button>
            <button
              onClick={backToMenu}
              className="btn-secondary"
            >
              Volver al Lobby
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F7F6] selection:bg-math-teal/20 pb-40">
      <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
        <header className="mb-12 flex items-center gap-6">
          <button onClick={backToMenu} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-math-slate">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </button>
          <div className="flex-1">
            <ProgressBar
              current={Math.min(currentIndex + 1, questions.length)}
              total={questions.length}
            />
          </div>
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
      </div>
    </div>
  );
}

export default App;
