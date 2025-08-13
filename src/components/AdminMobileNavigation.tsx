import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X, Users, MessageSquare, AlertTriangle, BookOpen, Eye, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface AdminMobileNavigationProps {
  activeTab: 'users' | 'messages' | 'violations' | 'quiz' | 'attempts' | 'settings';
  setActiveTab: (tab: 'users' | 'messages' | 'violations' | 'quiz' | 'attempts' | 'settings') => void;
}

const AdminMobileNavigation: React.FC<AdminMobileNavigationProps> = ({ activeTab, setActiveTab }) => {
  const { signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigation = (tab: 'users' | 'messages' | 'violations' | 'quiz' | 'attempts' | 'settings') => {
    setActiveTab(tab);
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
        <SheetContent side="right" className="w-80 p-0 flex flex-col">
          <div className="p-4 border-b bg-primary/10">
            <h3 className="text-lg font-semibold">Admin Menu</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <Button variant="ghost" className="w-full justify-start space-x-3" onClick={() => handleNavigation('users')}>
              <Users className="h-5 w-5" />
              <span>Users & Messaging</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start space-x-3" onClick={() => handleNavigation('messages')}>
              <MessageSquare className="h-5 w-5" />
              <span>Support Messages</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start space-x-3" onClick={() => handleNavigation('violations')}>
              <AlertTriangle className="h-5 w-5" />
              <span>Violations</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start space-x-3" onClick={() => handleNavigation('quiz')}>
              <BookOpen className="h-5 w-5" />
              <span>Quiz Management</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start space-x-3" onClick={() => handleNavigation('attempts')}>
              <Eye className="h-5 w-5" />
              <span>Quiz Attempts</span>
            </Button>
            
            <Button variant="ghost" className="w-full justify-start space-x-3" onClick={() => handleNavigation('settings')}>
              <Settings className="h-5 w-5" />
              <span>Explanation Settings</span>
            </Button>
          </div>
          <div className="p-4 border-t">
            <Button variant="outline" className="w-full text-destructive border-destructive" onClick={signOut}>
              <LogOut className="h-5 w-5 mr-2" />
              Sign Out
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminMobileNavigation;