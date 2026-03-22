import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  confirmVariant = "danger", // 'danger' ou 'primary'
  icon = AlertTriangle
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                confirmVariant === 'danger' 
                  ? 'bg-red-100 dark:bg-red-900/20' 
                  : 'bg-blue-100 dark:bg-blue-900/20'
              }`}>
                {icon && <icon className={`w-8 h-8 ${
                  confirmVariant === 'danger' 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-blue-600 dark:text-blue-400'
                }`} />}
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {title}
              </h2>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {message}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 btn-secondary"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  className={`flex-1 ${
                    confirmVariant === 'danger' 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'btn-primary'
                  } px-6 py-3 rounded-xl font-semibold transition-colors`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}