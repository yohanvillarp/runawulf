import { useState, useEffect } from "react";
import { useWebSocket } from "../../../context/useWebSocket";
import { WEBSOCKET_MESSAGE_TYPES } from "../../../shared/constants/webSocketTypes";
import type { MockSystemData } from "../types/MockSystemData";

// Este objeto asegura que el estado inicial siempre tenga todas las propiedades necesarias
const defaultSystemData: MockSystemData = {
  "cpuUsado": 0,
  "ramUsado": 0,
  "ramTotal": 0,
  "discoUsado": 0,
  "discoTotal": 0,
  "ipPublica": "0.0.0.0",
  "ipPrivada": "0.0.0.0",
  "nombreMaquina": "",
  "sistemaOperativo": "",
  "tiempoPrendido": "",
  "datosRecibidosMB": 0,
  "datosEnviadosMB": 0,
  "cargaPromedio": {
    "1min": 0,
    "5min": 0,
    "15min": 0
  },
  "numeroProcesos": 0,
  "procesosMasUsados": [],
  "servicios": [],
  "latenciaMs": 0,
  "usuariosConectados": 0,
};

export const useSystemData = () => {
  const [systemData, setSystemData] = useState<MockSystemData>(defaultSystemData);
  const { lastMessage } = useWebSocket();

  useEffect(() => {
    if (!lastMessage) return;

    if (
      lastMessage.type === WEBSOCKET_MESSAGE_TYPES.SCRIPT_RESULT &&
      lastMessage.script === "get/get_system_info.sh"
    ) {
      try {
        // Accede a la propiedad 'output' del objeto 'lastMessage'
        const rawOutput = lastMessage.output; 

        // Condición corregida: verifica si 'rawOutput' es un string
        const parsedData: MockSystemData = typeof rawOutput === "string"
          ? JSON.parse(rawOutput)
          : rawOutput;

        // Actualiza el estado con los datos procesados
        setSystemData(parsedData);
      } catch (error) {
        console.error("Error al procesar el output del WebSocket:", error);
      }
    }
  }, [lastMessage]);

  return systemData;
};