import { useState } from "react";

export type Thresholds = {
  cpu: number;
  ram: number;
  disk: number;
};

const defaultThresholds: Thresholds = {
  cpu: 80,
  ram: 9,
  disk: 200,
};

export const useThresholds = () => {
  const [thresholds, setThresholds] = useState<Thresholds>(() => {
    const stored = localStorage.getItem("thresholds");
    return stored ? JSON.parse(stored) : defaultThresholds;
  });


  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setThresholds((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const onConfigSave = () => {
    localStorage.setItem("thresholds", JSON.stringify(thresholds));
  };

  return { thresholds, handleThresholdChange, onConfigSave };
};