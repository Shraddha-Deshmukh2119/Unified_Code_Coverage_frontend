import MainLayout from "../layouts/MainLayout";
import MetricCard from "../components/cards/MetricCard";

export default function AIInsights() {
  const recommendations = [
    {
      file: "AuthService.java",
      priority: "HIGH",
      test: "Boundary Condition Tests",
    },
    {
      file: "PaymentService.java",
      priority: "HIGH",
      test: "Exception Handling Tests",
    },
    {
      file: "OrderController.java",
      priority: "MEDIUM",
      test: "Integration Tests",
    },
    {
      file: "ProductService.java",
      priority: "LOW",
      test: "Negative Scenario Tests",
    },
  ];

  return (
    <MainLayout>
      <div className="page-subtitle">Coverage Intelligence Center</div>
      <h1 className="page-title">AI Coverage Insights</h1>
      <p
        style={{
          color: "var(--text-secondary)",
          marginBottom: "24px",
          marginTop: "-16px",
          fontSize: "14px"
        }}
      >
        AI-powered recommendations, predictive risk analysis, and coverage optimizations.
      </p>

      {/* KPI Cards Grid */}
      <div className="grid-cols-4" style={{ marginBottom: "24px" }}>
        <MetricCard
          title="AI Risk Index"
          value="7.2 / 10"
          subtitle="Overall repo risk rating"
          trend="ATTENTION"
          trendType="down"
        />

        <MetricCard
          title="High Risk Files"
          value="12"
          subtitle="Low coverage + high complexity"
          trend="+2 files"
          trendType="down"
        />

        <MetricCard
          title="Coverage Gaps"
          value="48"
          subtitle="Untested logical branches"
        />

        <MetricCard
          title="Recommendations"
          value="15"
          subtitle="Actionable test improvements"
          trend="15 pending"
          trendType="up"
        />
      </div>

      {/* Smart Insights Cards */}
      <h2 style={{ fontSize: "16px", marginBottom: "16px" }}>Smart Insights</h2>
      <div className="grid-cols-3" style={{ marginBottom: "24px", gap: "20px" }}>
        <div className="g-card" style={{ borderLeft: "4px solid var(--google-yellow-600)" }}>
          <h3 style={{ fontSize: "15px", marginBottom: "8px" }}>Coverage Risk</h3>
          <p style={{ fontSize: "13px", lineHeight: 1.5 }}>
            Branch coverage is critically lower than line coverage in security modules. Add tests for conditional paths and exception handling.
          </p>
        </div>

        <div className="g-card" style={{ borderLeft: "4px solid var(--google-blue-600)" }}>
          <h3 style={{ fontSize: "15px", marginBottom: "8px" }}>Code Quality Alert</h3>
          <p style={{ fontSize: "13px", lineHeight: 1.5 }}>
            282 code smells detected. Prioritize structural refactoring in frequently modified controller and auth classes.
          </p>
        </div>

        <div className="g-card" style={{ borderLeft: "4px solid var(--google-red-600)" }}>
          <h3 style={{ fontSize: "15px", marginBottom: "8px" }}>Security Concern</h3>
          <p style={{ fontSize: "13px", lineHeight: 1.5 }}>
            Overall security rating is currently below target. Review database queries for potential SQL injection vulnerabilities.
          </p>
        </div>
      </div>

      {/* Coverage Prediction Section */}
      <div
        className="g-card"
        style={{
          borderLeft: "6px solid var(--google-green-600)",
          marginBottom: "24px"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase" }}>
              Coverage Prediction
            </span>
            <h3 style={{ color: "var(--google-green-700)", fontSize: "20px", marginTop: "4px", fontWeight: 600 }}>
              Potential Gain: +7.9%
            </h3>
          </div>
          <div style={{ display: "flex", gap: "24px", textAlign: "right" }}>
            <div>
              <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Current Coverage</span>
              <p style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)" }}>34.6%</p>
            </div>
            <div>
              <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Target Coverage</span>
              <p style={{ fontSize: "16px", fontWeight: 600, color: "var(--google-green-700)" }}>42.5%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Table */}
      <div className="g-card" style={{ marginBottom: "24px" }}>
        <h2 style={{ fontSize: "16px", marginBottom: "12px" }}>Test Recommendations</h2>

        <div className="g-table-container" style={{ marginTop: 0 }}>
          <table className="g-table">
            <thead>
              <tr>
                <th>File Name</th>
                <th>Priority</th>
                <th>Suggested Test Types</th>
              </tr>
            </thead>

            <tbody>
              {recommendations.map((item, index) => {
                const badgeClass = 
                  item.priority === "HIGH" 
                    ? "g-badge-red" 
                    : item.priority === "MEDIUM" 
                    ? "g-badge-yellow" 
                    : "g-badge-grey";

                return (
                  <tr key={index}>
                    <td style={{ fontWeight: 500 }}>{item.file}</td>
                    <td>
                      <span className={`g-badge ${badgeClass}`}>
                        {item.priority}
                      </span>
                    </td>
                    <td>{item.test}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Coming Soon Callout */}
      <div
        className="g-card"
        style={{
          background: "var(--google-blue-50)",
          border: "1px dashed var(--google-blue-600)",
          textAlign: "center",
          padding: "32px 24px"
        }}
      >
        <h2 style={{ color: "var(--google-blue-700)", fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>
          AI Reasoning Engine Under Development
        </h2>

        <p style={{ color: "var(--google-blue-700)", fontSize: "13.5px", maxWidth: "600px", margin: "0 auto 16px" }}>
          Upcoming features integrate large language models directly into the pipeline to auto-generate pull request test suites.
        </p>

        <div 
          style={{ 
            display: "flex", 
            justifyContent: "center", 
            gap: "16px 32px", 
            flexWrap: "wrap",
            fontSize: "12.5px",
            fontWeight: 600,
            color: "var(--google-blue-600)"
          }}
        >
          <span>✦ LLM Test Generation</span>
          <span>✦ Auto-Pruning Engine</span>
          <span>✦ Predictive Path Analytics</span>
          <span>✦ Automated Vulnerability Fixes</span>
        </div>
      </div>
    </MainLayout>
  );
}