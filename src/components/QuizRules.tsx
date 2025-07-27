import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const QuizRules: React.FC = () => {
  const rules = [
    "Quiz duration: 40 minutes",
    "40 multiple choice questions from Calculus (MTH 102)",
    "Registration fee: ₦1000 (required before taking quiz)",
    "Quiz available: August 9th, 2025 (12:00 AM - 11:59 PM)",
    "No pausing or restarting once started",
    "Tab switching will auto-submit your quiz",
    "Screenshots during the quiz will be detected and will result in disqualification",
    "Copying is disabled",
    "One attempt per student",
    "Top 10 scores displayed on public leaderboard",
    "Winner announced August 10th, 2025 at 7:00 AM"
  ];

  return (
    <Card className="bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Quiz Rules & Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {rules.map((rule, index) => (
            <div key={index} className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
              <span className="text-foreground">{rule}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
          <p className="text-sm text-muted-foreground">
            <strong>Subject Focus:</strong> Calculus (MTH 102) - Functions, Limits, 
            Differentiation, Integration, and Fundamental Theorems.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizRules;