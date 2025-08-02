import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Shield, MessageSquare, Users, AlertTriangle, Send, Upload, RotateCcw, Eye, PlayCircle, Reply, Settings, BookOpen } from 'lucide-react';
import { MathText } from '@/components/MathRenderer';
import MobileNavigation from '@/components/MobileNavigation';

interface User {
  id: string;
  email: string;
  username: string;
  payment_verified: boolean;
  has_attempted_quiz: boolean;
  quiz_completed_at: string | null;
}

interface SupportMessage {
  id: string;
  user_email: string;
  message: string;
  created_at: string;
  is_admin_response: boolean;
  user_id: string;
}

interface Violation {
  id: string;
  user_id: string;
  violation_type: string;
  violation_details: string;
  timestamp: string;
  user_email?: string;
}

interface Question {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  difficulty_level: string;
  question_area: string;
}

interface QuizAttempt {
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

const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([]);
  const [violations, setViolations] = useState<Violation[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [messageSubject, setMessageSubject] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<'users' | 'messages' | 'violations' | 'quiz' | 'attempts'>('users');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [previewQuestionIndex, setPreviewQuestionIndex] = useState(0);
  const [previewAnswers, setPreviewAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        if (!user) {
          navigate('/auth');
          return;
        }

        // Check if user is admin
        const { data: adminData } = await supabase
          .from('admin_panel')
          .select('is_admin')
          .eq('user_id', user.id)
          .single();

        if (!adminData?.is_admin) {
          toast({
            title: "Access Denied",
            description: "You don't have admin privileges.",
            variant: "destructive",
          });
          navigate('/');
          return;
        }

        setIsAdmin(true);
        await loadData();
      } catch (error) {
        console.error('Admin check failed:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user, navigate]);

  const loadData = async () => {
    try {
      // Load users
      const { data: userData } = await supabase
        .from('profiles')
        .select('user_id, username, payment_verified, has_attempted_quiz, quiz_completed_at')
        .order('created_at', { ascending: false });

      // Get user emails from auth
      const usersWithEmails = await Promise.all(
        (userData || []).map(async (profile) => {
          const { data: authData } = await supabase.auth.admin.getUserById(profile.user_id);
          return {
            id: profile.user_id,
            email: authData.user?.email || 'Unknown',
            username: profile.username,
            payment_verified: profile.payment_verified,
            has_attempted_quiz: profile.has_attempted_quiz,
            quiz_completed_at: profile.quiz_completed_at,
          };
        })
      );

      setUsers(usersWithEmails);

      // Load support messages
      const { data: messagesData } = await supabase
        .from('support_messages')
        .select('*')
        .order('created_at', { ascending: false });

      setSupportMessages(messagesData || []);

      // Load violations
      const { data: violationsData } = await supabase
        .from('quiz_violations')
        .select('*')
        .order('timestamp', { ascending: false });

      // Add user emails to violations
      const violationsWithEmails = await Promise.all(
        (violationsData || []).map(async (violation) => {
          const user = usersWithEmails.find(u => u.id === violation.user_id);
          return {
            ...violation,
            user_email: user?.email || 'Unknown',
          };
        })
      );

      setViolations(violationsWithEmails);

      // Load questions for quiz preview
      const { data: questionsData } = await supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      setQuestions(questionsData || []);

      // Load quiz attempts
      const { data: attemptsData } = await supabase
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
        .order('submitted_at', { ascending: false });

      const transformedAttempts = attemptsData?.map((attempt: any) => ({
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

      setQuizAttempts(transformedAttempts);

    } catch (error) {
      console.error('Failed to load admin data:', error);
      toast({
        title: "Error",
        description: "Failed to load admin data.",
        variant: "destructive",
      });
    }
  };

  const sendMessage = async () => {
    if (!selectedUser || !messageSubject || !messageContent) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      let screenshotUrl = null;

      // Upload screenshot if provided
      if (screenshotFile) {
        const fileExt = screenshotFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        screenshotUrl = fileName;
      }

      // Send message
      await supabase.from('admin_messages').insert({
        user_id: selectedUser,
        subject: messageSubject,
        message: messageContent,
        screenshot_url: screenshotUrl,
      });

      toast({
        title: "Success",
        description: "Message sent successfully!",
      });

      // Reset form
      setSelectedUser('');
      setMessageSubject('');
      setMessageContent('');
      setScreenshotFile(null);
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive",
      });
    }
  };

  const resetUserQuiz = async (userId: string, username: string) => {
    try {
      // Reset quiz attempt status
      await supabase
        .from('profiles')
        .update({ 
          has_attempted_quiz: false,
          quiz_completed_at: null 
        })
        .eq('user_id', userId);

      // Delete quiz attempts
      await supabase
        .from('quiz_attempts')
        .delete()
        .eq('user_id', userId);

      // Delete violations for this user
      await supabase
        .from('quiz_violations')
        .delete()
        .eq('user_id', userId);

      toast({
        title: "Success",
        description: `Quiz attempt reset for ${username}. They can now retake the quiz.`,
      });

      // Reload data
      await loadData();
    } catch (error) {
      console.error('Failed to reset quiz:', error);
      toast({
        title: "Error",
        description: "Failed to reset quiz attempt.",
        variant: "destructive",
      });
    }
  };

  const replyToMessage = async (messageId: string) => {
    if (!replyMessage.trim()) {
      toast({
        title: "Error",
        description: "Please enter a reply message.",
        variant: "destructive",
      });
      return;
    }

    try {
      const originalMessage = supportMessages.find(m => m.id === messageId);
      if (!originalMessage) return;

      // Insert reply as admin response
      await supabase.from('support_messages').insert({
        user_email: originalMessage.user_email,
        user_id: originalMessage.user_id,
        message: replyMessage,
        is_admin_response: true,
      });

      toast({
        title: "Success",
        description: "Reply sent successfully!",
      });

      setReplyingTo(null);
      setReplyMessage('');
      await loadData();
    } catch (error) {
      console.error('Failed to send reply:', error);
      toast({
        title: "Error",
        description: "Failed to send reply.",
        variant: "destructive",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            🛡️ Admin Dashboard
          </h1>
          <div className="hidden lg:flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate('/')}>
              Back to Home
            </Button>
          </div>
          <MobileNavigation />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 border-b pb-4">
            {[
              { key: 'users', label: 'Users & Messaging', icon: Users },
              { key: 'messages', label: 'Support Messages', icon: MessageSquare },
              { key: 'violations', label: 'Violations', icon: AlertTriangle },
              { key: 'quiz', label: 'Quiz Management', icon: BookOpen },
              { key: 'attempts', label: 'Quiz Attempts', icon: PlayCircle },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === key 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>

          {/* Users & Messaging Tab */}
          {activeTab === 'users' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Users List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Registered Users ({users.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{user.username}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                          {user.quiz_completed_at && (
                            <div className="text-xs text-muted-foreground">
                              Completed: {new Date(user.quiz_completed_at).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col space-y-2">
                          <div className="flex space-x-2">
                            <Badge variant={user.payment_verified ? "default" : "destructive"}>
                              {user.payment_verified ? "Paid" : "Unpaid"}
                            </Badge>
                            <Badge variant={user.has_attempted_quiz ? "secondary" : "outline"}>
                              {user.has_attempted_quiz ? "Attempted" : "Pending"}
                            </Badge>
                          </div>
                          {user.has_attempted_quiz && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="outline" className="text-xs">
                                  <RotateCcw className="h-3 w-3 mr-1" />
                                  Reset Quiz
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Reset Quiz Attempt</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will delete all quiz attempts and violations for {user.username} and allow them to retake the quiz. This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => resetUserQuiz(user.id, user.username)}>
                                    Reset Quiz
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Send Message */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Send className="h-5 w-5 mr-2" />
                    Send Message to User
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select value={selectedUser} onValueChange={setSelectedUser}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.username} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder="Message subject"
                    value={messageSubject}
                    onChange={(e) => setMessageSubject(e.target.value)}
                  />

                  <Textarea
                    placeholder="Message content"
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    rows={4}
                  />

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Upload className="inline h-4 w-4 mr-1" />
                      Attach Screenshot (optional)
                    </label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setScreenshotFile(e.target.files?.[0] || null)}
                    />
                  </div>

                  <Button onClick={sendMessage} className="w-full">
                    Send Message
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Support Messages Tab */}
          {activeTab === 'messages' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Support Messages ({supportMessages.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {supportMessages.map((message) => (
                    <div key={message.id} className={`p-4 border rounded-lg ${message.is_admin_response ? 'bg-primary/5 border-primary/20' : 'bg-muted/30'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{message.user_email}</span>
                        <div className="flex items-center space-x-2">
                          <Badge variant={message.is_admin_response ? "default" : "secondary"}>
                            {message.is_admin_response ? "Admin" : "User"}
                          </Badge>
                          {!message.is_admin_response && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setReplyingTo(message.id)}
                            >
                              <Reply className="h-3 w-3 mr-1" />
                              Reply
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {new Date(message.created_at).toLocaleString()}
                      </p>
                      <p>{message.message}</p>
                      
                      {replyingTo === message.id && (
                        <div className="mt-4 space-y-2">
                          <Textarea
                            placeholder="Type your reply..."
                            value={replyMessage}
                            onChange={(e) => setReplyMessage(e.target.value)}
                            rows={3}
                          />
                          <div className="flex space-x-2">
                            <Button size="sm" onClick={() => replyToMessage(message.id)}>
                              Send Reply
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setReplyingTo(null)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Violations Tab */}
          {activeTab === 'violations' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Quiz Violations ({violations.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {violations.map((violation) => (
                    <div key={violation.id} className="p-4 border rounded-lg border-destructive/20 bg-destructive/5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{violation.user_email}</span>
                        <Badge variant="destructive">{violation.violation_type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {new Date(violation.timestamp).toLocaleString()}
                      </p>
                      <p className="text-sm">{violation.violation_details}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quiz Management Tab */}
          {activeTab === 'quiz' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5" />
                    <span>Quiz Questions ({questions.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {questions.slice(0, 10).map((question, index) => (
                      <div key={question.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-sm mb-1">
                              Question {index + 1}
                            </div>
                            <div className="text-sm text-muted-foreground line-clamp-2">
                              <MathText>{question.question_text}</MathText>
                            </div>
                            <div className="flex space-x-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {question.difficulty_level}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {question.question_area}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Eye className="h-5 w-5" />
                    <span>Quiz Preview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {questions.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Question {previewQuestionIndex + 1} of {Math.min(questions.length, 10)}
                        </span>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setPreviewQuestionIndex(Math.max(0, previewQuestionIndex - 1))}
                            disabled={previewQuestionIndex === 0}
                          >
                            Previous
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setPreviewQuestionIndex(Math.min(questions.length - 1, previewQuestionIndex + 1))}
                            disabled={previewQuestionIndex >= Math.min(questions.length - 1, 9)}
                          >
                            Next
                          </Button>
                        </div>
                      </div>

                      {questions[previewQuestionIndex] && (
                        <div className="space-y-4">
                          <div className="p-4 bg-muted/50 rounded-lg">
                            <MathText>{questions[previewQuestionIndex].question_text}</MathText>
                          </div>
                          <div className="grid grid-cols-1 gap-2">
                            {[
                              { key: 'A', text: questions[previewQuestionIndex].option_a },
                              { key: 'B', text: questions[previewQuestionIndex].option_b },
                              { key: 'C', text: questions[previewQuestionIndex].option_c },
                              { key: 'D', text: questions[previewQuestionIndex].option_d }
                            ].map((option) => (
                              <div
                                key={option.key}
                                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                                  previewAnswers[questions[previewQuestionIndex].id] === option.key
                                    ? 'border-primary bg-primary/10'
                                    : option.key === questions[previewQuestionIndex].correct_answer
                                      ? 'border-green-500 bg-green-50 dark:bg-green-950'
                                      : 'border-muted bg-background hover:bg-muted/50'
                                }`}
                                onClick={() => setPreviewAnswers(prev => ({
                                  ...prev,
                                  [questions[previewQuestionIndex].id]: option.key
                                }))}
                              >
                                <div className="flex items-center space-x-2">
                                  <span className="font-semibold">{option.key}.</span>
                                  <MathText>{option.text}</MathText>
                                  {option.key === questions[previewQuestionIndex].correct_answer && (
                                    <span className="ml-auto text-green-600 text-sm font-medium">✓ Correct</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Quiz Attempts Tab */}
          {activeTab === 'attempts' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PlayCircle className="h-5 w-5" />
                  <span>Quiz Attempts ({quizAttempts.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {quizAttempts.map((attempt, index) => {
                    const percentage = Math.round((attempt.score / attempt.total_questions) * 100);
                    return (
                      <div key={attempt.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{attempt.profiles.username}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(attempt.submitted_at).toLocaleString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg text-primary">
                              {attempt.score}/{attempt.total_questions}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {percentage}% • {formatTime(attempt.time_taken)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPage;