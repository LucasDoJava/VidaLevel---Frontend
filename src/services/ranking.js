import { apiFetch } from "./api";

export async function getRanking() {
  return apiFetch("/ranking");
}
