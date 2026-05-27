import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#4F46E5", "#22C55E"];

export default function LanguageDistributionChart({
  javaCoverage,
  cppCoverage,
}: any) {
  const data = [
    {
      name: "Java",
      value: javaCoverage,
    },
    {
      name: "C++",
      value: cppCoverage,
    },
  ];

  return (
    <div
      style={{
        background: "#101B31",
        padding: "20px",
        borderRadius: "12px",
        height: "350px",
      }}
    >
      <h3>Languages</h3>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            outerRadius={100}
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index]}
              />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}