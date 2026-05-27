import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";

import { getBuildHistory } from "../api/dashboardApi";

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
      <h1>Build History</h1>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            background: "#101B31",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          Total Builds
          <h2>{builds.length}</h2>
        </div>

        <div
          style={{
            background: "#101B31",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          Latest Build
          <h2>
            {builds[0]?.buildNumber}
          </h2>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search Build Number"
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "20px",
          borderRadius: "10px",
        }}
      />

      {filteredBuilds.map((build) => (
        <div
          key={build.buildId}
          style={{
            background: "#101B31",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "15px",
          }}
        >
          <h3>
            Build #{build.buildNumber}
          </h3>

          <p>
            Status: {build.status}
          </p>

          <p>
            Coverage:
            {" "}
            {build.coverage}%
          </p>

          <p>
            Repository:
            {" "}
            {build.repositoryName}
          </p>

          <p>
            Time:
            {" "}
            {new Date(
              build.buildTime
            ).toLocaleString()}
          </p>
        </div>
      ))}
    </MainLayout>
  );
}