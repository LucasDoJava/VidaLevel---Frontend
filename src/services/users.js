// src/services/users.js
import { apiFetch } from "./api";

export async function registerUser({ name, email, password }) {
  return apiFetch("/users", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export async function getUserById(id) {
  return apiFetch(`/users/${id}`);
}

export async function updateUser(id, payload) {
  return apiFetch(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
