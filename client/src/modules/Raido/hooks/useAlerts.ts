import { useEffect, useRef } from "react";
import type { Thresholds } from "./useThresholds";
import type { MockSystemData } from "../types/MockSystemData";

type AddNotificationFn = (notif: { type: "info" | "success" | "error"; message: string }) => void;

export const useAlerts = (
  systemData: MockSystemData,
  thresholds: Thresholds,
  addNotification: AddNotificationFn
) => {
  
  const lastStates = useRef({
    cpu: false,
    ram: false,
    disk: false,
  });

  useEffect(() => {
    const checkAndNotify = (
    condition: boolean,
    key: "cpu" | "ram" | "disk",
    message: string
  ) => {
    if (condition && !lastStates.current[key]) {
      // Solo se dispara cuando pasa de OK → ALERTA
      addNotification({ type: "error", message });
      lastStates.current[key] = true;
    } else if (!condition && lastStates.current[key]) {
      // Opcional: notificación de recuperación
      addNotification({
        type: "success",
        message: `✅ Recurso ${key.toUpperCase()} volvió a niveles normales.`,
      });
      lastStates.current[key] = false;
    }
  };

  checkAndNotify(
    systemData.cpuUsado >= thresholds.cpu,
    "cpu",
    `¡Alerta! Uso de CPU (${systemData.cpuUsado.toFixed(
      1
    )}%) superó el umbral de ${thresholds.cpu}%.`
  );

  checkAndNotify(
    systemData.ramUsado >= thresholds.ram,
    "ram",
    `¡Alerta! Uso de RAM (${systemData.ramUsado.toFixed(
      1
    )}GB) superó el umbral de ${thresholds.ram}GB.`
  );

  checkAndNotify(
    systemData.discoUsado >= thresholds.disk,
    "disk",
    `¡Alerta! Uso de Disco (${systemData.discoUsado.toFixed(
      1
    )}GB) superó el umbral de ${thresholds.disk}GB.`
  );
}, [systemData, thresholds, addNotification]);
};
