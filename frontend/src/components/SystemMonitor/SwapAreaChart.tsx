// src/components/SystemMonitor/SwapAreaChart.tsx

import React from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { colors } from "../../constants/colors";

type SwapData = {
  time: string;
  used: number;
}[];

type Props = {
  data: SwapData;
};

const SwapAreaChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md mx-auto">
      <h3 className="text-sky-800 font-bold text-xl mb-4">Uso de Swap (GB)</h3>
      <div style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorSwap" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.blue} stopOpacity={0.8} />
                <stop offset="95%" stopColor={colors.blue} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="used"
              stroke={colors.blue}
              fillOpacity={1}
              fill="url(#colorSwap)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SwapAreaChart;