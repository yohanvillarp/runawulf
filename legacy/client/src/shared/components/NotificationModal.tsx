import React from "react";
import { X, Info, CheckCircle, AlertCircle } from "lucide-react";
import type { Notification } from '@/features/intrusion/types/Notification';

const notificationIcons = {
  info: <Info className="w-6 h-6 text-blue-600" />,
  success: <CheckCircle className="w-6 h-6 text-green-600" />,
  error: <AlertCircle className="w-6 h-6 text-red-600" />,
};

const notificationColors = {
  info: "bg-blue-100 border-blue-500 text-blue-700",
  success: "bg-green-100 border-green-500 text-green-700",
  error: "bg-red-100 border-red-500 text-red-700",
};

type Props = {
  notifications: Notification[];
  onClose: () => void;
};

const NotificationModal: React.FC<Props> = ({ notifications, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-24 z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-2xl shadow-lg p-8 max-w-lg w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold"
          aria-label="Cerrar notificaciones"
        >
          <X />
        </button>
        <h2 className="text-3xl font-bold mb-6 text-sky-800">
          Notificaciones
        </h2>
        {notifications.length === 0 ? (
          <p className="text-center text-gray-500">No hay notificaciones.</p>
        ) : (
          <ul className="space-y-4 max-h-96 overflow-y-auto">
            {notifications.map(({ id, type, message }) => (
              <li
                key={id}
                className={`flex items-center gap-3 border-l-4 px-4 py-3 rounded shadow-sm ${notificationColors[type]}`}
              >
                {notificationIcons[type]}
                <span className="font-semibold">{message}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationModal;