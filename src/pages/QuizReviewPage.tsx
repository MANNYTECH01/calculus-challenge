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
  explanation_math: string;
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
    checkReviewAvailability();
  }, [user, navigate]);

  const checkReviewAvailability = async () => {
    try {
      // Check if it's after August 17th, 2025 at 7:00 AM UTC (quiz results release)
      const reviewReleaseDate = new Date('2025-08-17T10:00:00Z');
      const now = new Date();
      
      if (now < reviewReleaseDate) {
        setCanViewReview(false);
        setLoading(false);
        return;
      }

      setCanViewReview(true);
      await fetchQuizData();
    } catch (error) {
      console.error('Error checking review availability:', error);
      toast({
        title: "Error",
        description: "Failed to load quiz review",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const fetchQuizData = async () => {
    try {
      // Fetch user's quiz attempt
      const { data: attemptData, error: attemptError } = await supabase
        .from('quiz_attempts')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (attemptError) {
        if (attemptError.code === 'PGRST116') {
          // No quiz attempt found
          setLoading(false);
          return;
        }
        throw attemptError;
      }

      setQuizAttempt(attemptData);

      // Extract question IDs from quiz data
      const quizData = attemptData.quiz_data as any;
      const questionIds = quizData?.questions?.map((q: any) => q.id) || [];
      
      if (questionIds.length === 0) {
        setLoading(false);
        return;
      }

      // Fetch all questions that were in the quiz
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .in('id', questionIds);

      if (questionsError) throw questionsError;

      setQuestions(questionsData || []);

      // Fetch explanations
      const { data: explanationsData, error: explanationsError } = await supabase
        .from('answer_explanations')
        .select('*')
        .in('question_id', questionIds);

      if (explanationsError) throw explanationsError;

      // Convert to record for easy lookup
      const explanationsRecord: Record<string, AnswerExplanation> = {};
      explanationsData?.forEach(exp => {
        explanationsRecord[exp.question_id] = exp;
      });
      setExplanations(explanationsRecord);

    } catch (error) {
      console.error('Error fetching quiz data:', error);
      toast({
        title: "Error",
        description: "Failed to load quiz data",
        variant: "destructive"
      });
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
    const quizData = quizAttempt?.quiz_data as any;
    const userAnswers = quizData?.userAnswers || [];
    const answer = userAnswers.find((a: any) => a.questionId === questionId);
    return answer?.answer || '';
  };

  const isCorrect = (questionId: string): boolean => {
    const question = questions.find(q => q.id === questionId);
    const userAnswer = getUserAnswer(questionId);
    return question?.correct_answer === userAnswer;
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
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Quiz Review
            </h1>
            <div className="hidden lg:flex">
              <Button variant="outline" onClick={() => navigate('/')}>
                Back to Home
              </Button>
            </div>
            <MobileNavigation />
          </div>
        </header>
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="py-12">
              <div className="text-center">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Quiz Review Not Available Yet</h3>
                <p className="text-muted-foreground">
                  Quiz review will be available after August 17th, 2025 at 10:00 AM.
                  <br />
                  Check back after the results are officially released!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!quizAttempt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Quiz Review
            </h1>
            <div className="hidden lg:flex">
              <Button variant="outline" onClick={() => navigate('/')}>
                Back to Home
              </Button>
            </div>
            <MobileNavigation />
          </div>
        </header>
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="py-12">
              <div className="text-center">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Quiz Attempt Found</h3>
                <p className="text-muted-foreground">
                  You haven't attempted the quiz yet or your attempt data is not available.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const percentage = Math.round((quizAttempt.score / quizAttempt.total_questions) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/')}
              className="lg:hidden"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Quiz Review
            </h1>
          </div>
          
          <div className="hidden lg:flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate('/')}>
              Back to Home
            </Button>
          </div>

          <MobileNavigation />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Score Summary */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-6 w-6" />
              <span>Quiz Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{quizAttempt.score}</div>
                <div className="text-sm text-muted-foreground">Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{quizAttempt.total_questions}</div>
                <div className="text-sm text-muted-foreground">Total Questions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{percentage}%</div>
                <div className="text-sm text-muted-foreground">Percentage</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{formatTime(quizAttempt.time_taken)}</div>
                <div className="text-sm text-muted-foreground">Time Taken</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions Review */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Question by Question Review</h2>
          
          {questions.map((question, index) => {
            const userAnswer = getUserAnswer(question.id);
            const correct = isCorrect(question.id);
            const explanation = explanations[question.id];

            return (
              <Card key={question.id} className={`border-l-4 ${correct ? 'border-l-green-500' : 'border-l-red-500'}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">
                      Question {index + 1}
                    </CardTitle>
                    <Badge variant={correct ? "default" : "destructive"}>
                      {correct ? (
                        <><CheckCircle2 className="h-4 w-4 mr-1" /> Correct</>
                      ) : (
                        <><XCircle className="h-4 w-4 mr-1" /> Incorrect</>
                      )}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Question Text */}
                  <div>
                    <h4 className="font-semibold mb-2">Question:</h4>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <MathText>{question.question_text}</MathText>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { key: 'A', text: question.option_a },
                      { key: 'B', text: question.option_b },
                      { key: 'C', text: question.option_c },
                      { key: 'D', text: question.option_d }
                    ].map((option) => (
                      <div 
                        key={option.key}
                        className={`p-3 rounded-lg border-2 ${
                          option.key === question.correct_answer 
                            ? 'border-green-500 bg-green-50 dark:bg-green-950' 
                            : option.key === userAnswer 
                              ? 'border-red-500 bg-red-50 dark:bg-red-950'
                              : 'border-muted bg-muted/30'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">{option.key}.</span>
                          <MathText>{option.text}</MathText>
                          {option.key === question.correct_answer && (
                            <CheckCircle2 className="h-4 w-4 text-green-600 ml-auto" />
                          )}
                          {option.key === userAnswer && option.key !== question.correct_answer && (
                            <XCircle className="h-4 w-4 text-red-600 ml-auto" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Answer Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/20 rounded-lg">
                    <div>
                      <span className="text-sm font-medium">Your Answer: </span>
                      <span className={`font-semibold ${correct ? 'text-green-600' : 'text-red-600'}`}>
                        {userAnswer || 'No answer'}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Correct Answer: </span>
                      <span className="font-semibold text-green-600">{question.correct_answer}</span>
                    </div>
                  </div>

                  {/* Explanation */}
                  {explanation && (
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <h5 className="font-semibold mb-2 text-primary">Explanation:</h5>
                      <div className="space-y-2">
                        <MathText>{explanation.explanation}</MathText>
                        {explanation.explanation_math && (
                          <div className="mt-2 p-2 bg-background rounded border">
                            <MathText>{explanation.explanation_math}</MathText>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Summary */}
        <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3">Quiz Completed</h3>
            <p className="text-muted-foreground mb-4">
              You completed the MTH 102 Calculus Quiz on {new Date(quizAttempt.submitted_at).toLocaleDateString()}.
              Your final score was {quizAttempt.score} out of {quizAttempt.total_questions} ({percentage}%).
            </p>
            <Button onClick={() => navigate('/leaderboard')}>
              View Leaderboard
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default QuizReviewPage;