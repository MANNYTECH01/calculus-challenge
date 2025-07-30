import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X, User, LogOut, MessageCircle, Trophy, BookOpen, Home } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const MobileNavigation: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-80 p-0">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b bg-gradient-to-r from-primary/10 to-accent/10">
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
                <div className="mt-4 space-y-1">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {user.user_metadata?.username || user.email}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {user.email}
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Links */}
            <div className="flex-1 p-6 space-y-4">
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
                <div className="bg-muted/50 p-4 rounded-lg">
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

            {/* Footer Actions */}
            {user && (
              <div className="p-6 border-t">
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
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavigation;