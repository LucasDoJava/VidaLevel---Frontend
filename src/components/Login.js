import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState(""); // ✅ novo
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { login, register, isLoading } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (isLogin) {
      const success = await login({ email, password });
      if (success) navigate("/habits");
    } else {
      const success = await register({
        name, // ✅ agora vem do input
        email,
        password,
        confirmPassword,
      });

      if (success) {
        // Após cadastro, volta para login
        setIsLogin(true);
        setPassword("");
        setConfirmPassword("");
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="card p-8 w-full max-w-md animate-fade-scale"
      >
        {/* LOGO */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl font-bold">VL</span>
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-6 text-gradient text-center">
          {isLogin ? "Entrar" : "Criar Conta"}
        </h1>

        {/* ✅ NOME (só no cadastro) */}
        {!isLogin && (
          <input
            type="text"
            placeholder="Nome"
            className="input-field mb-4"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          className="input-field mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* SENHA */}
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Senha"
            className="input-field pr-12"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* CONFIRMAR SENHA */}
        {!isLogin && (
          <div className="relative mb-4">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirmar senha"
              className="input-field pr-12"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        )}

        <button
          type="submit"
          className="btn-primary w-full mb-4"
          disabled={isLoading}
        >
          {isLoading ? "Carregando..." : isLogin ? "Entrar" : "Cadastrar"}
        </button>

        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            // ✅ limpa campos ao trocar modo
            setPassword("");
            setConfirmPassword("");
            setName("");
          }}
          className="text-sm text-blue-600 hover:underline w-full text-center"
        >
          {isLogin ? "Não tem conta? Criar agora" : "Já tem conta? Fazer login"}
        </button>
      </form>
    </div>
  );
}
