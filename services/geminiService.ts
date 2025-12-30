
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { APP_CONFIG } from "../constants";

// Helper to decode Base64
export function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Helper to encode to Base64
export function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Helper to decode raw PCM to AudioBuffer
export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const geminiService = {
  // Generate names with Google Search Grounding
  async generateNamesWithGrounding(params: {
    petType: string;
    personality: string[];
  }) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `为一只${params.petType}推荐5个名字，性格特点：${params.personality.join(',')}. 
    请使用Google Search搜索这些名字在当下的流行度、是否有特殊的文化含义或最近相关的热门事件。
    返回JSON格式。`;

    const response = await ai.models.generateContent({
      model: APP_CONFIG.MODELS.TEXT,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              meaning: { type: Type.STRING },
              trends: { type: Type.STRING, description: "基于搜索结果的流行度分析" },
              sources: { type: Type.ARRAY, items: { type: Type.STRING }, description: "参考链接" },
              popularity: {
                type: Type.OBJECT,
                properties: { global: { type: Type.NUMBER } }
              }
            },
            required: ["name", "meaning", "trends"]
          }
        }
      }
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    return {
      data: JSON.parse(response.text || '[]'),
      chunks: groundingChunks
    };
  },

  async analyzePetImage(base64Image: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const imagePart = {
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Image.split(',')[1] || base64Image,
      },
    };
    const textPart = { 
      text: `Analyze this pet photo. 
      Identify its species (choose ONLY from: 小狗, 小猫, 小鸟, 兔兔, 仓鼠, 其他).
      Identify its possible breed.
      Identify primary personality traits (choose ONLY from: 调皮活泼, 温柔粘人, 高冷傲娇, 憨态可掬, 聪明伶俐, 贪吃懒做). 
      Return as JSON.` 
    };

    const response = await ai.models.generateContent({
      model: APP_CONFIG.MODELS.VISION,
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            species: { type: Type.STRING },
            breed: { type: Type.STRING },
            traits: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["species", "breed", "traits"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  },

  // NEW: Process audio to extract form intents
  async extractIntentFromAudio(audioBase64: string, mimeType: string, options: any) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const audioPart = {
      inlineData: {
        data: audioBase64,
        mimeType: mimeType
      }
    };
    const textPart = {
      text: `Based on this audio, extract the user's choices for the following categories if mentioned:
      - petType (Valid options: ${options.type.join(', ')})
      - gender (Valid options: ${options.gender.join(', ')})
      - personality (Valid options: ${options.personality.join(', ')})
      
      Return as JSON. If something is not mentioned, return null for that field. 
      For personality, return an array of all detected traits.`
    };

    const response = await ai.models.generateContent({
      model: APP_CONFIG.MODELS.TEXT,
      contents: { parts: [audioPart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            petType: { type: Type.STRING, nullable: true },
            gender: { type: Type.STRING, nullable: true },
            personality: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });

    return JSON.parse(response.text || '{}');
  },

  async speakName(text: string, voice: 'Kore' | 'Puck' = 'Kore'): Promise<void> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: APP_CONFIG.MODELS.TTS,
      contents: [{ parts: [{ text: `Say clearly: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) return;

    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const audioData = decode(base64Audio);
    const buffer = await decodeAudioData(audioData, audioCtx, 24000, 1);
    
    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtx.destination);
    source.start();
  }
};
