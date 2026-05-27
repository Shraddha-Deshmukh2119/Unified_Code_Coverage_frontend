import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function QualityScoreTrendChart({
  data,
}: any) {
  return (
    <div
      style={{
        background: "#101B31",
        borderRadius: "12px",
        padding: "20px",
        height: "350px",
      }}
    >
      <h3>Quality Score Trend</h3>

      <ResponsiveContainer
        width="100%"
        height={280}
      >
        <LineChart data={data}>
          <XAxis dataKey="buildNumber" />

          <YAxis domain={[0, 100]} />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="score"
            stroke="#4F46E5"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}