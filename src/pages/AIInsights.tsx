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
  Sparkles,
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

  const getRiskBg = (risk: number) => {
    if (risk <= 3) return "var(--google-green-50)";
    if (risk <= 6) return "var(--google-yellow-50)";
    return "var(--google-red-50)";
  };

  const getRiskLabel = (risk: number) => {
    if (risk <= 3) return "Low Risk";
    if (risk <= 6) return "Moderate Risk";
    if (risk <= 8) return "High Risk";
    return "Critical Risk";
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
            marginBottom: "28px",
            background: "linear-gradient(135deg, var(--grey-900), #1e293b)",
            border: "1px solid var(--border-color)",
            borderLeft: "6px solid var(--bmc-orange)",
            color: "#fff",
            padding: "24px 32px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "var(--shadow-md)",
          }}
        >
          {/* subtle background pattern */}
          <div
            style={{
              position: "absolute",
              right: "-5%",
              top: "-20%",
              opacity: 0.05,
              transform: "scale(1.5)",
            }}
          >
            <Sparkles size={200} />
          </div>
          
          <div style={{ display: "flex", alignItems: "flex-start", gap: "20px", position: "relative", zIndex: 1 }}>
            <div style={{
              background: "rgba(255,107,0,0.15)",
              padding: "12px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}>
              <Brain size={28} style={{ color: "var(--bmc-orange)" }} />
            </div>
            <div>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "var(--bmc-orange)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  display: "block",
                  marginBottom: "8px"
                }}
              >
                Executive Summary
              </span>
              <p
                style={{
                  fontSize: "15px",
                  lineHeight: 1.6,
                  color: "var(--grey-100)",
                  margin: 0,
                  fontWeight: 400
                }}
              >
                {insights.executiveSummary}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* KPI Metric Cards using build-detail-metric-card style from CSS */}
      <div className="grid-cols-4" style={{ marginBottom: "28px" }}>
        {/* Risk Index */}
        <div
          className="g-card build-detail-metric-card"
          style={{
            padding: "24px",
            borderTop: `4px solid ${getRiskColor(riskIndex)}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <div className="metric-icon-box" style={{ background: getRiskBg(riskIndex) }}>
              <Gauge size={18} style={{ color: getRiskColor(riskIndex) }} />
            </div>
            <span className="metric-card-label" style={{ fontSize: "12px" }}>AI Risk Index</span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "8px" }}>
            <span style={{ fontSize: "42px", fontWeight: 800, color: getRiskColor(riskIndex), fontFamily: "var(--font-display)", lineHeight: 1 }}>
              {riskIndex}
            </span>
            <span style={{ fontSize: "16px", color: "var(--text-secondary)", fontWeight: 600 }}>/ 10</span>
          </div>
          <span style={{ display: "inline-block", fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "12px", background: getRiskBg(riskIndex), color: getRiskColor(riskIndex), letterSpacing: "0.03em" }}>
            {getRiskLabel(riskIndex)}
          </span>
        </div>

        {/* High Risk Files */}
        <div
          className="g-card build-detail-metric-card"
          style={{
            padding: "24px",
            borderTop: "4px solid var(--google-red-600)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <div className="metric-icon-box" style={{ background: "var(--google-red-50)" }}>
              <FileWarning size={18} style={{ color: "var(--google-red-600)" }} />
            </div>
            <span className="metric-card-label" style={{ fontSize: "12px" }}>High Risk Files</span>
          </div>
          <div style={{ fontSize: "42px", fontWeight: 800, color: "var(--google-red-600)", fontFamily: "var(--font-display)", lineHeight: 1, marginBottom: "8px" }}>
            {highRiskFiles}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
            Low coverage + high complexity
          </div>
        </div>

        {/* Coverage Gaps */}
        <div
          className="g-card build-detail-metric-card"
          style={{
            padding: "24px",
            borderTop: "4px solid var(--google-yellow-600)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <div className="metric-icon-box" style={{ background: "var(--google-yellow-50)" }}>
              <AlertTriangle size={18} style={{ color: "var(--google-yellow-600)" }} />
            </div>
            <span className="metric-card-label" style={{ fontSize: "12px" }}>Coverage Gaps</span>
          </div>
          <div style={{ fontSize: "42px", fontWeight: 800, color: "var(--google-yellow-600)", fontFamily: "var(--font-display)", lineHeight: 1, marginBottom: "8px" }}>
            {coverageGaps}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
            Untested logical branches
          </div>
        </div>

        {/* Potential Gain */}
        <div
          className="g-card build-detail-metric-card"
          style={{
            padding: "24px",
            borderTop: "4px solid var(--google-green-600)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <div className="metric-icon-box" style={{ background: "var(--google-green-50)" }}>
              <TrendingUp size={18} style={{ color: "var(--google-green-600)" }} />
            </div>
            <span className="metric-card-label" style={{ fontSize: "12px" }}>Potential Gain</span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "8px" }}>
            <span style={{ fontSize: "42px", fontWeight: 800, color: "var(--google-green-600)", fontFamily: "var(--font-display)", lineHeight: 1 }}>
              +{potentialGain}
            </span>
            <span style={{ fontSize: "18px", color: "var(--google-green-600)", fontWeight: 600 }}>%</span>
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
            If recommendations are followed
          </div>
        </div>
      </div>

      {/* Coverage Prediction Bar */}
      <div
        className="g-card"
        style={{
          marginBottom: "28px",
          padding: "28px 32px",
          borderTop: "4px solid var(--bmc-orange)"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ background: "var(--bmc-orange-light)", padding: "8px", borderRadius: "8px" }}>
              <Target size={22} style={{ color: "var(--bmc-orange)" }} />
            </div>
            <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
              Coverage Gap Analysis
            </span>
          </div>
          <div style={{ display: "flex", gap: "36px" }}>
            <div style={{ textAlign: "center" }}>
              <span style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Current
              </span>
              <p style={{ fontSize: "24px", fontWeight: 800, color: "var(--google-red-600)", fontFamily: "var(--font-display)", margin: "4px 0 0 0" }}>
                {currentCoverage}%
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              <span style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Target
              </span>
              <p style={{ fontSize: "24px", fontWeight: 800, color: "var(--google-green-600)", fontFamily: "var(--font-display)", margin: "4px 0 0 0" }}>
                {targetCoverage}%
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              <span style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Achievable
              </span>
              <p style={{ fontSize: "24px", fontWeight: 800, color: "var(--bmc-orange)", fontFamily: "var(--font-display)", margin: "4px 0 0 0" }}>
                {(currentCoverage + potentialGain).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            width: "100%",
            height: "36px",
            background: "var(--grey-100)",
            borderRadius: "18px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)"
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
              background: "linear-gradient(90deg, var(--google-red-600), var(--google-yellow-600))",
              borderRadius: "18px 0 0 18px",
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
              background: "repeating-linear-gradient(45deg, var(--bmc-orange) 0px, var(--bmc-orange) 6px, rgba(255,107,0,0.6) 6px, rgba(255,107,0,0.6) 12px)",
              opacity: 0.6,
              transition: "width 1.5s cubic-bezier(0.4, 0, 0.2, 1) 0.3s",
            }}
          />
          {/* Target marker */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: `${targetCoverage}%`,
              transform: "translateX(-50%)",
              height: "100%",
              width: "4px",
              background: "var(--google-green-700)",
              zIndex: 10
            }}
          />
          {/* Labels on bar */}
          <span
            style={{
              position: "absolute",
              top: "50%",
              left: `${currentCoverage / 2}%`,
              transform: "translate(-50%, -50%)",
              fontSize: "13px",
              fontWeight: 700,
              color: "#fff",
              textShadow: "0 1px 3px rgba(0,0,0,0.4)",
            }}
          >
            {currentCoverage}%
          </span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "10px",
            fontSize: "12px",
            fontWeight: 600,
            color: "var(--text-secondary)",
          }}
        >
          <span>0%</span>
          <span style={{ color: "var(--google-green-700)" }}>Target: {targetCoverage}%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Smart Insights Cards */}
      <h2 style={{ fontSize: "18px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px", fontWeight: 700 }}>
        <Activity size={22} style={{ color: "var(--bmc-orange)" }} />
        Smart Insights
      </h2>
      <div
        className="grid-cols-3"
        style={{ marginBottom: "28px", gap: "24px" }}
      >
        {/* Coverage Risk */}
        <div
          className="g-card build-detail-metric-card"
          style={{
            borderTop: "4px solid var(--google-yellow-600)",
            padding: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div className="metric-icon-box" style={{ background: "var(--google-yellow-50)" }}>
              <BarChart3 size={20} style={{ color: "var(--google-yellow-600)" }} />
            </div>
            <h3 style={{ fontSize: "15px", fontWeight: 700, margin: 0 }}>
              Coverage Risk
            </h3>
          </div>
          <p style={{ fontSize: "13.5px", lineHeight: 1.6, color: "var(--text-secondary)", margin: 0 }}>
            {insights?.coverageRiskInsight ?? "No coverage risk data available."}
          </p>
        </div>

        {/* Code Quality */}
        <div
          className="g-card build-detail-metric-card"
          style={{
            borderTop: "4px solid var(--google-blue-600)",
            padding: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div className="metric-icon-box" style={{ background: "var(--google-blue-50)" }}>
              <Bug size={20} style={{ color: "var(--google-blue-600)" }} />
            </div>
            <h3 style={{ fontSize: "15px", fontWeight: 700, margin: 0 }}>
              Code Quality Alert
            </h3>
          </div>
          <p style={{ fontSize: "13.5px", lineHeight: 1.6, color: "var(--text-secondary)", margin: 0 }}>
            {insights?.codeQualityInsight ?? "No code quality data available."}
          </p>
        </div>

        {/* Security */}
        <div
          className="g-card build-detail-metric-card"
          style={{
            borderTop: "4px solid var(--google-red-600)",
            padding: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div className="metric-icon-box" style={{ background: "var(--google-red-50)" }}>
              <Shield size={20} style={{ color: "var(--google-red-600)" }} />
            </div>
            <h3 style={{ fontSize: "15px", fontWeight: 700, margin: 0 }}>
              Security Concern
            </h3>
          </div>
          <p style={{ fontSize: "13.5px", lineHeight: 1.6, color: "var(--text-secondary)", margin: 0 }}>
            {insights?.securityInsight ?? "No security insight data available."}
          </p>
        </div>
      </div>

      {/* Recommendations */}
      <div className="g-card" style={{ marginBottom: "28px", padding: "32px", borderTop: "4px solid var(--bmc-orange)" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <div style={{ background: "var(--bmc-orange-light)", padding: "10px", borderRadius: "10px" }}>
            <Lightbulb size={24} style={{ color: "var(--bmc-orange)" }} />
          </div>
          <h2 style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>
            AI Recommendations
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {(insights?.recommendations ?? []).map((rec, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "18px",
                padding: "20px",
                background: "var(--grey-50)",
                borderRadius: "12px",
                border: "1px solid var(--border-color)",
                transition: "all 0.2s ease",
                cursor: "default",
                boxShadow: "var(--shadow-sm)"
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--bmc-orange)";
                (e.currentTarget as HTMLElement).style.background = "var(--bmc-orange-light)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--border-color)";
                (e.currentTarget as HTMLElement).style.background = "var(--grey-50)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-sm)";
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--bmc-orange), var(--bmc-orange-hover))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: 800,
                  boxShadow: "0 4px 10px rgba(255,107,0,0.3)"
                }}
              >
                {index + 1}
              </div>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: "14.5px",
                    lineHeight: 1.6,
                    color: "var(--text-primary)",
                    fontWeight: 500,
                    margin: 0
                  }}
                >
                  {rec}
                </p>
              </div>
              <ChevronRight
                size={20}
                style={{
                  color: "var(--text-secondary)",
                  flexShrink: 0,
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
          background: "linear-gradient(135deg, var(--bmc-orange-light), rgba(255, 107, 0, 0.05))",
          border: "2px dashed var(--bmc-orange)",
          textAlign: "center",
          padding: "40px 32px",
        }}
      >
        <Zap
          size={36}
          style={{
            color: "var(--bmc-orange)",
            margin: "0 auto 16px",
            display: "block",
            filter: "drop-shadow(0 4px 8px rgba(255,107,0,0.3))"
          }}
        />
        <h2
          style={{
            color: "var(--bmc-orange-hover)",
            fontSize: "20px",
            fontWeight: 800,
            marginBottom: "12px",
          }}
        >
          AI Reasoning Engine Under Development
        </h2>

        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "14.5px",
            maxWidth: "600px",
            margin: "0 auto 24px",
            lineHeight: 1.6
          }}
        >
          Upcoming features integrate large language models directly into the
          pipeline to auto-generate pull request test suites.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "24px",
            flexWrap: "wrap",
            fontSize: "13.5px",
            fontWeight: 700,
            color: "var(--bmc-orange)",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Sparkles size={14}/> LLM Test Generation</span>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Sparkles size={14}/> Auto-Pruning Engine</span>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Sparkles size={14}/> Predictive Path Analytics</span>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Sparkles size={14}/> Automated Vulnerability Fixes</span>
        </div>
      </div>
    </MainLayout>
  );
}