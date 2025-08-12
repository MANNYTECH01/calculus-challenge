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
    const { reference } = await req.json(); // We only need the reference from the client
    if (!reference) {
      throw new Error("Payment reference is required");
    }
    const supabaseClient = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "", {
      auth: {
        persistSession: false
      }
    });
    const paystackSecretKey = Deno.env.get("SECRET_KEY"); // Using standardized name
    if (!paystackSecretKey) {
      throw new Error("Paystack secret key not configured");
    }
    // Verify the payment with Paystack
    const verifyResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${paystackSecretKey}`,
        "Content-Type": "application/json"
      }
    });
    const verifyData = await verifyResponse.json();
    if (verifyData.status && verifyData.data.status === "success") {
      // Get email directly from Paystack's response
      const email = verifyData.data.customer.email;
      if (!email) {
        throw new Error("Could not retrieve customer email from Paystack transaction.");
      }
      // Update payment session status
      await supabaseClient.from("payment_sessions").update({
        status: "completed"
      }).eq("paystack_reference", reference);
      // Get user ID from email
      const { data: userData } = await supabaseClient.auth.admin.getUserByEmail(email);
      if (userData.user) {
        // Update user profile to mark payment as verified
        await supabaseClient.from("profiles").update({
          payment_verified: true
        }).eq("user_id", userData.user.id);
      } else {
        // This case might happen if the webhook hasn't created the user yet
        console.warn(`User with email ${email} not found, webhook will handle profile update.`);
      }
      return new Response(JSON.stringify({
        verified: true
      }), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        },
        status: 200
      });
    } else {
      return new Response(JSON.stringify({
        verified: false,
        reason: verifyData.message || "Payment not completed"
      }), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        },
        status: 400
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
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
