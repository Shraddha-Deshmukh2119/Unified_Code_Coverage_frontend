import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function QualityScoreTrendChart({
  data,
}: any) {

  const formattedData =
    data.map(
      (
        item: any,
        index: number
      ) => ({
        chartId: index + 1,

        buildNumber:
          item.buildNumber,

        coverage:
          Number(item.coverage),

        score:
          Number(item.score),

        bugs:
          Number(item.bugs),

        vulnerabilities:
          Number(
            item.vulnerabilities
          ),

        status:
          item.status,
      })
    );

  return (
    <div
      style={{
        width: "100%",
        height: 400,

        background: "#FFFFFF",

        padding: "20px",

        borderRadius: "12px",

        marginTop: "25px",

        boxShadow:
          "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <h3
        style={{
          marginBottom: 20,

          fontSize: 18,

          fontWeight: 600,

          color: "#111827",
        }}
      >
        Quality Trend Analysis
      </h3>

      <ResponsiveContainer
        width="100%"
        height={320}
      >
        <LineChart
          data={formattedData}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#E5E7EB"
          />

          <XAxis
            dataKey="chartId"
            stroke="#6B7280"
          />

          <YAxis
            domain={[0, 100]}
            stroke="#6B7280"
          />

          <Tooltip
            contentStyle={{
              background:
                "#FFFFFF",

              border:
                "1px solid #E5E7EB",

              borderRadius:
                "10px",

              color:
                "#111827",
            }}

            formatter={(
              value: any,
              name: any
            ) => {

              if (
                name ===
                "coverage"
              ) {
                return [
                  `${value}%`,
                  "Coverage",
                ];
              }

              if (
                name ===
                "score"
              ) {
                return [
                  `${value}%`,
                  "Project Health Score",
                ];
              }

              return [
                value,
                name,
              ];
            }}

            labelFormatter={(
              label,
              payload
            ) => {

              if (
                payload &&
                payload.length > 0
              ) {

                return `Build #${payload[0].payload.buildNumber}`;
              }

              return label;
            }}
          />

          <Legend />

          {/* Coverage Line */}

          <Line
            type="monotone"

            dataKey="coverage"

            stroke="#22C55E"

            strokeWidth={3}

            dot={{ r: 4 }}

            activeDot={{
              r: 7,
            }}

            name="Coverage"
          />

          {/* Project Health Line */}

          <Line
            type="monotone"

            dataKey="score"

            stroke="#2563EB"

            strokeWidth={3}

            dot={{ r: 4 }}

            activeDot={{
              r: 7,
            }}

            name="Project Health Score"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}