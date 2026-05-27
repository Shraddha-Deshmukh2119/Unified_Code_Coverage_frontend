import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SeverityChart({
  issues,
}: any) {

  const data = [
    {
      name: "Critical",
      value: issues.filter(
        (i:any)=>
          i.severity==="CRITICAL"
      ).length,
    },

    {
      name: "Major",
      value: issues.filter(
        (i:any)=>
          i.severity==="MAJOR"
      ).length,
    },

    {
      name: "Minor",
      value: issues.filter(
        (i:any)=>
          i.severity==="MINOR"
      ).length,
    },
  ];

  return (
    <div
      style={{
        background:"#101B31",
        borderRadius:"12px",
        padding:"20px",
        height:"350px",
      }}
    >
      <h2>Severity Breakdown</h2>

      <ResponsiveContainer
        width="100%"
        height={280}
      >
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            outerRadius={100}
          >
            <Cell fill="#DC2626" />
            <Cell fill="#F97316" />
            <Cell fill="#EAB308" />
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}