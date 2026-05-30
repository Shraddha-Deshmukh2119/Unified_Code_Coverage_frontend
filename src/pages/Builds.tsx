import { useEffect, useState, useRef } from "react";
import MainLayout from "../layouts/MainLayout";
import { getBuildHistory } from "../api/dashboardApi";
import StatusBadge from "../components/common/StatusBadge";
import {
  CheckCircle2,
  XCircle,
  Clock,
  GitBranch,
  Calendar,
  Timer,
  Activity,
  BarChart3,
  Package,
  Filter,
  ChevronDown,
  Hash,
  Search,
  X,
  TrendingUp,
  TrendingDown,
  Shield,
  ArrowRight,
} from "lucide-react";

export default function Builds() {
  const [builds, setBuilds] = useState<any[]>([]);
  const [selectedBuildId, setSelectedBuildId] = useState<number | null>(null);
  const [previewBuildId, setPreviewBuildId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Dropdown state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownSearch, setDropdownSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getBuildHistory()
      .then((res) => setBuilds(Array.isArray(res.data) ? [...res.data].reverse() : []))
      .catch(console.error);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
        setDropdownSearch("");
        setPreviewBuildId(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Auto-focus search when dropdown opens
  useEffect(() => {
    if (dropdownOpen && dropdownInputRef.current) {
      setTimeout(() => dropdownInputRef.current?.focus(), 50);
    }
  }, [dropdownOpen]);

  // Computed stats
  const passedBuilds = builds.filter(
    (b) => b.status === "SUCCESS" || b.status === "PASSED"
  ).length;
  const failedBuilds = builds.length - passedBuilds;



  const formatDuration = (ms: number) => {
    const totalSeconds = Math.round(ms / 1000);
    if (totalSeconds < 60) return `${totalSeconds}s`;
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    if (mins < 60) return `${mins}m ${secs}s`;
    const hours = Math.floor(mins / 60);
    return `${hours}h ${mins % 60}m`;
  };

  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Dropdown list filtered by search
  const dropdownOptions = builds.filter((b) => {
    if (b.buildId == null) return false;
    if (!dropdownSearch) return true;
    return b.buildId.toString().includes(dropdownSearch.trim());
  });

  // Main list filter
  const filteredBuilds = builds.filter((build) => {
    if (build.buildId == null) return false;
    const buildMatch =
      selectedBuildId === null || build.buildId === selectedBuildId;
    const statusMatch =
      statusFilter === "ALL" || build.status === statusFilter;
    return buildMatch && statusMatch;
  });

  const successRate =
    builds.length > 0
      ? ((passedBuilds / builds.length) * 100).toFixed(1)
      : "0";

  const getStatusIcon = (status: string, size = 18) => {
    if (status === "SUCCESS" || status === "PASSED") {
      return (
        <CheckCircle2
          size={size}
          style={{ color: "var(--google-green-600)", flexShrink: 0 }}
        />
      );
    }
    return (
      <XCircle
        size={size}
        style={{ color: "var(--google-red-600)", flexShrink: 0 }}
      />
    );
  };

  const getStatusBarColor = (status: string) => {
    if (status === "SUCCESS" || status === "PASSED")
      return "var(--google-green-600)";
    return "var(--google-red-600)";
  };

  const getCoverageColor = (cov: number) => {
    if (cov >= 80) return "var(--google-green-600)";
    if (cov >= 50) return "var(--google-yellow-600)";
    return "var(--google-red-600)";
  };

  // When a build row is clicked in the dropdown → show its detail preview, keep dropdown open
  const handlePreview = (buildId: number) => {
    setPreviewBuildId((prev) => (prev === buildId ? null : buildId));
    setSelectedBuildId(buildId);
  };

  // Reset to All Builds
  const handleClearSelection = () => {
    setSelectedBuildId(null);
    setPreviewBuildId(null);
    setDropdownOpen(false);
    setDropdownSearch("");
  };

  // Close dropdown after applying
  const handleApply = () => {
    setDropdownOpen(false);
    setDropdownSearch("");
    setPreviewBuildId(null);
  };

  const selectedBuild = builds.find((b) => b.buildId === selectedBuildId);
  const previewBuild = builds.find((b) => b.buildId === previewBuildId);

  // Compute delta vs previous build for the selected build
  const getSelectedBuildDelta = () => {
    if (!selectedBuild) return null;
    const sortedBuilds = [...builds].sort((a, b) => a.buildId - b.buildId);
    const idx = sortedBuilds.findIndex((b) => b.buildId === selectedBuild.buildId);
    if (idx <= 0) return null;
    const prevBuild = sortedBuilds[idx - 1];
    const delta = (selectedBuild.coverage ?? 0) - (prevBuild.coverage ?? 0);
    return { delta: parseFloat(delta.toFixed(2)), prevBuildId: prevBuild.buildId, prevCoverage: prevBuild.coverage ?? 0 };
  };
  const buildDelta = getSelectedBuildDelta();

  // Handle clicking a row in the Build History table
  const handleTableRowClick = (buildId: number) => {
    if (selectedBuildId === buildId) {
      // Deselect if already selected
      setSelectedBuildId(null);
    } else {
      setSelectedBuildId(buildId);
    }
  };

  return (
    <MainLayout>
      <div className="page-subtitle">Repository Operations</div>
      <h1 className="page-title">Build Pipeline</h1>
      <p
        style={{
          color: "var(--text-secondary)",
          marginBottom: "24px",
          marginTop: "-16px",
          fontSize: "14px",
        }}
      >
        CI/CD pipeline history, build analytics, and deployment metrics.
      </p>

      {/* KPI Cards */}
      <div className="grid-cols-4" style={{ marginBottom: "24px" }}>
        {/* Total Builds */}
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
              background: "var(--google-blue-600)",
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "10px",
            }}
          >
            <Package size={16} style={{ color: "var(--text-secondary)" }} />
            <span
              style={{
                fontSize: "12px",
                color: "var(--text-secondary)",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Total Builds
            </span>
          </div>
          <span
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "var(--text-primary)",
              fontFamily: "var(--font-display)",
            }}
          >
            {builds.length}
          </span>
          <p
            style={{
              fontSize: "12px",
              color: "var(--text-secondary)",
              marginTop: "6px",
            }}
          >
            All recorded pipeline runs
          </p>
        </div>

        {/* Passed Builds */}
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
              marginBottom: "10px",
            }}
          >
            <CheckCircle2
              size={16}
              style={{ color: "var(--google-green-600)" }}
            />
            <span
              style={{
                fontSize: "12px",
                color: "var(--text-secondary)",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Passed Builds
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
            <span
              style={{
                fontSize: "32px",
                fontWeight: 700,
                color: "var(--google-green-600)",
                fontFamily: "var(--font-display)",
              }}
            >
              {passedBuilds}
            </span>
            <span
              className="g-badge g-badge-green"
              style={{ fontSize: "11px", fontWeight: 600 }}
            >
              {successRate}%
            </span>
          </div>
          <p
            style={{
              fontSize: "12px",
              color: "var(--text-secondary)",
              marginTop: "6px",
            }}
          >
            Success rate across all runs
          </p>
        </div>

        {/* Failed Builds */}
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
              background:
                failedBuilds > 0
                  ? "var(--google-red-600)"
                  : "var(--google-green-600)",
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "10px",
            }}
          >
            <XCircle
              size={16}
              style={{
                color:
                  failedBuilds > 0
                    ? "var(--google-red-600)"
                    : "var(--google-green-600)",
              }}
            />
            <span
              style={{
                fontSize: "12px",
                color: "var(--text-secondary)",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Failed Builds
            </span>
          </div>
          <span
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color:
                failedBuilds > 0
                  ? "var(--google-red-600)"
                  : "var(--google-green-600)",
              fontFamily: "var(--font-display)",
            }}
          >
            {failedBuilds}
          </span>
          <p
            style={{
              fontSize: "12px",
              color: "var(--text-secondary)",
              marginTop: "6px",
            }}
          >
            {failedBuilds === 0
              ? "No failures detected"
              : "Builds requiring attention"}
          </p>
        </div>


      </div>

      {/* Filter Bar */}
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          gap: "12px",
          alignItems: "center",
          background: "var(--bg-card)",
          padding: "12px 20px",
          borderRadius: "8px",
          border: "1px solid var(--border-color)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        {/* ── Build Number Dropdown ── */}
        <div
          ref={dropdownRef}
          style={{ position: "relative", flex: 1, minWidth: 0 }}
        >
          {/* Trigger button */}
          <button
            id="build-number-dropdown-trigger"
            onClick={() => setDropdownOpen((prev) => !prev)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: dropdownOpen ? "var(--google-blue-50)" : "transparent",
              border: dropdownOpen
                ? "1px solid var(--google-blue-600)"
                : "1px solid transparent",
              borderRadius: "6px",
              padding: "7px 10px",
              cursor: "pointer",
              transition: "all 0.15s ease",
              outline: "none",
              boxShadow: dropdownOpen
                ? "0 0 0 2px rgba(26,115,232,0.15)"
                : "none",
            }}
          >
            <Hash
              size={15}
              style={{ color: "var(--google-blue-600)", flexShrink: 0 }}
            />
            <span
              style={{
                flex: 1,
                textAlign: "left",
                fontSize: "13.5px",
                color:
                  selectedBuildId !== null
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
                fontWeight: selectedBuildId !== null ? 600 : 400,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {selectedBuildId !== null
                ? `Build ${selectedBuildId}`
                : "Select Build Number…"}
            </span>

            {/* Status pill on trigger */}
            {selectedBuildId !== null && selectedBuild && (
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  padding: "2px 8px",
                  borderRadius: "10px",
                  background:
                    selectedBuild.status === "SUCCESS" ||
                    selectedBuild.status === "PASSED"
                      ? "var(--google-green-50)"
                      : "var(--google-red-50)",
                  color:
                    selectedBuild.status === "SUCCESS" ||
                    selectedBuild.status === "PASSED"
                      ? "var(--google-green-700)"
                      : "var(--google-red-700)",
                  border:
                    selectedBuild.status === "SUCCESS" ||
                    selectedBuild.status === "PASSED"
                      ? "1px solid var(--google-green-100)"
                      : "1px solid var(--google-red-100)",
                  flexShrink: 0,
                }}
              >
                {selectedBuild.status}
              </span>
            )}

            {/* Clear button */}
            {selectedBuildId !== null && (
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearSelection();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.stopPropagation();
                    handleClearSelection();
                  }
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "2px",
                  borderRadius: "4px",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  flexShrink: 0,
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLSpanElement).style.color =
                    "var(--google-red-600)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLSpanElement).style.color =
                    "var(--text-secondary)")
                }
              >
                <X size={14} />
              </span>
            )}

            <ChevronDown
              size={15}
              style={{
                color: "var(--text-secondary)",
                flexShrink: 0,
                transition: "transform 0.2s ease",
                transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </button>

          {/* ── Floating Dropdown Panel ── */}
          {dropdownOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                left: 0,
                zIndex: 9999,
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                borderRadius: "10px",
                boxShadow:
                  "0 8px 32px rgba(60,64,67,0.22), 0 2px 8px rgba(60,64,67,0.12)",
                overflow: "hidden",
                animation: "slideInUp 0.18s cubic-bezier(0.4,0,0.2,1)",
                width: "520px",
                maxWidth: "90vw",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Search header */}
              <div
                style={{
                  padding: "10px 12px",
                  borderBottom: "1px solid var(--border-color)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "var(--grey-50)",
                  flexShrink: 0,
                }}
              >
                <Search
                  size={14}
                  style={{ color: "var(--text-secondary)", flexShrink: 0 }}
                />
                <input
                  ref={dropdownInputRef}
                  type="text"
                  placeholder="Type to search build ID…"
                  value={dropdownSearch}
                  onChange={(e) => setDropdownSearch(e.target.value)}
                  style={{
                    flex: 1,
                    border: "none",
                    background: "transparent",
                    outline: "none",
                    fontSize: "13px",
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-body)",
                  }}
                />
                {dropdownSearch && (
                  <button
                    onClick={() => setDropdownSearch("")}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--text-secondary)",
                      display: "flex",
                      alignItems: "center",
                      padding: "2px",
                    }}
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* Two-column layout: list + detail */}
              <div style={{ display: "flex", minHeight: 0 }}>
                {/* ── Left: Scrollable Build List ── */}
                <div
                  style={{
                    width: previewBuild ? "220px" : "100%",
                    flexShrink: 0,
                    borderRight: previewBuild
                      ? "1px solid var(--border-color)"
                      : "none",
                    overflowY: "auto",
                    overflowX: "hidden",
                    maxHeight: "320px",
                    transition: "width 0.25s ease",
                  }}
                >
                  {/* All Builds option */}
                  <button
                    onClick={() => {
                      setSelectedBuildId(null);
                      setPreviewBuildId(null);
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 14px",
                      background:
                        selectedBuildId === null
                          ? "var(--google-blue-50)"
                          : "transparent",
                      border: "none",
                      borderBottom: "1px solid var(--border-color)",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "background 0.12s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (selectedBuildId !== null)
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.background = "var(--grey-50)";
                    }}
                    onMouseLeave={(e) => {
                      if (selectedBuildId !== null)
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.background = "transparent";
                    }}
                  >
                    <span
                      style={{
                        width: "7px",
                        height: "7px",
                        borderRadius: "50%",
                        background: "var(--google-blue-600)",
                        flexShrink: 0,
                        opacity: selectedBuildId === null ? 1 : 0,
                        transition: "opacity 0.15s",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "var(--google-blue-600)",
                        flex: 1,
                      }}
                    >
                      All Builds
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {builds.length}
                    </span>
                  </button>

                  {/* Individual builds */}
                  {dropdownOptions.length === 0 ? (
                    <div
                      style={{
                        padding: "20px",
                        textAlign: "center",
                        color: "var(--text-secondary)",
                        fontSize: "13px",
                      }}
                    >
                      No builds match "{dropdownSearch}"
                    </div>
                  ) : (
                    dropdownOptions.map((build) => {
                      const isSelected = selectedBuildId === build.buildId;
                      const isPreviewed = previewBuildId === build.buildId;
                      const isSuccess =
                        build.status === "SUCCESS" ||
                        build.status === "PASSED";

                      return (
                        <button
                          key={build.buildId}
                          onClick={() => handlePreview(build.buildId)}
                          style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "9px 14px",
                            background:
                              isPreviewed
                                ? "var(--google-blue-50)"
                                : isSelected
                                ? "rgba(26,115,232,0.06)"
                                : "transparent",
                            border: "none",
                            borderBottom: "1px solid var(--grey-100)",
                            borderLeft: isPreviewed
                              ? "3px solid var(--google-blue-600)"
                              : "3px solid transparent",
                            cursor: "pointer",
                            textAlign: "left",
                            transition: "all 0.12s ease",
                          }}
                          onMouseEnter={(e) => {
                            if (!isPreviewed)
                              (
                                e.currentTarget as HTMLButtonElement
                              ).style.background = "var(--grey-50)";
                          }}
                          onMouseLeave={(e) => {
                            if (!isPreviewed)
                              (
                                e.currentTarget as HTMLButtonElement
                              ).style.background =
                                isSelected
                                  ? "rgba(26,115,232,0.06)"
                                  : "transparent";
                          }}
                        >
                          {/* Status dot */}
                          <span
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              background: isSuccess
                                ? "var(--google-green-600)"
                                : "var(--google-red-600)",
                              flexShrink: 0,
                            }}
                          />

                          {/* Build ID */}
                          <span
                            style={{
                              fontSize: "13px",
                              fontWeight: isPreviewed ? 700 : 500,
                              fontFamily: "var(--font-display)",
                              color: isPreviewed
                                ? "var(--google-blue-600)"
                                : "var(--text-primary)",
                              flex: 1,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {build.buildId}
                          </span>

                          {/* Relative time */}
                          {build.buildTime && (
                            <span
                              style={{
                                fontSize: "11px",
                                color: "var(--text-secondary)",
                                flexShrink: 0,
                              }}
                            >
                              {formatRelativeTime(build.buildTime)}
                            </span>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>

                {/* ── Right: Detail Preview Panel ── */}
                {previewBuild && (
                  <div
                    style={{
                      flex: 1,
                      overflowY: "auto",
                      maxHeight: "320px",
                      padding: "16px",
                      background: "var(--grey-50)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                      animation: "fadeIn 0.2s ease",
                    }}
                  >
                    {/* Detail header */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        paddingBottom: "10px",
                        borderBottom: "1px solid var(--border-color)",
                      }}
                    >
                      {previewBuild.status === "SUCCESS" ||
                      previewBuild.status === "PASSED" ? (
                        <CheckCircle2
                          size={16}
                          style={{ color: "var(--google-green-600)" }}
                        />
                      ) : (
                        <XCircle
                          size={16}
                          style={{ color: "var(--google-red-600)" }}
                        />
                      )}
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: 700,
                          fontFamily: "var(--font-display)",
                          color: "var(--text-primary)",
                        }}
                      >
                        Build {previewBuild.buildId}
                      </span>
                      <StatusBadge status={previewBuild.status} />
                    </div>

                    {/* Repo & Branch */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "12px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      <GitBranch size={12} />
                      <span>{previewBuild.repositoryName ?? "repository"}</span>
                      <span style={{ opacity: 0.4 }}>•</span>
                      <span>{previewBuild.branch ?? "main"}</span>
                    </div>

                    {/* Metric cards */}
                    {/* Coverage */}
                    <div
                      style={{
                        background: "var(--bg-card)",
                        border: "1px solid var(--border-color)",
                        borderRadius: "8px",
                        padding: "12px 14px",
                      }}
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          fontSize: "10px",
                          textTransform: "uppercase",
                          fontWeight: 600,
                          color: "var(--text-secondary)",
                          marginBottom: "8px",
                          letterSpacing: "0.05em",
                        }}
                      >
                        <BarChart3 size={11} />
                        Coverage
                      </span>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "20px",
                            fontWeight: 700,
                            color: getCoverageColor(previewBuild.coverage ?? 0),
                            fontFamily: "var(--font-display)",
                          }}
                        >
                          {previewBuild.coverage ?? 0}%
                        </span>
                        <div
                          style={{
                            flex: 1,
                            height: "5px",
                            background: "var(--grey-200)",
                            borderRadius: "3px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${previewBuild.coverage ?? 0}%`,
                              height: "100%",
                              background: getCoverageColor(
                                previewBuild.coverage ?? 0
                              ),
                              borderRadius: "3px",
                              transition:
                                "width 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Duration */}
                    <div
                      style={{
                        background: "var(--bg-card)",
                        border: "1px solid var(--border-color)",
                        borderRadius: "8px",
                        padding: "12px 14px",
                      }}
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          fontSize: "10px",
                          textTransform: "uppercase",
                          fontWeight: 600,
                          color: "var(--text-secondary)",
                          marginBottom: "8px",
                          letterSpacing: "0.05em",
                        }}
                      >
                        <Timer size={11} />
                        Duration
                      </span>
                      <span
                        style={{
                          fontSize: "20px",
                          fontWeight: 700,
                          color: "var(--text-primary)",
                          fontFamily: "var(--font-display)",
                        }}
                      >
                        {previewBuild.buildDuration ?? previewBuild.duration
                          ? formatDuration(
                              previewBuild.buildDuration ??
                                previewBuild.duration
                            )
                          : "—"}
                      </span>
                    </div>

                    {/* Executed */}
                    <div
                      style={{
                        background: "var(--bg-card)",
                        border: "1px solid var(--border-color)",
                        borderRadius: "8px",
                        padding: "12px 14px",
                      }}
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          fontSize: "10px",
                          textTransform: "uppercase",
                          fontWeight: 600,
                          color: "var(--text-secondary)",
                          marginBottom: "8px",
                          letterSpacing: "0.05em",
                        }}
                      >
                        <Calendar size={11} />
                        Executed
                      </span>
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: 500,
                          color: "var(--text-primary)",
                        }}
                      >
                        {previewBuild.buildTime
                          ? new Date(previewBuild.buildTime).toLocaleString(
                              undefined,
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )
                          : "—"}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div
                style={{
                  padding: "8px 14px",
                  borderTop: "1px solid var(--border-color)",
                  background: "var(--grey-50)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{ fontSize: "11px", color: "var(--text-secondary)" }}
                >
                  {dropdownOptions.length} build
                  {dropdownOptions.length !== 1 ? "s" : ""} ·{" "}
                  {previewBuild
                    ? "Click another to switch"
                    : "Click a build to preview"}
                </span>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={handleClearSelection}
                    className="g-btn g-btn-outline"
                    style={{ fontSize: "11px", padding: "4px 10px" }}
                  >
                    Clear
                  </button>
                  <button
                    onClick={handleApply}
                    className="g-btn g-btn-primary"
                    style={{ fontSize: "11px", padding: "4px 12px" }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div
          style={{
            width: "1px",
            height: "24px",
            background: "var(--border-color)",
            flexShrink: 0,
          }}
        />

        {/* Status filter */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <Filter
            size={14}
            style={{ color: "var(--text-secondary)", flexShrink: 0 }}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="g-select"
            style={{ padding: "6px 12px", minWidth: "120px", fontSize: "13px" }}
          >
            <option value="ALL">All Status</option>
            <option value="SUCCESS">Success</option>
            <option value="PASSED">Passed</option>
            <option value="FAILURE">Failure</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
      </div>

      {/* ── Build Detail Insights Panel ── */}
      {selectedBuild && (
        <div className="g-card build-detail-panel" style={{ padding: "24px", marginBottom: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", borderBottom: "1px solid var(--border-color)", paddingBottom: "16px" }}>
            <div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Selected Build</div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <h2 style={{ fontSize: "24px", fontWeight: 700, fontFamily: "var(--font-display)", margin: 0 }}>
                  #{selectedBuild.buildId}
                </h2>
                <StatusBadge status={selectedBuild.status} />
              </div>
            </div>
            <button
              onClick={() => setSelectedBuildId(null)}
              className="g-btn g-btn-outline"
              style={{ fontSize: "12px", padding: "6px 12px" }}
            >
              <X size={14} />
              Clear Selection
            </button>
          </div>

          <div className="build-detail-grid">
            {/* Coverage */}
            <div className="build-detail-metric">
              <span className="metric-label">
                <BarChart3 size={12} />
                Coverage
              </span>
              <span className="metric-value" style={{ color: getCoverageColor(selectedBuild.coverage ?? 0) }}>
                {selectedBuild.coverage ?? 0}%
              </span>
              <div style={{ height: "4px", background: "var(--grey-200)", borderRadius: "2px", overflow: "hidden", marginTop: "4px" }}>
                <div style={{ width: `${selectedBuild.coverage ?? 0}%`, height: "100%", background: getCoverageColor(selectedBuild.coverage ?? 0), borderRadius: "2px", transition: "width 0.6s ease" }} />
              </div>
            </div>

            {/* Delta vs Previous */}
            <div className="build-detail-metric">
              <span className="metric-label">
                {buildDelta && buildDelta.delta >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                Delta vs Previous
              </span>
              {buildDelta ? (
                <>
                  <span className="metric-value" style={{ color: buildDelta.delta >= 0 ? "var(--google-green-600)" : "var(--google-red-600)" }}>
                    {buildDelta.delta >= 0 ? "+" : ""}{buildDelta.delta}%
                  </span>
                  <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                    vs Build #{buildDelta.prevBuildId} ({buildDelta.prevCoverage}%)
                  </span>
                </>
              ) : (
                <span className="metric-value" style={{ fontSize: "14px", color: "var(--text-secondary)" }}>No previous build</span>
              )}
            </div>

            {/* Branch */}
            <div className="build-detail-metric">
              <span className="metric-label">
                <GitBranch size={12} />
                Branch
              </span>
              <span className="metric-value" style={{ fontSize: "16px" }}>
                {selectedBuild.branch ?? "main"}
              </span>
            </div>

            {/* Timestamp */}
            <div className="build-detail-metric">
              <span className="metric-label">
                <Calendar size={12} />
                Executed
              </span>
              <span className="metric-value" style={{ fontSize: "14px" }}>
                {selectedBuild.buildTime
                  ? new Date(selectedBuild.buildTime).toLocaleString(undefined, {
                      month: "short", day: "numeric", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })
                  : "—"}
              </span>
            </div>

            {/* Duration */}
            <div className="build-detail-metric">
              <span className="metric-label">
                <Timer size={12} />
                Duration
              </span>
              <span className="metric-value" style={{ fontSize: "16px" }}>
                {selectedBuild.buildDuration ?? selectedBuild.duration
                  ? formatDuration(selectedBuild.buildDuration ?? selectedBuild.duration)
                  : "—"}
              </span>
            </div>

            {/* Quality Gate */}
            <div className="build-detail-metric">
              <span className="metric-label">
                <Shield size={12} />
                Quality Gate
              </span>
              {selectedBuild.qualityGateStatus ? (
                <span className="metric-value" style={{ fontSize: "16px", color: selectedBuild.qualityGateStatus === "PASSED" ? "var(--google-green-600)" : "var(--google-red-600)" }}>
                  {selectedBuild.qualityGateStatus}
                </span>
              ) : (
                <span className="metric-value" style={{ fontSize: "14px", color: "var(--text-secondary)" }}>N/A</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Compact Build History Table ── */}
      <div
        className="g-card"
        style={{ padding: 0, overflow: "hidden" }}
      >
        {/* Table header bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 18px",
            borderBottom: "1px solid var(--border-color)",
            background: "var(--grey-50)",
          }}
        >
          <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
            Build History
          </span>
          <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
            {filteredBuilds.length} build{filteredBuilds.length !== 1 ? "s" : ""}
            {selectedBuildId !== null && (
              <span style={{ color: "var(--google-blue-600)", marginLeft: "6px" }}>
                — Build {selectedBuildId} selected
              </span>
            )}
          </span>
        </div>

        {filteredBuilds.length > 0 ? (
          <div className="g-table-container" style={{ maxHeight: "480px", overflowY: "auto" }}>
            <table className="g-table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th style={{ width: "36px" }}></th>
                  <th>Build</th>
                  <th>Status</th>
                  <th>Repository</th>
                  <th>Branch</th>
                  <th>Coverage</th>
                  <th style={{ textAlign: "right" }}>When</th>
                </tr>
              </thead>
              <tbody>
                {filteredBuilds.map((build) => {
                  const coverageVal = build.coverage ?? 0;
                  const isRowSelected = build.buildId === selectedBuildId;
                  return (
                    <tr 
                      key={build.buildId}
                      className={`clickable-row ${isRowSelected ? "selected-row" : ""}`}
                      onClick={() => handleTableRowClick(build.buildId)}
                    >
                      {/* Status dot cell */}
                      <td style={{ padding: "0 0 0 4px" }}>
                        <div
                          style={{
                            width: "4px",
                            height: "32px",
                            borderRadius: "2px",
                            background: getStatusBarColor(build.status),
                            margin: "0 auto",
                          }}
                        />
                      </td>

                      {/* Build ID */}
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                          {getStatusIcon(build.status, 14)}
                          <span
                            style={{
                              fontSize: "13px",
                              fontWeight: 700,
                              fontFamily: "var(--font-display)",
                              color: "var(--text-primary)",
                            }}
                          >
                            #{build.buildId}
                          </span>
                        </div>
                      </td>

                      {/* Status badge */}
                      <td>
                        <StatusBadge status={build.status} />
                      </td>

                      {/* Repo */}
                      <td>
                        <span
                          style={{
                            fontSize: "12px",
                            color: "var(--text-secondary)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            display: "block",
                            maxWidth: "160px",
                          }}
                        >
                          {build.repositoryName ?? "repository"}
                        </span>
                      </td>

                      {/* Branch */}
                      <td>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            fontSize: "12px",
                            color: "var(--text-secondary)",
                          }}
                        >
                          <GitBranch size={11} />
                          {build.branch ?? "main"}
                        </span>
                      </td>

                      {/* Coverage */}
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div
                            style={{
                              width: "56px",
                              height: "4px",
                              background: "var(--grey-200)",
                              borderRadius: "2px",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                width: `${coverageVal}%`,
                                height: "100%",
                                background: getCoverageColor(coverageVal),
                                borderRadius: "2px",
                              }}
                            />
                          </div>
                          <span
                            style={{
                              fontSize: "12px",
                              fontWeight: 600,
                              color: getCoverageColor(coverageVal),
                            }}
                          >
                            {coverageVal}%
                          </span>
                        </div>
                      </td>

                      {/* Relative time */}
                      <td style={{ textAlign: "right" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            fontSize: "12px",
                            color: "var(--text-secondary)",
                          }}
                        >
                          <Clock size={11} />
                          {build.buildTime ? formatRelativeTime(build.buildTime) : "—"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "60px 40px",
              color: "var(--text-secondary)",
            }}
          >
            <Activity
              size={40}
              style={{
                color: "var(--grey-300)",
                margin: "0 auto 12px",
                display: "block",
              }}
            />
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: "var(--text-primary)",
                marginBottom: "6px",
              }}
            >
              No Builds Found
            </h3>
            <p style={{ fontSize: "13px" }}>
              No builds match your current filter criteria.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}