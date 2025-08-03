import { supabaseAdmin } from "lib/supabaseAdmin.ts";
import { crypto } from "https://deno.land/std@0.190.0/crypto/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-paystack-signature",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const paystackSecretKey = Deno.env.get("REACT_APP_PAYSTACK_SECRET_KEY");
    if (!paystackSecretKey) {
      throw new Error("Paystack secret key not configured");
    }

    const signature = req.headers.get("x-paystack-signature");
    if (!signature) {
      throw new Error("No signature found");
    }

    const body = await req.text();
    const hash = await crypto.subtle.digest(
      "SHA-512",
      new TextEncoder().encode(paystackSecretKey + body)
    );
    
    const expectedSignature = Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    if (signature !== expectedSignature) {
      throw new Error("Invalid signature");
    }

    const event = JSON.parse(body);
    
    if (event.event === "charge.success") {
      const { data: transaction } = event;
      const reference = transaction.reference;
      const email = transaction.customer.email;
      const amount = transaction.amount;

      await supabaseAdmin.from("payment_sessions").update({ status: "completed", amount: amount }).eq("paystack_reference", reference);

      if (transaction.metadata && transaction.metadata.type === "registration") {
        console.log("Registration payment completed, waiting for frontend verification");
      } else {
        const { data: userData } = await supabaseAdmin.auth.admin.getUserByEmail(email);
        
        if (userData.user) {
          await supabaseAdmin.from("profiles").update({ payment_verified: true }).eq("user_id", userData.user.id);
        }
      }
    }

    return new Response(JSON.stringify({ status: "success" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});