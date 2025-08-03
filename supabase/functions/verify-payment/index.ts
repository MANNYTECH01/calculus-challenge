import { supabaseAdmin } from "lib/supabaseAdmin.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { reference, email } = await req.json();
    if (!reference || !email) throw new Error("Reference and email are required");
    
    const paystackSecretKey = Deno.env.get("REACT_APP_PAYSTACK_SECRET_KEY");
    if (!paystackSecretKey) throw new Error("Paystack secret key not configured");

    const verifyResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${paystackSecretKey}` },
    });
    const verifyData = await verifyResponse.json();

    if (verifyData.status && verifyData.data.status === "success") {
      await supabaseAdmin.from("payment_sessions").update({ status: "completed" }).eq("paystack_reference", reference).eq("user_email", email);
      const { data: userData } = await supabaseAdmin.auth.admin.getUserByEmail(email);
      if (userData.user) {
        await supabaseAdmin.from("profiles").update({ payment_verified: true }).eq("user_id", userData.user.id);
      }
      return new Response(JSON.stringify({ verified: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200,
      });
    } else {
      return new Response(JSON.stringify({ verified: false, reason: "Payment not completed" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200,
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500,
    });
  }
});