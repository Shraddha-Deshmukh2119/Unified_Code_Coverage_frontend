interface Props {
  sourceData: any;
  onClose: () => void;
}

export default function SourceCodeModal({
  sourceData,
  onClose,
}: Props) {

  if (!sourceData) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background:
          "rgba(0,0,0,0.8)",
        display: "flex",
        justifyContent:
          "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: "90%",
          height: "85%",
          background: "#0F172A",
          borderRadius: "12px",
          padding: "20px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            marginBottom: "15px",
          }}
        >
          <h2>
            Source Viewer
          </h2>

          <button
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <p>
          <b>File:</b>
          {" "}
          {sourceData.file}
        </p>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            background:
              "#020617",
            marginTop: "15px",
            padding: "15px",
            fontFamily:
              "monospace",
          }}
        >
          {sourceData.source.map(
            (
              lineObj: any
            ) => (
              <div
                key={
                  lineObj.line
                }
                style={{
                  display: "flex",

                  background:
                    lineObj.line ===
                    sourceData.highlightLine
                      ? "#7F1D1D"
                      : "transparent",
                }}
              >
                <div
                  style={{
                    width: "70px",
                    color:
                      "#94A3B8",
                  }}
                >
                  {
                    lineObj.line
                  }
                </div>

                <div>
                  {
                    lineObj.code
                  }
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}