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
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes in seconds
  const [isLoading, setIsLoading] = useState(true);
  const [quizStarted, setQuizStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const forceSubmitRef = useRef(false);

  // Generate device fingerprint
  const generateDeviceFingerprint = useCallback(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx?.fillText('fingerprint', 10, 10);
    const canvasFingerprint = canvas.toDataURL();
    
    return btoa(JSON.stringify({
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      screenWidth: screen.width,
      screenHeight: screen.height,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      canvas: canvasFingerprint.slice(-50) // Last 50 chars for brevity
    }));
  }, []);

  const submitQuiz = useCallback(async (forced = false) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    forceSubmitRef.current = true;

    try {
      // Calculate score
      let score = 0;
      const quizData = questions.map(question => {
        const userAnswer = userAnswers.find(a => a.questionId === question.id);
        const isCorrect = userAnswer?.answer === question.correct_answer;
        if (isCorrect) score++;
        
        return {
          questionId: question.id,
          questionText: question.question_text,
          correctAnswer: question.correct_answer,
          userAnswer: userAnswer?.answer || null,
          isCorrect
        };
      });

      const timeTaken = (60 * 60) - timeLeft;
      
      // Submit to database
      const { error } = await supabase
        .from('quiz_attempts')
        .insert({
          user_id: user?.id,
          score,
          total_questions: questions.length,
          time_taken: timeTaken,
          quiz_data: JSON.parse(JSON.stringify({
            questions: questions.map(q => ({ id: q.id, question_text: q.question_text })),
            userAnswers: userAnswers,
            violations: violations
          })),
          device_fingerprint: generateDeviceFingerprint(),
          ip_address: 'client-side', // Would be set by server in real app
          user_agent: navigator.userAgent,
          anti_cheat_violations: JSON.parse(JSON.stringify(violations))
        });

      if (error) throw error;

      // Update user profile to mark quiz as attempted
      await supabase
        .from('profiles')
        .update({
          has_attempted_quiz: true,
          quiz_completed_at: new Date().toISOString()
        })
        .eq('user_id', user?.id);

      toast({
        title: forced ? "Quiz Auto-Submitted" : "Quiz Submitted Successfully",
        description: `Your score: ${score}/${questions.length}`,
        variant: forced ? "destructive" : "default",
      });

      navigate('/leaderboard');
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast({
        title: "Submission Error",
        description: "Failed to submit quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [questions, userAnswers, timeLeft, user?.id, navigate, generateDeviceFingerprint, isSubmitting]);

  const { violations, addViolation } = useAntiCheat({
    enabled: quizStarted,
    onViolation: (violation) => {
      console.log('Anti-cheat violation:', violation);
    },
    onForceSubmit: () => {
      if (!forceSubmitRef.current) {
        submitQuiz(true);
      }
    }
  });

  // Load questions and check if user has already attempted
  useEffect(() => {
    const loadData = async () => {
      try {
        // Check if user has already attempted quiz
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('has_attempted_quiz, payment_verified')
          .eq('user_id', user?.id)
          .single();

        if (profileError) throw profileError;

        setUserProfile(profileData);

        if (profileData.has_attempted_quiz) {
          setHasAttempted(true);
          setIsLoading(false);
          return;
        }

        if (!profileData.payment_verified) {
          toast({
            title: "Payment Required",
            description: "You need to complete payment verification before taking the quiz.",
            variant: "destructive",
          });
          navigate('/dashboard');
          return;
        }

        // Load questions if user hasn't attempted and payment is verified
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .limit(40);

        if (error) throw error;

        // Randomize questions
        const shuffled = [...(data || [])].sort(() => Math.random() - 0.5);
        setQuestions(shuffled);
      } catch (error) {
        console.error('Error loading quiz data:', error);
        toast({
          title: "Error",
          description: "Failed to load quiz. Please try again.",
          variant: "destructive",
        });
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadData();
    } else {
      navigate('/auth');
    }
  }, [user, navigate]);

  // Timer effect
  useEffect(() => {
    if (!quizStarted) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          submitQuiz(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [quizStarted, submitQuiz]);

  // Add quiz mode class to body
  useEffect(() => {
    if (quizStarted) {
      document.body.classList.add('quiz-mode');
      return () => document.body.classList.remove('quiz-mode');
    }
  }, [quizStarted]);

  const startQuiz = () => {
    setQuizStarted(true);
    toast({
      title: "Quiz Started",
      description: "Good luck! Remember, you cannot pause or restart.",
    });
  };

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

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

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
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Quiz Access Denied
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
                <Shield className="h-12 w-12 mx-auto text-warning mb-4" />
                <h3 className="text-xl font-semibold mb-2">Quiz Already Attempted</h3>
                <p className="text-muted-foreground mb-6">
                  You have already completed the quiz. Each participant is allowed only one attempt.
                  <br />
                  Check the leaderboard for your results or wait for the detailed review to be available.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="outline" onClick={() => navigate('/leaderboard')}>
                    View Leaderboard
                  </Button>
                  <Button onClick={() => navigate('/quiz-review')}>
                    View Quiz Review
                  </Button>
                </div>
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
        <Card className="max-w-2xl w-full bg-card/50 backdrop-blur-sm border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Ready to Start Quiz?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-primary/10 rounded-lg">
                <Clock className="h-6 w-6 text-primary" />
                <div>
                  <div className="font-semibold">Duration</div>
                  <div className="text-sm text-muted-foreground">60 minutes</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-accent/10 rounded-lg">
                <Shield className="h-6 w-6 text-accent" />
                <div>
                  <div className="font-semibold">Questions</div>
                  <div className="text-sm text-muted-foreground">{questions.length} questions</div>
                </div>
              </div>
            </div>

            <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
                <div className="space-y-2">
                  <div className="font-semibold text-warning">Important Warnings:</div>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Once started, you cannot pause or restart</li>
                    <li>• Tab switching will auto-submit your quiz</li>
                    <li>• Screenshots during the quiz will be detected and will result in disqualification</li>
                    <li>• Copying is disabled</li>
                    <li>• You have only one attempt</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/')}>
                Go Back
              </Button>
              <Button 
                onClick={startQuiz}
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              >
                Start Quiz Now
              </Button>
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
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="text-xl font-bold text-primary">
              MTH 102 Quiz
            </div>
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
          
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </header>

      {/* Quiz Content */}
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
                const optionText = currentQuestion?.[`option_${option.toLowerCase()}` as keyof Question] as string;
                const isSelected = currentAnswer === option;
                
                return (
                  <Button
                    key={option}
                    variant={isSelected ? "default" : "outline"}
                    className={`p-4 h-auto text-left justify-start ${
                      isSelected ? 'bg-primary text-primary-foreground' : ''
                    }`}
                    onClick={() => handleAnswerSelect(option)}
                  >
                    <span className="font-semibold mr-3">{option}.</span>
                    <MathText>{optionText || ''}</MathText>
                  </Button>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-6">
              <Button
                variant="outline"
                onClick={goToPreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>

              <div className="text-sm text-muted-foreground">
                {userAnswers.length} of {questions.length} answered
              </div>

              {currentQuestionIndex === questions.length - 1 ? (
                <Button
                  onClick={() => submitQuiz(false)}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-success to-accent hover:from-success/90 hover:to-accent/90"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                </Button>
              ) : (
                <Button
                  onClick={goToNextQuestion}
                  disabled={currentQuestionIndex === questions.length - 1}
                >
                  Next
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Security Status */}
        <div className="max-w-4xl mx-auto mt-4">
          <Card className="bg-warning/5 border-warning/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 text-sm">
                <Shield className="h-4 w-4 text-warning" />
                <span className="text-warning font-semibold">Security Active:</span>
                <span className="text-muted-foreground">
                  Anti-cheat monitoring enabled • {violations.length} violations detected
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default QuizPage;