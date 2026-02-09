import { notFound } from 'next/navigation';
import { getScenario } from '@/lib/scenarios';
import ScenarioInterface from '@/components/ScenarioInterface';

/**
 * Dynamic page for individual scenario
 * Route: /scenarios/[id]
 * 
 * This is a Next.js dynamic route that renders a specific training scenario
 */

export default function ScenarioPage({ params }: { params: { id: string } }) {
  const scenario = getScenario(params.id);

  if (!scenario) {
    notFound();
  }

  return <ScenarioInterface scenario={scenario} />;
}

// Generate static params for all scenarios (optional - for better performance)
export async function generateStaticParams() {
  return [
    { id: 'storytelling' },
  ];
}

