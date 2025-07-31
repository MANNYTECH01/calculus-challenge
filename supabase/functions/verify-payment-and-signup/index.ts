import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reference, email, password, username, location } = await req.json();
    
    if (!reference || !email || !password || !username) {
      throw new Error("Reference, email, password, and username are required");
    }

    // Create Supabase client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Initialize Paystack
    const paystackSecretKey = Deno.env.get("REACT_APP_PAYSTACK_SECRET_KEY");
    if (!paystackSecretKey) {
      throw new Error("Paystack secret key not configured");
    }

    // Verify the payment with Paystack
    const verifyResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${paystackSecretKey}`,
        "Content-Type": "application/json",
      },
    });

    const verifyData = await verifyResponse.json();

    if (!verifyData.status || verifyData.data.status !== "success") {
      return new Response(JSON.stringify({ 
        verified: false, 
        reason: verifyData.message || "Payment not completed" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Payment verified, now create user account
    const { data: signUpData, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        username,
        location: location || "Not specified"
      },
      email_confirm: true // Auto-confirm email since payment is verified
    });

    if (signUpError) {
      throw new Error(`User creation failed: ${signUpError.message}`);
    }

    // Update payment session status
    await supabaseAdmin
      .from("payment_sessions")
      .update({ status: "completed" })
      .eq("paystack_reference", reference)
      .eq("user_email", email);

    // Create user profile with payment verified
    await supabaseAdmin
      .from("profiles")
      .insert({
        user_id: signUpData.user.id,
        username,
        full_name: username,
        location: location || "Not specified",
        payment_verified: true
      });

    return new Response(JSON.stringify({ 
      verified: true,
      user_created: true,
      message: "Payment verified and account created successfully"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error('Payment verification and signup error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});