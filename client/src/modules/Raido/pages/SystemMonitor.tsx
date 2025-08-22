import React, { useState } from "react";
import { Bell, CheckCircle, Info, AlertCircle } from "lucide-react";
import DataSection from "../components/DataSection";
import { ResourcePieChart } from "../components/ResourcePieChart";
import SwapAreaChart from "../components/SwapAreaChart";
import CpuHistoryLineChart from "../components/CpuHistoryLineChart";
import NetworkBarChart from "../components/NetworkBarChart";
import NotificationModal from "../../../shared/components/NotificationModal";
import { useNotifications } from "../hooks/useNotifications";
import { useThresholds } from "../hooks/useThresholds";
import { useSystemData } from "../hooks/useSystemData";
import type { Thresholds } from "../hooks/useThresholds";
import { useResourceData } from "../hooks/useResourceData";
import { useSystemInfo } from "../hooks/useSystemInfo";
import { useCpuHistory } from "../hooks/useCpuHistory";
import { useNetworkData } from "../hooks/useNetworkData";
import { useSwapData } from "../hooks/useSwapData";
import { useAlerts } from "../hooks/useAlerts";

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

const SystemMonitorImproved: React.FC = () => {

  // Llama a los custom hooks para obtener el estado y las funciones
  const systemData = useSystemData();

  const { notifications, toast, addNotification } = useNotifications();

  const { thresholds, handleThresholdChange, onConfigSave } = useThresholds();
  
  useAlerts(systemData, thresholds, addNotification);
  
  const cpuHistoryData = useCpuHistory(); 
  const networkData = useNetworkData();
  const swapData = useSwapData();
  const resourceData = useResourceData(systemData);
  const systemInfo = useSystemInfo(systemData);
  
  

  // Modal configuración abierto o no?
  const [showConfig, setShowConfig] = useState(false);
  // Modal notificaciones abierto o no?
  const [showNotifModal, setShowNotifModal] = useState(false);

  const handleSaveAndNotify = () => {
    onConfigSave();
    addNotification({ type: "success", message: "Configuración de alerta guardada." });
    setShowConfig(false);
  };

  return (
    <main className="min-h-screen bg-sky-50 p-12 font-sans max-w-7xl mx-auto relative">
      <h1 className="text-5xl font-extrabold mb-12 text-sky-700 text-center">
        Monitor de Sistema
      </h1>

      {/* Gráficos circulares */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 px-4">
        <ResourcePieChart
          title="CPU (%)"
          used={resourceData.cpu.used}
          total={100}
          suffix="%"
        />
        <ResourcePieChart
          title="RAM (GB)"
          used={resourceData.ram.used}
          total={resourceData.ram.total}
        />
        <ResourcePieChart
          title="Disco (GB)"
          used={resourceData.disk.used}
          total={resourceData.disk.total}
        />
      </section>

      {/* Gráficos secundarios */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 px-4">
        <NetworkBarChart data={networkData} />
        <CpuHistoryLineChart data={cpuHistoryData} />
        <SwapAreaChart data={swapData} />
      </section>

      <DataSection data={systemInfo} />

      {/* Boton para activar configuracion de alertas*/}
      <button
        className="fixed bottom-5 right-5 bg-sky-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-sky-800 shadow-lg transition"
        onClick={() => setShowConfig(true)}
        aria-label="Abrir configuración de alertas"
      >
        Configurar alertas
      </button>

      {/* Botón campana notificaciones */}
      <button
        aria-label="Abrir notificaciones"
        className="fixed top-5 right-5 z-50 bg-white p-3 rounded-full shadow-md hover:shadow-lg transition"
        onClick={() => setShowNotifModal(true)}
      >
        <Bell className="w-8 h-8 text-sky-700" />
      </button>

      {/* Toast temporal */}
      {toast && (
        <div
          className={`fixed top-20 right-5 flex items-center gap-3 px-4 py-3 border-l-4 rounded shadow-md z-60 animate-slide-in ${notificationColors[toast.type]
            }`}
        >
          {notificationIcons[toast.type]}
          <span className="font-semibold">{toast.message}</span>
        </div>
      )}

      {/* Modal notificaciones */}
      {showNotifModal && (
        <NotificationModal notifications={notifications} onClose={() => setShowNotifModal(false)} />
      )}

      {/* Modal configuración */}
      {showConfig && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-60"
          onClick={() => setShowConfig(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowConfig(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold"
              aria-label="Cerrar configuración"
            >
              x
            </button>

            <h2 className="text-3xl font-bold mb-6 text-sky-800 text-center">
              Configurar Alertas
            </h2>
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              {[
                { label: "CPU (%)", name: "cpu", max: 100 },
                { label: "RAM (GB)", name: "ram", max: 16 },
                { label: "Disco (GB)", name: "disk", max: 500 },
              ].map(({ label, name, max }) => (
                <div key={name}>
                  <label
                    htmlFor={name}
                    className="block mb-2 font-semibold text-sky-700"
                  >
                    {label}
                  </label>
                  <input
                    type="range"
                    id={name}
                    name={name}
                    min={0}
                    max={max}
                    value={thresholds[name as keyof Thresholds]}
                    onChange={handleThresholdChange}
                    className="w-full accent-sky-600"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>0</span>
                    <span>{name === "cpu" ? `${max}%` : `${max} GB`}</span>
                  </div>
                </div>
              ))}
              <button
                type="submit"
                className="mt-4 w-full bg-sky-700 text-white font-semibold py-3 rounded-lg hover:bg-sky-800 transition"
                onClick={handleSaveAndNotify}
              >
                Guardar configuración
              </button>
            </form>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes slide-in {
            0% {opacity: 0; transform: translateX(100%);}
            100% {opacity: 1; transform: translateX(0);}
          }
          .animate-slide-in {
            animation: slide-in 0.3s ease forwards;
          }
        `}
      </style>
    </main>
  );
};

export default SystemMonitorImproved;
