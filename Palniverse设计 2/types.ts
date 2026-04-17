
export interface Persona {
  tone: string;
  attitude: string;
  style: string;
  relation: string;
  memory_preference: string;
  material_base: 'metal' | 'plush' | 'wood' | 'glass' | 'vintage' | 'tech';
}

export interface AuraObject {
  id: string;
  palNum: string; 
  name: string;
  title: string;
  imageUrl: string;
  bio: string;
  description: string;
  motto: string;
  persona: Persona;
  energyLevel: number; 
  relationshipScore: number; 
  memories: Memory[];
  facts: string[];
  createdAt: number;
}

export interface Memory {
  id: string;
  timestamp: number;
  content: string;
  imageUrl?: string;
  type: 'EP' | 'RP' | 'EM' | 'PP'; 
}

export interface SocialComment {
  id: string;
  objectId: string;
  text: string;
  timestamp: number;
}

export interface SocialPost {
  id: string;
  author: 'user' | string;
  content: string;
  imageUrl?: string;
  emotion?: string; 
  timestamp: number;
  tags: string[];
  comments: SocialComment[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName?: string;
  text: string;
  timestamp: number;
}

export interface Chatroom {
  id: string;
  name: string;
  pals: string[]; // Object IDs
  topic: string;
  messages: ChatMessage[];
}

export interface AuraTask {
  id: string;
  goal: string;
  deadline: number;
  assignedObjectId: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface UserProfile {
  nickname: string;
  avatarUrl?: string;
  pronoun: string;
  birthday: string;
  bio: string;
  preferences: {
    language: 'English' | 'Chinese';
    notifications: boolean;
    quietTime: string;
  };
}
