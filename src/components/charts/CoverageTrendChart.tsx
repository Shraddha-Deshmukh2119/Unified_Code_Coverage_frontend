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
    <div
      style={{
        background: "#101B31",
        padding: "20px",
        borderRadius: "12px",
        height: "350px",
      }}
    >
      <h3>Coverage Trend</h3>

      <ResponsiveContainer
  width="100%"
  height={300}
>
        <LineChart data={data}>
          <CartesianGrid stroke="#1F2A44" />

          <XAxis dataKey="buildNumber" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="coverage"
            stroke="#4F46E5"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}