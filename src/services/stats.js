import { apiFetch } from "./api";

export async function getMyStats() {
  return apiFetch("/stats/me");
}
