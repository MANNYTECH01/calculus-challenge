import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X, User, LogOut, MessageCircle, Trophy, BookOpen, Home } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

// New green WhatsApp icon component for the mobile menu
const WhatsAppIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="text-[#25D366]" // This sets the green color
  >
    <path
      d="M19.67,15.65a2.5,2.5,0,0,1-1.35.81c-.52.16-1.12.22-1.66.1-1.28-.29-2.47-1-3.55-1.93s-2-2-2.83-3.23a8.1,8.1,0,0,1-1-3.28c0-.52.09-1,.22-1.44a2.29,2.29,0,0,1,.81-1.28,1,1,0,0,1,.73-.32h.35a.82.82,0,0,1,.71.48l.9,1.87a.87.87,0,0,1,0,.8.71.71,0,0,1-.38.56l-.83.67a.38.38,0,0,0-.14.33,4.4,4.4,0,0,0,1.15,2.2,4.4,4.4,0,0,0,2.2,1.15.38.38,0,0,0,.33-.14l.67-.83a.71.71,0,0,1,.56-.38.87.87,0,0,1,.8,0l1.87.9a.82.82,0,0,1,.48.71v.35A1,1,0,0,1,19.67,15.65ZM12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Z"
    />
  </svg>
);


const MobileNavigation: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // --- IMPORTANT: Replace this with your actual WhatsApp group invite link ---
  const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/LLUb49tb3wiETZ212ROiJU";

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
                  onClick={() => handleNavigation('/quiz-review')}
                >
                  <BookOpen className="h-5 w-5" />
                  <span>Quiz Review</span>
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-start space-x-3"
                  onClick={() => handleNavigation('/messages')}
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Messages</span>
                </Button>

                <a href={WHATSAPP_GROUP_URL} target="_blank" rel="noopener noreferrer" className="w-full" onClick={() => setIsOpen(false)}>
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