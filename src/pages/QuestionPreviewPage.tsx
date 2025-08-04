import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MathText } from '@/components/MathRenderer';
import { ArrowLeft, Shield, BookCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface Question {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  category: string;
}

const QuestionPreviewPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [explanations, setExplanations] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    const checkAdminAndFetchData = async () => {
      if (!user) {
        navigate('/auth');
        return;
      }

      try {
        const { data: adminData } = await supabase
          .from('admin_panel')
          .select('is_admin')
          .eq('user_id', user.id)
          .single();

        if (!adminData?.is_admin) {
          toast({ title: "Access Denied", description: "You do not have permission to view this page.", variant: "destructive" });
          navigate('/');
          return;
        }
        setIsAdmin(true);

        // Securely call the Edge Function to get all data
        const { data, error } = await supabase.functions.invoke('get-all-questions-and-explanations');
        
        if (error) throw error;

        const { questions: qData, explanations: eData } = data;
        setQuestions(qData || []);
        
        const explanationMap = (eData || []).reduce((acc: Record<string, string>, curr: { question_id: string, explanation: string }) => {
          acc[curr.question_id] = curr.explanation;
          return acc;
        }, {});
        setExplanations(explanationMap);

      } catch (error: any) {
        console.error('Error fetching preview data:', error);
        toast({ title: "Error", description: `Failed to load preview data: ${error.message}`, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    checkAdminAndFetchData();
  }, [user, authLoading, navigate]);

  if (loading || authLoading) {
    return <div className="text-center p-8">Verifying Admin Access and Loading Data...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-md mx-auto text-center p-8">
            <Shield className="h-12 w-12 mx-auto text-destructive mb-4" />
            <h2 className="text-2xl font-bold">Access Denied</h2>
            <p className="text-muted-foreground mt-2">You must be an administrator to view this page.</p>
          </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Button variant="outline" onClick={() => navigate('/admin')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Admin Dashboard
        </Button>
        <h1 className="text-3xl font-bold mb-2">Quiz Questions & Explanations Preview</h1>
        <p className="text-muted-foreground mb-6">Total Questions: {questions.length}</p>
        <div className="space-y-6">
          {questions.map((question, index) => (
            <Card key={question.id}>
              <CardHeader>
                <CardTitle className="text-lg">
                  <div className="flex justify-between items-start">
                    <span className="pr-4">
                      <MathText>{`Question ${index + 1}: ${question.question_text}`}</MathText>
                    </span>
                    <Badge variant="outline">{question.category}</Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><MathText>{`A) ${question.option_a}`}</MathText></p>
                <p><MathText>{`B) ${question.option_b}`}</MathText></p>
                <p><MathText>{`C) ${question.option_c}`}</MathText></p>
                <p><MathText>{`D) ${question.option_d}`}</MathText></p>
                <p className="font-bold pt-2 text-primary">
                  Correct Answer: {question.correct_answer}
                </p>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      <span className="flex items-center text-sm font-semibold">
                        <BookCheck className="h-4 w-4 mr-2" />
                        View Explanation
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 text-sm text-muted-foreground">
                      <MathText>{explanations[question.id] || "No explanation available."}</MathText>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionPreviewPage;