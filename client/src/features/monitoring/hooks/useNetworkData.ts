import { useState, useEffect } from "react";
import { useSystemData } from "./useSystemData";

// Define la estructura de cada punto de dato de red
interface NetworkHistoryPoint {
  time: string;
  in: number;
  out: number;
}

// Limita el historial a 20 puntos
const MAX_HISTORY_POINTS = 20;

export const useNetworkData = () => {
  const [networkHistory, setNetworkHistory] = useState<NetworkHistoryPoint[]>([]);
  const systemData = useSystemData(); // Obtiene los datos más recientes del sistema

  useEffect(() => {
    // Solo actualiza si hay datos de red disponibles
    if (systemData.datosRecibidosMB !== undefined && systemData.datosEnviadosMB !== undefined) {
      // Formatea la hora actual
      const now = new Date();
      const timeString = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

      // Crea el nuevo punto de dato
      const newPoint: NetworkHistoryPoint = {
        time: timeString,
        in: systemData.datosRecibidosMB,
        out: systemData.datosEnviadosMB,
      };

      // Actualiza el estado con el nuevo punto
      setNetworkHistory(prevHistory => {
        const updatedHistory = [...prevHistory, newPoint];
        // Si el historial excede el límite, elimina el punto más antiguo
        if (updatedHistory.length > MAX_HISTORY_POINTS) {
          return updatedHistory.slice(updatedHistory.length - MAX_HISTORY_POINTS);
        }
        return updatedHistory;
      });
    }
  }, [systemData.datosRecibidosMB, systemData.datosEnviadosMB]); // Depende de los datos de red

  return networkHistory;
};