// Types for API communication
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export interface ChatRequest {
  message: string;
  session_id?: string;
}

export interface ChatResponse {
  response: string;
  agent_used: string;
  decision: string;
  confidence: number;
  session_id: string;
  tools_used: string[];
}

export interface UserInfo {
  name: string;
  email?: string;
  phone?: string;
  isRegistered: boolean;
}

// Knowledge Base Types
export interface KnowledgeBaseItem {
  id: number;
  question: string;
  answer: string;
  keywords: string[];
  category: string;
}

export interface KnowledgeBaseCreate {
  question: string;
  answer: string;
  keywords: string[];
  category: string;
}

export interface KnowledgeBaseUpdate {
  question?: string;
  answer?: string;
  keywords?: string[];
  category?: string;
}
