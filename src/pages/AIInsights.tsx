import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { getAIMetrics, getAIInsights } from "../api/dashboardApi";
import {
  Brain,
  AlertTriangle,
  Target,
  TrendingUp,
  FileWarning,
  Gauge,
  Lightbulb,
  ChevronRight,
  Activity,
  Zap,
  BarChart3,
  Shield,
  Bug,
} from "lucide-react";

interface AIMetrics {
  riskIndex: number;
  highRiskFiles: number;
  coverageGaps: number;
  currentCoverage: number;
  targetCoverage: number;
  potentialGain: number;
}

interface AIInsightsData {
  executiveSummary: string;
  coverageRiskInsight: string;
  codeQualityInsight: string;
  securityInsight: string;
  recommendations: string[];
}

export default function AIInsights() {
  const [metrics, setMetrics] = useState<AIMetrics | null>(null);
  const [insights, setInsights] = useState<AIInsightsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAIMetrics(), getAIInsights()])
      .then(([metricsRes, insightsRes]) => {
        setMetrics(metricsRes.data);
        setInsights(insightsRes.data);
      })
      .catch((err) => console.error("Failed to load AI data", err))
      .finally(() => setLoading(false));
  }, []);

  const getRiskColor = (risk: number) => {
    if (risk <= 3) return "var(--google-green-600)";
    if (risk <= 6) return "var(--google-yellow-600)";
    return "var(--google-red-600)";
  };

  const getRiskLabel = (risk: number) => {
    if (risk <= 3) return "Low Risk";
    if (risk <= 6) return "Moderate Risk";
    if (risk <= 8) return "High Risk";
    return "Critical Risk";
  };

  const getRiskBg = (risk: number) => {
    if (risk <= 3) return "var(--google-green-50)";
    if (risk <= 6) return "var(--google-yellow-50)";
    return "var(--google-red-50)";
  };

  if (loading) {
    return (
      <MainLayout>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            gap: "12px",
            color: "var(--text-secondary)",
          }}
        >
          <div className="loading-spinner" />
          <span style={{ fontSize: "14px" }}>Loading AI Intelligence...</span>
        </div>
      </MainLayout>
    );
  }

  const riskIndex = metrics?.riskIndex ?? 0;
  const highRiskFiles = metrics?.highRiskFiles ?? 0;
  const coverageGaps = metrics?.coverageGaps ?? 0;
  const currentCoverage = metrics?.currentCoverage ?? 0;
  const targetCoverage = metrics?.targetCoverage ?? 80;
  const potentialGain = metrics?.potentialGain ?? 0;

  return (
    <MainLayout>
      <div className="page-subtitle">Coverage Intelligence Center</div>
      <h1 className="page-title">AI Coverage Insights</h1>
      <p
        style={{
          color: "var(--text-secondary)",
          marginBottom: "28px",
          marginTop: "-16px",
          fontSize: "14px",
        }}
      >
        AI-powered recommendations, predictive risk analysis, and coverage
        optimizations.
      </p>

      {/* Executive Summary Banner */}
      {insights?.executiveSummary && (
        <div
          className="g-card"
          style={{
            marginBottom: "24px",
            borderLeft: "5px solid var(--bmc-orange)",
            display: "flex",
            alignItems: "flex-start",
            gap: "16px",
            padding: "20px 24px",
          }}
        >
          <Brain
            size={24}
            style={{
              color: "var(--bmc-orange)",
              flexShrink: 0,
              marginTop: "2px",
            }}
          />
          <div>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "var(--bmc-orange)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Executive Summary
            </span>
            <p
              style={{
                fontSize: "14px",
                lineHeight: 1.65,
                color: "var(--text-primary)",
                marginTop: "6px",
              }}
            >
              {insights.executiveSummary}
            </p>
          </div>
        </div>
      )}

      {/* KPI Metric Cards */}
      <div className="grid-cols-4" style={{ marginBottom: "24px" }}>
        {/* Risk Index */}
        <div
          className="g-card"
          style={{ padding: "20px", position: "relative", overflow: "hidden" }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: getRiskColor(riskIndex),
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "12px",
            }}
          >
            <Gauge size={16} style={{ color: "var(--text-secondary)" }} />
            <span
              style={{
                fontSize: "12px",
                color: "var(--text-secondary)",
                fontWeight: 600,
              }}
            >
              AI Risk Index
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
            <span
              style={{
                fontSize: "32px",
                fontWeight: 700,
                color: getRiskColor(riskIndex),
                fontFamily: "var(--font-display)",
              }}
            >
              {riskIndex}
            </span>
            <span
              style={{
                fontSize: "16px",
                color: "var(--text-secondary)",
                fontWeight: 500,
              }}
            >
              / 10
            </span>
          </div>
          <span
            style={{
              display: "inline-block",
              marginTop: "8px",
              fontSize: "11px",
              fontWeight: 600,
              padding: "3px 10px",
              borderRadius: "12px",
              background: getRiskBg(riskIndex),
              color: getRiskColor(riskIndex),
            }}
          >
            {getRiskLabel(riskIndex)}
          </span>
        </div>

        {/* High Risk Files */}
        <div
          className="g-card"
          style={{ padding: "20px", position: "relative", overflow: "hidden" }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: "var(--google-red-600)",
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "12px",
            }}
          >
            <FileWarning size={16} style={{ color: "var(--text-secondary)" }} />
            <span
              style={{
                fontSize: "12px",
                color: "var(--text-secondary)",
                fontWeight: 600,
              }}
            >
              High Risk Files
            </span>
          </div>
          <span
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "var(--google-red-600)",
              fontFamily: "var(--font-display)",
            }}
          >
            {highRiskFiles}
          </span>
          <p
            style={{
              fontSize: "12px",
              color: "var(--text-secondary)",
              marginTop: "6px",
            }}
          >
            Low coverage + high complexity
          </p>
        </div>

        {/* Coverage Gaps */}
        <div
          className="g-card"
          style={{ padding: "20px", position: "relative", overflow: "hidden" }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: "var(--google-yellow-600)",
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "12px",
            }}
          >
            <AlertTriangle
              size={16}
              style={{ color: "var(--text-secondary)" }}
            />
            <span
              style={{
                fontSize: "12px",
                color: "var(--text-secondary)",
                fontWeight: 600,
              }}
            >
              Coverage Gaps
            </span>
          </div>
          <span
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "var(--google-yellow-700)",
              fontFamily: "var(--font-display)",
            }}
          >
            {coverageGaps}
          </span>
          <p
            style={{
              fontSize: "12px",
              color: "var(--text-secondary)",
              marginTop: "6px",
            }}
          >
            Untested logical branches
          </p>
        </div>

        {/* Potential Gain */}
        <div
          className="g-card"
          style={{ padding: "20px", position: "relative", overflow: "hidden" }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: "var(--google-green-600)",
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "12px",
            }}
          >
            <TrendingUp size={16} style={{ color: "var(--text-secondary)" }} />
            <span
              style={{
                fontSize: "12px",
                color: "var(--text-secondary)",
                fontWeight: 600,
              }}
            >
              Potential Gain
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
            <span
              style={{
                fontSize: "32px",
                fontWeight: 700,
                color: "var(--google-green-600)",
                fontFamily: "var(--font-display)",
              }}
            >
              +{potentialGain}
            </span>
            <span
              style={{
                fontSize: "16px",
                color: "var(--google-green-600)",
                fontWeight: 500,
              }}
            >
              %
            </span>
          </div>
          <p
            style={{
              fontSize: "12px",
              color: "var(--text-secondary)",
              marginTop: "6px",
            }}
          >
            If recommendations are followed
          </p>
        </div>
      </div>

      {/* Coverage Prediction Bar */}
      <div
        className="g-card"
        style={{
          marginBottom: "24px",
          padding: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Target
              size={20}
              style={{ color: "var(--bmc-orange)" }}
            />
            <span
              style={{
                fontSize: "14px",
                fontWeight: 700,
                color: "var(--text-primary)",
              }}
            >
              Coverage Gap Analysis
            </span>
          </div>
          <div style={{ display: "flex", gap: "28px" }}>
            <div style={{ textAlign: "center" }}>
              <span
                style={{
                  fontSize: "11px",
                  color: "var(--text-secondary)",
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                Current
              </span>
              <p
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "var(--google-red-600)",
                  fontFamily: "var(--font-display)",
                }}
              >
                {currentCoverage}%
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              <span
                style={{
                  fontSize: "11px",
                  color: "var(--text-secondary)",
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                Target
              </span>
              <p
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "var(--google-green-600)",
                  fontFamily: "var(--font-display)",
                }}
              >
                {targetCoverage}%
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              <span
                style={{
                  fontSize: "11px",
                  color: "var(--text-secondary)",
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                Achievable
              </span>
              <p
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "var(--bmc-orange)",
                  fontFamily: "var(--font-display)",
                }}
              >
                {(currentCoverage + potentialGain).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            width: "100%",
            height: "28px",
            background: "var(--grey-100)",
            borderRadius: "14px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Current coverage fill */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              width: `${currentCoverage}%`,
              background:
                "linear-gradient(90deg, var(--google-red-600), var(--google-yellow-600))",
              borderRadius: "14px 0 0 14px",
              transition: "width 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
          {/* Potential gain fill */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: `${currentCoverage}%`,
              height: "100%",
              width: `${potentialGain}%`,
              background:
                "repeating-linear-gradient(45deg, var(--bmc-orange) 0px, var(--bmc-orange) 4px, transparent 4px, transparent 8px)",
              opacity: 0.35,
              transition: "width 1.5s cubic-bezier(0.4, 0, 0.2, 1) 0.3s",
            }}
          />
          {/* Target marker */}
          <div
            style={{
              position: "absolute",
              top: "-4px",
              left: `${targetCoverage}%`,
              transform: "translateX(-50%)",
              height: "calc(100% + 8px)",
              width: "3px",
              background: "var(--google-green-600)",
              borderRadius: "2px",
            }}
          />
          {/* Labels on bar */}
          <span
            style={{
              position: "absolute",
              top: "50%",
              left: `${currentCoverage / 2}%`,
              transform: "translate(-50%, -50%)",
              fontSize: "11px",
              fontWeight: 700,
              color: "#fff",
              textShadow: "0 1px 2px rgba(0,0,0,0.3)",
            }}
          >
            {currentCoverage}%
          </span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "8px",
            fontSize: "11px",
            color: "var(--text-secondary)",
          }}
        >
          <span>0%</span>
          <span
            style={{
              color: "var(--google-green-600)",
              fontWeight: 600,
            }}
          >
            Target: {targetCoverage}%
          </span>
          <span>100%</span>
        </div>
      </div>

      {/* Smart Insights Cards */}
      <h2 style={{ fontSize: "16px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
        <Activity size={18} style={{ color: "var(--bmc-orange)" }} />
        Smart Insights
      </h2>
      <div
        className="grid-cols-3"
        style={{ marginBottom: "24px", gap: "20px" }}
      >
        {/* Coverage Risk */}
        <div
          className="g-card"
          style={{
            borderLeft: "4px solid var(--google-yellow-600)",
            padding: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "10px",
            }}
          >
            <BarChart3 size={18} style={{ color: "var(--google-yellow-600)" }} />
            <h3 style={{ fontSize: "14px", fontWeight: 600 }}>
              Coverage Risk
            </h3>
          </div>
          <p
            style={{
              fontSize: "13px",
              lineHeight: 1.6,
              color: "var(--text-secondary)",
            }}
          >
            {insights?.coverageRiskInsight ??
              "No coverage risk data available."}
          </p>
        </div>

        {/* Code Quality */}
        <div
          className="g-card"
          style={{
            borderLeft: "4px solid var(--google-blue-600)",
            padding: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "10px",
            }}
          >
            <Bug size={18} style={{ color: "var(--google-blue-600)" }} />
            <h3 style={{ fontSize: "14px", fontWeight: 600 }}>
              Code Quality Alert
            </h3>
          </div>
          <p
            style={{
              fontSize: "13px",
              lineHeight: 1.6,
              color: "var(--text-secondary)",
            }}
          >
            {insights?.codeQualityInsight ??
              "No code quality data available."}
          </p>
        </div>

        {/* Security */}
        <div
          className="g-card"
          style={{
            borderLeft: "4px solid var(--google-red-600)",
            padding: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "10px",
            }}
          >
            <Shield size={18} style={{ color: "var(--google-red-600)" }} />
            <h3 style={{ fontSize: "14px", fontWeight: 600 }}>
              Security Concern
            </h3>
          </div>
          <p
            style={{
              fontSize: "13px",
              lineHeight: 1.6,
              color: "var(--text-secondary)",
            }}
          >
            {insights?.securityInsight ??
              "No security insight data available."}
          </p>
        </div>
      </div>

      {/* Recommendations */}
      <div className="g-card" style={{ marginBottom: "24px", padding: "24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          <Lightbulb size={20} style={{ color: "var(--bmc-orange)" }} />
          <h2 style={{ fontSize: "16px", fontWeight: 600 }}>
            AI Recommendations
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {(insights?.recommendations ?? []).map((rec, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "14px",
                padding: "14px 16px",
                background: "var(--grey-50)",
                borderRadius: "10px",
                border: "1px solid var(--border-color)",
                transition: "all 0.2s ease",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "var(--bmc-orange)";
                (e.currentTarget as HTMLElement).style.background =
                  "var(--bmc-orange-light)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "var(--border-color)";
                (e.currentTarget as HTMLElement).style.background =
                  "var(--grey-50)";
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, var(--bmc-orange), var(--bmc-orange-hover))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  color: "#fff",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                {index + 1}
              </div>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: "13.5px",
                    lineHeight: 1.55,
                    color: "var(--text-primary)",
                    fontWeight: 500,
                  }}
                >
                  {rec}
                </p>
              </div>
              <ChevronRight
                size={16}
                style={{
                  color: "var(--text-secondary)",
                  flexShrink: 0,
                  marginTop: "3px",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Coming Soon Callout */}
      <div
        className="g-card"
        style={{
          background: "var(--bmc-orange-light)",
          border: "1px dashed var(--bmc-orange)",
          textAlign: "center",
          padding: "32px 24px",
        }}
      >
        <Zap
          size={28}
          style={{
            color: "var(--bmc-orange)",
            margin: "0 auto 12px",
            display: "block",
          }}
        />
        <h2
          style={{
            color: "var(--bmc-orange-hover)",
            fontSize: "18px",
            fontWeight: 600,
            marginBottom: "8px",
          }}
        >
          AI Reasoning Engine Under Development
        </h2>

        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "13.5px",
            maxWidth: "600px",
            margin: "0 auto 16px",
          }}
        >
          Upcoming features integrate large language models directly into the
          pipeline to auto-generate pull request test suites.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "16px 32px",
            flexWrap: "wrap",
            fontSize: "12.5px",
            fontWeight: 600,
            color: "var(--bmc-orange)",
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