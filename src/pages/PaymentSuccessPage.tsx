import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const PaymentSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handlePaymentVerification = async () => {
      try {
        const reference = searchParams.get('reference');
        const trxref = searchParams.get('trxref');
        
        const paymentRef = reference || trxref;
        
        if (!paymentRef) {
          throw new Error('No payment reference found');
        }

        // Get pending signup data
        const pendingSignup = localStorage.getItem('pending_signup');
        
        if (pendingSignup) {
          // Handle signup flow
          const signupData = JSON.parse(pendingSignup);
          
          const { data, error } = await supabase.functions.invoke('verify-payment-and-signup', {
            body: {
              reference: paymentRef,
              email: signupData.email,
              password: signupData.password,
              username: signupData.username,
              location: signupData.location
            }
          });

          if (error) throw error;

          if (data?.verified && data?.user_created) {
            localStorage.removeItem('pending_signup');
            setSuccess(true);
            toast({
              title: "Account Created Successfully!",
              description: "Your payment has been verified and your account is ready. You can now sign in.",
            });
            
            setTimeout(() => {
              navigate('/auth?tab=signin&message=account-created');
            }, 3000);
          } else {
            throw new Error(data?.message || 'Payment verification failed');
          }
        } else {
          // Handle existing user payment verification
          const { data, error } = await supabase.functions.invoke('verify-payment', {
            body: { 
              reference: paymentRef,
              email: 'unknown' // Will be handled by backend
            }
          });

          if (error) throw error;

          if (data?.verified) {
            setSuccess(true);
            toast({
              title: "Payment Verified!",
              description: "Your payment has been verified successfully.",
            });
            
            setTimeout(() => {
              navigate('/dashboard');
            }, 2000);
          } else {
            throw new Error('Payment verification failed');
          }
        }
      } catch (error: any) {
        console.error('Payment verification error:', error);
        setError(error.message || 'Payment verification failed');
        toast({
          title: "Payment Verification Failed",
          description: error.message || "Please contact support for assistance.",
          variant: "destructive",
        });
      } finally {
        setVerifying(false);
      }
    };

    handlePaymentVerification();
  }, [searchParams, navigate]);

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 mx-auto text-primary animate-spin" />
              <h3 className="text-xl font-semibold">Verifying Payment</h3>
              <p className="text-muted-foreground">
                Please wait while we verify your payment...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <XCircle className="h-12 w-12 mx-auto text-destructive" />
              <h3 className="text-xl font-semibold">Payment Verification Failed</h3>
              <p className="text-muted-foreground">{error}</p>
              <div className="space-y-2">
                <Button onClick={() => window.location.reload()} className="w-full">
                  Try Again
                </Button>
                <Button variant="outline" onClick={() => navigate('/auth')} className="w-full">
                  Back to Login
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-12 w-12 mx-auto text-success" />
            <h3 className="text-xl font-semibold">Payment Successful!</h3>
            <p className="text-muted-foreground">
              Your payment has been verified and processed successfully.
            </p>
            <p className="text-sm text-muted-foreground">
              Redirecting you to {localStorage.getItem('pending_signup') ? 'sign in' : 'dashboard'}...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccessPage;