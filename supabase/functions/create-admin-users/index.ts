import { supabaseAdmin } from 'lib/supabaseAdmin.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  try {
    const { data: adminUser, error: adminError } = await supabaseAdmin.auth.admin.createUser({
      email: 'schooltact01@gmail.com',
      password: 'Oluwaseun@7',
      email_confirm: true,
      user_metadata: { username: 'admin_school', full_name: 'School Admin' }
    });
    if (adminError) throw adminError;

    const { data: regularUser, error: regularError } = await supabaseAdmin.auth.admin.createUser({
      email: 'iseoluwae949@gmail.com',
      password: 'Deelite@7',
      email_confirm: true,
      user_metadata: { username: 'user_iseo', full_name: 'Iseo User' }
    });
    if (regularError) throw regularError;

    await supabaseAdmin.from('profiles').insert({ user_id: adminUser.user.id, username: 'admin_school', full_name: 'School Admin', payment_verified: true });
    await supabaseAdmin.from('profiles').insert({ user_id: regularUser.user.id, username: 'user_iseo', full_name: 'Iseo User', payment_verified: true });
    await supabaseAdmin.from('admin_panel').insert({ user_id: adminUser.user.id, is_admin: true });

    return new Response(JSON.stringify({ success: true, message: 'Users created successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
})