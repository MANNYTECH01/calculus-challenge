import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Settings, Eye, EyeOff, Calendar, Clock } from 'lucide-react';
import { useExplanationSettings, ExplanationSettings } from '@/hooks/useExplanationSettings';
import { toast } from '@/hooks/use-toast';

const ExplanationToggle: React.FC = () => {
  const { settings, canViewExplanations, loading, updateSettings, refetch } = useExplanationSettings();

  const handleToggle = async (field: keyof ExplanationSettings, value: boolean | string) => {
    const success = await updateSettings({ [field]: value });
    if (success) {
      toast({
        title: "Settings Updated",
        description: "Explanation access settings have been updated successfully.",
      });
    } else {
      toast({
        title: "Update Failed",
        description: "Failed to update explanation settings.",
        variant: "destructive",
      });
    }
  };

  const handleDateChange = (value: string) => {
    // Convert local datetime to ISO string
    const date = new Date(value);
    handleToggle('release_date', date.toISOString());
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading explanation settings...</p>
        </CardContent>
      </Card>
    );
  }

  if (!settings) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Settings className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Settings Not Found</h3>
          <p className="text-muted-foreground mb-4">Unable to load explanation settings.</p>
          <Button onClick={refetch}>Retry</Button>
        </CardContent>
      </Card>
    );
  }

  // Convert ISO string to local datetime for input
  const localReleaseDate = settings.release_date ? 
    new Date(settings.release_date).toISOString().slice(0, 16) : '';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Explanation Access Control
          <Badge variant={settings.enabled ? "default" : "secondary"}>
            {settings.enabled ? "Enabled" : "Disabled"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Status */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            {canViewExplanations ? (
              <Eye className="h-4 w-4 text-green-600" />
            ) : (
              <EyeOff className="h-4 w-4 text-red-600" />
            )}
            <span className="font-medium">
              Current Status: {canViewExplanations ? "Explanations Visible" : "Explanations Hidden"}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            This shows whether explanations are currently visible to users based on current settings.
          </p>
        </div>

        {/* Master Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="explanation-enabled">Enable Explanations</Label>
            <p className="text-sm text-muted-foreground">
              Master toggle for explanation feature
            </p>
          </div>
          <Switch
            id="explanation-enabled"
            checked={settings.enabled}
            onCheckedChange={(checked) => handleToggle('enabled', checked)}
          />
        </div>

        {settings.enabled && (
          <>
            {/* Access Mode Selection */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Access Mode</Label>
              
              {/* Show Immediately After Attempt */}
              <div className="flex items-start justify-between p-4 border rounded-lg">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <Label htmlFor="immediate-access">Show Immediately After Quiz Attempt</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Users can view explanations immediately after completing the quiz
                  </p>
                </div>
                <Switch
                  id="immediate-access"
                  checked={settings.show_immediately_after_attempt}
                  onCheckedChange={(checked) => {
                    handleToggle('show_immediately_after_attempt', checked);
                    if (checked) {
                      handleToggle('show_only_after_date', false);
                    }
                  }}
                />
              </div>

              {/* Show Only After Date */}
              <div className="flex items-start justify-between p-4 border rounded-lg">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <Label htmlFor="date-access">Show Only After Release Date</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Lock explanations until a specific date/time
                  </p>
                </div>
                <Switch
                  id="date-access"
                  checked={settings.show_only_after_date}
                  onCheckedChange={(checked) => {
                    handleToggle('show_only_after_date', checked);
                    if (checked) {
                      handleToggle('show_immediately_after_attempt', false);
                    }
                  }}
                />
              </div>

              {/* Release Date Input */}
              {settings.show_only_after_date && (
                <div className="space-y-2 pl-8">
                  <Label htmlFor="release-date">Release Date & Time</Label>
                  <Input
                    id="release-date"
                    type="datetime-local"
                    value={localReleaseDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Explanations will be visible starting from this date and time
                  </p>
                </div>
              )}
            </div>

            {/* Help Text */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-lg">
              <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">How It Works</h4>
              <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                <li>• <strong>Immediate Access:</strong> Users see explanations right after completing the quiz</li>
                <li>• <strong>Date-Based Access:</strong> All explanations are locked until the release date</li>
                <li>• Both modes require the master "Enable Explanations" toggle to be on</li>
                <li>• Video explanations (YouTube URLs) and text explanations are both supported</li>
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ExplanationToggle;