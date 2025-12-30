
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI, Modality } from '@google/genai';
import { ICONS, APP_CONFIG } from '../constants';
import { decode, decodeAudioData, encode } from '../services/geminiService';

const LiveConsultation: React.FC = () => {
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sessionRef = useRef<any>(null);

  useEffect(() => {
    // Initial UI state
    return () => {
      stopSession();
    };
  }, []);

  const startSession = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inputAudioContext = new AudioContext({ sampleRate: 16000 });
      const outputAudioContext = new AudioContext({ sampleRate: 24000 });
      audioContextRef.current = outputAudioContext;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.ref = stream;

      let nextStartTime = 0;
      const sources = new Set<AudioBufferSourceNode>();

      const sessionPromise = ai.live.connect({
        model: APP_CONFIG.MODELS.LIVE,
        callbacks: {
          onopen: () => {
            setIsConnected(true);
            const source = inputAudioContext.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then((s) => s.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);
          },
          onmessage: async (message) => {
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              setIsTalking(true);
              nextStartTime = Math.max(nextStartTime, outputAudioContext.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContext, 24000, 1);
              const source = outputAudioContext.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputAudioContext.destination);
              source.addEventListener('ended', () => {
                sources.delete(source);
                if (sources.size === 0) setIsTalking(false);
              });
              source.start(nextStartTime);
              nextStartTime += audioBuffer.duration;
              sources.add(source);
            }
          },
          onerror: (e) => console.error('Live Error', e),
          onclose: () => setIsConnected(false),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
          systemInstruction: '你是一位温柔的宠物起名专家。请通过语音与用户交流，询问他们宠物的细节，并给出富有创意的名字建议。',
        },
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      alert('无法开启麦克风或连接服务');
    }
  };

  const stopSession = () => {
    if (sessionRef.current) sessionRef.current.close();
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    setIsConnected(false);
    setIsTalking(false);
  };

  return (
    <div className="fixed inset-0 bg-[#0A0A0A] z-[300] flex flex-col items-center justify-between py-20 px-10 text-white overflow-hidden">
      {/* Siri-like Background Glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] transition-all duration-1000 ${
        isConnected ? (isTalking ? 'bg-[#FF6B9D]/30 scale-110' : 'bg-[#007AFF]/20 scale-100') : 'bg-white/5 scale-75'
      }`} />

      <div className="relative z-10 text-center">
        <h1 className="text-2xl font-bold mb-2">AI 灵感专家</h1>
        <p className={`text-sm transition-opacity duration-300 ${isConnected ? 'opacity-60' : 'opacity-30'}`}>
          {isConnected ? (isTalking ? '专家正在为您构思...' : '请说出您宠物的特点') : '准备与 AI 进行语音通话'}
        </p>
      </div>

      {/* Central Visualizer */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        <div className={`absolute inset-0 border-2 rounded-full transition-all duration-500 ${isConnected ? 'border-white/20 animate-pulse' : 'border-white/5'}`} />
        <div className={`w-32 h-32 rounded-full bg-gradient-to-br from-[#FF6B9D] to-[#FFD700] flex items-center justify-center shadow-[0_0_50px_rgba(255,107,157,0.5)] transition-transform duration-300 ${isTalking ? 'scale-110' : 'scale-100'}`}>
          <ICONS.Mic size={48} className="text-white" />
        </div>
        
        {/* Animated Rings */}
        {isTalking && (
          <>
            <div className="absolute inset-0 border border-[#FF6B9D] rounded-full animate-wave" />
            <div className="absolute inset-0 border border-[#FF6B9D] rounded-full animate-wave [animation-delay:0.5s]" />
          </>
        )}
      </div>

      <div className="relative z-10 w-full flex flex-col items-center gap-6">
        {!isConnected ? (
          <button 
            onClick={startSession}
            className="w-20 h-20 rounded-full bg-[#34C759] flex items-center justify-center shadow-xl active:scale-90 transition-transform"
          >
            <ICONS.Phone size={32} />
          </button>
        ) : (
          <button 
            onClick={stopSession}
            className="w-20 h-20 rounded-full bg-[#FF3B30] flex items-center justify-center shadow-xl active:scale-90 transition-transform"
          >
            <ICONS.Close size={32} />
          </button>
        )}
        
        <button 
          onClick={() => navigate(-1)}
          className="text-white/40 text-sm font-medium active:opacity-100"
        >
          离开咨询室
        </button>
      </div>
    </div>
  );
};

export default LiveConsultation;
