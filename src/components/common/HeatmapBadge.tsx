interface Props {
  color: string;
}

export default function HeatmapBadge({
  color,
}: Props) {
  const background =
    color === "GREEN"
      ? "#22C55E"
      : color === "YELLOW"
      ? "#F59E0B"
      : "#EF4444";

  return (
    <div
      style={{
        width: "18px",
        height: "18px",
        borderRadius: "50%",
        background,
      }}
    />
  );
}