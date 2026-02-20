import { Bell } from "lucide-react";

export default function DropdownNotificacao({
  isOpen,
  setIsOpen,
  pendingRequests,
  respondToRequest,
}) {
  return (
    <div className="relative notification-dropdown">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-300 relative"
      >
        <Bell className="w-5 h-5" />

        {pendingRequests.length > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-50">
          {pendingRequests.length === 0 ? (
            <p className="text-sm text-gray-500">
              Nenhum pedido pendente
            </p>
          ) : (
            pendingRequests.map((request) => (
              <div
                key={request.id}
                className="mb-3 border-b pb-2 last:border-none"
              >
                <p className="text-sm mb-2">
                  <strong>{request.sender_name}</strong> enviou um pedido
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      respondToRequest(request.id, "accept")
                    }
                    className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                  >
                    Aceitar
                  </button>
                  <button
                    onClick={() =>
                      respondToRequest(request.id, "reject")
                    }
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                  >
                    Recusar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
