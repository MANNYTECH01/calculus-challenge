import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const QuizRules: React.FC = () => {
  const rules = [
    "Subject: Multiple Choice Questions from Calculus (MTH 102)",
    "Registration Fee: ₦1000 (Required before taking quiz)",
    "Quiz Date: August 9th, 2025 Available from: 12:00 AM – 11:59 PM",
    "No Pausing or Restarting once the quiz is started",
    "Tab Switching during the quiz will auto-submit your attempt",
    "Screenshots will be detected; any attempt will result in disqualification",
    "Copying/Right-clicking/Highlighting is disabled",
    "One Attempt Only per student",
    "Questions are Randomized per User – no user gets the same set of questions",
    "Users from the same area will not get same questions",
    "Countdown Timer: Users cannot start until the countdown ends at 12:00 AM on quiz day",
    "Correct Answers & Explanations will be released on August 10th, 2025 at 7:00 AM",
    "Winner Announcement: August 10th, 2025 at 7:00 AM",
    "Registration remains open until 11:00 PM on August 9th, 2025",
    "Real-time support chat available before, during, and after the quiz"
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