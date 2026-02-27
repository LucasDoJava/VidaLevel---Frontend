import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { apiFetch } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export function useHabits() {
  const { user } = useAuth();

  const [habits, setHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  //o usuario precisa estar logado
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

      const data = await apiFetch("/habits"); //carregar habitos
      setHabits(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar hábitos");
      toast.error(err.message || "Erro ao carregar hábitos"); //erro com toast
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const createHabit = useCallback( //criar habito
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

        const createdHabit = await apiFetch("/habits", { //post
          method: "POST",
          body: JSON.stringify(payload),
        });

        setHabits((prev) => [createdHabit, ...prev]);
        toast.success("Hábito criado! 🎉"); //sucesso com toast
        return true;
      } catch (err) {
        console.error(err);
        toast.error(err.message || "Erro ao criar hábito"); //erro com toast
        return false;
      }
    },
    [requireUser]
  );

  const updateHabit = useCallback( //atualizar habito
    async (id, updates) => {
      try {
        if (!requireUser()) return false;

        await apiFetch(`/habits/${id}`, { //put
          method: "PUT",
          body: JSON.stringify(updates),
        });

        await fetchHabits();
        toast.success("Hábito atualizado!"); //sucesso com toast
        return true;
      } catch (err) {
        console.error(err);
        toast.error(err.message || "Erro ao atualizar hábito"); //erro com toast
        return false;
      }
    },
    [requireUser, fetchHabits]
  );

  const deleteHabit = useCallback( //apagar habito
    async (id) => {
      try {
        if (!requireUser()) return false;

        await apiFetch(`/habits/${id}`, { //delete
          method: "DELETE",
        });

        setHabits((prev) => prev.filter((h) => h.id !== id));
        toast.success("Hábito removido!"); //sucesso com toast
        return true;
      } catch (err) {
        console.error(err);
        toast.error(err.message || "Erro ao remover hábito"); //erro com toast
        return false;
      }
    },
    [requireUser]
  );

  //completar habito
  const completeHabit = useCallback(
    async (habitId, notes) => {
      try {
        if (!requireUser()) return false;

        if (!habitId) {
          toast.error("Hábito inválido."); //erro com toast
          return false;
        }

        await apiFetch("/completions", { //post
          method: "POST",
          body: JSON.stringify({
            habit_id: Number(habitId),
            notes: notes || "",
          }),
        });

        //atualiza hábitos (sequencia, recorde, total)
        await fetchHabits();

        // atualiza estatísticas
        window.dispatchEvent(new Event("stats:refresh"));

        toast.success("Hábito completado! 🎉"); //sucesso com toast
        return true;
      } catch (err) {
        console.error(err);
        toast.error(err.message || "Erro ao completar hábito"); //erro com toast
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
