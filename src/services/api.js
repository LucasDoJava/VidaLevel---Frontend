// src/services/api.js
const API_URL = "http://127.0.0.1:5000";

function isLikelyJwt(token) { //validaçao do token
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  return parts.length === 3 && parts.every((p) => p.length > 5);
}
//funçao para extraçao de erros
function extractMessage(data, fallbackStatus) {
  if (!data) return `Request failed: ${fallbackStatus}`;

  if (typeof data === "string") return data; //tratar para diferentes formatos

  const msg = data.message ?? data.msg ?? data.error;

  if (typeof msg === "string") return msg;

  
  if (msg && typeof msg === "object") {
    const firstKey = Object.keys(msg)[0];
    if (firstKey) {
      const val = msg[firstKey];
      if (typeof val === "string") return val;
      try {
        return JSON.stringify(val);
      } catch {
        return `Erro em ${firstKey}`;
      }
    }
    try {
      return JSON.stringify(msg);
    } catch {
      return `Request failed: ${fallbackStatus}`;
    }
  }

  try {
    return JSON.stringify(data);
  } catch {
    return `Request failed: ${fallbackStatus}`;
  }
}

function getToken() {
  const token = localStorage.getItem("token"); //funcao para genrenciar os tokens
  if (!isLikelyJwt(token)) {
    if (token) localStorage.removeItem("token"); //limpa o token invalido
    return null;
  }
  return token; //retorna o token valido
}
//funcao principal (apiFetch)
export async function apiFetch(path, options = {}) {
  const token = getToken();

  const headers = {
    ...(options.headers || {}),
  };

  const config = { ...options, headers };

  //se o corpo chegar como obj, transforma vira json
  if (config.body && !(config.body instanceof FormData)) {
    if (typeof config.body === "object") {
      config.body = JSON.stringify(config.body);
    }
    
    if (!headers["Content-Type"]) {
      headers["Content-Type"] = "application/json"; //adiciona headers
    }
  }
  //adiciona o token 
  if (token && !headers.Authorization) { 
    headers.Authorization = `Bearer ${token}`;
  }
  //requisicao em açao
  const res = await fetch(`${API_URL}${path}`, config);

  const ct = res.headers.get("content-type") || "";
  const data = ct.includes("application/json")
    ? await res.json().catch(() => null)
    : await res.text().catch(() => null);

  if (!res.ok) {
    const msg = extractMessage(data, res.status);
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

