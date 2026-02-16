import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { apiFetch } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export function useHabits() {
  const { user } = useAuth();

  const [habits, setHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const requireUser = useCallback(() => {
    if (!user) {
      toast.error("Faça login para continuar.");
      return false;
    }
    return true;
  }, [user]);

  const fetchHabits = useCallback(async () => {
    try {
      if (!user) {
        setHabits([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      const data = await apiFetch("/habits");
      setHabits(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar hábitos");
      toast.error(err.message || "Erro ao carregar hábitos");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const createHabit = useCallback(
    async (habitData) => {
      try {
        if (!requireUser()) return false;

        const payload = {
          name: habitData.name,
          description: habitData.description || "",
          category: habitData.category,
          difficulty: habitData.difficulty,
          points: Number(habitData.points),
          icon: habitData.icon || "",
          color: habitData.color || "",
        };

        const createdHabit = await apiFetch("/habits", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        setHabits((prev) => [createdHabit, ...prev]);
        toast.success("Hábito criado! 🎉");
        return true;
      } catch (err) {
        console.error(err);
        toast.error(err.message || "Erro ao criar hábito");
        return false;
      }
    },
    [requireUser]
  );

  const updateHabit = useCallback(
    async (id, updates) => {
      try {
        if (!requireUser()) return false;

        await apiFetch(`/habits/${id}`, {
          method: "PUT",
          body: JSON.stringify(updates),
        });

        await fetchHabits();
        toast.success("Hábito atualizado!");
        return true;
      } catch (err) {
        console.error(err);
        toast.error(err.message || "Erro ao atualizar hábito");
        return false;
      }
    },
    [requireUser, fetchHabits]
  );

  const deleteHabit = useCallback(
    async (id) => {
      try {
        if (!requireUser()) return false;

        await apiFetch(`/habits/${id}`, {
          method: "DELETE",
        });

        setHabits((prev) => prev.filter((h) => h.id !== id));
        toast.success("Hábito removido!");
        return true;
      } catch (err) {
        console.error(err);
        toast.error(err.message || "Erro ao remover hábito");
        return false;
      }
    },
    [requireUser]
  );

  // ✅ AGORA CORRETO PARA O HabitCard
  const completeHabit = useCallback(
    async (habitId, notes) => {
      try {
        if (!requireUser()) return false;

        if (!habitId) {
          toast.error("Hábito inválido.");
          return false;
        }

        await apiFetch("/completions", {
          method: "POST",
          body: JSON.stringify({
            habit_id: Number(habitId),
            notes: notes || "",
          }),
        });

        // 🔥 Atualiza hábitos (streak, recorde, total)
        await fetchHabits();

        // 🔥 Atualiza estatísticas
        window.dispatchEvent(new Event("stats:refresh"));

        toast.success("Hábito completado! 🎉");
        return true;
      } catch (err) {
        console.error(err);
        toast.error(err.message || "Erro ao completar hábito");
        return false;
      }
    },
    [requireUser, fetchHabits]
  );

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  return {
    habits,
    isLoading,
    error,
    fetchHabits,
    createHabit,
    updateHabit,
    deleteHabit,
    completeHabit,
  };
}
