// src/components/SystemMonitor/CpuHistoryLineChart.tsx

import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { colors } from "../../constants/colors";

type CpuHistoryData = {
  time: string;
  cpu: number;
}[];

type Props = {
  data: CpuHistoryData;
};

const CpuHistoryLineChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md mx-auto">
      <h3 className="text-sky-800 font-bold text-xl mb-4">
        Uso Histórico CPU (%)
      </h3>
      <div style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="cpu"
              stroke={colors.blue}
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CpuHistoryLineChart;