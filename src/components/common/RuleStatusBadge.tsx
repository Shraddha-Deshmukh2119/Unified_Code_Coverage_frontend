interface Props {
  status: string;
}

export default function RuleStatusBadge({
  status,
}: Props) {
  const success = status === "PASS";

  return (
    <span
      style={{
        background: success
          ? "#22C55E"
          : "#EF4444",

        color: "white",

        padding: "6px 12px",

        borderRadius: "20px",

        fontSize: "12px",

        fontWeight: "bold",
      }}
    >
      {status}
    </span>
  );
}