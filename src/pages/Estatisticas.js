import { useEffect, useMemo, useState } from "react";
import { Calendar, Award, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { useUserStats } from "../hooks/useUserStats";
import { getMyCompletions } from "../services/completion";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

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

        const days = 7; //7 dias
        const today = new Date();
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        start.setDate(today.getDate() - (days - 1)); //data de inicio (7 dias atras)

        const map = {};
        //conta conclusoes por dia
        for (const c of completions) {
          if (!c.completed_at) continue;
          const d = new Date(c.completed_at);
          if (d < start) continue;

          const key = d.toISOString().slice(0, 10);
          map[key] = (map[key] || 0) + 1;
        }
           //cria array com os últimos 7 dias
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
// armazena o valor retornado e só o recalcula se as dependências mudarem
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

      {/*cards*/}
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

      {/* Gráficos */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

  {/* Hábitos concluídos */}
  <div className="bg-white p-6 rounded-xl shadow">
    <h2 className="font-bold text-lg mb-4">
      Hábitos Concluídos (Últimos 7 Dias)
    </h2>

    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={dailyActivity}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="completions" />
      </BarChart>
    </ResponsiveContainer>
  </div>

  {/* XP */}
  <div className="bg-white p-6 rounded-xl shadow">
    <h2 className="font-bold text-lg mb-4">
      Progresso para o Próximo Nível
    </h2>

    <div className="mb-3 flex justify-between text-sm">
      <span>Nível {stats.level}</span>
      <span>
        {stats.current_exp} / {stats.exp_to_next_level} XP
      </span>
    </div>

    <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-green-500"
        style={{
          width: `${
            (stats.current_exp / stats.exp_to_next_level) * 100
          }%`
        }}
      />
    </div>
  </div>

</div>

{/* Recorde */}
<div className="bg-white p-6 rounded-xl shadow mb-8">
  <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
    <Trophy />
    Recorde de Sequência
  </h2>

  <div className="flex items-center gap-4">
    <Trophy size={50} className="text-yellow-500" />

    <div>
      <p className="text-4xl font-bold">
        {uiStats.longestStreak}
      </p>

      <p className="text-gray-500">
        dias consecutivos
      </p>
    </div>
  </div>
</div>

      {/*conquistas*/}
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
