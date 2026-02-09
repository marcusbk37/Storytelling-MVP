import { redirect } from 'next/navigation';

// Root route: immediately take users to the storytelling demo page.
export default function RootPage() {
  redirect('/storytelling');
}

