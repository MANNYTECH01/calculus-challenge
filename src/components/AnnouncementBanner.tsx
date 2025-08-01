import React from 'react';
import { Card } from '@/components/ui/card';

const AnnouncementBanner: React.FC = () => {
  return (
    <Card className="prize-glow bg-gradient-to-r from-warning/20 to-accent/20 border-warning/30 p-6 text-center">
      <div className="text-lg md:text-xl font-bold text-warning mb-2">
        🎓 MTH 102 Calculus Quiz Competition | August 9th, 2025 | Registration: ₦1000
      </div>
      <div className="text-sm md:text-base text-muted-foreground mb-4">
        Quiz Time: 12:00 AM - 11:59 PM | Winner Announced: August 19th at 7:00 AM
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="flex items-center justify-center space-x-2">
          <span className="medal-gold text-2xl">🥇</span>
          <span className="font-semibold">First: ₦20,000</span>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <span className="medal-silver text-2xl">🥈</span>
          <span className="font-semibold">Second: ₦15,000</span>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <span className="medal-bronze text-2xl">🥉</span>
          <span className="font-semibold">Third: ₦10,000</span>
        </div>
      </div>
    </Card>
  );
};

export default AnnouncementBanner;