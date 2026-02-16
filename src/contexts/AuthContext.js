import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { apiFetch } from "../services/api";

export const AuthContext = createContext(null);

const USER_KEY = "auth_user";
const TOKEN_KEY = "token";

// login(email, password) OU login({email, password})
function normalizeLoginArgs(a, b) {
  if (typeof a === "string") return { email: a, password: b };
  if (a && typeof a === "object") return { email: a.email, password: a.password };
  return { email: undefined, password: undefined };
}

// register(name, email, password, confirmPassword) OU register({name,email,password,confirmPassword})
function normalizeRegisterArgs(a, b, c, d) {
  if (a && typeof a === "object") {
    return {
      name: a.name,
      email: a.email,
      password: a.password,
      confirmPassword: a.confirmPassword,
      avatar: a.avatar,
    };
  }
  return { name: a, email: b, password: c, confirmPassword: d, avatar: undefined };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!localStorage.getItem(TOKEN_KEY);

  // carrega user salvo
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_KEY);
      if (storedUser) setUser(JSON.parse(storedUser));
    } catch {
      localStorage.removeItem(USER_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // persiste user
  useEffect(() => {
    try {
      if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
      else localStorage.removeItem(USER_KEY);
    } catch {}
  }, [user]);

  const login = async (a, b) => {
    try {
      setIsLoading(true);

      const { email, password } = normalizeLoginArgs(a, b);

      if (!email || !password) {
        toast.error("Informe email e senha.");
        return false;
      }

      const data = await apiFetch("/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      // backend retorna: { access_token, user }
      const token = data?.access_token;
      const backendUser = data?.user;

      if (!token || !backendUser) {
        toast.error("Resposta inválida do servidor no login.");
        return false;
      }

      // ✅ salva token e user reais
      localStorage.setItem(TOKEN_KEY, token);
      setUser(backendUser);

      toast.success("Login realizado com sucesso!");
      return true;
    } catch (err) {
      console.error("Erro no login:", err);
      toast.error(err?.message || "Credenciais inválidas");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (a, b, c, d) => {
    try {
      setIsLoading(true);

      const { name, email, password, confirmPassword, avatar } =
        normalizeRegisterArgs(a, b, c, d);

      if (!name || !email || !password) {
        toast.error("Preencha nome, email e senha.");
        return false;
      }

      if (confirmPassword !== undefined && password !== confirmPassword) {
        toast.error("As senhas não coincidem.");
        return false;
      }

      // cria usuário real no backend
      await apiFetch("/users", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password,
          avatar: avatar ?? null,
        }),
      });

      toast.success("Conta criada! Fazendo login...");

      // auto-login após cadastro
      return await login(email, password);
    } catch (err) {
      console.error("Erro no registro:", err);
      toast.error(err?.message || "Erro ao criar conta");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // ✅ limpa TUDO (isso resolve “hábitos de outro usuário”)
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    toast.success("Logout realizado!");
  };

  const value = useMemo(
    () => ({ user, isLoading, isAuthenticated, login, register, logout }),
    [user, isLoading, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return ctx;
}
