import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CreditCard, CheckCircle } from 'lucide-react';

const AuthPage: React.FC = () => {
  const { user, signIn, signUp, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentVerified, setPaymentVerified] = useState(false);

  // Form states
  const [signInForm, setSignInForm] = useState({ email: '', password: '' });
  const [signUpForm, setSignUpForm] = useState({ email: '', password: '', username: '', confirmPassword: '' });

  useEffect(() => {
    if (user) {
      // Check payment status
      const paymentStatus = searchParams.get('payment');
      if (paymentStatus === 'success') {
        handlePaymentVerification();
      } else {
        navigate('/');
      }
    }
  }, [user, navigate, searchParams]);

  const handlePaymentVerification = async () => {
    if (!user?.email) return;
    
    try {
      setPaymentProcessing(true);
      
      // Get the reference from URL params or storage
      const reference = searchParams.get('reference') || localStorage.getItem('payment_reference');
      
      if (reference) {
        const { data, error } = await supabase.functions.invoke('verify-payment', {
          body: { reference: reference, email: user.email }
        });

        if (error) throw error;

        if (data.verified) {
          setPaymentVerified(true);
          localStorage.removeItem('payment_reference');
          toast({
            title: "Payment Verified!",
            description: "Your registration is now complete. You can take the quiz.",
          });
          setTimeout(() => navigate('/'), 2000);
        } else {
          toast({
            title: "Payment Verification Failed",
            description: "Your payment could not be verified. Please contact support.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      toast({
        title: "Verification Error",
        description: "Failed to verify payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // First check if user has paid
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('payment_verified')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      const { error } = await signIn(signInForm.email, signInForm.password);
      
      if (!error) {
        // Check payment status after successful login
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('payment_verified')
          .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
          .single();

        if (!userProfile?.payment_verified) {
          await supabase.auth.signOut();
          toast({
            title: "Payment Required",
            description: "Please complete your ₦500 payment to access the portal.",
            variant: "destructive",
          });
          return;
        }
      }
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signUpForm.password !== signUpForm.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Please ensure both passwords match.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // New payment-first signup flow
      const { data, error } = await supabase.functions.invoke('create-payment-signup', {
        body: {
          email: signUpForm.email,
          password: signUpForm.password,
          username: signUpForm.username || signUpForm.email.split('@')[0],
          location: 'Not specified'
        }
      });

      if (error) throw error;

      if (data?.authorization_url) {
        // Store signup data for after payment
        localStorage.setItem('pending_signup', JSON.stringify({
          email: signUpForm.email,
          password: signUpForm.password,
          username: signUpForm.username || signUpForm.email.split('@')[0],
          location: 'Not specified',
          reference: data.reference
        }));

        toast({
          title: "Redirecting to Payment",
          description: "You'll be redirected to Paystack to complete your ₦500 payment. After payment, your account will be created and verified automatically.",
        });

        // Redirect to Paystack
        setTimeout(() => {
          window.location.href = data.authorization_url;
        }, 1500);
      } else {
        throw new Error('Payment initialization failed');
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast({
        title: "Sign Up Failed",
        description: error.message || "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentInitiation = async () => {
    try {
      setPaymentProcessing(true);
      
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { 
          email: signUpForm.email,
          location: 'default' // Can be enhanced with geolocation later
        }
      });

      if (error) throw error;

      if (data.url) {
        // Store reference for verification
        localStorage.setItem('payment_reference', data.reference);
        
        // Redirect to Paystack checkout
        window.open(data.url, '_blank');
        
        toast({
          title: "Redirecting to Payment",
          description: "Complete your ₦500 registration fee via Paystack. After payment, check your email for confirmation link.",
        });
      }
    } catch (error) {
      console.error('Payment initiation error:', error);
      toast({
        title: "Payment Error",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPaymentProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (paymentProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CreditCard className="h-12 w-12 mx-auto text-primary" />
              <h3 className="text-xl font-semibold">Processing Payment</h3>
              <p className="text-muted-foreground">Please wait while we verify your payment...</p>
              <Loader2 className="h-6 w-6 animate-spin mx-auto" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (paymentVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="h-12 w-12 mx-auto text-success" />
              <h3 className="text-xl font-semibold">Payment Verified!</h3>
              <p className="text-muted-foreground">Your registration is complete. Redirecting to homepage...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card/50 backdrop-blur-sm border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            MTH 102 Quiz Portal
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Registration requires ₦500 payment
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up & Pay</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    value={signInForm.email}
                    onChange={(e) => setSignInForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    value={signInForm.password}
                    onChange={(e) => setSignInForm(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Sign In
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-username">Username</Label>
                  <Input
                    id="signup-username"
                    type="text"
                    value={signUpForm.username}
                    onChange={(e) => setSignUpForm(prev => ({ ...prev, username: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={signUpForm.email}
                    onChange={(e) => setSignUpForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signUpForm.password}
                    onChange={(e) => setSignUpForm(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm">Confirm Password</Label>
                  <Input
                    id="signup-confirm"
                    type="password"
                    value={signUpForm.confirmPassword}
                    onChange={(e) => setSignUpForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
                  <div className="text-sm text-warning font-semibold mb-1">
                    Registration Fee: ₦500
                  </div>
                  <div className="text-xs text-muted-foreground">
                    After creating your account, you'll be redirected to pay the registration fee via Paystack (secure payment platform).
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={isSubmitting || paymentProcessing}>
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Sign Up & Pay ₦500
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 text-center">
            <Button variant="outline" onClick={() => navigate('/')}>
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;