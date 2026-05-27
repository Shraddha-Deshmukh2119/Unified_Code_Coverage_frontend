import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  summary: any;
}

export default function IssueDistributionChart({
  summary,
}: Props) {

  const data = [
    {
      name: "Bugs",
      value: summary.bugs,
    },
    {
      name: "Vulnerabilities",
      value:
        summary.vulnerabilities,
    },
    {
      name: "Code Smells",
      value:
        summary.codeSmells,
    },
    {
      name: "Hotspots",
      value:
        summary.securityHotspots,
    },
  ];

  const colors = [
    "#EF4444",
    "#DC2626",
    "#2563EB",
    "#EAB308",
  ];

  return (
    <div
      style={{
        background: "#101B31",
        borderRadius: "12px",
        padding: "20px",
        height: "350px",
      }}
    >
      <h2>Issue Distribution</h2>

      <ResponsiveContainer
        width="100%"
        height={280}
      >
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
          >
            {data.map(
              (_, index) => (
                <Cell
                  key={index}
                  fill={
                    colors[index]
                  }
                />
              )
            )}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}