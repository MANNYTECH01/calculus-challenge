import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X, User, LogOut, MessageCircle, Trophy, BookOpen, Home } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';


const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
);


const MobileNavigation: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };
  const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/your-group-invite-link";

  return (
    <div className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-80 p-0 flex flex-col max-h-screen">
          {/* Header */}
          <div className="p-4 border-b bg-gradient-to-r from-primary/10 to-accent/10 shrink-0">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Menu</h3>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            {user && (
              <div className="mt-3 space-y-1">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium truncate">
                    {user.user_metadata?.username || user.email}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {user.email}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links - Scrollable */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            <Button
              variant="ghost"
              className="w-full justify-start space-x-3"
              onClick={() => handleNavigation('/')}
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Button>

            {user ? (
              <>
                <Button
                  variant="ghost"
                  className="w-full justify-start space-x-3"
                  onClick={() => handleNavigation('/dashboard')}
                >
                  <User className="h-5 w-5" />
                  <span>Dashboard</span>
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-start space-x-3"
                  onClick={() => handleNavigation('/quiz')}
                >
                  <BookOpen className="h-5 w-5" />
                  <span>Quiz</span>
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-start space-x-3"
                  onClick={() => handleNavigation('/leaderboard')}
                >
                  <Trophy className="h-5 w-5" />
                  <span>Leaderboard</span>
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-start space-x-3"
                  onClick={() => handleNavigation('/messages')}
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Messages</span>
                </Button>
                <a href={WHATSAPP_GROUP_URL} target="_blank" rel="noopener noreferrer" className="w-full">
                  <Button
                    variant="ghost"
                    className="w-full justify-start space-x-3"
                  >
                    <WhatsAppIcon />
                    <span>WhatsApp Group</span>
                  </Button>
                </a>
              </>
            ) : (
              <Button
                variant="ghost"
                className="w-full justify-start space-x-3"
                onClick={() => handleNavigation('/auth')}
              >
                <User className="h-5 w-5" />
                <span>Login / Register</span>
              </Button>
            )}

            {/* Support Section */}
            <div className="pt-4 border-t">
              <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Support</h4>
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  For complaints or clarification, contact us at:
                </p>
                <a 
                  href="mailto:schooltact01@gmail.com"
                  className="text-sm font-medium text-primary underline"
                >
                  schooltact01@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Logout Button - Always Visible */}
          {user && (
            <div className="p-4 border-t bg-background/95 shrink-0">
              <Button
                variant="outline"
                className="w-full justify-start space-x-3 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => {
                  signOut();
                  setIsOpen(false);
                }}
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavigation;