import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, location } = await req.json();
    
    if (!email) {
      throw new Error("Email is required");
    }

    // Create Supabase client with service role key
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Initialize Paystack
    const paystackSecretKey = Deno.env.get("REACT_APP_PAYSTACK_SECRET_KEY");
    if (!paystackSecretKey) {
      throw new Error("Paystack secret key not configured");
    }

    // Generate unique reference
    const reference = `mth102_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Initialize Paystack transaction
    const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${paystackSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        amount: 100000, // ₦1000 in kobo
        currency: "NGN",
        reference: reference,
        callback_url: `${req.headers.get("origin")}/auth?payment=success&reference=${reference}`,
        channels: ["card", "bank", "ussd", "qr", "mobile_money", "bank_transfer"],
        metadata: {
          custom_fields: [
            {
              display_name: "Purpose",
              variable_name: "purpose",
              value: "MTH 102 Quiz Registration Fee"
            }
          ]
        }
      }),
    });

    const paystackData = await paystackResponse.json();

    if (!paystackData.status) {
      throw new Error(paystackData.message || "Failed to initialize payment");
    }

    // Record payment session in database
    await supabaseClient.from("payment_sessions").insert({
      user_email: email,
      paystack_reference: reference,
      paystack_access_code: paystackData.data.access_code,
      amount: 100000,
      status: "pending",
    });

    return new Response(JSON.stringify({ 
      url: paystackData.data.authorization_url,
      reference: reference,
      access_code: paystackData.data.access_code
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});