export const dynamic = 'force-dynamic';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ProShop } from '@/components/ui/ProShop';

export default async function ShopPage() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/auth/login');
  } catch {
    redirect('/auth/login');
  }
  return <ProShop />;
}
