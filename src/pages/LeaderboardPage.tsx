import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, Medal, Award, ArrowLeft } from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  score: number;
  total_questions: number;
  time_taken: number;
  submitted_at: string;
  profiles: {
    username: string;
  };
}

const LeaderboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const { data, error } = await supabase
          .from('quiz_attempts')
          .select(`
            id,
            score,
            total_questions,
            time_taken,
            submitted_at,
            user_id,
            profiles!inner(username)
          `)
          .order('score', { ascending: false })
          .order('time_taken', { ascending: true })
          .limit(10);

        if (error) throw error;
        setLeaderboard(data || []);
      } catch (error) {
        console.error('Error loading leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, []);

  const getMedalIcon = (position: number) => {
    switch (position) {
      case 1: return <Trophy className="h-6 w-6 medal-gold" />;
      case 2: return <Medal className="h-6 w-6 medal-silver" />;
      case 3: return <Award className="h-6 w-6 medal-bronze" />;
      default: return <span className="w-6 text-center font-bold">{position}</span>;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Leaderboard
          </h1>
          <Button variant="outline" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">
              🏆 Top Performers
            </CardTitle>
            <p className="text-muted-foreground">
              Congratulations to our quiz champions!
            </p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading leaderboard...</p>
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No quiz attempts yet. Be the first to take the quiz!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {leaderboard.map((entry, index) => {
                  const position = index + 1;
                  const percentage = ((entry.score / entry.total_questions) * 100).toFixed(1);
                  
                  return (
                    <div
                      key={entry.id}
                      className={`flex items-center space-x-4 p-4 rounded-lg border ${
                        position <= 3 
                          ? 'bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30' 
                          : 'bg-muted/20 border-muted'
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {getMedalIcon(position)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-foreground">
                          {entry.profiles?.username || 'Anonymous'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(entry.submitted_at).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-bold text-lg">
                          {entry.score}/{entry.total_questions}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {percentage}% • {formatTime(entry.time_taken)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default LeaderboardPage;