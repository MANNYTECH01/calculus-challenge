import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CountdownTimer from '@/components/CountdownTimer';
import AnnouncementBanner from '@/components/AnnouncementBanner';
import QuizRules from '@/components/QuizRules';
import PrizeStructure from '@/components/PrizeStructure';
import SupportChat from '@/components/SupportChat';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Trophy, BookOpen, Menu } from 'lucide-react';
import MobileNavigation from '@/components/MobileNavigation';

const HomePage: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [quizAvailable, setQuizAvailable] = useState(false);

  // Quiz date - set to a future date
  const quizDate = new Date('2025-08-16T00:00:00');
  useEffect(() => {
    const now = new Date();
    setQuizAvailable(now >= quizDate);
  }, []);

  const handleStartQuiz = () => {
    navigate('/quiz');
  };

  const handleViewLeaderboard = () => {
    navigate('/leaderboard');
  };

  const handleViewDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            MTH 102 (Calculus Quiz)
          </h1>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground hidden xl:block">
                  Welcome, <span className="font-semibold text-foreground">{user.user_metadata?.username || user.email}</span>
                </span>
                <Button variant="outline" onClick={handleViewDashboard}>
                  Dashboard
                </Button>
                <Button variant="ghost" onClick={signOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <Button onClick={() => navigate('/auth')}>
                Login / Sign Up
              </Button>
            )}
          </div>

          {/* Mobile Navigation */}
          <MobileNavigation />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-6 fade-in-up">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Calculus Challenge
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Test your knowledge of MTH 102 and compete for amazing cash prizes!
            </p>
          </div>

          {/* Countdown Timer */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-foreground">
              Quiz Starts In:
            </h3>
            <CountdownTimer 
              targetDate={quizDate}
              onComplete={() => console.log('Quiz time!')}
            />
          </div>
        </div>

        {/* Announcement Banner */}
        <AnnouncementBanner />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="text-center bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-6">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-foreground">Aug 16</div>
              <div className="text-sm text-muted-foreground">Quiz Date</div>
            </CardContent>
          </Card>
          
          <Card className="text-center bg-gradient-to-br from-accent/10 to-success/10 border-accent/20">
            <CardContent className="p-6">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-accent" />
              <div className="text-2xl font-bold text-foreground">40</div>
              <div className="text-sm text-muted-foreground">Questions</div>
            </CardContent>
          </Card>
          
          <Card className="text-center bg-gradient-to-br from-success/10 to-warning/10 border-success/20">
            <CardContent className="p-6">
              <Users className="h-8 w-8 mx-auto mb-2 text-success" />
              <div className="text-2xl font-bold text-foreground">60</div>
              <div className="text-sm text-muted-foreground">Minutes</div>
            </CardContent>
          </Card>
          
          <Card className="text-center bg-gradient-to-br from-warning/10 to-primary/10 border-warning/20">
            <CardContent className="p-6">
              <Trophy className="h-8 w-8 mx-auto mb-2 text-warning" />
              <div className="text-2xl font-bold text-foreground">₦20k</div>
              <div className="text-sm text-muted-foreground">Total Prizes</div>
            </CardContent>
          </Card>
        </div>

        {/* Quiz Rules */}
        <QuizRules />

        {/* Prize Structure */}
        <PrizeStructure />

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          {user ? (
            <>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white px-8 py-3 text-lg font-semibold"
                onClick={handleStartQuiz}
                disabled={!quizAvailable}
              >
                {quizAvailable ? 'Start Quiz' : 'Quiz Not Available Yet'}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={handleViewLeaderboard}
              >
                View Leaderboard
              </Button>
            </>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                Register and pay ₦1000 to participate in the quiz
              </p>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white"
                onClick={() => navigate('/auth')}
              >
                Register & Pay ₦1000
              </Button>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t bg-muted/50 py-8 mt-16">
        <div className="container mx-auto px-4 text-center space-y-4">
          <p className="text-muted-foreground">
            © 2025 MTH 102 Calculus Quiz. Good luck to all participants!
          </p>
          <div className="max-w-md mx-auto p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/20">
            <h4 className="font-semibold mb-2">Need Support?</h4>
            <p className="text-sm text-muted-foreground mb-2">
              For complaints or clarification, contact us at:
            </p>
            <a 
              href="mailto:schooltact01@gmail.com"
              className="text-primary hover:underline font-medium"
            >
              schooltact01@gmail.com
            </a>
          </div>
        </div>
      </footer>
      
      {/* Support Chat */}
      <SupportChat />
    </div>
  );
};

export default HomePage;