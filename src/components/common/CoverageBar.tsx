interface Props {
  value: number;
}

export default function CoverageBar({
  value,
}: Props) {
  return (
    <div>
      <div
        style={{
          width: "100%",
          background: "#1F2A44",
          borderRadius: "8px",
          height: "8px",
        }}
      >
        <div
          style={{
            width: `${value}%`,
            background: "#22C55E",
            height: "8px",
            borderRadius: "8px",
          }}
        />
      </div>

      <small>{value}%</small>
    </div>
  );
}