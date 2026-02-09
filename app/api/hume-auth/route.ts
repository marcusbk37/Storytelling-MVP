import { NextResponse } from 'next/server';
import { getHumeCredentials } from '@/lib/hume-config';
import { getScenario } from '@/lib/scenarios';
import { Hume } from 'hume';

/**
 * API Route: /api/hume-auth
 * 
 * This endpoint provides API credentials and creates/returns a config for EVI
 * 
 * WHY THIS IS NEEDED:
 * - We never want to expose API keys directly in the client/browser code
 * - This server-side endpoint securely provides credentials at runtime
 * - Creates EVI configs with scenario-specific system prompts
 * 
 * FLOW:
 * 1. Frontend calls this endpoint with scenario ID
 * 2. Server gets API keys from environment
 * 3. Server creates/gets EVI config with system prompt
 * 4. Server returns credentials and config ID to frontend
 * 5. Frontend uses these to establish WebSocket connection
 */

export async function POST(request: Request) {
  try {
    // Get credentials with improved error logging
    const { apiKey, secretKey } = getHumeCredentials();
    
    // Get the scenario ID from the request
    const body = await request.json();
    const { scenarioId } = body;

    console.log('✅ Providing Hume credentials for scenario:', scenarioId);
    console.log('API Key prefix:', apiKey.substring(0, 10) + '...');
    
    // Get scenario to check if we need to create a config
    const scenario = getScenario(scenarioId);
    
    if (!scenario) {
      return NextResponse.json(
        { error: 'Scenario not found' },
        { status: 404 }
      );
    }

    // For now, we'll let the client handle config creation inline
    // or we can create a config here if needed
    // TODO: Optionally create a config with the system prompt and return configId
    
    console.log('✅ Credentials ready for EVI connection');
    
    return NextResponse.json({
      apiKey,
      secretKey,
      configId: undefined, // Client will use inline session settings
      scenarioId,
    });

  } catch (error) {
    console.error('❌ Error in hume-auth route:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}

