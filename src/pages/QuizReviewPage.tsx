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
  explanation?: string;
}

interface QuizAttempt {
  id: string;
  score: number;
  total_questions: number;
  time_taken: number;
  quiz_data: any;
  submitted_at: string;
}

const QuizReviewPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quizAttempt, setQuizAttempt] = useState<QuizAttempt | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [canViewReview, setCanViewReview] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    const reviewReleaseDate = new Date('2025-08-11T06:00:00Z'); // 7:00 AM WAT
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
    if (!user) return;
    try {
      const { data: attemptData, error: attemptError } = await supabase.from('quiz_attempts').select('*').eq('user_id', user.id).single();
      if (attemptError && attemptError.code !== 'PGRST116') throw attemptError;
      if (!attemptData) { setLoading(false); return; }
      setQuizAttempt(attemptData);
      
      const questionIds = (attemptData.quiz_data as any)?.questions?.map((q: any) => q.id) || [];
      if (questionIds.length === 0) { setLoading(false); return; }

      const { data: questionsData, error: questionsError } = await supabase.from('questions').select('*').in('id', questionIds);
      if (questionsError) throw questionsError;
      
      const questionMap = new Map(questionsData.map(q => [q.id, q]));
      const sortedQuestions = questionIds.map((id: string) => questionMap.get(id)).filter(Boolean);

      setQuestions(sortedQuestions as Question[]);

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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading quiz review...</p>
        </div>
      </div>
    );
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
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
         <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl md:text-2xl font-bold">Quiz Review</h1>
            <Button variant="outline" onClick={() => navigate('/')}>Back to Home</Button>
          </div>
        </header>
        <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto text-center p-8">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold">No Quiz Attempt Found</h2>
          <p className="text-muted-foreground mt-2">You haven't attempted the quiz yet. Once you do, you can review it here after the review period begins.</p>
        </Card>
        </div>
      </div>
    );
  }

  const percentage = Math.round((quizAttempt.score / quizAttempt.total_questions) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/')}
                className="lg:hidden"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl md:text-2xl font-bold">Quiz Review</h1>
          </div>
          <div className="hidden lg:flex">
             <Button variant="outline" onClick={() => navigate('/')}>Back to Home</Button>
          </div>
          <div className="lg:hidden">
            <MobileNavigation />
          </div>
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
                      const optionKey = `option_${opt.toLowerCase() as 'a' | 'b' | 'c' | 'd'}`;
                      const optionText = question[optionKey as keyof Question] as string;
                      const isCorrectAnswer = question.correct_answer === opt;
                      const isUserAnswer = userAnswer === opt;

                      let itemClass = 'border-muted';
                      if (isCorrectAnswer) {
                        itemClass = 'border-green-500 bg-green-50 dark:bg-green-900/20';
                      } else if (isUserAnswer && !isCorrectAnswer) {
                        itemClass = 'border-red-500 bg-red-50 dark:bg-red-900/20';
                      }

                      return (
                        <div key={opt} className={`p-3 rounded-lg border-2 flex items-start gap-2 ${itemClass}`}>
                           {isCorrectAnswer && <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />}
                           {isUserAnswer && !isCorrectAnswer && <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-1" />}
                           {!isCorrectAnswer && !isUserAnswer && <div className="w-5 h-5 flex-shrink-0" />}
                          <div className="flex-1">
                            <MathText>{`${opt}) ${optionText}`}</MathText>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {question.explanation && (
                    <div className="p-4 bg-sky-50 dark:bg-sky-900/20 border-l-4 border-sky-500 rounded-r-lg mt-4">
                      <h4 className="font-bold text-sky-800 dark:text-sky-300 flex items-center gap-2"><BookOpen className="h-4 w-4" />Explanation:</h4>
                      <div className="text-sm text-muted-foreground mt-2 pl-6">
                        <MathText>{question.explanation}</MathText>
                      </div>
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