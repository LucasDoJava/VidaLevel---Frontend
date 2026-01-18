import { Trophy, User } from "lucide-react"

const rankingMock = [
  { id: 1, name: "Ana Souza", points: 1280 },
  { id: 2, name: "Carlos Lima", points: 1150 },
  { id: 3, name: "Mariana Alves", points: 980 },
  { id: 4, name: "Lucas Batista", points: 870 },
  { id: 5, name: "João Pedro", points: 740 },
]

export default function Ranking() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* Título */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
          <Trophy className="text-white w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          Ranking de Amigos
        </h1>
      </div>

      {/* Lista */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {rankingMock.map((user, index) => (
          <div
            key={user.id}
            className={`flex items-center justify-between px-6 py-4 border-b last:border-b-0 transition-colors
              ${index === 0 ? "bg-yellow-50" : ""}
              ${index === 1 ? "bg-gray-50" : ""}
              ${index === 2 ? "bg-orange-50" : ""}
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
                  {user.name}
                </div>
                <div className="text-sm text-gray-500">
                  {user.points} pontos
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
        ))}
      </div>
    </div>
  )
}
