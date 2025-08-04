import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, Clock, Target, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface LeaderboardEntry {
  id: string;
  score: number;
  total_questions: number;
  time_taken: number;
  submitted_at: string;
  user_id: string;
  profiles: {
    username: string;
  };
}

const LeaderboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Check if it's after August 17th, 2025 at 1:00 AM UTC
        const releaseDate = new Date('2025-08-17T10:00:00Z');
        const now = new Date();
        
        if (now < releaseDate) {
          setLeaderboard([]);
          setLoading(false);
          return;
        }

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

        // Transform the data to match LeaderboardEntry interface
        const transformedData = data?.map((attempt: any) => ({
          id: attempt.id,
          score: attempt.score,
          total_questions: attempt.total_questions,
          time_taken: attempt.time_taken,
          submitted_at: attempt.submitted_at,
          user_id: attempt.user_id,
          profiles: {
            username: attempt.profiles?.username || 'Anonymous'
          }
        })) || [];

        setLeaderboard(transformedData);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black">1st Place</Badge>;
      case 2:
        return <Badge className="bg-gradient-to-r from-gray-300 to-gray-500 text-black">2nd Place</Badge>;
      case 3:
        return <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-black">3rd Place</Badge>;
      default:
        return <Badge variant="outline">#{rank}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            🏆 Top 10 Leaderboard
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            MTH 102 Calculus Quiz Competition - August 16th, 2025
            <br />
            Leaderboard available from August 17th, 2025 at 10:00 AM
            <br />
            Winner will be announced on August 17th, 2025 at 10:00 AM
          </p>
        </div>

        {/* Leaderboard */}
        <div className="max-w-4xl mx-auto space-y-4">
          {leaderboard.length === 0 ? (
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardContent className="py-12">
                <div className="text-center">
                  <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Leaderboard Coming Soon</h3>
                  <p className="text-muted-foreground">
                    The leaderboard will be displayed publicly on August 17th, 2025 at 10:00 AM.
                    <br />
                    Complete the quiz to compete for the top positions!
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            leaderboard.map((entry, index) => {
              const rank = index + 1;
              const percentage = Math.round((entry.score / entry.total_questions) * 100);
              const isCurrentUser = user?.id === entry.user_id;

              return (
                <Card 
                  key={entry.id} 
                  className={`bg-card/50 backdrop-blur-sm transition-all hover:shadow-lg ${
                    isCurrentUser ? 'ring-2 ring-primary' : ''
                  } ${rank <= 3 ? 'border-primary/30' : ''}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {getRankIcon(rank)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className={`font-semibold ${isCurrentUser ? 'text-primary' : ''}`}>
                              {entry.profiles.username}
                              {isCurrentUser && <span className="text-sm text-primary ml-2">(You)</span>}
                            </h3>
                            {getRankBadge(rank)}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Target className="h-4 w-4" />
                              <span>{entry.score}/{entry.total_questions} ({percentage}%)</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{formatTime(entry.time_taken)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(entry.submitted_at)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {entry.score}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          points
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Navigation */}
        <div className="text-center mt-8">
          <Button onClick={() => navigate('/')} variant="outline">
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;