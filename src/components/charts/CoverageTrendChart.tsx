import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface Props {
  data: any[];
}

export default function CoverageTrendChart({ data }: Props) {
  return (
    <div style={{ height: "350px", display: "flex", flexDirection: "column" }}>
      <h3 style={{ marginBottom: "16px", fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "16px" }}>
        Coverage Trend
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid stroke="var(--grey-200)" strokeDasharray="3 3" />
          <XAxis 
            dataKey="buildNumber" 
            stroke="var(--grey-700)" 
            fontSize={12}
            tickLine={false} 
            axisLine={false}
            dy={8}
          />
          <YAxis 
            stroke="var(--grey-700)" 
            fontSize={12}
            tickLine={false} 
            axisLine={false}
            dx={-8}
            domain={[0, 100]}
          />
          <Tooltip 
            contentStyle={{
              background: "var(--grey-900)",
              border: "none",
              borderRadius: "4px",
              color: "white",
              fontSize: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
            }}
            labelFormatter={(label) => `Build #${label}`}
            formatter={(value: any) => [`${value}%`, "Coverage"]}
          />
          <Line
            type="monotone"
            dataKey="coverage"
            stroke="var(--google-blue-600)"
            strokeWidth={3}
            activeDot={{ r: 6, strokeWidth: 0 }}
            dot={{ r: 3, strokeWidth: 1 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}