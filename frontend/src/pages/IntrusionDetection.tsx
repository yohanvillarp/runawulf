import { Link } from "react-router-dom";
import { Bell, Eye } from "lucide-react";

export default function IntrusionDetection() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Detección de intrusos</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Crear alerta */}
        <div className="bg-white rounded-2xl shadow p-6 text-center transition transform duration-300 hover:scale-105 hover:shadow-lg hover:bg-blue-50 cursor-pointer">
          <Bell className="w-12 h-12 mx-auto text-blue-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Crear alerta</h3>
          <p className="text-gray-500 mb-4">
            Define nuevas alertas para monitorear posibles intrusiones en la red.
          </p>
          <Link
            to="/intrusion-detection/crear-alerta" 
            className="bg-blue-500 text-white px-4 py-2 rounded-lg transition duration-300 hover:bg-blue-600 active:scale-95 inline-block"
          >
            Crear alerta
          </Link>
        </div>

        {/* Ver notificaciones */}
        <div className="bg-white rounded-2xl shadow p-6 text-center transition transform duration-300 hover:scale-105 hover:shadow-lg hover:bg-blue -50 cursor-pointer">
          <Eye className="w-12 h-12 mx-auto text-blue-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Ver notificaciones</h3>
          <p className="text-gray-500 mb-4">
            Consulta las notificaciones generadas por el sistema de detección.
          </p>
          <Link
            to="/intrusion-detection/notificaciones" 
            className="bg-blue-500 text-white px-4 py-2 rounded-lg transition duration-300 hover:bg-blue-600 active:scale-95 inline-block"
          >
            Ver notificaciones
          </Link>
        </div>
      </div>
    </div>
  );
}
