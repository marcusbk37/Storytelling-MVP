import { NextResponse } from 'next/server';
import { getAllScenarios } from '@/lib/scenarios';

/**
 * API Route: /api/scenarios
 * 
 * Returns list of all available training scenarios
 */

export async function GET() {
  const scenarios = getAllScenarios();
  return NextResponse.json(scenarios);
}

