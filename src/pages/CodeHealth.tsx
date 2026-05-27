import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";

import SeverityBadge from "../components/common/SeverityBadge";

import IssueTypeBadge from "../components/common/IssueTypeBadge";

import IssueDetailsModal from "../components/modals/IssueDetailsModal";

import IssueDistributionChart from "../components/charts/IssueDistributionChart";
import SourceCodeModal from "../components/modals/SourceCodeModal";

import { getIssueSourceCode } from "../api/dashboardApi";

import {
  getSonarSummary,
  getSonarIssues,
  getSonarIssueDetails,
} from "../api/dashboardApi";
import SeverityChart from "../components/charts/SeverityChart";

export default function CodeHealth() {
  const [summary, setSummary] = useState<any>(null);

  const [issues, setIssues] = useState<any[]>([]);

  const [search, setSearch] = useState("");

  const [typeFilter, setTypeFilter] = useState("ALL");
  const [issueDetails, setIssueDetails] = useState<any>(null);
  const [sourceData, setSourceData] = useState<any>(null);

  useEffect(() => {
    getSonarSummary()
      .then((res) => setSummary(res.data))
      .catch(console.error);

    getSonarIssues()
      .then((res) => setIssues(res.data))
      .catch(console.error);
  }, []);

  if (!summary) {
    return <MainLayout>Loading...</MainLayout>;
  }

  const filteredIssues = issues.filter((issue) => {
    const searchMatch = issue.file.toLowerCase().includes(search.toLowerCase());

    const typeMatch = typeFilter === "ALL" || issue.type === typeFilter;

    return searchMatch && typeMatch;
  });

  return (
    <MainLayout>
      <h1>Code Health</h1>

      {/* Summary Cards */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "20px",
          marginBottom: "25px",
        }}
      >
        <Card
          title="Bugs"
          value={summary.bugs}
          onClick={() => setTypeFilter("BUG")}
        />

        <Card
          title="Vulnerabilities"
          value={summary.vulnerabilities}
          onClick={() => setTypeFilter("VULNERABILITY")}
        />

        <Card
          title="Code Smells"
          value={summary.codeSmells}
          onClick={() => setTypeFilter("CODE_SMELL")}
        />

        <Card title="Security Hotspots" value={summary.securityHotspots} />
      </div>

      {/* Ratings */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5,1fr)",
          gap: "20px",
          marginBottom: "25px",
        }}
      >
        <Card title="Security" value={summary.securityRating} />

        <Card title="Reliability" value={summary.reliabilityRating} />

        <Card title="Maintainability" value={summary.maintainabilityRating} />

        <Card
          title="Technical Debt"
          value={`${(summary.technicalDebtMinutes / 60).toFixed(1)} hrs`}
        />

        <Card
          title="Risk Level"
          value={summary.securityRating === "D" ? "HIGH" : "LOW"}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginBottom: "25px",
        }}
      >
        <IssueDistributionChart summary={summary} />

        <SeverityChart issues={issues} />
      </div>

      <div
        style={{
          background: "#101B31",
          padding: "25px",
          borderRadius: "12px",
          marginBottom: "25px",
        }}
      >
        <h2>Health Overview</h2>

        <p>
          {summary.vulnerabilities > 0
            ? "Security risks require attention."
            : "No security issues detected."}
        </p>

        <p>Open Bugs: {summary.bugs}</p>

        <p>Code Smells: {summary.codeSmells}</p>

        <p>
          Technical Debt: {(summary.technicalDebtMinutes / 60).toFixed(1)}
          hrs
        </p>
      </div>
      {/* Filters */}

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Search file..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            padding: "10px",
          }}
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="ALL">All</option>

          <option value="BUG">Bugs</option>

          <option value="VULNERABILITY">Vulnerabilities</option>

          <option value="CODE_SMELL">Code Smells</option>
        </select>
      </div>

      {/* Issue Explorer */}

      <div
        style={{
          background: "#101B31",
          borderRadius: "12px",
          padding: "20px",
        }}
      >
        <h2>Issue Explorer</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: "20px",
            marginBottom: "25px",
          }}
        >
          <Card
            title="Critical"
            value={issues.filter((i) => i.severity === "CRITICAL").length}
          />
          <Card
            title="Major"
            value={issues.filter((i) => i.severity === "MAJOR").length}
          />
          <Card
            title="Minor"
            value={issues.filter((i) => i.severity === "MINOR").length}
          />
          <Card
            title="Open Issues"
            value={issues.filter((i) => i.status === "OPEN").length}
          />
        </div>

        <table
          style={{
            width: "100%",
          }}
        >
          <thead>
            <tr>
              <th>Type</th>
              <th>Severity</th>
              <th>File</th>
              <th>Line</th>
              <th>Message</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredIssues.map((issue, index) => (
              <tr key={`${issue.issueKey}-${index}`}>
                <td>
                  <IssueTypeBadge type={issue.type} />
                </td>

                <td>
                  <SeverityBadge severity={issue.severity} />
                </td>

                <td>{issue.file}</td>

                <td>{issue.line}</td>

                <td>{issue.message}</td>

                <td>{issue.status}</td>

                <td>
                  <button
                    onClick={async () => {
                      try {
                        const res = await getSonarIssueDetails(issue.issueKey);

                        setIssueDetails(res.data);
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <IssueDetailsModal
        issue={issueDetails}
        onClose={() => setIssueDetails(null)}
        onViewSource={async (issueKey) => {
          try {
            const res = await getIssueSourceCode(issueKey);

            setSourceData(res.data);
          } catch (err) {
            console.error(err);
          }
        }}
      />
      <SourceCodeModal
        sourceData={sourceData}
        onClose={() => setSourceData(null)}
      />
    </MainLayout>
  );
}

function Card({ title, value, onClick }: any) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "#101B31",
        padding: "20px",
        borderRadius: "12px",
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}
