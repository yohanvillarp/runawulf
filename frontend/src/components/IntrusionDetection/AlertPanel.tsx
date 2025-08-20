import { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import type { SuricataLog } from "../../types/SuricataLog";
import Loader from "../Loader";
import { useState } from "react";
type Props = {
  logs: SuricataLog[];
  bucketMs?: number;
};

const PROTOCOL_COLORS = [
  "#4f46e5", // indigo
  "#16a34a", // green
  "#dc2626", // red
  "#f59e0b", // amber
  "#0ea5e9", // sky
  "#9333ea", // violet
  "#ef4444", // rose
];

function startOfBucket(ts: number, bucketMs: number) {
  return Math.floor(ts / bucketMs) * bucketMs;
}

function formatHHMM(ts: number) {
  const d = new Date(ts);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

export default function AlertPanel({ logs, bucketMs = 60_000 }: Props) {
  const hasData = logs && logs.length > 0;
  const [selectedLog, setSelectedLog] = useState<SuricataLog | null>(null);

  // Timeline: todos los logs por minuto
  const timeSeries = useMemo(() => {
    if (!hasData) return [];
    const map = new Map<number, number>();
    logs.forEach((e) => {
      const t = Date.parse(e.timestamp);
      if (!Number.isNaN(t)) {
        const k = startOfBucket(t, bucketMs);
        map.set(k, (map.get(k) ?? 0) + 1);
      }
    });
    return Array.from(map.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([ts, count]) => ({ ts, label: formatHHMM(ts), count }));
  }, [logs, bucketMs, hasData]);

  // Protocolo
  const protocolBars = useMemo(() => {
    if (!hasData) return [];
    const counts = new Map<string, number>();
    logs.forEach((e) => {
      const proto = (e as any).proto || "UNKNOWN";
      counts.set(proto, (counts.get(proto) ?? 0) + 1);
    });
    return Array.from(counts.entries()).map(([proto, count]) => ({ proto, count }));
  }, [logs, hasData]);

  // IP origen (solo alert)
  const ipBars = useMemo(() => {
    if (!hasData) return [];
    const counts = new Map<string, number>();
    logs
      .filter((e) => e.tipo === "alert")
      .forEach((e) => {
        const ip = e.src_ip || "UNKNOWN";
        counts.set(ip, (counts.get(ip) ?? 0) + 1);
      });
    return Array.from(counts.entries()).map(([ip, count]) => ({ ip, count }));
  }, [logs, hasData]);

  // Puerto
  const portBars = useMemo(() => {
    if (!hasData) return [];
    const counts = new Map<number, number>();

    logs
      .filter((e): e is Extract<SuricataLog, { tipo: "alert" }> => e.tipo === "alert")
      .forEach((e) => {
        const port = e.dest_port ?? 0; // por si acaso no viene
        counts.set(port, (counts.get(port) ?? 0) + 1);
      });

    return Array.from(counts.entries()).map(([port, count]) => ({ port, count }));
  }, [logs, hasData]);


  if (!hasData) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex gap-6">
      {/* Columna izquierda: módulos */}
      <div className="flex-1 grid grid-rows-4 gap-6">
        {/* Timeline */}
        <div
          className="rounded-2xl border p-4 bg-white shadow cursor-pointer"
          onClick={() => setSelectedLog({ tipo: "timeline" } as any)}
        >
          <h4 className="font-semibold mb-2">Logs en tiempo</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeries}>
                <defs>
                  <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="Eventos"
                  stroke="#4f46e5"
                  fill="url(#areaFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Protocolo */}
        <div
          className="rounded-2xl border p-4 bg-white shadow cursor-pointer"
          onClick={() => setSelectedLog({ tipo: "protocol" } as any)}
        >
          <h4 className="font-semibold mb-2">Por protocolo</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={protocolBars}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="proto" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Eventos">
                  {protocolBars.map((_, idx) => (
                    <Cell key={idx} fill={PROTOCOL_COLORS[idx % PROTOCOL_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* IP origen */}
        <div
          className="rounded-2xl border p-4 bg-white shadow cursor-pointer"
          onClick={() => setSelectedLog({ tipo: "ip" } as any)}
        >
          <h4 className="font-semibold mb-2">Por IP origen (alertas)</h4>
          <div className="h-64 overflow-auto">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={ipBars}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ip" hide />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#dc2626" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Puertos destino */}
        <div
          className="rounded-2xl border p-4 bg-white shadow cursor-pointer"
          onClick={() => setSelectedLog({ tipo: "port" } as any)}
        >
          <h4 className="font-semibold mb-2">Por puerto destino (alertas)</h4>
          <div className="h-64 overflow-auto">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={portBars}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="port" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Columna derecha: información general */}
      <div className="w-1/3 rounded-2xl border p-4 bg-gray-50 shadow">
        <h4 className="font-semibold mb-2">Información general</h4>
        {selectedLog ? (
          <pre className="text-sm overflow-auto">{JSON.stringify(selectedLog, null, 2)}</pre>
        ) : (
          <p className="text-gray-500">Selecciona un módulo para ver detalles</p>
        )}
      </div>
    </div>
  );
}