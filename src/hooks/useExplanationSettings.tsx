import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface ExplanationSettings {
  enabled: boolean;
  show_immediately_after_attempt: boolean;
  show_only_after_date: boolean;
  release_date: string;
}

export const useExplanationSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<ExplanationSettings | null>(null);
  const [canViewExplanations, setCanViewExplanations] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('quiz_settings')
        .select('value')
        .eq('key', 'show_explanations')
        .single();

      if (error) throw error;
      
      const explanationSettings = data.value as any;
      // Validate the structure of the settings
      if (explanationSettings && typeof explanationSettings === 'object') {
        setSettings(explanationSettings as ExplanationSettings);
      } else {
        setSettings(null);
      }

      // Check if current user can view explanations
      if (user?.id) {
        const { data: canShow, error: checkError } = await supabase
          .rpc('can_show_explanations', { p_user_id: user.id });
        
        if (checkError) {
          console.error('Error checking explanation permissions:', checkError);
          setCanViewExplanations(false);
        } else {
          setCanViewExplanations(canShow || false);
        }
      } else {
        // For non-authenticated users, check without user_id
        const { data: canShow, error: checkError } = await supabase
          .rpc('can_show_explanations');
        
        if (checkError) {
          console.error('Error checking explanation permissions:', checkError);
          setCanViewExplanations(false);
        } else {
          setCanViewExplanations(canShow || false);
        }
      }
    } catch (error) {
      console.error('Error fetching explanation settings:', error);
      setSettings(null);
      setCanViewExplanations(false);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<ExplanationSettings>) => {
    if (!settings) return false;

    try {
      const updatedSettings = { ...settings, ...newSettings };
      
      const { error } = await supabase
        .from('quiz_settings')
        .update({ value: updatedSettings })
        .eq('key', 'show_explanations');

      if (error) throw error;
      
      setSettings(updatedSettings);
      await fetchSettings(); // Refresh permissions
      return true;
    } catch (error) {
      console.error('Error updating explanation settings:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [user?.id]);

  return {
    settings,
    canViewExplanations,
    loading,
    updateSettings,
    refetch: fetchSettings
  };
};