interface Props {
  type: string;
}

export default function IssueTypeBadge({
  type,
}: Props) {

  const colors: any = {
    BUG: "#EF4444",

    VULNERABILITY: "#DC2626",

    CODE_SMELL: "#2563EB",
  };

  return (
    <span
      style={{
        background:
          colors[type] ||
          "#64748B",

        color: "white",

        padding: "4px 10px",

        borderRadius: "20px",

        fontSize: "12px",
      }}
    >
      {type}
    </span>
  );
}