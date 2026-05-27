interface Props {
  severity: string;
}

export default function SeverityBadge({
  severity,
}: Props) {

  let color = "#64748B";

  switch (severity) {
    case "CRITICAL":
      color = "#EF4444";
      break;

    case "MAJOR":
      color = "#F97316";
      break;

    case "MINOR":
      color = "#EAB308";
      break;

    default:
      color = "#64748B";
  }

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
      {severity}
    </span>
  );
}