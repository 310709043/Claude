import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { MainApp } from '@/components/MainApp';

export default async function HomePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return <MainApp initialProfile={profile} />;
}
