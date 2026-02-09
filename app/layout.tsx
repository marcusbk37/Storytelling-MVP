import type { Metadata } from 'next';
import './globals.css';
import { PostHogProvider, PostHogPageView } from '@/components/PostHogProvider';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Manager Training Scenarios',
  description: 'Practice difficult conversations with AI-powered simulations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <PostHogProvider>
          <Suspense fallback={null}>
            <PostHogPageView />
          </Suspense>
          {children}
        </PostHogProvider>
      </body>
    </html>
  );
}
