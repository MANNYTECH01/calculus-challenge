import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Create admin user
    const { data: adminUser, error: adminError } = await supabaseAdmin.auth.admin.createUser({
      email: 'schooltact01@gmail.com',
      password: 'Oluwaseun@7',
      email_confirm: true,
      user_metadata: {
        username: 'admin_school',
        full_name: 'School Admin'
      }
    })

    if (adminError) {
      console.error('Admin creation error:', adminError)
      throw adminError
    }

    // Create regular user
    const { data: regularUser, error: regularError } = await supabaseAdmin.auth.admin.createUser({
      email: 'iseoluwae949@gmail.com',
      password: 'Deelite@7',
      email_confirm: true,
      user_metadata: {
        username: 'user_iseo',
        full_name: 'Iseo User'
      }
    })

    if (regularError) {
      console.error('Regular user creation error:', regularError)
      throw regularError
    }

    // Create profiles for both users
    const { error: adminProfileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        user_id: adminUser.user.id,
        username: 'admin_school',
        full_name: 'School Admin',
        payment_verified: true
      })

    if (adminProfileError) {
      console.error('Admin profile error:', adminProfileError)
      throw adminProfileError
    }

    const { error: regularProfileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        user_id: regularUser.user.id,
        username: 'user_iseo',
        full_name: 'Iseo User',
        payment_verified: true
      })

    if (regularProfileError) {
      console.error('Regular profile error:', regularProfileError)
      throw regularProfileError
    }

    // Make admin user an admin
    const { error: adminPanelError } = await supabaseAdmin
      .from('admin_panel')
      .insert({
        user_id: adminUser.user.id,
        is_admin: true
      })

    if (adminPanelError) {
      console.error('Admin panel error:', adminPanelError)
      throw adminPanelError
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Users created successfully',
        adminUserId: adminUser.user.id,
        regularUserId: regularUser.user.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error creating users:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})