interface Props {
  status: string;
}

export default function StatusBadge({ status }: Props) {
  const color =
    status === "HEALTHY"
      ? "#22C55E"
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
      {status}
    </span>
  );
}