import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ProShop } from '@/components/ui/ProShop';

export default async function ShopPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  return <ProShop />;
}
