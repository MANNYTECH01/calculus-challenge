import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '', 
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('Fetching questions and explanations...');
    
    // Fetch all questions with explanations
    const { data: questions, error: qError } = await supabaseAdmin
      .from('questions')
      .select('*');
    
    if (qError) {
      console.error('Error fetching questions:', qError);
      throw qError;
    }

    console.log(`Found ${questions?.length || 0} questions`);

    // Return questions with explanations
    // Note: explanations are stored directly in the questions table
    return new Response(JSON.stringify({
      questions: questions || [],
      explanations: (questions || []).map(q => ({
        question_id: q.id,
        explanation: q.explanation
      })).filter(e => e.explanation) // Only include questions that have explanations
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 200
    });
  } catch (error) {
    console.error('Function error:', error);
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
