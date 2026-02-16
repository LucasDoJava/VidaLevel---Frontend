import { useEffect, useState } from "react"
import { Trophy, User } from "lucide-react"
import { getRanking } from "../services/ranking"
import { useAuth } from "../contexts/AuthContext"

export default function Ranking() {
  const { user } = useAuth()
  const [ranking, setRanking] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadRanking() {
      try {
        setLoading(true)
        const data = await getRanking()
        setRanking(data?.ranking || [])
      } catch (e) {
        console.error("Erro ao carregar ranking:", e)
        setRanking([])
      } finally {
        setLoading(false)
      }
    }

    loadRanking()
  }, [])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-gray-600">Carregando ranking...</p>
      </div>
    )
  }

  if (!ranking.length) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-gray-600">Ainda não há dados no ranking.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* Título */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
          <Trophy className="text-white w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          Ranking Global
        </h1>
      </div>

      {/* Lista */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {ranking.map((player, index) => {
          const isMe = String(player.user_id) === String(user?.id)

          return (
            <div
              key={player.user_id}
              className={`flex items-center justify-between px-6 py-4 border-b last:border-b-0 transition-colors
                ${index === 0 ? "bg-yellow-50" : ""}
                ${index === 1 ? "bg-gray-50" : ""}
                ${index === 2 ? "bg-orange-50" : ""}
                ${isMe ? "ring-2 ring-blue-400" : ""}
              `}
            >
              <div className="flex items-center gap-4">

                {/* Posição */}
                <div className="w-8 text-lg font-bold text-gray-700">
                  #{index + 1}
                </div>

                {/* Avatar */}
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white shadow">
                  <User className="w-5 h-5" />
                </div>

                {/* Nome */}
                <div>
                  <div className="font-medium text-gray-900">
                    {player.name}
                    {isMe && (
                      <span className="text-xs text-gray-500 ml-1">
                        (você)
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {player.total_points} pontos • Nível {player.level}
                  </div>
                </div>
              </div>

              {/* Medalha Top 3 */}
              {index < 3 && (
                <Trophy
                  className={`w-6 h-6
                    ${index === 0 && "text-yellow-500"}
                    ${index === 1 && "text-gray-400"}
                    ${index === 2 && "text-orange-400"}
                  `}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
