import { redirect } from 'next/navigation';

// All storytelling dashboard at /storytelling/dashboard. Redirect old URL.
export default function SalesDashboardRedirect() {
  redirect('/storytelling/dashboard');
}
