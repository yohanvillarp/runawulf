import { useState, useEffect } from "react";
import { useSystemData } from "./useSystemData";

// Define la estructura de cada punto de dato
interface CpuHistoryPoint {
  time: string;
  cpu: number;
}

// Limita el historial a 15 puntos
const MAX_HISTORY_POINTS = 20;

export const useCpuHistory = () => {
  const [cpuHistory, setCpuHistory] = useState<CpuHistoryPoint[]>([]);
  const systemData = useSystemData(); // Llama al hook principal para obtener los datos más recientes

  useEffect(() => {
    // Solo actualiza si hay datos de CPU disponibles
    if (systemData.cpuUsado !== undefined){

        // Formatea la hora actual
        const now = new Date();
        const timeString = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

        // Crea el nuevo punto de dato
        const newPoint: CpuHistoryPoint = {
            time: timeString,
            cpu: systemData.cpuUsado,
        };

        // Actualiza el estado con el nuevo punto
        setCpuHistory(prevHistory => {
            const updatedHistory = [...prevHistory, newPoint];
            // Si el historial excede el límite, elimina el punto más antiguo
            if (updatedHistory.length > MAX_HISTORY_POINTS) {
                return updatedHistory.slice(updatedHistory.length - MAX_HISTORY_POINTS);
            }
            return updatedHistory;
        });
    }
  }, [systemData.cpuUsado ]); // Se ejecuta cada vez que el valor de CPU cambia

  return cpuHistory;
};