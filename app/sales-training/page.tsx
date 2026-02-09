import { redirect } from 'next/navigation';

// All storytelling now lives at /storytelling. Redirect old URL.
export default function SalesTrainingRedirect() {
  redirect('/storytelling');
}
