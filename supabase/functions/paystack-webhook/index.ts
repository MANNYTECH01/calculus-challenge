import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { crypto } from "https://deno.land/std@0.190.0/crypto/mod.ts";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-paystack-signature"
};
serve(async (req)=>{
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders
    });
  }
  try {
    const paystackSecretKey = Deno.env.get("SECRET_KEY");
    if (!paystackSecretKey) {
      throw new Error("Paystack secret key not configured");
    }
    // Verify Paystack signature
    const signature = req.headers.get("x-paystack-signature");
    if (!signature) {
      throw new Error("No signature found");
    }
    const body = await req.text();
    const hash = await crypto.subtle.digest("SHA-512", new TextEncoder().encode(paystackSecretKey + body));
    const expectedSignature = Array.from(new Uint8Array(hash)).map((b)=>b.toString(16).padStart(2, '0')).join('');
    if (signature !== expectedSignature) {
      throw new Error("Invalid signature");
    }
    const event = JSON.parse(body);
    // Create Supabase client with service role key
    const supabaseAdmin = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "", {
      auth: {
        persistSession: false
      }
    });
    if (event.event === "charge.success") {
      const { data: transaction } = event;
      const reference = transaction.reference;
      const email = transaction.customer.email;
      const amount = transaction.amount;
      console.log(`Processing successful payment: ${reference} for ${email}`);
      // Update payment session
      const { error: updateError } = await supabaseAdmin.from("payment_sessions").update({
        status: "completed",
        amount: amount
      }).eq("paystack_reference", reference);
      if (updateError) {
        console.error("Error updating payment session:", updateError);
      }
      // Check if this is a signup payment by looking for metadata
      if (transaction.metadata && transaction.metadata.type === "registration") {
        // This will be handled by the frontend after payment redirect
        console.log("Registration payment completed, waiting for frontend verification");
      } else {
        // Update existing user payment status
        const { data: userData } = await supabaseAdmin.auth.admin.getUserByEmail(email);
        if (userData.user) {
          await supabaseAdmin.from("profiles").update({
            payment_verified: true
          }).eq("user_id", userData.user.id);
          console.log(`Updated payment status for existing user: ${email}`);
        }
      }
      // Send confirmation email (optional - you can implement this)
      console.log(`Payment confirmed for ${email}, amount: ₦${amount / 100}`);
    }
    return new Response(JSON.stringify({
      status: "success"
    }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      },
      status: 200
    });
  } catch (error) {
    console.error('Webhook error:', error);
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
