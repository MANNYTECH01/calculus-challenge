import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { useAntiCheat } from '@/hooks/useAntiCheat';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Clock, AlertTriangle, Shield, ArrowLeft } from 'lucide-react';
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
  category: string;
}

interface UserAnswer {
  questionId: string;
  answer: string;
}

const QuizPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes
  const [isLoading, setIsLoading] = useState(true);
  const [quizStarted, setQuizStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const forceSubmitRef = useRef(false);

  const generateDeviceFingerprint = useCallback(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.fillText('fingerprint', 10, 10);
    }
    const canvasFingerprint = canvas.toDataURL();
    
    return btoa(JSON.stringify({
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenWidth: screen.width,
      screenHeight: screen.height,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      canvas: canvasFingerprint.slice(-50)
    }));
  }, []);

  const { violations } = useAntiCheat({
    enabled: quizStarted,
    onForceSubmit: () => submitQuiz(true)
  });

  const submitQuiz = useCallback(async (forced = false) => {
    if (isSubmitting || forceSubmitRef.current) return;
    setIsSubmitting(true);
    forceSubmitRef.current = true;

    try {
      let score = 0;
      questions.forEach(question => {
        const userAnswer = userAnswers.find(a => a.questionId === question.id);
        if (userAnswer?.answer === question.correct_answer) {
          score++;
        }
      });

      const timeTaken = (60 * 60) - timeLeft;
      
      await supabase.from('quiz_attempts').insert({
        user_id: user?.id,
        score,
        total_questions: questions.length,
        time_taken: timeTaken,
        quiz_data: { 
          questions: questions.map(q => ({ id: q.id })), 
          userAnswers: userAnswers.map(ua => ({ questionId: ua.questionId, answer: ua.answer }))
        } as any,
        device_fingerprint: generateDeviceFingerprint(),
        user_agent: navigator.userAgent,
        anti_cheat_violations: violations as any
      });

      await supabase.from('profiles').update({ has_attempted_quiz: true, quiz_completed_at: new Date().toISOString() }).eq('user_id', user?.id);

      // This is the updated toast notification
      const percentage = Math.round((score / questions.length) * 100);
      toast({
        title: forced ? "Quiz Auto-Submitted" : "Quiz Submitted Successfully",
        description: `Your score: ${score}/${questions.length} (${percentage}%)`,
        variant: forced ? "destructive" : "default",
      });

      navigate('/leaderboard');
    } catch (error) {
      toast({ title: "Submission Error", description: "Failed to submit quiz.", variant: "destructive" });
      setIsSubmitting(false);
      forceSubmitRef.current = false;
    }
  }, [questions, userAnswers, timeLeft, user?.id, navigate, generateDeviceFingerprint, isSubmitting, violations]);

  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        navigate('/auth');
        return;
      }

      const quizStartDate = new Date('2025-08-11T00:00:00Z');
      const quizEndDate = new Date('2025-08-16T23:59:59Z');
      const now = new Date();

      if (now < quizStartDate || now > quizEndDate) {
        toast({ title: "Quiz Not Available", description: "The quiz can only be taken on August 16th, 2025.", variant: "destructive" });
        navigate('/');
        return;
      }

      try {
        const { data: profileData, error: profileError } = await supabase.from('profiles').select('has_attempted_quiz, payment_verified').eq('user_id', user.id).single();
        if (profileError) throw profileError;

        if (profileData.has_attempted_quiz) {
          setHasAttempted(true);
          setIsLoading(false);
          return;
        }

        if (!profileData.payment_verified) {
          toast({ title: "Payment Required", description: "You must complete payment to take the quiz.", variant: "destructive" });
          navigate('/dashboard');
          return;
        }

        // Fetch questions based on categories
        const categories = { functions: 3, limits: 7, differentiation: 16, integration: 13, applications: 1 };
        const fetchedQuestions: Question[] = [];

        for (const [category, count] of Object.entries(categories)) {
            const { data, error } = await supabase
              .from('questions')
              .select('*')
              .eq('category', category)
              .limit(count);
            if (error) throw error;
            if (data) fetchedQuestions.push(...data);
        }
        
        setQuestions(fetchedQuestions.sort(() => Math.random() - 0.5)); // Shuffle the final set
      } catch (error) {
        toast({ title: "Error", description: "Failed to load quiz questions.", variant: "destructive" });
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [user, navigate]);

  useEffect(() => {
    if (!quizStarted || timeLeft <= 0) {
      if(timerRef.current) clearInterval(timerRef.current);
      return;
    };

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if(timerRef.current) clearInterval(timerRef.current);
          submitQuiz(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [quizStarted, timeLeft, submitQuiz]);

  const startQuiz = () => setQuizStarted(true);

  const handleAnswerSelect = (answer: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    setUserAnswers(prev => {
      const existing = prev.findIndex(a => a.questionId === currentQuestion.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing].answer = answer;
        return updated;
      }
      return [...prev, { questionId: currentQuestion.id, answer }];
    });
  };

  const goToNextQuestion = () => setCurrentQuestionIndex(prev => Math.min(prev + 1, questions.length - 1));
  const goToPreviousQuestion = () => setCurrentQuestionIndex(prev => Math.max(prev - 1, 0));
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (hasAttempted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl md:text-2xl font-bold">Quiz Access Denied</h1>
            <MobileNavigation />
          </div>
        </header>
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="py-12 text-center">
              <Shield className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Quiz Already Attempted</h3>
              <p className="text-muted-foreground mb-6">
                You have already completed the quiz. Each participant is allowed only one attempt.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" onClick={() => navigate('/leaderboard')}>View Leaderboard</Button>
                <Button onClick={() => navigate('/quiz-review')}>View Quiz Review</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Ready to Start Quiz?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
                <Clock className="h-6 w-6 text-primary" />
                <div>
                  <div className="font-semibold">Duration</div>
                  <div className="text-sm text-muted-foreground">60 minutes</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
                <Shield className="h-6 w-6 text-primary" />
                <div>
                  <div className="font-semibold">Questions</div>
                  <div className="text-sm text-muted-foreground">{questions.length} questions</div>
                </div>
              </div>
            </div>
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                <div>
                  <div className="font-semibold text-destructive">Important Warnings:</div>
                  <ul className="text-sm space-y-1 text-muted-foreground list-disc pl-5 mt-2">
                    <li>Once started, you cannot pause or restart.</li>
                    <li>Switching tabs will auto-submit your quiz.</li>
                    <li>Screenshots and copying are disabled and monitored.</li>
                    <li>You have only one attempt.</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/')}>Go Back</Button>
              <Button onClick={startQuiz} className="bg-primary hover:bg-primary/90">Start Quiz Now</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = userAnswers.find(a => a.questionId === currentQuestion?.id)?.answer;
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 no-select">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="text-xl font-bold text-primary">MTH 102 Quiz</div>
            <div className="flex items-center space-x-6">
              <div className="text-lg font-mono bg-primary/10 px-3 py-1 rounded-lg">
                <Clock className="inline h-4 w-4 mr-2" />
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
            </div>
          </div>
          <div className="mt-4"><Progress value={progress} className="h-2" /></div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl">
              <MathText>{currentQuestion?.question_text || ''}</MathText>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              {['A', 'B', 'C', 'D'].map((option) => {
                const optionKey = `option_${option.toLowerCase() as 'a'}`;
                const optionText = currentQuestion?.[optionKey as keyof Question] as string;
                return (
                  <Button
                    key={option}
                    variant={currentAnswer === option ? "default" : "outline"}
                    className="p-4 h-auto text-left justify-start"
                    onClick={() => handleAnswerSelect(option)}
                  >
                    <span className="font-semibold mr-3">{option}.</span>
                    <MathText>{optionText || ''}</MathText>
                  </Button>
                );
              })}
            </div>
            <div className="flex justify-between items-center pt-6">
              <Button onClick={goToPreviousQuestion} disabled={currentQuestionIndex === 0} variant="outline">Previous</Button>
              <div className="text-sm text-muted-foreground">{userAnswers.length} of {questions.length} answered</div>
              {currentQuestionIndex === questions.length - 1 ? (
                <Button onClick={() => submitQuiz(false)} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">Submit Quiz</Button>
              ) : (
                <Button onClick={goToNextQuestion}>Next</Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default QuizPage;
