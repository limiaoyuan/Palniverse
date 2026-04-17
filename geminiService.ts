
import { GoogleGenAI, Type } from "@google/genai";
import { Persona, AuraObject } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateObjectSoul = async (imageB64: string, description: string): Promise<{persona: Persona, motto: string, facts: string[]}> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: imageB64 } },
        { text: `Deeply analyze this object's visual essence. Description: "${description}".
          1. Persona: Material base (metal/plush/wood/glass/vintage/tech), Tone, Attitude, Style, Relation, Memory_preference.
          2. Motto: A soul-stirring one-sentence quote about its existence.
          3. Facts: 5 interesting labels/tags about its soul or history.
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
  const system = `You are the digital soul of ${object.name}.
    Material: ${object.persona.material_base}. 
    Persona: ${JSON.stringify(object.persona)}.
    Current Motto: ${object.motto}.
    Memories: ${relevantMemories.join("; ")}.
    Instructions:
    - Reference memories naturally.
    - Brief, evocative responses.
    - Occasionally (10% chance) suggest a new 'motto' that reflects your evolving bond.
    Return JSON format with 'text' and optional 'newMotto'.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
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
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
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
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `You are the digital soul of ${name}. 
      Persona: ${JSON.stringify(persona)}.
      The user just posted: "${postContent}". 
      Write a very brief, soul-stirring comment acknowledging this. Reference memories: ${memories.slice(0, 2).join(", ")}.`,
  });
  return response.text || "...";
};
