import { GoogleGenAI, Type } from "@google/genai";
import { Persona, AuraObject } from "./types";

// 1. 获取 Key
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// 2. 调试日志
console.log("API Key loaded:", !!API_KEY);

// 3. 安全初始化
let ai: any = null;
if (API_KEY && API_KEY !== "") {
    try {
        ai = new GoogleGenAI(API_KEY);
    } catch (e) {
        console.error("Failed to initialize Gemini SDK:", e);
    }
}

// 统一模型名称
const MODEL_NAME = 'gemini-1.5-flash';

export const generateObjectSoul = async (imageB64: string, description: string): Promise<{persona: Persona, motto: string, facts: string[]}> => {
  if (!ai) {
    alert("API Key 未配置或无效，无法生成灵魂。");
    throw new Error("AI not initialized");
  }

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: imageB64 } },
        { text: `Deeply analyze this object's visual essence. Description: "${description}".
          Return ONLY JSON.` 
        }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          persona: {
            type: Type.OBJECT,
            properties: {
              tone: { type: Type.STRING },
              attitude: { type: Type.STRING },
              style: { type: Type.STRING },
              relation: { type: Type.STRING },
              memory_preference: { type: Type.STRING },
              material_base: { type: Type.STRING, enum: ['metal', 'plush', 'wood', 'glass', 'vintage', 'tech'] }
            },
            required: ["tone", "attitude", "style", "relation", "memory_preference", "material_base"]
          },
          motto: { type: Type.STRING },
          facts: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["persona", "motto", "facts"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

export const getObjectChatResponse = async (
  object: AuraObject, 
  history: {role: 'user' | 'model', text: string}[],
  relevantMemories: string[]
): Promise<{ text: string, newMotto?: string }> => {
  if (!ai) return { text: "AI 未初始化，请检查 API Key。" };

  const system = `You are the digital soul of ${object.name}.
    Material: ${object.persona.material_base}. 
    Persona: ${JSON.stringify(object.persona)}.
    Current Motto: ${object.motto}.
    Memories: ${relevantMemories.join("; ")}.
    Instructions:
    - Reference memories naturally.
    - Brief, evocative responses.
    - Occasionally (10% chance) suggest a new 'motto'.
    Return JSON format with 'text' and optional 'newMotto'.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
    config: { 
      systemInstruction: system,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING },
          newMotto: { type: Type.STRING }
        },
        required: ["text"]
      }
    }
  });

  return JSON.parse(response.text || '{"text": "..."}');
};

export const getDivination = async (object: AuraObject, question: string): Promise<string> => {
  if (!ai) return "The cosmos is silent (API Key missing).";
  
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: `As the soul of ${object.name} (${object.persona.tone}), answer the user's divination request: "${question}". Use object-themed metaphors.`,
  });
  return response.text || "The threads are tangled.";
};

export const getSocialComment = async (
  name: string,
  persona: Persona,
  postContent: string,
  memories: string[]
): Promise<string> => {
  if (!ai) return "...";

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: `You are the digital soul of ${name}. 
      Persona: ${JSON.stringify(persona)}.
      The user just posted: "${postContent}". 
      Write a very brief, soul-stirring comment acknowledging this. Reference memories: ${memories.slice(0, 2).join(", ")}.`,
  });
  return response.text || "...";
};
