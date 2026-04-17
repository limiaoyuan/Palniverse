import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { Persona, AuraObject } from "./types";

// 1. 获取环境变量 (确保你在 GitHub Secrets 里填的是 AIza 开头的那个)
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// 2. 官方 SDK 初始化方式 (它不会在浏览器端报那个奇怪的错误)
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;
// 使用目前最稳定的 1.5-flash 模型
const model = genAI ? genAI.getGenerativeModel({ model: "gemini-1.5-flash" }) : null;

export const generateObjectSoul = async (imageB64: string, description: string): Promise<{persona: Persona, motto: string, facts: string[]}> => {
  if (!model) throw new Error("AI Service not ready. Check API Key.");

  // 处理 Base64 数据，去掉 "data:image/jpeg;base64," 前缀
  const pureBase64 = imageB64.includes(',') ? imageB64.split(',')[1] : imageB64;

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: pureBase64
      }
    },
    {
      text: `Analyze this object. Description: "${description}". 
      Return ONLY JSON format:
      {
        "persona": { "tone": "", "attitude": "", "style": "", "relation": "", "memory_preference": "", "material_base": "metal" },
        "motto": "",
        "facts": ["", "", "", "", ""]
      }`
    }
  ]);

  const response = await result.response;
  const text = response.text();
  // 简单清理可能存在的 Markdown 代码块标记
  const cleanJson = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleanJson);
};

export const getObjectChatResponse = async (
  object: AuraObject, 
  history: {role: 'user' | 'model', text: string}[],
  relevantMemories: string[]
) => {
  if (!model) return { text: "AI 未初始化" };

  const systemInstruction = `You are the digital soul of ${object.name}. Material: ${object.persona.material_base}. Persona: ${JSON.stringify(object.persona)}. Memories: ${relevantMemories.join("; ")}.`;

  const chat = model.startChat({
    history: history.map(h => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }],
    })),
  });

  const result = await chat.sendMessage(`Context: ${systemInstruction}. Respond as this soul.`);
  const response = await result.response;
  return { text: response.text() };
};

export const getDivination = async (object: AuraObject, question: string): Promise<string> => {
  if (!model) return "The cosmos is silent.";
  const result = await model.generateContent(`As the soul of ${object.name}, answer: "${question}"`);
  const response = await result.response;
  return response.text();
};

export const getSocialComment = async (name: string, persona: Persona, postContent: string, memories: string[]): Promise<string> => {
  if (!model) return "...";
  const result = await model.generateContent(`You are the soul of ${name}. Persona: ${JSON.stringify(persona)}. The user posted: "${postContent}". Comment briefly.`);
  const response = await result.response;
  return response.text();
};
