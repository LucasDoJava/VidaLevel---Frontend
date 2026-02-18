import { useEffect, useMemo, useState } from "react";
import { Calendar, Award, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { useUserStats } from "../hooks/useUserStats";
import { getMyCompletions } from "../services/completion";

export default function Estatisticas() {
  const { stats, loading, error, getAchievements } = useUserStats();
  const [dailyActivity, setDailyActivity] = useState([]);

  useEffect(() => {
    document.title = "Estatísticas - VidaLevel";
  }, []);

  useEffect(() => {
    async function loadActivity() {
      try {
        const completions = await getMyCompletions();

        const days = 7;
        const today = new Date();
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        start.setDate(today.getDate() - (days - 1));

        const map = {};

        for (const c of completions) {
          if (!c.completed_at) continue;
          const d = new Date(c.completed_at);
          if (d < start) continue;

          const key = d.toISOString().slice(0, 10);
          map[key] = (map[key] || 0) + 1;
        }

        const series = [];
        for (let i = 0; i < days; i++) {
          const d = new Date(start);
          d.setDate(start.getDate() + i);

          const key = d.toISOString().slice(0, 10);
          const label = `${String(d.getDate()).padStart(2, "0")}/${String(
            d.getMonth() + 1
          ).padStart(2, "0")}`;

          series.push({ date: label, completions: map[key] || 0 });
        }

        setDailyActivity(series);
      } catch (e) {
        console.error(e);
        setDailyActivity([]);
      }
    }

    loadActivity();
  }, [stats?.total_habits_completed]);

  const uiStats = useMemo(() => {
    if (!stats) return null;
    return {
      level: stats.level,
      totalPoints: stats.total_points,
      longestStreak: stats.longest_streak,
      totalHabitsCompleted: stats.total_habits_completed,
    };
  }, [stats]);

  if (loading || !uiStats) {
    return <p className="p-8 text-gray-600">Carregando estatísticas...</p>;
  }

  if (error) {
    return <p className="p-8 text-red-600">{error}</p>;
  }

  const achievements = getAchievements();
  const max = Math.max(...dailyActivity.map(d => d.completions), 1);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-sm">Nível</p>
          <p className="text-3xl font-bold">{uiStats.level}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-sm">Pontos</p>
          <p className="text-3xl font-bold">{uiStats.totalPoints}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-sm">Maior Sequência</p>
          <p className="text-3xl font-bold">{uiStats.longestStreak}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-sm">Hábitos Concluídos</p>
          <p className="text-3xl font-bold">{uiStats.totalHabitsCompleted}</p>
        </div>
      </div>

      {/* Últimos Dias */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="flex items-center gap-2 mb-4">
          <Calendar /> Últimos Dias
        </h2>

        {dailyActivity.map(d => (
          <div key={d.date} className="flex gap-3 items-center">
            <span className="w-12">{d.date}</span>
            <div className="flex-1 bg-gray-200 h-3 rounded-full">
              <div
                className="bg-blue-500 h-3 rounded-full"
                style={{ width: `${(d.completions / max) * 100}%` }}
              />
            </div>
            <span>{d.completions}</span>
          </div>
        ))}
      </div>

      {/* Conquistas */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="flex items-center gap-2 mb-4">
          <Award /> Conquistas
        </h2>

        <div className="grid grid-cols-3 gap-4">
          {achievements.map(a => (
            <motion.div
              key={a.id}
              whileHover={{ scale: 1.05 }}
              className={`p-4 rounded-lg border ${
                a.unlocked ? "bg-yellow-50 border-yellow-300" : "bg-gray-50"
              }`}
            >
              <div className="text-2xl">{a.icon}</div>
              <h3 className="font-semibold">{a.name}</h3>
              <p className="text-sm">{a.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
}
