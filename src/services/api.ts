import type {
  ChatRequest,
  ChatResponse,
  KnowledgeBaseItem,
  KnowledgeBaseCreate,
  KnowledgeBaseUpdate,
} from "../types/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export const chatAPI = {
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const response = await fetch(`${API_BASE_URL}/chat/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Erro ao enviar mensagem");
    }

    return response.json();
  },

  async healthCheck(): Promise<{ status: string; service: string }> {
    const response = await fetch(`${API_BASE_URL}/chat/health`);
    return response.json();
  },
};

export const knowledgeBaseAPI = {
  async getAll(category?: string): Promise<KnowledgeBaseItem[]> {
    const url = category
      ? `${API_BASE_URL}/api/knowledge-base/?category=${category}`
      : `${API_BASE_URL}/api/knowledge-base/`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Erro ao buscar itens da base de conhecimento");
    }

    return response.json();
  },

  async getById(id: number): Promise<KnowledgeBaseItem> {
    const response = await fetch(`${API_BASE_URL}/api/knowledge-base/${id}`);

    if (!response.ok) {
      throw new Error("Item não encontrado");
    }

    return response.json();
  },

  async create(item: KnowledgeBaseCreate): Promise<KnowledgeBaseItem> {
    const response = await fetch(`${API_BASE_URL}/api/knowledge-base/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Erro ao criar item");
    }

    return response.json();
  },

  async update(
    id: number,
    item: KnowledgeBaseUpdate
  ): Promise<KnowledgeBaseItem> {
    const response = await fetch(`${API_BASE_URL}/api/knowledge-base/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Erro ao atualizar item");
    }

    return response.json();
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/knowledge-base/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Erro ao deletar item");
    }
  },

  async getCategories(): Promise<string[]> {
    const response = await fetch(
      `${API_BASE_URL}/api/knowledge-base/categories/list`
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar categorias");
    }

    return response.json();
  },
};
