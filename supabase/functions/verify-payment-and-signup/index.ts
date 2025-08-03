import { supabaseAdmin } from "lib/supabaseAdmin.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { reference, email, password, username, location } = await req.json();
    if (!reference || !email || !password || !username) throw new Error("Missing required fields.");

    const paystackSecretKey = Deno.env.get("REACT_APP_PAYSTACK_SECRET_KEY");
    if (!paystackSecretKey) throw new Error("Paystack secret key not configured");

    const verifyResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${paystackSecretKey}` },
    });
    const verifyData = await verifyResponse.json();

    if (!verifyData.status || verifyData.data.status !== "success") {
      return new Response(JSON.stringify({ verified: false, reason: "Payment not completed" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400,
      });
    }

    const { data: { user }, error: signUpError } = await supabaseAdmin.auth.admin.createUser({ email, password, user_metadata: { username, location: location || "Not specified" }, email_confirm: true });
    if (signUpError) throw new Error(`User creation failed: ${signUpError.message}`);

    await supabaseAdmin.from("payment_sessions").update({ status: "completed" }).eq("paystack_reference", reference).eq("user_email", email);
    await supabaseAdmin.from("profiles").insert({ user_id: user.id, username, full_name: username, location: location || "Not specified", payment_verified: true });

    return new Response(JSON.stringify({ verified: true, user_created: true, message: "Account created successfully" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500,
    });
  }
});