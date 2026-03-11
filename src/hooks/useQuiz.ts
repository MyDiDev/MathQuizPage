import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';

type Difficulty = 'beginner' | 'intermediate' | 'advanced';

type Question = Database['public']['Tables']['questions']['Row'] & {
  options: Database['public']['Tables']['options']['Row'][];
};

export function useQuiz(difficulty?: Difficulty, seed?: string) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);

      let query = supabase
        .from('questions')
        .select(`
          *,
          options (*)
        `);

      if (difficulty) {
        query = query.eq('difficulty', difficulty);
      }

      const { data, error } = await query.limit(10);

      if (error) throw error;

      let shuffled = (data as Question[]);
      
      if (seed) {
        // Simple seeded shuffle
        const seedNum = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        shuffled = shuffled.sort((a, b) => {
          const pseudoA = Math.sin(seedNum + a.id.length) * 10000;
          const pseudoB = Math.sin(seedNum + b.id.length) * 10000;
          return (pseudoA % 1) - (pseudoB % 1);
        });
      } else {
        shuffled = shuffled.sort(() => Math.random() - 0.5);
      }
      
      setQuestions(shuffled);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [difficulty]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleSelectOption = (optionId: string) => {
    if (isAnswered) return;
    setSelectedOptionId(optionId);
    setIsAnswered(true);

    const isCorrect = questions[currentIndex].options.find(o => o.id === optionId)?.is_correct;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOptionId(null);
      setIsAnswered(false);
    } else {
      setIsAnswered(true);
      setCurrentIndex(questions.length);
    }
  };

  const currentQuestion = questions[currentIndex];
  const isCorrect = currentQuestion?.options.find(o => o.id === selectedOptionId)?.is_correct || false;

  return {
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
    nextQuestion,
  };
}
