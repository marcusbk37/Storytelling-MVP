import { NextResponse } from 'next/server';
import { getScenario } from '@/lib/scenarios';

/**
 * API Route: /api/scenarios/[id]
 * 
 * Returns a specific scenario by ID
 */

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const scenario = getScenario(params.id);
  
  if (!scenario) {
    return NextResponse.json(
      { error: 'Scenario not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json(scenario);
}

