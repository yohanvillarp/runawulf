import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { colors } from "../constants/colors";

export const ResourcePieChart = ({
  title,
  used,
  total,
  suffix = "GB",
}: {
  title: string;
  used: number;
  total: number;
  suffix?: string;
}) => {
  const usedPercent = (used / total) * 100;
  const alert = usedPercent >= 80; //alerta si pasa mas del 80%
  const data = [
    { name: "Usado", value: used },
    { name: "Libre", value: total - used },
  ];
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center w-full">
      <h3 className="text-sky-800 font-bold text-xl mb-4">{title}</h3>
      <div className="w-full" style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={80}
              outerRadius={110}
              paddingAngle={6}
              cornerRadius={12}
            >
              <Cell fill={alert ? colors.red : colors.blue} />
              <Cell fill={colors.lightBlue} />
            </Pie>
            <Tooltip
              formatter={(val) =>
                typeof val === "number"
                  ? suffix === "%"
                    ? `${val}%`
                    : `${val} ${suffix}`
                  : ""
              }
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <p
        className={`mt-5 font-semibold text-lg ${
          alert ? "text-red-600" : "text-sky-700"
        }`}
      >
        {used} / {total} {suffix}
      </p>
    </div>
  );
};
