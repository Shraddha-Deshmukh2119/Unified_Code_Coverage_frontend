import MainLayout from "../layouts/MainLayout";

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
      <h1
        style={{
          marginBottom: "10px",
        }}
      >
        Coverage Intelligence Center
      </h1>

      <p
        style={{
          color: "#94A3B8",
          marginBottom: "30px",
        }}
      >
        AI-powered recommendations,
        risk detection and coverage
        intelligence.
      </p>

      {/* KPI Cards */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(4,1fr)",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <Card
          title="AI Risk Score"
          value="7.2 / 10"
          color="#F97316"
        />

        <Card
          title="High Risk Files"
          value="12"
          color="#EF4444"
        />

        <Card
          title="Coverage Gaps"
          value="48"
          color="#EAB308"
        />

        <Card
          title="Recommendations"
          value="15"
          color="#22C55E"
        />
      </div>

      {/* Smart Insights */}

      <h2>Smart Insights</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(3,1fr)",
          gap: "20px",
          marginTop: "15px",
          marginBottom: "30px",
        }}
      >
        <InsightCard
          title="Coverage Risk"
          description="
Branch coverage is lower than line coverage. Add tests for conditional paths and exception handling."
        />

        <InsightCard
          title="Code Quality Alert"
          description="
282 code smells detected. Prioritize cleanup in frequently modified modules."
        />

        <InsightCard
          title="Security Concern"
          description="
Security rating is below target. Review authentication and validation flows."
        />
      </div>

      {/* Coverage Prediction */}

      <div
        style={{
          background: "#101B31",
          padding: "25px",
          borderRadius: "12px",
          marginBottom: "30px",
        }}
      >
        <h2>Coverage Prediction</h2>

        <h3
          style={{
            color: "#22C55E",
          }}
        >
          Potential Gain: +7.9%
        </h3>

        <p>
          Current Coverage: 34.6%
        </p>

        <p>
          Estimated Coverage After
          Recommendations: 42.5%
        </p>
      </div>

      {/* Recommendations */}

      <div
        style={{
          background: "#101B31",
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "30px",
        }}
      >
        <h2>
          Test Recommendations
        </h2>

        <table
          style={{
            width: "100%",
          }}
        >
          <thead>
            <tr>
              <th>File</th>
              <th>Priority</th>
              <th>Suggested Tests</th>
            </tr>
          </thead>

          <tbody>
            {recommendations.map(
              (item, index) => (
                <tr key={index}>
                  <td>{item.file}</td>

                  <td>
                    {item.priority}
                  </td>

                  <td>{item.test}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Coming Soon */}

      <div
        style={{
          background: "#172554",
          padding: "30px",
          borderRadius: "12px",
          textAlign: "center",
        }}
      >
        <h2>
          AI Engine Under Development
        </h2>

        <p>
          Upcoming Features:
        </p>

        <ul
          style={{
            listStyle: "none",
          }}
        >
          <li>
            LLM Test Generation
          </li>

          <li>
            Risk Scoring Engine
          </li>

          <li>
            Predictive Coverage
          </li>

          <li>
            Smart Refactoring
            Suggestions
          </li>
        </ul>
      </div>
    </MainLayout>
  );
}

function Card({
  title,
  value,
  color,
}: any) {
  return (
    <div
      style={{
        background: "#101B31",
        padding: "20px",
        borderRadius: "12px",
      }}
    >
      <h4
        style={{
          color,
        }}
      >
        {title}
      </h4>

      <h2>{value}</h2>
    </div>
  );
}

function InsightCard({
  title,
  description,
}: any) {
  return (
    <div
      style={{
        background: "#101B31",
        padding: "20px",
        borderRadius: "12px",
      }}
    >
      <h3>{title}</h3>

      <p
        style={{
          color: "#94A3B8",
        }}
      >
        {description}
      </p>
    </div>
  );
}