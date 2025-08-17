// src/components/SystemMonitor/NetworkBarChart.tsx

import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { colors } from "../../constants/colors";

type NetworkData = {
  time: string;
  in: number;
  out: number;
}[];

type Props = {
  data: NetworkData;
};

const NetworkBarChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md mx-auto">
      <h3 className="text-sky-800 font-bold text-xl mb-4">
        Tráfico de Red (Kb/s)
      </h3>
      <div style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
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
  );
};

export default NetworkBarChart;