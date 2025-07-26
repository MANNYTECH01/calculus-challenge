import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface CountdownTimerProps {
  targetDate: Date;
  onComplete?: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        onComplete?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  return (
    <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <Card key={unit} className="bg-gradient-to-br from-primary/20 to-accent/20 border-primary/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl md:text-3xl font-bold text-primary countdown-animation">
              {value.toString().padStart(2, '0')}
            </div>
            <div className="text-sm text-muted-foreground capitalize">
              {unit}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CountdownTimer;