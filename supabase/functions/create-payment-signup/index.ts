import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};
serve(async (req)=>{
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders
    });
  }
  try {
    const { email, password, username, location } = await req.json();
    if (!email || !password || !username) {
      throw new Error("Email, password, and username are required");
    }
    // Create Supabase client with service role key for admin operations
    const supabaseAdmin = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "", {
      auth: {
        persistSession: false
      }
    });
    // Initialize Paystack
    const paystackSecretKey = Deno.env.get("REACT_APP_PAYSTACK_SECRET_KEY");
    if (!paystackSecretKey) {
      throw new Error("Paystack secret key not configured");
    }
    // Generate unique reference
    const reference = `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    // Initialize payment with Paystack
    const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${paystackSecretKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        amount: 100000,
        reference,
        currency: "NGN",
        callback_url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/verify-payment-and-signup`,
        metadata: {
          username,
          location: location || "Not specified"
        }
      })
    });
    const paystackData = await paystackResponse.json();
    if (!paystackData.status) {
      throw new Error(paystackData.message || "Payment initialization failed");
    }
    // Store payment session
    await supabaseAdmin.from("payment_sessions").insert({
      user_email: email,
      stripe_session_id: reference,
      paystack_reference: reference,
      paystack_access_code: paystackData.data.access_code,
      amount: 1000,
      currency: "ngn",
      status: "pending"
    });
    return new Response(JSON.stringify({
      authorization_url: paystackData.data.authorization_url,
      access_code: paystackData.data.access_code,
      reference
    }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      },
      status: 200
    });
  } catch (error) {
    console.error('Payment signup error:', error);
    return new Response(JSON.stringify({
      error: error.message
    }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      },
      status: 500
    });
  }
});