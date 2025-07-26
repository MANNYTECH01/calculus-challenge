import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const QuizRules: React.FC = () => {
  const rules = [
    "Quiz duration: 20 minutes",
    "Multiple choice questions from Calculus (MTH 102)",
    "No pausing or restarting once started",
    "Tab switching will auto-submit your quiz",
    "Screenshots and copying are disabled",
    "One attempt per student",
    "Top 3 scores win cash prizes"
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
            <strong>Subject Focus:</strong> Calculus (MTH 102) - Derivatives, Integrals, Limits, 
            Chain Rule, Product Rule, Quotient Rule, and fundamental theorems.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizRules;