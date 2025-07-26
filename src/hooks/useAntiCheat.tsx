import { useEffect, useCallback, useRef } from 'react';
import { toast } from '@/hooks/use-toast';

interface AntiCheatHook {
  violations: string[];
  addViolation: (violation: string) => void;
}

interface UseAntiCheatOptions {
  onViolation?: (violation: string) => void;
  onForceSubmit?: () => void;
  enabled?: boolean;
}

export const useAntiCheat = ({ 
  onViolation, 
  onForceSubmit, 
  enabled = true 
}: UseAntiCheatOptions = {}): AntiCheatHook => {
  const violationsRef = useRef<string[]>([]);

  const addViolation = useCallback((violation: string) => {
    violationsRef.current.push(violation);
    onViolation?.(violation);
    
    toast({
      title: "Security Warning",
      description: `Violation detected: ${violation}`,
      variant: "destructive",
    });
  }, [onViolation]);

  // Disable right-click context menu
  useEffect(() => {
    if (!enabled) return;

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      addViolation("Right-click attempted");
    };

    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, [enabled, addViolation]);

  // Disable text selection and copying
  useEffect(() => {
    if (!enabled) return;

    const handleSelectStart = (e: Event) => {
      e.preventDefault();
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      addViolation("Copy attempt detected");
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable common shortcuts
      if (
        (e.ctrlKey && (e.key === 'c' || e.key === 'a' || e.key === 'v' || e.key === 'x')) ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') || // Dev tools
        e.key === 'F12' || // Dev tools
        (e.ctrlKey && e.shiftKey && e.key === 'J') || // Console
        (e.ctrlKey && e.key === 'u') || // View source
        (e.ctrlKey && e.key === 's') || // Save
        (e.ctrlKey && e.key === 'p') || // Print
        e.key === 'PrintScreen' // Screenshot
      ) {
        e.preventDefault();
        addViolation(`Blocked shortcut: ${e.key}`);
      }
    };

    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, addViolation]);

  // Detect tab switching and window focus changes
  useEffect(() => {
    if (!enabled) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        addViolation("Tab switched or window minimized");
        setTimeout(() => {
          if (document.hidden) {
            onForceSubmit?.();
          }
        }, 3000); // 3 second grace period
      }
    };

    const handleBlur = () => {
      addViolation("Window lost focus");
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [enabled, addViolation, onForceSubmit]);

  // Add blur overlay for screenshot prevention
  useEffect(() => {
    if (!enabled) return;

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen') {
        // Add blur overlay temporarily
        const overlay = document.createElement('div');
        overlay.className = 'quiz-overlay';
        overlay.textContent = 'Screenshots are not allowed!';
        document.body.appendChild(overlay);
        
        setTimeout(() => {
          document.body.removeChild(overlay);
        }, 2000);
        
        addViolation("Screenshot attempt");
      }
    };

    document.addEventListener('keyup', handleKeyUp);
    return () => document.removeEventListener('keyup', handleKeyUp);
  }, [enabled, addViolation]);

  return {
    violations: violationsRef.current,
    addViolation
  };
};