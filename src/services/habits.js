import { apiFetch } from "./api";

export function getHabits() {
  return apiFetch("/habits"); 
}

export function createHabit(payload) {
  return apiFetch("/habits", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateHabit(id, payload) {
  return apiFetch(`/habits/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteHabit(id) {
  return apiFetch(`/habits/${id}`, { method: "DELETE" });
}
