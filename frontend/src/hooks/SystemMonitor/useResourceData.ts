// hooks/useResourceData.ts
import type { MockSystemData } from "../../types/MockSystemData";

export const useResourceData = (systemData: MockSystemData) => {
  return {
    cpu: {
      used: systemData.cpuUsado,
      total: 100
    },
    ram: {
      used: systemData.ramUsado,
      total: systemData.ramTotal
    },
    disk: {
      used: systemData.discoUsado,
      total: systemData.discoTotal
    }
  };
};