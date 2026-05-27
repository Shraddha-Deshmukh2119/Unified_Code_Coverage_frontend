import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";
import { getBuildHistory } from "../api/dashboardApi";
import MetricCard from "../components/cards/MetricCard";
import StatusBadge from "../components/common/StatusBadge";

export default function Builds() {
  const [builds, setBuilds] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getBuildHistory()
      .then((res) => {
        setBuilds(res.data);
      })
      .catch(console.error);
  }, []);

  const filteredBuilds = builds.filter((build) => {
  if (build.buildNumber == null) {
    return false;
  }

  return build.buildNumber
    .toString()
    .includes(search);
});

  return (
    <MainLayout>
      <div className="page-subtitle">Repository Operations</div>
      <h1 className="page-title">Build History</h1>

      {/* KPI Cards Row */}
      <div className="grid-cols-4" style={{ marginBottom: "24px" }}>
        <MetricCard
          title="Total Builds"
          value={builds.length}
          subtitle="All recorded pipeline runs"
        />

        <MetricCard
          title="Latest Build"
          value={builds[0]?.buildNumber ? `#${builds[0].buildNumber}` : "-"}
          subtitle={builds[0] ? `Status: ${builds[0].status}` : undefined}
          trend={builds[0]?.status === "SUCCESS" ? "SUCCESS" : undefined}
          trendType={builds[0]?.status === "SUCCESS" ? "up" : "down"}
        />
      </div>

      {/* Search Input */}
      <div style={{ marginBottom: "24px", display: "flex" }}>
        <input
          type="text"
          placeholder="Filter build history by build number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="g-input"
          style={{ width: "100%", padding: "12px" }}
        />
      </div>

      {/* Builds Feed */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {filteredBuilds.length > 0 ? (
          filteredBuilds.map((build) => (
            <div
              key={build.buildId}
              className="g-card"
              style={{
                padding: "20px"
              }}
            >
              {/* Build Title header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid var(--grey-100)",
                  paddingBottom: "10px",
                  marginBottom: "12px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <h3 style={{ margin: 0, fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "16px" }}>
                    Build #{build.buildNumber}
                  </h3>
                  <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                    {build.repositoryName}
                  </span>
                </div>
                
                <StatusBadge status={build.status} />
              </div>

              {/* Stats details */}
              <div 
                style={{ 
                  display: "grid", 
                  gridTemplateColumns: "1fr 1fr 1fr", 
                  gap: "16px",
                  fontSize: "13px",
                  color: "var(--text-secondary)"
                }}
              >
                <div>
                  <span style={{ display: "block", fontSize: "11px", textTransform: "uppercase", fontWeight: 600 }}>Coverage</span>
                  <strong style={{ fontSize: "16px", color: "var(--text-primary)", fontWeight: 600 }}>{build.coverage}%</strong>
                </div>

                <div>
                  <span style={{ display: "block", fontSize: "11px", textTransform: "uppercase", fontWeight: 600 }}>Branch</span>
                  <strong style={{ fontSize: "14px", color: "var(--text-primary)", fontWeight: 500 }}>{build.branch ?? "main"}</strong>
                </div>

                <div>
                  <span style={{ display: "block", fontSize: "11px", textTransform: "uppercase", fontWeight: 600 }}>Execution Time</span>
                  <span style={{ fontSize: "13px", color: "var(--text-primary)" }}>
                    {new Date(build.buildTime).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="g-card" style={{ textAlign: "center", padding: "40px", color: "var(--text-secondary)" }}>
            No builds found matching that build number.
          </div>
        )}
      </div>
    </MainLayout>
  );
}