// Hume AI Configuration
// This file contains helper functions for working with Hume's EVI

export interface HumeConfig {
  apiKey: string;
  secretKey: string;
}

/**
 * Hume's EVI (Empathic Voice Interface) Configuration Options
 * 
 * Key parameters you can customize:
 * - voice: The voice model to use (e.g., "ITO", "KORA", "DACHER")
 * - language: Language code (e.g., "en", "es", "fr")
 * - systemPrompt: Instructions for how the AI should behave
 */
export interface EVIConfig {
  voice?: string;
  language?: string;
  systemPrompt: string;
}

/**
 * Get Hume API credentials from environment variables
 * 
 * Note: Hume uses HUME_API_KEY or HUME_CLIENT_ID (older naming)
 * We support both for backward compatibility
 */
export function getHumeCredentials(): HumeConfig {
  // Try new naming convention first, fall back to old naming
  const apiKey = process.env.HUME_API_KEY || process.env.HUME_CLIENT_ID;
  const secretKey = process.env.HUME_SECRET_KEY || process.env.HUME_CLIENT_SECRET;

  if (!apiKey || !secretKey) {
    console.error('Missing Hume credentials. Checked for:');
    console.error('  - HUME_API_KEY or HUME_CLIENT_ID');
    console.error('  - HUME_SECRET_KEY or HUME_CLIENT_SECRET');
    throw new Error(
      'Hume API credentials must be set in environment variables. ' +
      'Please set either (HUME_API_KEY + HUME_SECRET_KEY) or (HUME_CLIENT_ID + HUME_CLIENT_SECRET)'
    );
  }

  // Log that we found credentials (without exposing them)
  console.log('Hume credentials found:', {
    apiKeyPrefix: apiKey.substring(0, 6) + '...',
    secretKeyPrefix: secretKey.substring(0, 6) + '...',
  });

  return { apiKey, secretKey };
}

/**
 * Default EVI configuration for our scenarios
 */
export const DEFAULT_EVI_CONFIG: Partial<EVIConfig> = {
  voice: 'KORA', // Female voice - natural and empathetic
  language: 'en',
};

/**
 * Voice options available in Hume EVI
 * These voices are optimized for emotional expression
 */
export const VOICE_OPTIONS = {
  KORA: { name: 'Kora', gender: 'female', description: 'Warm and empathetic' },
  ITO: { name: 'Ito', gender: 'male', description: 'Professional and calm' },
  DACHER: { name: 'Dacher', gender: 'male', description: 'Friendly and engaging' },
  AURA: { name: 'Aura', gender: 'female', description: 'Confident and clear' },
};

