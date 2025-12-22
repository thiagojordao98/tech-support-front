import { useState } from "react";
import type { UserInfo } from "../types/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { User, Mail, Phone, Sparkles } from "lucide-react";

interface UserIdentificationProps {
  onComplete: (userInfo: UserInfo) => void;
}

export default function UserIdentification({
  onComplete,
}: UserIdentificationProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isRegistered, setIsRegistered] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onComplete({
      name: name.trim(),
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      isRegistered,
    });
  };

  const handleGuestAccess = () => {
    onComplete({
      name: "Visitante",
      isRegistered: false,
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Card className="backdrop-blur-sm bg-card/95">
          <CardHeader className="space-y-3">
            <div className="flex justify-center">
              <div className="rounded-full bg-primary/10 p-3">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl">TechSupport Pro</CardTitle>
            <CardDescription className="text-base">
              Atendimento inteligente com IA
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* User Type Toggle */}
            <div className="flex gap-2 p-1 bg-secondary rounded-xl border">
              <button
                type="button"
                onClick={() => setIsRegistered(true)}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isRegistered
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <User className="inline-block h-4 w-4 mr-2" />
                Cliente
              </button>
              <button
                type="button"
                onClick={() => setIsRegistered(false)}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  !isRegistered
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                Visitante
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Como podemos te chamar?"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {isRegistered && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(00) 00000-0000"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </>
              )}

              <Button type="submit" className="w-full" size="lg">
                Iniciar conversa
              </Button>
            </form>

            {!isRegistered && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGuestAccess}
              >
                Continuar sem cadastro
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
