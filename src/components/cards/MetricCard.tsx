interface Props {
  title: string;
  value: string | number;
}

function MetricCard({ title, value }: Props) {
  return (
    <div
      style={{
        background: "#101B31",
        padding: "20px",
        borderRadius: "12px",
        minWidth: "220px",
        border: "1px solid #1F2A44",
      }}
    >
      <p>{title}</p>

      <h2>{value}</h2>
    </div>
  );
}

export default MetricCard;