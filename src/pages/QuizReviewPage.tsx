import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, CheckCircle2, XCircle, Clock, Target, BookOpen } from 'lucide-react';
import { MathText } from '@/components/MathRenderer';
import MobileNavigation from '@/components/MobileNavigation';

interface Question {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
}

interface QuizAttempt {
  id: string;
  score: number;
  total_questions: number;
  time_taken: number;
  quiz_data: any;
  submitted_at: string;
}

interface AnswerExplanation {
  id: string;
  question_id: string;
  explanation: string;
}

const QuizReviewPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quizAttempt, setQuizAttempt] = useState<QuizAttempt | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [explanations, setExplanations] = useState<Record<string, AnswerExplanation>>({});
  const [loading, setLoading] = useState(true);
  const [canViewReview, setCanViewReview] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    const reviewReleaseDate = new Date('2025-08-17T06:00:00Z');
    const now = new Date();

    if (now >= reviewReleaseDate) {
      setCanViewReview(true);
      fetchQuizData();
    } else {
      setCanViewReview(false);
      setLoading(false);
    }
  }, [user, navigate]);

  const fetchQuizData = async () => {
    try {
      const { data: attemptData, error: attemptError } = await supabase.from('quiz_attempts').select('*').eq('user_id', user?.id).single();
      if (attemptError && attemptError.code !== 'PGRST116') throw attemptError;
      if (!attemptData) { setLoading(false); return; }
      setQuizAttempt(attemptData);
      
      const questionIds = (attemptData.quiz_data as any)?.questions?.map((q: any) => q.id) || [];
      if (questionIds.length === 0) { setLoading(false); return; }

      const { data: questionsData, error: questionsError } = await supabase.from('questions').select('*').in('id', questionIds);
      if (questionsError) throw questionsError;
      setQuestions(questionsData || []);

      const { data: explanationsData, error: explanationsError } = await supabase.from('answer_explanations').select('*').in('question_id', questionIds);
      if (explanationsError) throw explanationsError;
      
      const explanationsRecord: Record<string, AnswerExplanation> = {};
      (explanationsData || []).forEach(exp => { explanationsRecord[exp.question_id] = exp; });
      setExplanations(explanationsRecord);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load quiz data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getUserAnswer = (questionId: string): string => {
    const userAnswers = (quizAttempt?.quiz_data as any)?.userAnswers || [];
    const answer = userAnswers.find((a: any) => a.questionId === questionId);
    return answer?.answer || '';
  };

  const isCorrect = (questionId: string): boolean => {
    const question = questions.find(q => q.id === questionId);
    return question?.correct_answer === getUserAnswer(questionId);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading quiz review...</div>;
  }

  if (!canViewReview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl md:text-2xl font-bold">Quiz Review</h1>
            <Button variant="outline" onClick={() => navigate('/')}>Back to Home</Button>
          </div>
        </header>
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-2xl mx-auto text-center p-8">
            <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Review Not Available Yet</h3>
            <p className="text-muted-foreground">Answers and explanations will be released on August 17th, 2025 at 7:00 AM.</p>
          </Card>
        </div>
      </div>
    );
  }

  if (!quizAttempt) {
    return (
      <div className="min-h-screen text-center p-8">
        <h2 className="text-xl font-semibold">No Quiz Attempt Found</h2>
        <p>You haven't attempted the quiz yet.</p>
      </div>
    );
  }

  const percentage = Math.round((quizAttempt.score / quizAttempt.total_questions) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold">Quiz Review</h1>
          <MobileNavigation />
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 space-y-8">
        <Card>
          <CardHeader><CardTitle>Your Results</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-primary">{percentage}%</p>
              <p className="text-sm text-muted-foreground">Final Score</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{quizAttempt.score}/{quizAttempt.total_questions}</p>
              <p className="text-sm text-muted-foreground">Correct</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{formatTime(quizAttempt.time_taken)}</p>
              <p className="text-sm text-muted-foreground">Time Taken</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{new Date(quizAttempt.submitted_at).toLocaleDateString()}</p>
              <p className="text-sm text-muted-foreground">Date Taken</p>
            </div>
          </CardContent>
        </Card>
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Question Breakdown</h2>
          {questions.map((question, index) => {
            const userAnswer = getUserAnswer(question.id);
            const correct = isCorrect(question.id);
            const explanation = explanations[question.id];
            return (
              <Card key={question.id} className={`border-l-4 ${correct ? 'border-green-500' : 'border-red-500'}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                    <Badge variant={correct ? "default" : "destructive"}>{correct ? "Correct" : "Incorrect"}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg"><MathText>{question.question_text}</MathText></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {['A', 'B', 'C', 'D'].map(opt => {
                      const optionText = question[`option_${opt.toLowerCase() as 'a'}`];
                      return (
                        <div key={opt} className={`p-3 rounded-lg border-2 ${question.correct_answer === opt ? 'border-green-500 bg-green-50' : userAnswer === opt ? 'border-red-500 bg-red-50' : 'border-muted'}`}>
                          <MathText>{`${opt}) ${optionText}`}</MathText>
                        </div>
                      );
                    })}
                  </div>
                  {explanation && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h3 className="font-semibold text-blue-800">Explanation:</h3>
                      <p className="text-sm text-blue-700 mt-2"><MathText>{explanation.explanation}</MathText></p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default QuizReviewPage;
