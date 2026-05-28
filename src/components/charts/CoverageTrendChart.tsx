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

  // CLEAN + NORMALIZE DATA
  const formattedData = data.map((item: any, index: number) => ({
    buildId: index + 1,
    coverage: Number(item.coverage),
  }));

  console.log("Coverage Graph Data =>", formattedData);

  return (
    <div
      style={{
        height: "350px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h3
        style={{
          marginBottom: "16px",
          fontFamily: "var(--font-display)",
          fontWeight: 500,
          fontSize: "16px",
        }}
      >
        Coverage Trend
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={formattedData}
          margin={{
            top: 10,
            right: 10,
            left: -20,
            bottom: 0,
          }}
        >
          <CartesianGrid
            stroke="var(--grey-200)"
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="buildId"
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
            content={({ active, payload, label }) => {

              if (!active || !payload || !payload.length) {
                return null;
              }

              // FORCE exact coverage value
              const coverage = payload[0].payload.coverage;

              return (
                <div
                  style={{
                    background: "var(--grey-900)",
                    border: "none",
                    borderRadius: "4px",
                    color: "white",
                    fontSize: "12px",
                    padding: "10px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  }}
                >
                  <div
                    style={{
                      marginBottom: "6px",
                      color: "#aaa",
                    }}
                  >
                    Build #{label}
                  </div>

                  <div>
                    Coverage : <strong>{coverage}%</strong>
                  </div>
                </div>
              );
            }}
          />

          <Line
            type="monotone"
            dataKey="coverage"
            stroke="var(--google-blue-600)"
            strokeWidth={3}
            activeDot={{
              r: 6,
              strokeWidth: 0,
            }}
            dot={{
              r: 3,
              strokeWidth: 1,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}