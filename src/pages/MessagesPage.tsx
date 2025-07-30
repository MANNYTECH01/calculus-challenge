import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, MessageCircle, CheckCircle2, Clock, Image } from 'lucide-react';
import MobileNavigation from '@/components/MobileNavigation';

interface AdminMessage {
  id: string;
  subject: string;
  message: string;
  screenshot_url: string;
  is_read: boolean;
  created_at: string;
}

const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchMessages();
  }, [user, navigate]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_messages')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('admin_messages')
        .update({ is_read: true })
        .eq('id', messageId);

      if (error) throw error;

      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, is_read: true } : msg
        )
      );

      toast({
        title: "Message marked as read",
        description: "Message status updated successfully"
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
      toast({
        title: "Error",
        description: "Failed to update message status",
        variant: "destructive"
      });
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('admin_messages')
        .update({ is_read: true })
        .eq('user_id', user?.id)
        .eq('is_read', false);

      if (error) throw error;

      setMessages(prev => prev.map(msg => ({ ...msg, is_read: true })));

      toast({
        title: "All messages marked as read",
        description: "All messages have been updated"
      });
    } catch (error) {
      console.error('Error marking all messages as read:', error);
      toast({
        title: "Error",
        description: "Failed to update messages",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const unreadCount = messages.filter(msg => !msg.is_read).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/')}
              className="lg:hidden"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Messages
              </h1>
              {unreadCount > 0 && (
                <p className="text-sm text-muted-foreground">
                  {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            {unreadCount > 0 && (
              <Button variant="outline" onClick={markAllAsRead}>
                Mark All as Read
              </Button>
            )}
            <Button variant="outline" onClick={() => navigate('/')}>
              Back to Home
            </Button>
          </div>

          {/* Mobile Navigation */}
          <MobileNavigation />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {messages.length === 0 ? (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="py-12">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Messages</h3>
                <p className="text-muted-foreground">
                  You don't have any messages from the admin yet.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Mobile Mark All as Read */}
            {unreadCount > 0 && (
              <div className="lg:hidden">
                <Button 
                  variant="outline" 
                  onClick={markAllAsRead}
                  className="w-full"
                >
                  Mark All as Read ({unreadCount})
                </Button>
              </div>
            )}

            {/* Messages List */}
            <div className="space-y-4">
              {messages.map((message) => (
                <Card 
                  key={message.id}
                  className={`transition-all ${
                    message.is_read 
                      ? 'bg-muted/30' 
                      : 'bg-primary/5 border-primary/20 shadow-md'
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <CardTitle className="text-lg flex items-center space-x-3">
                        <MessageCircle className="h-5 w-5" />
                        <span>{message.subject}</span>
                        {!message.is_read && (
                          <Badge variant="default" className="text-xs">
                            New
                          </Badge>
                        )}
                      </CardTitle>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{formatDate(message.created_at)}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {message.message}
                    </p>
                    
                    {message.screenshot_url && (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm font-medium">
                          <Image className="h-4 w-4" />
                          <span>Attached Screenshot</span>
                        </div>
                        <div className="bg-muted/50 p-2 rounded-lg">
                          <img 
                            src={message.screenshot_url} 
                            alt="Admin screenshot"
                            className="max-w-full h-auto rounded border cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => window.open(message.screenshot_url, '_blank')}
                          />
                          <p className="text-xs text-muted-foreground mt-2">
                            Click to view in full size
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {!message.is_read && (
                      <div className="pt-2 border-t">
                        <Button 
                          size="sm" 
                          onClick={() => markAsRead(message.id)}
                          className="w-full md:w-auto"
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Mark as Read
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Support Section */}
        <Card className="max-w-4xl mx-auto mt-8 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3">Need Help?</h3>
            <p className="text-muted-foreground mb-4">
              For complaints or clarification, contact us at:
            </p>
            <a 
              href="mailto:schooltact01@gmail.com"
              className="inline-flex items-center space-x-2 text-primary hover:underline font-medium"
            >
              <MessageCircle className="h-4 w-4" />
              <span>schooltact01@gmail.com</span>
            </a>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default MessagesPage;