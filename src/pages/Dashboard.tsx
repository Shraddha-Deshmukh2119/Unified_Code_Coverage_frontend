import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import MetricCard from "../components/cards/MetricCard";
import CoverageTrendChart from "../components/charts/CoverageTrendChart";
import LanguageDistributionChart from "../components/charts/LanguageDistributionChart";

import {
  getSummary,
  getCoverageTrend,
  getLanguageDistribution,
  getLatestBuild,
  getSonarSummary,
} from "../api/dashboardApi";

export default function Dashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [trend, setTrend] = useState<any[]>([]);
  const [languages, setLanguages] = useState<any>(null);
  const [latestBuild, setLatestBuild] = useState<any>(null);
  const [sonar, setSonar] = useState<any>(null);

  useEffect(() => {
    getSummary().then((res) => setSummary(res.data));

    getCoverageTrend().then((res) => {
      const cleaned = res.data.filter(
        (item: any) => item.buildNumber !== null
      );

      setTrend(cleaned);
    });

    getLanguageDistribution().then((res) =>
      setLanguages(res.data)
    );

    getLatestBuild().then((res) =>
      setLatestBuild(res.data)
    );

    getSonarSummary().then((res) =>
      setSonar(res.data)
    );
  }, []);

  return (
    <MainLayout>
      <h1>Dashboard</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <MetricCard
          title="Overall Coverage"
          value={`${summary?.overallCoverage ?? "-"}%`}
        />

        <MetricCard
          title="Java Coverage"
          value={`${summary?.javaCoverage ?? "-"}%`}
        />

        <MetricCard
          title="C++ Coverage"
          value={`${summary?.cppCoverage ?? "-"}%`}
        />

        <MetricCard
          title="Build Status"
          value={latestBuild?.status ?? "-"}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        <CoverageTrendChart data={trend} />

        {languages && (
          <LanguageDistributionChart
            javaCoverage={languages.javaCoverage}
            cppCoverage={languages.cppCoverage}
          />
        )}
      </div>

      

      {sonar && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5,1fr)",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          <MetricCard
            title="Bugs"
            value={sonar.bugs}
          />

          <MetricCard
            title="Vulnerabilities"
            value={sonar.vulnerabilities}
          />

          <MetricCard
            title="Code Smells"
            value={sonar.codeSmells}
          />

          <MetricCard
            title="Security Rating"
            value={sonar.securityRating}
          />

          <MetricCard
            title="Maintainability"
            value={sonar.maintainabilityRating}
          />
        </div>
      )}
    </MainLayout>
  );
}