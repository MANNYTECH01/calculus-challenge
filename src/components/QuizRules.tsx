import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const QuizRules: React.FC = () => {
  const rules = [
    "Multiple Choice Questions from Calculus (MTH 102)",
    "Payment of ₦500 is required to register for the quiz",
    "No Pausing or Restarting once the quiz is started",
    "Tab Switching during the quiz will auto-submit your attempt",
    "Screenshots will be detected; any attempt will result in disqualification",
    "Copying/Right-clicking/Highlighting is disabled",
    "You have only one attempt during the quiz duration. After the quiz, you can attempt it multiple times",
    "Quiz Duration: 60 minutes (1 hour)",
    "Correct Answers & Explanations will be released on August 17th, 2025 at 07:00 AM",
    "Winner Announcement: August 17th, 2025 at 10:00 AM",
    "Leaderboard will be displayed on August 17th, 2025 at 10:00 AM",
    "Use the chat box for any complaints or clarifications"
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