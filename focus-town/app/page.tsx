import { redirect } from 'next/navigation';

// Redirect to demo until Supabase is configured, then swap this back to auth-gated MainApp
export default function HomePage() {
  redirect('/demo');
}
