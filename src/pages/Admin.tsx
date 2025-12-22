import { useState, useEffect } from "react";
import { knowledgeBaseAPI } from "../services/api";
import type { KnowledgeBaseItem } from "../types/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Plus, Pencil, Trash2, Save, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Admin() {
  const [items, setItems] = useState<KnowledgeBaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    keywords: "",
    category: "general",
  });

  useEffect(() => {
    loadItems();
    loadCategories();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await knowledgeBaseAPI.getAll();
      setItems(data);
    } catch (error) {
      console.error("Erro ao carregar itens:", error);
      alert("Erro ao carregar base de conhecimento");
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const cats = await knowledgeBaseAPI.getCategories();
      setCategories(cats);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  };

  const handleCreate = async () => {
    try {
      await knowledgeBaseAPI.create({
        question: formData.question,
        answer: formData.answer,
        keywords: formData.keywords.split(",").map((k) => k.trim()),
        category: formData.category,
      });

      setFormData({
        question: "",
        answer: "",
        keywords: "",
        category: "general",
      });
      setShowCreateForm(false);
      loadItems();
      loadCategories();
      alert("Item criado com sucesso!");
    } catch (error: any) {
      alert(error.message || "Erro ao criar item");
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      const item = items.find((i) => i.id === id);
      if (!item) return;

      await knowledgeBaseAPI.update(id, {
        question: formData.question || item.question,
        answer: formData.answer || item.answer,
        keywords: formData.keywords
          ? formData.keywords.split(",").map((k) => k.trim())
          : item.keywords,
        category: formData.category || item.category,
      });

      setEditingId(null);
      setFormData({
        question: "",
        answer: "",
        keywords: "",
        category: "general",
      });
      loadItems();
      alert("Item atualizado com sucesso!");
    } catch (error: any) {
      alert(error.message || "Erro ao atualizar item");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Deseja realmente excluir este item?")) return;

    try {
      await knowledgeBaseAPI.delete(id);
      loadItems();
      loadCategories();
      alert("Item excluído com sucesso!");
    } catch (error: any) {
      alert(error.message || "Erro ao excluir item");
    }
  };

  const startEdit = (item: KnowledgeBaseItem) => {
    setEditingId(item.id);
    setFormData({
      question: item.question,
      answer: item.answer,
      keywords: item.keywords.join(", "),
      category: item.category,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      question: "",
      answer: "",
      keywords: "",
      category: "general",
    });
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-background)] to-[var(--color-secondary)]/20 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-foreground)]">
              📚 Base de Conhecimento
            </h1>
            <p className="text-[var(--color-muted-foreground)] mt-2">
              Gerencie as respostas automáticas do sistema
            </p>
          </div>
          <Button
            onClick={() => {
              setShowCreateForm(!showCreateForm);
              setFormData({
                question: "",
                answer: "",
                keywords: "",
                category: "general",
              });
            }}
            size="lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Novo Item
          </Button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <Card className="border-2 border-[var(--color-primary)]">
            <CardHeader>
              <CardTitle>Criar Novo Item</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="create-question">Pergunta</Label>
                <Input
                  id="create-question"
                  placeholder="Ex: Como resetar minha senha?"
                  value={formData.question}
                  onChange={(e) =>
                    setFormData({ ...formData, question: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="create-answer">Resposta</Label>
                <textarea
                  id="create-answer"
                  placeholder="Resposta detalhada..."
                  value={formData.answer}
                  onChange={(e) =>
                    setFormData({ ...formData, answer: e.target.value })
                  }
                  className="w-full min-h-[120px] px-3 py-2 rounded-md border border-[var(--color-input)] bg-[var(--color-background)] text-[var(--color-foreground)]"
                />
              </div>

              <div>
                <Label htmlFor="create-keywords">
                  Palavras-chave (separadas por vírgula)
                </Label>
                <Input
                  id="create-keywords"
                  placeholder="senha, reset, recuperar"
                  value={formData.keywords}
                  onChange={(e) =>
                    setFormData({ ...formData, keywords: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="create-category">Categoria</Label>
                <Input
                  id="create-category"
                  placeholder="Ex: senha, login, pagamento"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCreate} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </Button>
                <Button
                  onClick={() => {
                    setShowCreateForm(false);
                    setFormData({
                      question: "",
                      answer: "",
                      keywords: "",
                      category: "general",
                    });
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filter */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--color-muted-foreground)]" />
                <Input
                  placeholder="Buscar na base de conhecimento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 rounded-md border border-[var(--color-input)] bg-[var(--color-background)] text-[var(--color-foreground)]"
              >
                <option value="">Todas as categorias</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Items List */}
        {loading ? (
          <div className="text-center py-12 text-[var(--color-muted-foreground)]">
            Carregando...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12 text-[var(--color-muted-foreground)]">
            Nenhum item encontrado
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="pt-6">
                  {editingId === item.id ? (
                    <div className="space-y-4">
                      <div>
                        <Label>Pergunta</Label>
                        <Input
                          value={formData.question}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              question: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>Resposta</Label>
                        <textarea
                          value={formData.answer}
                          onChange={(e) =>
                            setFormData({ ...formData, answer: e.target.value })
                          }
                          className="w-full min-h-[120px] px-3 py-2 rounded-md border border-[var(--color-input)] bg-[var(--color-background)] text-[var(--color-foreground)]"
                        />
                      </div>
                      <div>
                        <Label>Palavras-chave</Label>
                        <Input
                          value={formData.keywords}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              keywords: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>Categoria</Label>
                        <Input
                          value={formData.category}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              category: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleUpdate(item.id)}
                          className="flex-1"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Salvar
                        </Button>
                        <Button
                          onClick={cancelEdit}
                          variant="outline"
                          className="flex-1"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-[var(--color-foreground)] mb-2">
                            {item.question}
                          </h3>
                          <Badge variant="secondary">{item.category}</Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => startEdit(item)}
                            variant="outline"
                            size="sm"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleDelete(item.id)}
                            variant="destructive"
                            size="sm"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-[var(--color-muted-foreground)] mb-3 whitespace-pre-wrap">
                        {item.answer}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {item.keywords.map((keyword, idx) => (
                          <Badge key={idx} variant="outline">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
