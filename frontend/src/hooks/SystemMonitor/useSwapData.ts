// hooks/useSwapData.ts
import { useState, useEffect } from "react";
import { useSystemData } from "./useSystemData";

// Define la estructura de cada punto de dato de swap
interface SwapHistoryPoint {
  time: string;
  used: number;
}

// Limita el historial para mantener el rendimiento
const MAX_HISTORY_POINTS = 20;

export const useSwapData = () => {
  const [swapHistory, setSwapHistory] = useState<SwapHistoryPoint[]>([]);
  const systemData = useSystemData(); // Obtiene los datos más recientes del sistema

  useEffect(() => {
    // Solo actualiza si hay datos de RAM disponibles
    if (systemData.ramUsado !== undefined) {
      const now = new Date();
      const timeString = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

      // Crea el nuevo punto de dato
      const newPoint: SwapHistoryPoint = {
        time: timeString,
        used: systemData.ramUsado, // Usamos ramUsado como la métrica para la gráfica de swap
      };

      // Actualiza el estado con el nuevo punto
      setSwapHistory(prevHistory => {
        const updatedHistory = [...prevHistory, newPoint];
        // Si el historial excede el límite, elimina el punto más antiguo
        if (updatedHistory.length > MAX_HISTORY_POINTS) {
          return updatedHistory.slice(updatedHistory.length - MAX_HISTORY_POINTS);
        }
        return updatedHistory;
      });
    }
  }, [systemData.ramUsado]); // Depende del uso de RAM

  return swapHistory;
};