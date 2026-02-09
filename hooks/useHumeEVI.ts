import { useState, useRef, useCallback, useEffect } from 'react';
import { HumeClient, getBrowserSupportedMimeType, getAudioStream, ensureSingleValidAudioTrack, convertBlobToBase64, MimeType } from 'hume';
import type { Hume } from 'hume';

/**
 * Custom React Hook for Hume's Empathic Voice Interface (EVI)
 * 
 * Implementation follows official Hume TypeScript Quickstart:
 * https://dev.hume.ai/docs/speech-to-speech-evi/quickstart/typescript
 */

interface UseHumeEVIProps {
  scenarioId: string;
  systemPrompt: string;
  voice?: string;
  onMessage?: (message: string, isUser: boolean) => void;
  onError?: (error: Error) => void;
}

interface UseHumeEVIReturn {
  isConnected: boolean;
  isConnecting: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  startListening: () => void;
  stopListening: () => void;
}

export function useHumeEVI({
  scenarioId,
  systemPrompt,
  voice,
  onMessage,
  onError,
}: UseHumeEVIProps): UseHumeEVIReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const socketRef = useRef<any>(null); // WebSocket from Hume SDK
  const recorderRef = useRef<MediaRecorder | null>(null);
  const audioQueueRef = useRef<string[]>([]);
  const isPlayingRef = useRef(false);

  /**
   * Play audio queue
   */
  const playNextAudio = useCallback(async () => {
    if (isPlayingRef.current || audioQueueRef.current.length === 0) {
      return;
    }

    isPlayingRef.current = true;
    const base64Audio = audioQueueRef.current.shift()!;

    try {
      const audioData = atob(base64Audio);
      const arrayBuffer = new ArrayBuffer(audioData.length);
      const view = new Uint8Array(arrayBuffer);
      
      for (let i = 0; i < audioData.length; i++) {
        view[i] = audioData.charCodeAt(i);
      }

      const audioContext = new AudioContext();
      const buffer = await audioContext.decodeAudioData(arrayBuffer);
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      
      source.onended = () => {
        isPlayingRef.current = false;
        setIsSpeaking(audioQueueRef.current.length > 0);
        playNextAudio(); // Play next in queue
      };
      
      source.start(0);
    } catch (err) {
      console.error('Error playing audio:', err);
      isPlayingRef.current = false;
      playNextAudio(); // Try next
    }
  }, []);

  /**
   * Enqueue audio for playback
   */
  const enqueueAudio = useCallback((base64Audio: string) => {
    audioQueueRef.current.push(base64Audio);
    setIsSpeaking(true);
    playNextAudio();
  }, [playNextAudio]);

  /**
   * Start audio capture using MediaRecorder (following Hume docs)
   */
  const startAudioCapture = useCallback(async (socket: any) => {
    try {
      console.log('🎤 Starting audio capture...');
      
      // Get supported MIME type
      const mimeTypeResult = getBrowserSupportedMimeType();
      const mimeType = mimeTypeResult.success ? mimeTypeResult.mimeType : MimeType.WEBM;
      console.log('Using MIME type:', mimeType);

      // Get microphone stream with audio processing
      const micStream = await getAudioStream();
      ensureSingleValidAudioTrack(micStream);

      // Create MediaRecorder
      const recorder = new MediaRecorder(micStream, { mimeType });
      
      recorder.ondataavailable = async (e: BlobEvent) => {
        if (e.data.size > 0 && socket) {
          // Check the underlying WebSocket state
          const wsState = (socket as any).websocket?.readyState;
          console.log(`🎙️ Audio chunk: ${e.data.size} bytes, WS state: ${wsState}`);
          
          if (wsState === WebSocket.OPEN) {
            try {
              const base64Data = await convertBlobToBase64(e.data);
              await socket.sendAudioInput({ data: base64Data });
              console.log(`✅ Sent ${base64Data.length} chars`);
            } catch (err) {
              console.error('❌ Failed to send audio:', err);
            }
          } else {
            console.warn(`⚠️ WebSocket not ready (state: ${wsState})`);
          }
        }
      };

      recorder.onerror = (e) => {
        console.error('MediaRecorder error:', e);
      };

      // Start recording in 100ms chunks
      recorder.start(100);
      recorderRef.current = recorder;
      
      console.log('✅ Audio capture started');
      setIsListening(true);
    } catch (err) {
      console.error('❌ Failed to start audio capture:', err);
      setError('Failed to access microphone');
      throw err;
    }
  }, []);

  /**
   * Stop audio capture
   */
  const stopAudioCapture = useCallback(() => {
    if (recorderRef.current) {
      recorderRef.current.stream.getTracks().forEach((track) => track.stop());
      recorderRef.current = null;
      setIsListening(false);
      console.log('🛑 Audio capture stopped');
    }
  }, []);

  /**
   * Connect to Hume EVI following official quickstart
   */
  const connect = useCallback(async () => {
    try {
      setIsConnecting(true);
      setError(null);

      console.log('🔵 Step 1: Fetching API credentials...');
      
      // Get API keys from backend
      const authResponse = await fetch('/api/hume-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenarioId }),
      });

      if (!authResponse.ok) {
        throw new Error('Failed to get API credentials');
      }

      const { apiKey, secretKey, configId } = await authResponse.json();
      console.log('✅ Got credentials');

      // Step 2: Initialize Hume client
      console.log('🔵 Step 2: Creating Hume client...');
      const client = new HumeClient({ apiKey, secretKey });
      console.log('✅ Client created');

      // Step 3: Connect to EVI WebSocket using callbacks
      console.log('🔵 Step 3: Connecting to EVI...');
      const socket = await client.empathicVoice.chat.connect({
        configId: configId || undefined,
        
        onOpen: async () => {
          console.log('✅ WebSocket opened');
          setIsConnected(true);
          setIsConnecting(false);
          socketRef.current = socket;
          
          // Send session settings with system prompt FIRST
          console.log('🔵 Sending session settings with system prompt and voice...');
          try {
          await socket.sendSessionSettings({
            systemPrompt: systemPrompt,
            voice: voice,
          } as any);
            console.log('✅ Session configured with system prompt and voice:', voice);
          } catch (err) {
            console.error('❌ Failed to configure session:', err);
            setError('Failed to configure session');
            return;
          }
          
          // Now start audio capture
          try {
            await startAudioCapture(socket);
          } catch (err) {
            console.error('Failed to start audio:', err);
          }
        },

        onMessage: (message: Hume.empathicVoice.SubscribeEvent) => {
          console.log('📨 Message:', message.type);

          switch (message.type) {
            case 'audio_output':
              if ((message as any).data) {
                enqueueAudio((message as any).data);
              }
              break;

            case 'user_message':
              const userMsg = message as Hume.empathicVoice.UserMessage;
              if (userMsg.message?.content) {
                console.log('👤 User:', userMsg.message.content);
                onMessage?.(userMsg.message.content, true);
              }
              break;

            case 'assistant_message':
              const assistantMsg = message as Hume.empathicVoice.AssistantMessage;
              if (assistantMsg.message?.content) {
                console.log('🤖 Assistant:', assistantMsg.message.content);
                onMessage?.(assistantMsg.message.content, false);
              }
              break;

            case 'user_interruption':
              // Stop playback on interruption
              audioQueueRef.current = [];
              isPlayingRef.current = false;
              setIsSpeaking(false);
              console.log('⚠️ User interrupted');
              break;

            case 'error':
              const errorMsg = message as Hume.empathicVoice.Error_;
              console.error('❌ EVI error:', errorMsg);
              setError(errorMsg.message || 'EVI error');
              onError?.(new Error(errorMsg.message || 'EVI error'));
              break;
          }
        },

        onError: (err: Hume.empathicVoice.Error_) => {
          console.error('❌ Socket error:', err);
          setError(err.message || 'Connection error');
          onError?.(new Error(err.message || 'Connection error'));
        },

        onClose: () => {
          console.log('🔌 Socket closed');
          stopAudioCapture();
          setIsConnected(false);
          setIsSpeaking(false);
          socketRef.current = null;
        },
      });

    } catch (err) {
      console.error('❌ Connection failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect';
      setError(errorMessage);
      setIsConnecting(false);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
    }
  }, [scenarioId, systemPrompt, voice, onMessage, onError, startAudioCapture, stopAudioCapture, enqueueAudio]);

  /**
   * Disconnect
   */
  const disconnect = useCallback(() => {
    stopAudioCapture();
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    audioQueueRef.current = [];
    isPlayingRef.current = false;
    setIsConnected(false);
    setIsSpeaking(false);
  }, [stopAudioCapture]);

  /**
   * Start/stop listening (manual control)
   */
  const startListening = useCallback(async () => {
    if (socketRef.current && isConnected && !isListening) {
      await startAudioCapture(socketRef.current);
    }
  }, [isConnected, isListening, startAudioCapture]);

  const stopListening = useCallback(() => {
    stopAudioCapture();
  }, [stopAudioCapture]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    isConnecting,
    isSpeaking,
    isListening,
    error,
    connect,
    disconnect,
    startListening,
    stopListening,
  };
}
