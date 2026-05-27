interface Props {
  risk: string;
}

export default function RiskBadge({ risk }: Props) {
  const color =
    risk === "LOW"
      ? "#22C55E"
      : risk === "MEDIUM"
      ? "#F59E0B"
      : "#EF4444";

  return (
    <span
      style={{
        background: color,
        color: "white",
        padding: "4px 10px",
        borderRadius: "20px",
        fontSize: "12px",
      }}
    >
      {risk}
    </span>
  );
}