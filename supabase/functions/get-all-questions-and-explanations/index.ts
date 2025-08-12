import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const supabaseAdmin = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};
Deno.serve(async (_req)=>{
  if (_req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  try {
    // Fetch all questions
    const { data: questions, error: qError } = await supabaseAdmin.from('questions').select('*');
    if (qError) throw qError;
    // Fetch all explanations
    const { data: explanations, error: eError } = await supabaseAdmin.from('answer_explanations').select('question_id, explanation');
    if (eError) throw eError;
    return new Response(JSON.stringify({
      questions,
      explanations
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 200
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 500
    });
  }
});
