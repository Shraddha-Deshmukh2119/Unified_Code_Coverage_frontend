import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";

import RuleStatusBadge from "../components/common/RuleStatusBadge";
import QualityScoreTrendChart
from "../components/charts/QualityScoreTrendChart";

import {
  getQualityGate,
  getQualityGateHistory,
} from "../api/dashboardApi";

export default function QualityGate() {
  const [gate, setGate] = useState<any>(null);

  const [history, setHistory] =
    useState<any[]>([]);

  const [search, setSearch] = useState("");

const [statusFilter, setStatusFilter] =
  useState("ALL");

  useEffect(() => {
    getQualityGate()
      .then((res) => {
        setGate(res.data);
      })
      .catch(console.error);

    getQualityGateHistory()
      .then((res) => {
        setHistory(res.data);
      })
      .catch(console.error);
  }, []);

  if (!gate) {
    return (
      <MainLayout>
        Loading...
      </MainLayout>
    );
  }

  
  const filteredHistory = history.filter((item) => {
  const statusMatch =
    statusFilter === "ALL" ||
    item.status === statusFilter;

  const searchMatch =
    String(item.buildNumber)
      .toLowerCase()
      .includes(search.toLowerCase());

  return statusMatch && searchMatch;
});

console.log("Filter:", statusFilter);
console.log("Search:", search);
console.log("Filtered:", filteredHistory);
  return (
    
    <MainLayout>
      <h1>Quality Gate</h1>

      <div
        style={{
          background:
            gate.status === "PASSED"
              ? "#22C55E"
              : "#EF4444",

          color: "white",

          padding: "25px",

          borderRadius: "12px",

          marginBottom: "25px",
        }}
      >
        <h2>{gate.status}</h2>

        <h3>
          Quality Score:
          {" "}
          {gate.score}%
        </h3>

        <p>
          Passed Rules:
          {" "}
          {gate.passedRules}
        </p>

        <p>
          Failed Rules:
          {" "}
          {gate.failedRules}
        </p>
      </div>

      <div
        style={{
          background: "#101B31",

          borderRadius: "12px",

          padding: "20px",

          marginBottom: "25px",
        }}
      >
        <h2>Rule Evaluation</h2>

        <table
          style={{
            width: "100%",
          }}
        >
          <thead>
            <tr>
              <th>Rule</th>
              <th>Expected</th>
              <th>Actual</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {gate.rules.map(
              (
                rule: any,
                index: number
              ) => (
                <tr key={index}>
                  <td>{rule.name}</td>

                  <td>
                    {rule.expected}
                  </td>

                  <td>
                    {rule.actual}
                  </td>

                  <td>
                    <RuleStatusBadge
                      status={
                        rule.status
                      }
                    />
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      <div
        style={{
          background: "#101B31",

          borderRadius: "12px",

          padding: "20px",
        }}
      >
        <QualityScoreTrendChart data={history} />
        <h2>
          Quality Gate History
        </h2>

        <div
  style={{
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  }}
>
  <input
    type="text"
    placeholder="Search Build Number"
    value={search}
    onChange={(e) =>
      setSearch(e.target.value)
    }
    style={{
      padding: "10px",
      borderRadius: "8px",
      flex: 1,
    }}
  />

  <select
    value={statusFilter}
    onChange={(e) =>
      setStatusFilter(e.target.value)
    }
  >
    <option value="ALL">
      All
    </option>

    <option value="PASSED">
      Passed
    </option>

    <option value="FAILED">
      Failed
    </option>
  </select>
</div>

        {filteredHistory.map((item, index) => (
  <div
    key={`${item.buildNumber}-${index}`}
            style={{
              borderBottom:
                "1px solid #1F2A44",

              padding:
                "15px 0",
            }}
          >
            <h3>
              Build #
              {item.buildNumber}
            </h3>

            <p>
              Status:
              {" "}
              {item.status}
            </p>

            <p>
              Score:
              {" "}
              {item.score}%
            </p>

            <p>
              Coverage:
              {" "}
              {item.coverage}%
            </p>

            <p>
              Bugs:
              {" "}
              {item.bugs}
            </p>

            <p>
              Vulnerabilities:
              {" "}
              {item.vulnerabilities}
            </p>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}