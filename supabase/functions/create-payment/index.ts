import { supabaseAdmin } from "lib/supabaseAdmin.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { email, location } = await req.json();
    if (!email) throw new Error("Email is required");

    const paystackSecretKey = Deno.env.get("REACT_APP_PAYSTACK_SECRET_KEY");
    if (!paystackSecretKey) throw new Error("Paystack secret key not configured");
    
    const reference = `mth102_${Date.now()}`;
    const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: { "Authorization": `Bearer ${paystackSecretKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ email, amount: 50000, currency: "NGN", reference, callback_url: `${req.headers.get("origin")}/auth?payment=success&reference=${reference}` }),
    });
    const paystackData = await paystackResponse.json();
    if (!paystackData.status) throw new Error(paystackData.message);

    await supabaseAdmin.from("payment_sessions").insert({ user_email: email, paystack_reference: reference, paystack_access_code: paystackData.data.access_code, amount: 100000, status: "pending" });

    return new Response(JSON.stringify({ url: paystackData.data.authorization_url, reference, access_code: paystackData.data.access_code }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500,
    });
  }
});