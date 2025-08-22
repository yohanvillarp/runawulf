import { useState, useEffect } from "react";
import { useWebSocket } from "../../context/useWebSocket";
import { WEBSOCKET_MESSAGE_TYPES } from "../constants/webSocketTypes";

export const useScript = <T extends object[]>(initialData: T, script: string) => {
  const [data, setData] = useState<T>(initialData);
  const { lastMessage } = useWebSocket();

  useEffect(() => {
    if (!lastMessage) return;

    if (
      lastMessage.type === WEBSOCKET_MESSAGE_TYPES.SCRIPT_RESULT &&
      lastMessage.script === script
    ) {
      const rawOutput = lastMessage.output;

      try {
        // Parsear si es string, sino tomar como objeto
        const parsedLine = typeof rawOutput === "string" ? JSON.parse(rawOutput) : rawOutput;

        // Acumular en un array
        setData(prev => [...prev, parsedLine] as T);
      } catch (error) {
        console.error("Error al parsear JSON del WebSocket:", error, rawOutput);
      }
    }
  }, [lastMessage, script]);

  return { data, setData };
};
