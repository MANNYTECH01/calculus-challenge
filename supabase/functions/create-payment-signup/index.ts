import { supabaseAdmin } from "lib/supabaseAdmin.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { email, password, username, location } = await req.json();
    if (!email || !password || !username) throw new Error("Email, password, and username are required");

    const paystackSecretKey = Deno.env.get("REACT_APP_PAYSTACK_SECRET_KEY");
    if (!paystackSecretKey) throw new Error("Paystack secret key not configured");

    const reference = `quiz_${Date.now()}`;
    const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: { "Authorization": `Bearer ${paystackSecretKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ email, amount: 100000, reference, currency: "NGN", callback_url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/verify-payment-and-signup`, metadata: { username, location: location || "Not specified" } }),
    });
    const paystackData = await paystackResponse.json();
    if (!paystackData.status) throw new Error(paystackData.message);

    await supabaseAdmin.from("payment_sessions").insert({ user_email: email, paystack_reference: reference, paystack_access_code: paystackData.data.access_code, amount: 1000, currency: "ngn", status: "pending" });

    return new Response(JSON.stringify({ authorization_url: paystackData.data.authorization_url, access_code: paystackData.data.access_code, reference }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500,
    });
  }
});