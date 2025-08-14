import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

// Initialize a separate Supabase client with the service_role key
// This gives it admin privileges to bypass Row Level Security policies.
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

Deno.serve(async (req) => {
  // This is needed to handle the preflight request from the browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get the userId from the request body
    const { userId } = await req.json();
    if (!userId) {
      throw new Error("User ID is required.");
    }

    // Update the 'profiles' table using the admin client
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ payment_verified: true })
      .eq('user_id', userId);

    if (updateError) {
      throw updateError;
    }

    return new Response(JSON.stringify({ message: 'Payment confirmed successfully.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});