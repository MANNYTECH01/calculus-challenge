import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const CreateUsersPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const createUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-admin-users');
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Admin and test users created successfully!",
      });
      
      console.log('Users created:', data);
    } catch (error: any) {
      console.error('Error creating users:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-center">Create Test Users</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            This will create the admin and test user accounts with proper authentication.
          </p>
          <Button 
            onClick={createUsers} 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Creating Users...' : 'Create Users'}
          </Button>
          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>Admin:</strong> schooltact01@gmail.com / Oluwaseun@7</p>
            <p><strong>User:</strong> iseoluwae949@gmail.com / Deelite@7</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateUsersPage;