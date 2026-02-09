import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getScenario } from '@/lib/scenarios';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface TranscriptMessage {
  speaker: string;
  text: string;
  timestamp: string;
}

interface AnalysisRequest {
  transcript: TranscriptMessage[];
  scenarioId: string;
  objectives: string[];
}

export async function POST(request: Request) {
  try {
    const { transcript, scenarioId, objectives }: AnalysisRequest = await request.json();
    const scenario = getScenario(scenarioId);

    if (!transcript || !scenarioId || !objectives) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Format transcript for Claude
    const transcriptText = transcript
      .map((msg) => `${msg.speaker}: ${msg.text}`)
      .join('\n\n');

    let analysisStyle = `Your analysis should be:
        - Specific and evidence-based (cite exact moments from the transcript)
        - Balanced (acknowledge strengths AND areas for growth)
        - Actionable (provide concrete suggestions for improvement)
        - Empathetic yet direct
        - Focused on storytelling skills: emotional depth, clarity, specificity, and narrative coherence`;

    // For now, we treat all conversations as storytelling practice with a human interest journalist.
    const systemPrompt = `You are an expert storytelling and narrative coach.
    Analyze the transcript and provide constructive, actionable feedback focused on:
    - Helping the user tell one clear, specific story
    - Drawing out concrete scenes and sensory details
    - Exploring emotions, stakes, and what changed
    - Strengthening the overall narrative arc and meaning.
    ${analysisStyle}`;

    const userPrompt = `Analyze this conversation transcript between a user and an AI roleplay. 
    Your goal is to provide constructive, actionable feedback for the user to handle the AI better.

OBJECTIVES FOR THIS CONVERSATION:
${objectives.map((obj, idx) => `${idx + 1}. ${obj}`).join('\n')}

TRANSCRIPT:
${transcriptText}

Please provide a detailed analysis in the following JSON format:
{
  "overallScore": <number 0-100>,
  "sentiment": "<Professional/Empathetic/Direct/Defensive/etc>",
  "positives": [
    "<specific positive observation with evidence>",
    "<another positive>",
    ...
  ],
  "improvements": [
    "<specific area to improve with suggestion>",
    "<another improvement>",
    ...
  ],
  "objectivesAnalysis": {
    "achieved": [<indices of objectives that were achieved>],
    "notAchieved": [<indices of objectives that were not achieved>],
    "explanation": "<brief explanation of objective performance>"
  },
  "speakingBalance": {
    "managerPercentage": <estimated % manager spoke>,
    "assessment": "<whether balance was appropriate and why>"
  },
  "fillerWordsEstimate": <rough count of um, uh, like, etc>,
  "keyMoments": [
    {
      "timestamp": "<quote the speaker and moment>",
      "type": "positive" | "suggestion",
      "label": "<short label>",
      "explanation": "<why this moment was significant>",
      "suggestion": "<if type is suggestion, what to do differently>"
    }
  ],
  "nextSteps": [
    "<actionable recommendation for future conversations>",
    ...
  ]
}

Be thorough but concise. Focus on practical, actionable insights.`;

    console.log('🤖 Sending to Claude for analysis...');

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      temperature: 0.3, // Lower temperature for more consistent analysis
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    // Extract the JSON from Claude's response
    const textContent = response.content[0];
    if (textContent.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    // Parse Claude's JSON response
    let analysis;
    try {
      // Claude might wrap JSON in markdown code blocks, so strip those
      const jsonText = textContent.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      analysis = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Failed to parse Claude response:', textContent.text);
      throw new Error('Failed to parse analysis from Claude');
    }

    console.log('✅ Analysis complete');

    return NextResponse.json({
      success: true,
      analysis,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      },
    });

  } catch (error) {
    console.error('❌ Error in analyze-conversation route:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to analyze conversation',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}

