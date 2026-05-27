import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { getModules, getModuleById } from "../api/dashboardApi";
import CoverageBar from "../components/common/CoverageBar";
import StatusBadge from "../components/common/StatusBadge";
import RiskBadge from "../components/common/RiskBadge";
import { 
  Folder, 
  FolderOpen, 
  FileCode, 
  ChevronRight, 
  ChevronDown, 
  FileSpreadsheet,
  Sparkles
} from "lucide-react";

export default function Modules() {
  const [modules, setModules] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [languageFilter, setLanguageFilter] = useState("ALL");
  const [riskFilter, setRiskFilter] = useState("ALL");
  const [expandedFolders, setExpandedFolders] = useState<{ [key: string]: boolean }>({});
  
  // Split pane selection states
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    getModules()
      .then((res) => {
        setModules(res.data);
        if (res.data && res.data.length > 0) {
          // Auto-select the first module by default
          setSelectedModuleId(res.data[0].id);
        }
      })
      .catch(console.error);
  }, []);

  // Fetch full details of the selected module
  useEffect(() => {
    if (!selectedModuleId) return;
    setLoadingDetails(true);
    getModuleById(selectedModuleId)
      .then((res) => {
        setSelectedModule(res.data);
        setLoadingDetails(false);
      })
      .catch((err) => {
        console.error(err);
        setLoadingDetails(false);
      });
  }, [selectedModuleId]);

  // Initialize expanded folders to true once modules load
  useEffect(() => {
    if (modules.length > 0) {
      const initial: { [key: string]: boolean } = {};
      modules.forEach((module) => {
        let folder = "root";
        if (module.modulePath && module.modulePath.includes("/")) {
          folder = module.modulePath.substring(0, module.modulePath.lastIndexOf("/"));
        }
        initial[folder] = true;
      });
      setExpandedFolders(initial);
    }
  }, [modules]);

  const toggleFolder = (folder: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folder]: !prev[folder],
    }));
  };

  const filteredModules = modules.filter((module) => {
    const searchMatch = module.moduleName
      .toLowerCase()
      .includes(search.toLowerCase());

    const languageMatch =
      languageFilter === "ALL" || module.language === languageFilter;

    const riskMatch = riskFilter === "ALL" || module.riskLevel === riskFilter;

    return searchMatch && languageMatch && riskMatch;
  });

  // Group filtered modules by directory path
  const groupedModules: { [key: string]: any[] } = {};
  filteredModules.forEach((module) => {
    let folder = "root";
    if (module.modulePath && module.modulePath.includes("/")) {
      folder = module.modulePath.substring(0, module.modulePath.lastIndexOf("/"));
    }
    if (!groupedModules[folder]) {
      groupedModules[folder] = [];
    }
    groupedModules[folder].push(module);
  });

  return (
    <MainLayout>
      <div className="page-subtitle">Codebase Analyzer</div>
      <h1 className="page-title">Modules Explorer</h1>

      {/* Filter and Search Bar */}
      <div 
        className="flex-row-wrap" 
        style={{ 
          marginBottom: "24px", 
          background: "var(--bg-card)", 
          padding: "14px 20px", 
          borderRadius: "8px", 
          border: "1px solid var(--border-color)",
          boxShadow: "var(--shadow-sm)"
        }}
      >
        <input
          type="text"
          placeholder="Search modules by file name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="g-input"
          style={{ flex: 1, minWidth: "220px" }}
        />

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text-secondary)" }}>Language:</span>
          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            className="g-select"
            style={{ minWidth: "120px", padding: "8px 12px" }}
          >
            <option value="ALL">All</option>
            <option value="Java">Java</option>
            <option value="C++">C++</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text-secondary)" }}>Risk Level:</span>
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="g-select"
            style={{ minWidth: "120px", padding: "8px 12px" }}
          >
            <option value="ALL">All</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
      </div>

      {/* Split Pane View */}
      <div 
        style={{ 
          display: "flex", 
          gap: "24px", 
          alignItems: "flex-start",
          minHeight: "65vh"
        }}
      >
        {/* LEFT COLUMN: GitHub-like collapsible folder navigation */}
        <div 
          style={{ 
            width: "380px", 
            flexShrink: 0,
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            borderRadius: "8px",
            boxShadow: "var(--shadow-sm)",
            maxHeight: "75vh",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <div 
            style={{ 
              padding: "12px 16px", 
              borderBottom: "1px solid var(--border-color)", 
              background: "var(--grey-50)",
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--text-secondary)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <span>DIRECTORY PATH TREE</span>
            <span className="g-badge g-badge-grey" style={{ fontSize: "10.5px" }}>
              {filteredModules.length} Modules
            </span>
          </div>

          <div style={{ padding: "12px" }}>
            {Object.keys(groupedModules).length > 0 ? (
              Object.keys(groupedModules).map((folderName) => {
                const folderModules = groupedModules[folderName];
                const isExpanded = !!expandedFolders[folderName];

                return (
                  <div key={folderName} style={{ marginBottom: "10px" }}>
                    {/* Collapsible Folder Row */}
                    <div
                      onClick={() => toggleFolder(folderName)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "6px 8px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        userSelect: "none",
                        backgroundColor: "transparent",
                        transition: "background-color 0.15s"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--grey-50)")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      {isExpanded ? <ChevronDown size={14} style={{ color: "var(--grey-500)" }} /> : <ChevronRight size={14} style={{ color: "var(--grey-500)" }} />}
                      {isExpanded ? <FolderOpen size={16} style={{ color: "var(--bmc-orange)" }} /> : <Folder size={16} style={{ color: "var(--bmc-orange)" }} />}
                      <span 
                        style={{ 
                          fontSize: "13px", 
                          fontFamily: "var(--font-mono)", 
                          fontWeight: 600, 
                          color: "var(--text-primary)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap"
                        }}
                      >
                        {folderName === "root" ? "/" : folderName}
                      </span>
                      <span style={{ fontSize: "11px", color: "var(--text-secondary)", marginLeft: "auto" }}>
                        ({folderModules.length})
                      </span>
                    </div>

                    {/* Folder Files List */}
                    {isExpanded && (
                      <div style={{ paddingLeft: "18px", marginTop: "4px", display: "flex", flexDirection: "column", gap: "2px" }}>
                        {folderModules.map((module) => {
                          const isSelected = module.id === selectedModuleId;
                          return (
                            <div
                              key={module.id}
                              onClick={() => setSelectedModuleId(module.id)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: "8px",
                                padding: "6px 10px",
                                borderRadius: "6px",
                                cursor: "pointer",
                                borderLeft: isSelected ? "3px solid var(--bmc-orange)" : "3px solid transparent",
                                backgroundColor: isSelected ? "var(--bmc-orange-light)" : "transparent",
                                transition: "all 0.15s ease",
                                userSelect: "none"
                              }}
                              onMouseEnter={(e) => {
                                if (!isSelected) {
                                  e.currentTarget.style.backgroundColor = "var(--grey-50)";
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isSelected) {
                                  e.currentTarget.style.backgroundColor = "transparent";
                                }
                              }}
                            >
                              <FileCode size={14} style={{ color: isSelected ? "var(--bmc-orange)" : "var(--google-blue-600)", flexShrink: 0 }} />
                              <span 
                                style={{ 
                                  fontSize: "12.5px", 
                                  fontWeight: isSelected ? 600 : 500,
                                  color: isSelected ? "var(--bmc-orange)" : "var(--text-primary)",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  flex: 1
                                }}
                              >
                                {module.moduleName}
                              </span>

                              {/* Tiny Coverage Metric Tag */}
                              <span 
                                className={`g-badge ${module.lineCoverage >= 80 ? "g-badge-green" : module.lineCoverage >= 50 ? "g-badge-yellow" : "g-badge-red"}`}
                                style={{ fontSize: "10.5px", fontWeight: 700, padding: "1px 5px", flexShrink: 0 }}
                              >
                                {module.lineCoverage}%
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: "center", padding: "30px", color: "var(--text-secondary)", fontSize: "13px" }}>
                No folders or modules found.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive coverage analysis breakdown */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
          {selectedModule ? (
            <div 
              className="g-card" 
              style={{ 
                animation: "fadeIn 0.3s ease-out forwards",
                padding: "28px"
              }}
            >
              {/* Module Header Details */}
              <div 
                style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "flex-start", 
                  borderBottom: "1px solid var(--border-color)", 
                  paddingBottom: "18px", 
                  marginBottom: "20px" 
                }}
              >
                <div>
                  <div className="page-subtitle" style={{ color: "var(--bmc-orange)" }}>Active Module Selection</div>
                  <h2 style={{ fontSize: "20px", fontWeight: 700, margin: "2px 0 6px 0", wordBreak: "break-all", fontFamily: "var(--font-display)" }}>
                    {selectedModule.moduleName}
                  </h2>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "8px" }}>
                    <span className="g-badge g-badge-grey" style={{ fontSize: "11px" }}>{selectedModule.language}</span>
                    <RiskBadge risk={selectedModule.riskLevel} />
                    <StatusBadge status={selectedModule.status} />
                  </div>
                </div>

                <div 
                  className="bmc-badge-orange"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "10px 16px",
                    borderRadius: "8px",
                    fontWeight: 700
                  }}
                >
                  <span style={{ fontSize: "10px", textTransform: "uppercase", opacity: 0.8 }}>Line Coverage</span>
                  <span style={{ fontSize: "24px", fontFamily: "var(--font-display)", fontWeight: 800 }}>
                    {selectedModule.lineCoverage}%
                  </span>
                </div>
              </div>

              {/* Main Coverage Cards */}
              <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Metrics Breakdown
              </h3>
              
              <div 
                style={{ 
                  display: "grid", 
                  gridTemplateColumns: "1fr 1fr", 
                  gap: "20px",
                  marginBottom: "24px"
                }}
              >
                <div style={{ border: "1px solid var(--border-color)", padding: "16px", borderRadius: "8px", background: "var(--grey-20)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "13px" }}>
                    <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>Line Coverage Progress</span>
                    <strong style={{ color: "var(--text-primary)" }}>{selectedModule.lineCoverage}%</strong>
                  </div>
                  <CoverageBar value={selectedModule.lineCoverage} />
                </div>

                <div style={{ border: "1px solid var(--border-color)", padding: "16px", borderRadius: "8px", background: "var(--grey-20)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "13px" }}>
                    <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>Branch Coverage Progress</span>
                    <strong style={{ color: "var(--text-primary)" }}>{selectedModule.branchCoverage}%</strong>
                  </div>
                  <CoverageBar value={selectedModule.branchCoverage} />
                </div>
              </div>

              {/* Covered & Missed Details Grid */}
              <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Statement Counts
              </h3>

              <div 
                style={{ 
                  display: "grid", 
                  gridTemplateColumns: "repeat(4, 1fr)", 
                  gap: "16px",
                  marginBottom: "24px"
                }}
              >
                <div style={{ border: "1px solid var(--border-color)", padding: "14px", borderRadius: "8px", background: "var(--bg-card)", textAlign: "center" }}>
                  <span style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: 600 }}>Covered Lines</span>
                  <p style={{ fontSize: "20px", fontWeight: 700, color: "var(--google-green-600)", margin: "4px 0 0" }}>
                    {selectedModule.coveredLines ?? "-"}
                  </p>
                </div>

                <div style={{ border: "1px solid var(--border-color)", padding: "14px", borderRadius: "8px", background: "var(--bg-card)", textAlign: "center" }}>
                  <span style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: 600 }}>Missed Lines</span>
                  <p style={{ fontSize: "20px", fontWeight: 700, color: "var(--google-red-600)", margin: "4px 0 0" }}>
                    {selectedModule.missedLines ?? "-"}
                  </p>
                </div>

                <div style={{ border: "1px solid var(--border-color)", padding: "14px", borderRadius: "8px", background: "var(--bg-card)", textAlign: "center" }}>
                  <span style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: 600 }}>Covered Branches</span>
                  <p style={{ fontSize: "20px", fontWeight: 700, color: "var(--google-green-600)", margin: "4px 0 0" }}>
                    {selectedModule.coveredBranches ?? "-"}
                  </p>
                </div>

                <div style={{ border: "1px solid var(--border-color)", padding: "14px", borderRadius: "8px", background: "var(--bg-card)", textAlign: "center" }}>
                  <span style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: 600 }}>Missed Branches</span>
                  <p style={{ fontSize: "20px", fontWeight: 700, color: "var(--google-red-600)", margin: "4px 0 0" }}>
                    {selectedModule.missedBranches ?? "-"}
                  </p>
                </div>
              </div>

              {/* Heatmap & Path Detail */}
              <div 
                style={{ 
                  display: "grid", 
                  gridTemplateColumns: "1fr 1fr", 
                  gap: "20px",
                  marginBottom: "24px"
                }}
              >
                <div className="g-card" style={{ padding: "16px", boxShadow: "none", border: "1px solid var(--border-color)" }}>
                  <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase" }}>Heatmap Color status</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
                    <div style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor: selectedModule.heatmapColor === "GREEN" ? "var(--google-green-600)" : selectedModule.heatmapColor === "YELLOW" ? "var(--google-yellow-600)" : "var(--google-red-600)"
                    }} />
                    <span style={{ fontSize: "13.5px", fontWeight: 600 }}>{selectedModule.heatmapColor}</span>
                  </div>
                </div>

                <div className="g-card" style={{ padding: "16px", boxShadow: "none", border: "1px solid var(--border-color)" }}>
                  <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase" }}>Quality Assessment</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "8px", color: selectedModule.status === "HEALTHY" ? "var(--google-green-600)" : "var(--google-red-600)" }}>
                    <Sparkles size={14} />
                    <span style={{ fontSize: "13.5px", fontWeight: 600 }}>
                      {selectedModule.status === "HEALTHY" ? "Verified Quality Passed" : "Needs Quality Remediation"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Path Viewer */}
              <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Full Path Location
              </span>
              <div 
                style={{ 
                  background: "var(--grey-50)", 
                  border: "1px solid var(--border-color)", 
                  borderRadius: "6px", 
                  padding: "12px 16px", 
                  fontFamily: "var(--font-mono)", 
                  fontSize: "12.5px", 
                  color: "var(--grey-800)",
                  wordBreak: "break-all",
                  marginTop: "6px"
                }}
              >
                {selectedModule.modulePath}
              </div>
            </div>
          ) : loadingDetails ? (
            <div className="g-card" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
              <div style={{ fontSize: "15px", color: "var(--text-secondary)" }}>
                Loading module details...
              </div>
            </div>
          ) : (
            <div className="g-card" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "400px", color: "var(--text-secondary)" }}>
              <FileSpreadsheet size={48} style={{ color: "var(--grey-300)", marginBottom: "12px" }} />
              <h3>Select a Module</h3>
              <p style={{ fontSize: "13px", marginTop: "4px" }}>
                Please select a module file from the tree navigation pane on the left to review its detailed coverage.
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}