import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  AreaChart,
  Area,
  Legend,
} from "recharts";
import { Bell, CheckCircle, Info, AlertCircle, X } from "lucide-react";
import { useEffect } from "react";
import { useWebSocket } from "../context/useWebSocket";
import { WEBSOCKET_MESSAGE_TYPES } from "../constants/webSocketTypes";

const colors = {
  blue: "#0ea5e9",
  lightBlue: "#bae6fd",
  red: "#ef4444",
  green: "#22c55e",
  orange: "#f97316",
  gray: "#94a3b8",
};

type NotificationType = "info" | "success" | "error";

type Notification = {
  id: number;
  type: NotificationType;
  message: string;
};

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

const ResourcePieChart = ({
  title,
  used,
  total,
  suffix = "GB",
}: {
  title: string;
  used: number;
  total: number;
  suffix?: string;
}) => {
  const usedPercent = (used / total) * 100;
  const alert = usedPercent >= 80; //alerta si pasa mas del 80%
  const data = [
    { name: "Usado", value: used },
    { name: "Libre", value: total - used },
  ];
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center w-full">
      <h3 className="text-sky-800 font-bold text-xl mb-4">{title}</h3>
      <div className="w-full" style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={80}
              outerRadius={110}
              paddingAngle={6}
              cornerRadius={12}
            >
              <Cell fill={alert ? colors.red : colors.blue} />
              <Cell fill={colors.lightBlue} />
            </Pie>
            <Tooltip
              formatter={(val: number) =>
                suffix === "%" ? `${val}%` : `${val} ${suffix}`
              }
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <p
        className={`mt-5 font-semibold text-lg ${alert ? "text-red-600" : "text-sky-700"
          }`}
      >
        {used} / {total} {suffix}
      </p>
    </div>
  );
};

const networkData = [
  { time: "12:00", in: 120, out: 100 },
  { time: "12:01", in: 200, out: 170 },
  { time: "12:02", in: 150, out: 130 },
  { time: "12:03", in: 230, out: 210 },
  { time: "12:04", in: 180, out: 160 },
];

const cpuHistoryData = [
  { time: "12:00", cpu: 40 },
  { time: "12:01", cpu: 55 },
  { time: "12:02", cpu: 30 },
  { time: "12:03", cpu: 65 },
  { time: "12:04", cpu: 70 },
];

const swapData = [
  { time: "12:00", used: 1.2 },
  { time: "12:01", used: 1.0 },
  { time: "12:02", used: 0.9 },
  { time: "12:03", used: 1.5 },
  { time: "12:04", used: 1.8 },
];

type Thresholds = {
  cpu: number;
  ram: number;
  disk: number;
};

type MockSystemData = {
  cpuUsage: number;
  ramUsed: number;
  ramTotal: number;
  diskUsed: number;
  diskTotal: number;
  ipPublica: string;
  ipPrivada: string;
  hostname: string;
  os: string;
  uptime: string;
};

const defaultThresholds: Thresholds = {
  cpu: 80,
  ram: 9,
  disk: 200,
};


{/* Jugando cn LocalStorage*/ }
const SystemMonitorImproved: React.FC = () => {
  // Guardar y cargar thresholds de localStorage
  const [thresholds, setThresholds] = useState<Thresholds>(() => {
    const stored = localStorage.getItem("thresholds");
    return stored ? JSON.parse(stored) : defaultThresholds;
  });

  // Guardando las notificaciones
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, type: "info", message: "CPU pasó el umbral de alerta." },
    { id: 2, type: "error", message: "Memoria pasó el umbral de alerta." },
  ]);
  // Modal configuración abierto o no?
  const [showConfig, setShowConfig] = useState(false);
  // Modal notificaciones abierto o no?
  const [showNotifModal, setShowNotifModal] = useState(false);
  // notificacion temporal
  const [toast, setToast] = useState<Notification | null>(null);

  // Cambiar valores umbral
  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setThresholds((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const [mockSystemData, setMockSystemData] = useState<MockSystemData>({
    cpuUsage: 85,
    ramUsed: 8.1,
    ramTotal: 10,
    diskUsed: 210,
    diskTotal: 256,
    ipPublica: "190.12.34.56",
    ipPrivada: "192.168.1.10",
    hostname: "mi-servidor",
    os: "Ubuntu 22.04 LTS",
    uptime: "5 horas 10 minutos",
  })

  const { socket, lastMessage } = useWebSocket();

  // solicita datos al backend
  useEffect(() => {
    if (!socket) return;
    socket.send(JSON.stringify({
      type: "exec-script",
      payload: {
        script: "get_system_info",
      }
    }))
  }, [socket])

  // recibe datos del backend cada 5 segundos
  useEffect(() => {
    if (!lastMessage) return;

    if (
      lastMessage.type === WEBSOCKET_MESSAGE_TYPES.SCRIPT_RESULT &&
      lastMessage.script === "get_system_info.sh"
    ) {
      // Si output viene en formato string JSON:
      try {
        const data = typeof lastMessage.output === "string"
          ? JSON.parse(lastMessage.output)
          : lastMessage.output;

        setMockSystemData(data);
      } catch (error) {
        console.error("Error parseando output:", error);
      }
    }
  }, [lastMessage]);

  // Funcionalidad
  // Agregar notificación (toast + lista)
  const addNotification = (notif: Omit<Notification, "id">) => {
    const newNotif = { id: Date.now(), ...notif };
    setNotifications((prev) => [newNotif, ...prev]);
    setToast(newNotif);
    setTimeout(() => setToast(null), 2000);
  };

  // Guardar configuración (localStorage + alertas)
  const onConfigSave = () => {
    localStorage.setItem("thresholds", JSON.stringify(thresholds));
    setShowConfig(false);

    // Comprobar alertas:
    if (mockSystemData.cpuUsage >= thresholds.cpu) {
      addNotification({ type: "error", message: "CPU pasó el umbral de alerta." });
    }
    if (mockSystemData.ramUsed >= thresholds.ram) {
      addNotification({ type: "error", message: "RAM pasó el umbral de alerta." });
    }
    if (mockSystemData.diskUsed >= thresholds.disk) {
      addNotification({ type: "error", message: "Disco pasó el umbral de alerta." });
    }

    addNotification({ type: "success", message: "Usuario cambió la configuración de alerta." });
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
          used={mockSystemData.cpuUsage}
          total={100}
          suffix="%"
        />
        <ResourcePieChart
          title="RAM (GB)"
          used={mockSystemData.ramUsed}
          total={mockSystemData.ramTotal}
        />
        <ResourcePieChart
          title="Disco (GB)"
          used={mockSystemData.diskUsed}
          total={mockSystemData.diskTotal}
        />
      </section>

      {/* Gráficos secundarios */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md mx-auto">
          <h3 className="text-sky-800 font-bold text-xl mb-4">
            Tráfico de Red (Kb/s)
          </h3>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={networkData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="in" fill={colors.blue} name="Entrante" />
                <Bar dataKey="out" fill={colors.orange} name="Saliente" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md mx-auto">
          <h3 className="text-sky-800 font-bold text-xl mb-4">
            Uso Histórico CPU (%)
          </h3>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cpuHistoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="cpu"
                  stroke={colors.blue}
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md mx-auto">
          <h3 className="text-sky-800 font-bold text-xl mb-4">Uso de Swap (GB)</h3>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={swapData}>
                <defs>
                  <linearGradient id="colorSwap" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.blue} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={colors.blue} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="used"
                  stroke={colors.blue}
                  fillOpacity={1}
                  fill="url(#colorSwap)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Datos del servidor */}
      <section className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto mb-12 text-sky-900">
        <h2 className="text-3xl font-bold mb-6 border-b border-sky-400 pb-3">
          Datos del Servidor
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 text-xl">
          <li>
            <strong>IP Pública:</strong> {mockSystemData.ipPublica}
          </li>
          <li>
            <strong>IP Privada:</strong> {mockSystemData.ipPrivada}
          </li>
          <li>
            <strong>Hostname:</strong> {mockSystemData.hostname}
          </li>
          <li>
            <strong>Sistema Operativo:</strong> {mockSystemData.os}
          </li>
          <li>
            <strong>Tiempo encendido:</strong> {mockSystemData.uptime}
          </li>
        </ul>
      </section>

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
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-24 z-50"
          onClick={() => setShowNotifModal(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white rounded-2xl shadow-lg p-8 max-w-lg w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowNotifModal(false)}
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
                    className={`flex items-center gap-3 border-l-4 px-4 py-3 rounded shadow-sm ${notificationColors[type]
                      }`}
                  >
                    {notificationIcons[type]}
                    <span className="font-semibold">{message}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
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
                onClick={onConfigSave}
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
