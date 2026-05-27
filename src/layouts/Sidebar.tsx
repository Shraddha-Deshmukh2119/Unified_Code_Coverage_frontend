import { LayoutDashboard, Boxes, History, Shield, Brain } from "lucide-react";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div
      style={{
        width: "260px",
        height: "100vh",
        background: "#0D1528",
        color: "white",
        padding: "20px",
      }}
    >
      <h2>CodeQuality AI</h2>

      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          marginTop: "40px",
        }}
      >
        <Link to="/" style={{ color: "white" }}>
          <LayoutDashboard size={18} /> Dashboard
        </Link>

        <Link to="/modules" style={{ color: "white" }}>
          <Boxes size={18} /> Modules
        </Link>

        <Link to="/builds" style={{ color: "white" }}>
          <History size={18} /> Builds
        </Link>

        <Link to="/quality-gate" style={{ color: "white" }}>
          <Shield size={18} /> Quality Gate
        </Link>

        <Link to="/ai-insights" style={{ color: "white" }}>
          <Brain size={18} /> Coverage Intelligence
        </Link>
        <Link to="/code-health" style={{ color: "white" }}>
          <LayoutDashboard size={18} /> Code Health
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;