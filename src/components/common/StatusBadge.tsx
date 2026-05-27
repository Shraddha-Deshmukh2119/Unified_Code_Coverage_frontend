interface Props {
  status: string;
}

export default function StatusBadge({ status }: Props) {
  const isHealthy = status === "HEALTHY" || status === "SUCCESS" || status === "PASSED";
  const badgeClass = isHealthy ? "g-badge-green" : "g-badge-red";

  return (
    <span className={`g-badge ${badgeClass}`}>
      {status}
    </span>
  );
}