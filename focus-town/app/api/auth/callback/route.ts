import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      // Upsert profile for OAuth users
      const { data: existing } = await supabase.from('profiles').select('id').eq('id', data.user.id).single();
      if (!existing) {
        const colors = ['#6c5ce7','#fd79a8','#00b894','#0984e3','#e17055'];
        await supabase.from('profiles').insert({
          id: data.user.id,
          username: data.user.email?.split('@')[0] || 'user',
          display_name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User',
          avatar_url: data.user.user_metadata?.avatar_url || null,
          role: 'Student',
          car_color: colors[Math.floor(Math.random() * colors.length)],
          car_skin: 'default',
        });
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=oauth_error`);
}
