interface Props {
  issue: any;
  onClose: () => void;
  onViewSource: (
    issueKey: string
  ) => void;
}

export default function IssueDetailsModal({
  issue,
  onClose,
  onViewSource,
}: Props) {
  if (!issue) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background:
          "rgba(0,0,0,0.7)",
        display: "flex",
        justifyContent:
          "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#101B31",
          width: "850px",
          maxHeight: "85vh",
          overflowY: "auto",
          borderRadius: "12px",
          padding: "25px",
          color: "white",
        }}
      >
        {/* Header */}

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2>
            Issue Investigation
          </h2>

          <button
            onClick={onClose}
            style={{
              padding:
                "8px 16px",
            }}
          >
            Close
          </button>
        </div>

        {/* Severity Banner */}

        <div
          style={{
            background:
              issue.severity ===
              "CRITICAL"
                ? "#7F1D1D"
                : issue.severity ===
                  "MAJOR"
                ? "#9A3412"
                : "#1E293B",

            padding: "15px",

            borderRadius: "8px",

            marginBottom: "20px",
          }}
        >
          <h3>
            {issue.type}
          </h3>

          <p>
            Severity:
            {" "}
            {issue.severity}
          </p>
        </div>

        {/* Overview */}

        <h3>Overview</h3>

        <p>
          <b>Issue Key:</b>
          {" "}
          {issue.issueKey}
        </p>

        <p>
          <b>Category:</b>
          {" "}
          {
            issue.softwareQuality
          }
        </p>

        <p>
          <b>Status:</b>
          {" "}
          {issue.status}
        </p>

        <p>
          <b>File:</b>
          {" "}
          {issue.file}
        </p>

        <p>
          <b>Line:</b>
          {" "}
          {issue.line}
        </p>

        <p>
          <b>Rule ID:</b>
          {" "}
          {issue.rule}
        </p>

        {/* Description */}

        <h3
          style={{
            marginTop: "25px",
          }}
        >
          Description
        </h3>

        <p>
          {issue.message}
        </p>

        {/* Rule Explanation */}

        {issue.ruleDescription && (
          <>
            <h3
              style={{
                marginTop:
                  "25px",
              }}
            >
              Rule Explanation
            </h3>

            <p>
              {
                issue.ruleDescription
              }
            </p>
          </>
        )}

        {/* Impact */}

        {issue.impact && (
          <>
            <h3
              style={{
                marginTop:
                  "25px",
              }}
            >
              Impact
            </h3>

            <p>
              {issue.impact}
            </p>
          </>
        )}

        {/* Recommendation */}

        {issue.recommendation && (
          <>
            <h3
              style={{
                marginTop:
                  "25px",
              }}
            >
              Recommended Fix
            </h3>

            <p>
              {
                issue.recommendation
              }
            </p>
          </>
        )}

        {/* Tags */}

        <h3
          style={{
            marginTop: "25px",
          }}
        >
          Tags
        </h3>

        <p>
          {Array.isArray(
            issue.tags
          )
            ? issue.tags.join(
                ", "
              )
            : issue.tags}
        </p>

        {/* Effort */}

        <h3
          style={{
            marginTop: "25px",
          }}
        >
          Estimated Fix Time
        </h3>
        
          <button
  onClick={() =>
    onViewSource(
      issue.issueKey
    )
  }
>
  View Source
</button>
        <p>
          {issue.effortMinutes}
          {" "}
          minutes
        </p>
      </div>
    </div>
  );
}