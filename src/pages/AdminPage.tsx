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
import { Shield, MessageSquare, Users, AlertTriangle, Send, Upload } from 'lucide-react';
import MobileNavigation from '@/components/MobileNavigation';

interface User {
  id: string;
  email: string;
  username: string;
  payment_verified: boolean;
  has_attempted_quiz: boolean;
}

interface SupportMessage {
  id: string;
  user_email: string;
  message: string;
  created_at: string;
  is_admin_response: boolean;
}

interface Violation {
  id: string;
  user_id: string;
  violation_type: string;
  violation_details: string;
  timestamp: string;
  user_email?: string;
}

const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([]);
  const [violations, setViolations] = useState<Violation[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [messageSubject, setMessageSubject] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<'users' | 'messages' | 'violations'>('users');

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
        .select('user_id, username, payment_verified, has_attempted_quiz')
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
        
        // Note: For now, we'll skip file upload and just store the filename
        // In production, you'd want to implement proper file storage
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
            Admin Dashboard
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
          <div className="flex space-x-4 border-b">
            <button
              onClick={() => setActiveTab('users')}
              className={`pb-2 px-4 ${activeTab === 'users' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
            >
              <Users className="inline h-4 w-4 mr-2" />
              Users & Messaging
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`pb-2 px-4 ${activeTab === 'messages' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
            >
              <MessageSquare className="inline h-4 w-4 mr-2" />
              Support Messages
            </button>
            <button
              onClick={() => setActiveTab('violations')}
              className={`pb-2 px-4 ${activeTab === 'violations' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
            >
              <AlertTriangle className="inline h-4 w-4 mr-2" />
              Violations
            </button>
          </div>

          {/* Users & Messaging Tab */}
          {activeTab === 'users' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Users List */}
              <Card>
                <CardHeader>
                  <CardTitle>Registered Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{user.username}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                        <div className="flex space-x-2">
                          <Badge variant={user.payment_verified ? "default" : "destructive"}>
                            {user.payment_verified ? "Paid" : "Unpaid"}
                          </Badge>
                          <Badge variant={user.has_attempted_quiz ? "secondary" : "outline"}>
                            {user.has_attempted_quiz ? "Attempted" : "Pending"}
                          </Badge>
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
                <CardTitle>Support Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {supportMessages.map((message) => (
                    <div key={message.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{message.user_email}</span>
                        <Badge variant={message.is_admin_response ? "default" : "secondary"}>
                          {message.is_admin_response ? "Admin" : "User"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {new Date(message.created_at).toLocaleString()}
                      </p>
                      <p>{message.message}</p>
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
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Quiz Violations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {violations.map((violation) => (
                    <div key={violation.id} className="p-4 border rounded-lg">
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
        </div>
      </main>
    </div>
  );
};

export default AdminPage;