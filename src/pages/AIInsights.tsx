import { useEffect, useState, useMemo } from "react";
import MainLayout from "../layouts/MainLayout";
import { getAiMetricsData, getComplexityAnalysis } from "../api/dashboardApi";
import {
  Brain,
  Clock,
  Code2,
  Cpu,
  Zap,
  AlertCircle,
  Target,
  Shield,
  Search,
  Filter
} from "lucide-react";

interface ComplexityModule {
  moduleName: string;
  filePath: string;
  timeComplexity: string;
  reason: string;
  optimizationSuggestion: string;
  estimatedImprovedComplexity: string;
  hash?: string;
  id?: string;
}

const TABS = [
  { key: "executiveSummary", label: "Executive Summary", icon: <Brain size={18} />, color: "var(--bmc-orange)", bg: "var(--bmc-orange-light)" },
  { key: "coverageRiskInsight", label: "Coverage Risk", icon: <AlertCircle size={18} />, color: "var(--google-red-600)", bg: "var(--google-red-50)" },
  { key: "codeQualityInsight", label: "Code Quality", icon: <Code2 size={18} />, color: "var(--google-blue-600)", bg: "var(--google-blue-50)" },
  { key: "securityInsight", label: "Security", icon: <Shield size={18} />, color: "var(--google-green-600)", bg: "var(--google-green-50)" },
  { key: "recommendations", label: "Recommendations", icon: <Target size={18} />, color: "var(--google-yellow-600)", bg: "var(--google-yellow-50)" },
];

export default function AIInsights() {
  const [insightData, setInsightData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("executiveSummary");

  const [complexityList, setComplexityList] = useState<ComplexityModule[]>([]);
  const [selectedModule, setSelectedModule] = useState<ComplexityModule | null>(null);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [complexityFilter, setComplexityFilter] = useState("All");
  const [languageFilter, setLanguageFilter] = useState("All");

  const getLanguage = (filePath: string) => {
    if (!filePath) return "Other";
    const path = filePath.toLowerCase();
    if (path.endsWith(".java")) return "Java";
    if (path.endsWith(".cpp") || path.endsWith(".cc") || path.endsWith(".cxx") || path.endsWith(".h") || path.endsWith(".hpp")) return "C++";
    return "Other";
  };

  useEffect(() => {
    Promise.allSettled([getAiMetricsData(), getComplexityAnalysis()])
      .then(([metricsRes, complexityRes]) => {
        if (metricsRes.status === 'fulfilled') {
          setInsightData(metricsRes.value.data);
        } else {
          console.error("Failed to load AI metrics:", metricsRes.reason);
          setInsightData({ error: "Backend returned an error for AI Metrics." });
        }

        if (complexityRes.status === 'fulfilled') {
          const compData = complexityRes.value.data;
          let rawList: ComplexityModule[] = [];
          if (Array.isArray(compData)) {
            rawList = compData;
          } else if (compData && Array.isArray(compData.results)) {
            rawList = compData.results;
          } else if (compData && Array.isArray(compData.data)) {
            rawList = compData.data;
          }

          // Filter out Unknown complexity and deduplicate by moduleName
          const uniqueModulesMap = new Map<string, ComplexityModule>();
          rawList.forEach(mod => {
            const originalComplexity = mod.timeComplexity || "";
            const isUnknown = !originalComplexity || originalComplexity.toLowerCase().includes("unknown");

            if (!isUnknown && mod.moduleName && !uniqueModulesMap.has(mod.moduleName)) {
              // Extract just the O(...) part and standardize
              let cleanComplexity = originalComplexity;
              const match = originalComplexity.match(/O\s*\([^)]+\)/i);

              if (match) {
                // Convert to consistent format: O(n), remove spaces, standardize uppercase O and lowercase variables
                cleanComplexity = match[0]
                  .replace(/o/i, 'O')
                  .replace(/N/g, 'n')
                  .replace(/M/g, 'm')
                  .replace(/K/g, 'k')
                  .replace(/\s/g, '');
              } else if (cleanComplexity.length > 12) {
                cleanComplexity = "Complex";
              }

              mod.timeComplexity = cleanComplexity;
              uniqueModulesMap.set(mod.moduleName, mod);
            }
          });

          const filteredList = Array.from(uniqueModulesMap.values());
          setComplexityList(filteredList);

          if (filteredList.length > 0) {
            setSelectedModule(filteredList[0]);
          } else {
            setSelectedModule(null);
          }
        } else {
          console.error("Failed to load complexity analysis:", complexityRes.reason);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // Compute unique complexity values for the filter dropdown
  const uniqueComplexities = useMemo(() => {
    const set = new Set<string>();
    complexityList.forEach(m => set.add(m.timeComplexity));
    return ["All", ...Array.from(set).sort()];
  }, [complexityList]);

  // Apply search and filter
  const displayedModules = useMemo(() => {
    return complexityList.filter(mod => {
      const matchesSearch = mod.moduleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mod.filePath.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesComplexity = complexityFilter === "All" || mod.timeComplexity === complexityFilter;
      const matchesLanguage = languageFilter === "All" || getLanguage(mod.filePath) === languageFilter;

      return matchesSearch && matchesComplexity && matchesLanguage;
    });
  }, [complexityList, searchQuery, complexityFilter, languageFilter]);

  if (loading) {
    return (
      <MainLayout>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "12px", color: "var(--text-secondary)" }}>
          <div className="loading-spinner" />
          <span style={{ fontSize: "14px", fontWeight: 500 }}>Loading AI Intelligence...</span>
        </div>
      </MainLayout>
    );
  }

  // Helper for complexity color
  const getComplexityColor = (complexity: string) => {
    if (!complexity) return "var(--google-grey-600)";
    if (complexity.includes("O(1)") || complexity.includes("O(log n)")) return "var(--google-green-600)";
    if (complexity.includes("O(n)") || complexity.includes("O(n log n)")) return "var(--google-yellow-600)";
    return "var(--google-red-600)";
  };

  const getComplexityBg = (complexity: string) => {
    if (!complexity) return "var(--google-grey-50)";
    if (complexity.includes("O(1)") || complexity.includes("O(log n)")) return "var(--google-green-50)";
    if (complexity.includes("O(n)") || complexity.includes("O(n log n)")) return "var(--google-yellow-50)";
    return "var(--google-red-50)";
  };

  // Render current tab content
  const renderTabContent = () => {
    if (!insightData) return null;
    if (insightData.error) return <div style={{ color: "var(--google-red-600)", padding: "20px" }}>{insightData.error}</div>;

    const content = insightData[activeTab];
    if (!content) return <div style={{ color: "var(--text-secondary)", padding: "20px" }}>No data available for this section.</div>;

    const activeTabObj = TABS.find(t => t.key === activeTab);

    if (Array.isArray(content)) {
      return (
        <div key={activeTab} style={{ display: "flex", flexDirection: "column", gap: "16px", animation: "slideInUp 0.4s ease-out" }}>
          {content.map((item, idx) => (
            <div key={idx} style={{
              display: "flex",
              gap: "16px",
              background: activeTabObj?.bg || "var(--grey-50)",
              padding: "16px 20px",
              borderRadius: "12px",
              border: `1px solid ${activeTabObj?.color || "var(--google-blue-600)"}30`,
              boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
              transition: "transform 0.2s ease"
            }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateX(4px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateX(0)"}
            >
              <div style={{
                background: "var(--bg-card)",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                color: activeTabObj?.color || "var(--google-blue-600)",
                border: `2px solid ${activeTabObj?.color || "var(--border-color)"}`,
                flexShrink: 0,
                boxShadow: "var(--shadow-sm)"
              }}>
                {idx + 1}
              </div>
              <div style={{ lineHeight: 1.6, color: "var(--text-primary)", fontSize: "15px", display: "flex", alignItems: "center" }}>
                {item}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div key={activeTab} style={{
        lineHeight: 1.8,
        color: "var(--text-primary)",
        fontSize: "16px",
        whiteSpace: "pre-wrap",
        background: activeTabObj?.bg || 'var(--grey-50)',
        padding: "24px",
        borderRadius: "12px",
        borderLeft: `6px solid ${activeTabObj?.color || "var(--google-blue-600)"}`,
        boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
        animation: "fadeIn 0.5s ease-out"
      }}>
        {content}
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="page-subtitle">Coverage Intelligence Center</div>
      <h1 className="page-title">AI Metrics & Complexity Insights</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: "32px", marginTop: "-16px", fontSize: "14px" }}>
        AI-powered recommendations, predictive risk analysis, and module-level complexity details.
      </p>

      {/* Upper Part: AI Insights Tabbed View */}
      {insightData && (
        <div className="g-card" style={{ marginBottom: "24px", padding: 0, overflow: "hidden" }}>
          <div style={{
            display: "flex",
            borderBottom: "1px solid var(--border-color)",
            background: "var(--grey-50)",
            overflowX: "auto"
          }}>
            {TABS.map(tab => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "16px 20px",
                    border: "none",
                    background: isActive ? "var(--bg-card)" : "transparent",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? tab.color : "var(--text-secondary)",
                    borderBottom: isActive ? `3px solid ${tab.color}` : "3px solid transparent",
                    transition: "all 0.2s ease",
                    whiteSpace: "nowrap"
                  }}
                >
                  {/* Wrap icon to apply color when active */}
                  <div style={{ color: isActive ? tab.color : "var(--grey-500)", display: "flex" }}>
                    {tab.icon}
                  </div>
                  {tab.label}
                </button>
              );
            })}
          </div>
          <div style={{ padding: "24px 32px", minHeight: "140px" }}>
            {renderTabContent()}
          </div>
        </div>
      )}

      {/* Lower Part: Module Complexity Split View */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <h2 style={{ fontSize: "18px", display: "flex", alignItems: "center", gap: "10px", fontWeight: 700, margin: 0 }}>
          <Clock size={22} style={{ color: "var(--google-blue-600)" }} />
          Module Complexity
        </h2>
      </div>

      <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
        {/* Left Side: Master List with Search & Filter */}
        <div style={{ flex: "0 0 40%", display: "flex", flexDirection: "column", gap: "16px", height: "550px", position: "sticky", top: "20px" }}>

          <div style={{ display: "flex", gap: "12px" }}>
            <div style={{ flex: 1, position: "relative" }}>
              <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
              <input
                type="text"
                placeholder="Search modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px 10px 36px",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                  backgroundColor: "var(--bg-card)",
                  color: "var(--text-primary)"
                }}
              />
            </div>

            {/* Language Filter */}
            <div style={{ position: "relative", width: "120px" }}>
              <Code2 size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)", pointerEvents: "none" }} />
              <select
                value={languageFilter}
                onChange={(e) => setLanguageFilter(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px 10px 36px",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                  appearance: "none",
                  backgroundColor: "var(--bg-card)",
                  color: "var(--text-primary)",
                  cursor: "pointer"
                }}
              >
                <option value="All">All Langs</option>
                <option value="Java">Java</option>
                <option value="C++">C++</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Complexity Filter */}
            <div style={{ position: "relative", width: "120px" }}>
              <Filter size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)", pointerEvents: "none" }} />
              <select
                value={complexityFilter}
                onChange={(e) => setComplexityFilter(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px 10px 36px",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                  appearance: "none",
                  backgroundColor: "var(--bg-card)",
                  color: "var(--text-primary)",
                  cursor: "pointer"
                }}
              >
                {uniqueComplexities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="g-card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ overflowY: "auto", flex: 1 }}>
              {displayedModules.length === 0 ? (
                <div style={{ padding: "32px", textAlign: "center", color: "var(--text-secondary)" }}>
                  No modules found matching your criteria.
                </div>
              ) : (
                displayedModules.map((mod, idx) => {
                  const isSelected = selectedModule === mod;
                  const isLast = idx === displayedModules.length - 1;
                  const complexityColor = getComplexityColor(mod.timeComplexity);
                  const complexityBg = getComplexityBg(mod.timeComplexity);

                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedModule(mod)}
                      style={{
                        width: "100%",
                        border: "none",
                        borderBottom: isLast ? "none" : "1px solid var(--border-color)",
                        background: isSelected ? "var(--google-blue-50)" : "var(--bg-card)",
                        padding: "14px 16px",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "background 0.2s ease",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "12px"
                      }}
                    >
                      <div style={{ fontWeight: 600, fontSize: "14px", color: isSelected ? "var(--google-blue-700)" : "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flex: 1 }}>
                        {mod.moduleName || "Unnamed Module"}
                      </div>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "12px",
                        color: complexityColor,
                        background: complexityBg,
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontWeight: 700,
                        flexShrink: 0
                      }}>
                        <Zap size={12} />
                        {mod.timeComplexity}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Detail View */}
        <div style={{ flex: "1", display: "flex", flexDirection: "column", minHeight: "550px" }}>
          {selectedModule ? (
            <div className="g-card" style={{ padding: "32px", flex: 1, borderTop: "4px solid var(--google-blue-600)" }}>
              <div style={{ marginBottom: "24px", paddingBottom: "20px", borderBottom: "1px solid var(--border-color)" }}>
                <h3 style={{ fontSize: "22px", fontWeight: 700, margin: "0 0 8px 0", color: "var(--text-primary)" }}>
                  {selectedModule.moduleName || "Unnamed Module"}
                </h3>
                <div style={{ fontSize: "13px", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Code2 size={14} />
                  {selectedModule.filePath || "No file path provided"}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
                <div style={{ background: "var(--grey-50)", padding: "16px", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                  <span style={{ display: "block", fontSize: "12px", textTransform: "uppercase", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "8px" }}>Current Complexity</span>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontWeight: 700, fontSize: "18px", color: getComplexityColor(selectedModule.timeComplexity) }}>
                    <Zap size={20} />
                    {selectedModule.timeComplexity || "N/A"}
                  </div>
                </div>

                <div style={{ background: "var(--google-green-50)", padding: "16px", borderRadius: "8px", border: "1px solid var(--google-green-100)" }}>
                  <span style={{ display: "block", fontSize: "12px", textTransform: "uppercase", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "8px" }}>Estimated Improved</span>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontWeight: 700, fontSize: "18px", color: "var(--google-green-700)" }}>
                    <Target size={20} />
                    {selectedModule.estimatedImprovedComplexity || "Unknown"}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {selectedModule.reason && (
                  <div>
                    <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>
                      <AlertCircle size={16} style={{ color: "var(--google-blue-600)" }} />
                      Reason for Complexity
                    </span>
                    <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.6, color: "var(--text-secondary)", background: "var(--grey-50)", padding: "16px", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                      {selectedModule.reason}
                    </p>
                  </div>
                )}

                {selectedModule.optimizationSuggestion && (
                  <div>
                    <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>
                      <Brain size={16} style={{ color: "var(--bmc-orange)" }} />
                      AI Optimization Suggestion
                    </span>
                    <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.6, color: "var(--text-secondary)", background: "var(--bmc-orange-light)", padding: "16px", borderRadius: "8px", border: "1px solid rgba(255,107,0,0.2)", whiteSpace: "pre-wrap" }}>
                      {selectedModule.optimizationSuggestion}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="g-card" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px", color: "var(--text-secondary)", background: "var(--grey-50)", borderStyle: "dashed" }}>
              <Cpu size={48} style={{ color: "var(--grey-300)", marginBottom: "16px" }} />
              <div style={{ fontSize: "16px", fontWeight: 600 }}>Select a module</div>
              <div style={{ fontSize: "14px", marginTop: "8px" }}>Click on a module from the left list to view its detailed complexity analysis.</div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}