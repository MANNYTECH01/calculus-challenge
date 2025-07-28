import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, Medal, Award } from 'lucide-react';

interface Prize {
  position: number;
  prize_amount: number;
  prize_description: string;
}

const PrizeStructure: React.FC = () => {
  const [prizes, setPrizes] = useState<Prize[]>([]);

  useEffect(() => {
    loadPrizes();
  }, []);

  const loadPrizes = async () => {
    try {
      const { data, error } = await supabase
        .from('prize_structure')
        .select('*')
        .order('position', { ascending: true });

      if (error) throw error;
      setPrizes(data || []);
    } catch (error) {
      console.error('Error loading prizes:', error);
    }
  };

  const getIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <Award className="h-6 w-6 text-muted-foreground" />;
    }
  };

  const getPositionEmoji = (position: number) => {
    switch (position) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return '🏅';
    }
  };

  const getPositionColor = (position: number) => {
    switch (position) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/20 to-yellow-400/20 border-yellow-500/30';
      case 2:
        return 'bg-gradient-to-r from-gray-400/20 to-gray-300/20 border-gray-400/30';
      case 3:
        return 'bg-gradient-to-r from-amber-600/20 to-amber-500/20 border-amber-600/30';
      default:
        return 'bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20';
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          🏆 Prize Structure
        </CardTitle>
        <p className="text-center text-muted-foreground">
          Top performers will be rewarded for their excellence
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {prizes.map((prize) => (
            <div
              key={prize.position}
              className={`flex items-center justify-between p-4 rounded-lg border ${getPositionColor(
                prize.position
              )}`}
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {getIcon(prize.position)}
                  <span className="text-2xl">{getPositionEmoji(prize.position)}</span>
                </div>
                <div>
                  <div className="font-semibold text-lg">
                    {prize.position === 1 && '1st Place'}
                    {prize.position === 2 && '2nd Place'}
                    {prize.position === 3 && '3rd Place'}
                    {prize.position > 3 && `${prize.position}th Place`}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Position {prize.position}
                  </div>
                </div>
              </div>
              <Badge
                variant="outline"
                className="text-lg font-bold px-4 py-2 bg-background/50"
              >
                {prize.prize_description}
              </Badge>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              <strong>Winners will be announced:</strong><br />
              August 10th, 2025 at 7:00 AM
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrizeStructure;