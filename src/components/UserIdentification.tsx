import { useState } from "react";
import type { UserInfo } from "../types/api";

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
    <div className="identification-container">
      <div className="identification-card">
        <h1>TechSupport Pro</h1>
        <p className="subtitle">Atendimento inteligente com IA</p>

        <div className="user-type-toggle">
          <button
            type="button"
            className={isRegistered ? "active" : ""}
            onClick={() => setIsRegistered(true)}
          >
            Cliente
          </button>
          <button
            type="button"
            className={!isRegistered ? "active" : ""}
            onClick={() => setIsRegistered(false)}
          >
            Visitante
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nome completo *</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Como podemos te chamar?"
              required
            />
          </div>

          {isRegistered && (
            <>
              <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Telefone</label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(00) 00000-0000"
                />
              </div>
            </>
          )}

          <button type="submit" className="btn-primary">
            Iniciar conversa
          </button>
        </form>

        {!isRegistered && (
          <button
            type="button"
            className="btn-guest"
            onClick={handleGuestAccess}
          >
            Continuar sem cadastro
          </button>
        )}
      </div>
    </div>
  );
}
