import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import { getModuleById } from "../api/dashboardApi";

export default function ModuleDetails() {
  const { id } = useParams();

  const [module, setModule] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    getModuleById(Number(id))
      .then((res) => setModule(res.data))
      .catch(console.error);
  }, [id]);

  if (!module) {
    return (
      <MainLayout>
        Loading...
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <h1>{module.moduleName}</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <div>
          <h3>Language</h3>
          <p>{module.language}</p>
        </div>

        <div>
          <h3>Status</h3>
          <p>{module.status}</p>
        </div>

        <div>
          <h3>Risk Level</h3>
          <p>{module.riskLevel}</p>
        </div>

        <div>
          <h3>Heatmap</h3>
          <p>{module.heatmapColor}</p>
        </div>
      </div>

      <div
        style={{
          marginTop: "30px",
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: "20px",
        }}
      >
        <div>
          <h3>Line Coverage</h3>
          <p>{module.lineCoverage}%</p>
        </div>

        <div>
          <h3>Branch Coverage</h3>
          <p>{module.branchCoverage}%</p>
        </div>

        <div>
          <h3>Covered Lines</h3>
          <p>{module.coveredLines}</p>
        </div>

        <div>
          <h3>Missed Lines</h3>
          <p>{module.missedLines}</p>
        </div>

        <div>
          <h3>Covered Branches</h3>
          <p>{module.coveredBranches}</p>
        </div>

        <div>
          <h3>Missed Branches</h3>
          <p>{module.missedBranches}</p>
        </div>
      </div>

      <div style={{ marginTop: "30px" }}>
        <h3>Module Path</h3>
        <p>{module.modulePath}</p>
      </div>
    </MainLayout>
  );
}