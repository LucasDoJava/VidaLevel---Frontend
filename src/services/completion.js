import { apiFetch } from "./api";

export async function getMyCompletions() {
  return apiFetch("/completions");
}
