const API_URL = "http://127.0.0.1:5000";

function isLikelyJwt(token) {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  return parts.length === 3 && parts.every((p) => p.length > 5);
}

function getToken() {
  const token = localStorage.getItem("token"); // ✅ CORRETO

  if (!isLikelyJwt(token)) {
    if (token) localStorage.removeItem("auth_token");
    return null;
  }

  return token;
}

export async function apiFetch(path, options = {}) {
  const token = getToken();

  const headers = {
    ...(options.headers || {}),
  };

  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`; // ✅ Agora vai corretamente
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const ct = res.headers.get("content-type") || "";
  const data = ct.includes("application/json")
    ? await res.json().catch(() => null)
    : await res.text().catch(() => null);

  if (!res.ok) {
    const msg =
      (data && (data.message || data.msg)) ||
      (typeof data === "string" && data) ||
      `Request failed: ${res.status}`;
    throw new Error(msg);
  }

  return data;
}
