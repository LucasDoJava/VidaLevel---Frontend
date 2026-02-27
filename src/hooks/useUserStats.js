import { useEffect, useState, useCallback } from "react";
import { getMyStats } from "../services/stats";
import { useAuth } from "../contexts/AuthContext";

export function useUserStats() {
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
//atualizar estatisticas
  const refreshStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user) {
        setStats(null);
        return;
      }

      const data = await getMyStats(); //chama o serviço de minhas estatisticas
      setStats(data);
    } catch (err) {
      console.error("Erro ao buscar stats:", err);
      setError("Erro ao carregar estatísticas");
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    let alive = true;

    async function run() {
      if (!alive) return;
      await refreshStats();
    }

    run();

    //funçao para escutar o evento disparado pelo completeHabit
    function onRefresh() {
      if (!alive) return;
      refreshStats(); //chamando a funcao que busca as estatisticas atualizadas
    }

    window.addEventListener("stats:refresh", onRefresh); //ouve o evento

    return () => {
      alive = false;
      window.removeEventListener("stats:refresh", onRefresh); //remove
    };
  }, [refreshStats]);

  const getAchievements = useCallback(() => { //consquistas
    if (!stats) return [];

    const ach = stats.achievements || {};

    return [
      { id: "first_completion", icon: "✅", name: "Primeira Conclusão", description: "Concluiu um hábito pela primeira vez", unlocked: !!ach.first_completion },
      { id: "ten_completions", icon: "🔟", name: "10 Conclusões", description: "Concluiu 10 hábitos no total", unlocked: !!ach.ten_completions },
      { id: "twenty_completions", icon: "🏅", name: "20 Conclusões", description: "Concluiu 20 hábitos no total", unlocked: !!ach.twenty_completions },
      { id: "points_100", icon: "💯", name: "100 Pontos", description: "Acumulou 100 pontos", unlocked: !!ach.points_100 },
      { id: "points_500", icon: "💎", name: "500 Pontos", description: "Acumulou 500 pontos", unlocked: !!ach.points_500 },
      { id: "streak_7", icon: "🔥", name: "Sequência de 7 dias", description: "Concluiu hábitos por 7 dias seguidos", unlocked: !!ach.streak_7 },
      { id: "streak_30", icon: "🚀", name: "Sequência de 30 dias", description: "Concluiu hábitos por 30 dias seguidos", unlocked: !!ach.streak_30 },
    ];
  }, [stats]);

  return { stats, loading, isLoading: loading, error, refreshStats, getAchievements };
}
