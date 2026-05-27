import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import { getModules } from "../api/dashboardApi";

import CoverageBar from "../components/common/CoverageBar";
import StatusBadge from "../components/common/StatusBadge";
import RiskBadge from "../components/common/RiskBadge";
import HeatmapBadge
from "../components/common/HeatmapBadge";


export default function Modules() {
  const [modules, setModules] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const [languageFilter, setLanguageFilter] =
  useState("ALL");

  const [riskFilter, setRiskFilter] =
  useState("ALL");
  const navigate = useNavigate();

  useEffect(() => {
    getModules()
      .then((res) => {
        setModules(res.data);
      })
      .catch(console.error);
  }, []);

const filteredModules = modules.filter(
  (module) => {
    const searchMatch =
      module.moduleName
        .toLowerCase()
        .includes(search.toLowerCase());

    const languageMatch =
      languageFilter === "ALL" ||
      module.language === languageFilter;

    const riskMatch =
      riskFilter === "ALL" ||
      module.riskLevel === riskFilter;

    return (
      searchMatch &&
      languageMatch &&
      riskMatch
    );
  }
);

  return (
    <MainLayout>
      <h1
        style={{
          color: "white",
          marginBottom: "20px",
        }}
      >
        Modules
      </h1>

      <input
        type="text"
        placeholder="Search modules..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "10px",
          border: "1px solid #1F2A44",
          background: "#101B31",
          color: "white",
          marginBottom: "20px",
        }}
      />
      <div
  style={{
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  }}
>
  <select
    value={languageFilter}
    onChange={(e) =>
      setLanguageFilter(e.target.value)
    }
  >
    <option value="ALL">All Languages</option>
    <option value="Java">Java</option>
    <option value="C++">C++</option>
  </select>

  <select
    value={riskFilter}
    onChange={(e) =>
      setRiskFilter(e.target.value)
    }
  >
    <option value="ALL">All Risk</option>
    <option value="LOW">Low</option>
    <option value="MEDIUM">Medium</option>
    <option value="HIGH">High</option>
  </select>
</div>

      <div
        style={{
          display: "grid",
          gap: "15px",
        }}
      >
        {filteredModules.map((module) => (
          <div
            key={module.id}
            style={{
              background: "#101B31",
              borderRadius: "12px",
              padding: "20px",
              border: "1px solid #1F2A44",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h3
                  style={{
                    margin: 0,
                    color: "white",
                  }}
                >
                  {module.moduleName}
                </h3>

                <p
                  style={{
                    color: "#94A3B8",
                    marginTop: "6px",
                  }}
                >
                  {module.language}
                </p>
              </div>

              <button
                onClick={() =>
                  navigate(
                    `/modules/${module.id}`
                  )
                }
                style={{
                  background: "#4F46E5",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding:
                    "10px 16px",
                  cursor: "pointer",
                }}
              >
                View Details
              </button>
            </div>

            <div
              style={{
                marginTop: "20px",
              }}
            >
              <CoverageBar
                value={
                  module.lineCoverage
                }
              />
            </div>

            <div
  style={{
    display: "flex",
    gap: "10px",
    marginTop: "15px",
    alignItems: "center",
  }}
>
  <StatusBadge
    status={module.status}
  />

  <RiskBadge
    risk={module.riskLevel}
  />

  <HeatmapBadge
    color={module.heatmapColor}
  />
</div>
            <div
              style={{
                display: "flex",
                gap: "30px",
                marginTop: "15px",
                color: "#CBD5E1",
              }}
            >
              <div>
                Line Coverage:
                {" "}
                {module.lineCoverage}%
              </div>

              <div>
                Branch Coverage:
                {" "}
                {module.branchCoverage}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}