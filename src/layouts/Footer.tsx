import { ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { getLatestBuild } from "../api/dashboardApi";

export default function Footer() {
  const [latestBuild, setLatestBuild] = useState<any>(null);
  const [showEmails, setShowEmails] = useState(false);

  useEffect(() => {
    getLatestBuild()
      .then((res) => {
        setLatestBuild(res.data);
      })
      .catch(console.error);
  }, []);

  return (
    <footer className="g-footer">
      <div>
        <span>&copy; {new Date().getFullYear()} Unified Coverage Intelligence. All rights reserved.</span>
      </div>
      <div className="g-footer-links" style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
        <a 
          href={latestBuild?.repositoryUrl || "https://github.com"} 
          target="_blank" 
          rel="noopener noreferrer"
          className="g-footer-link"
          style={{ display: "inline-flex", alignItems: "center", gap: "4px", textDecoration: "none" }}
        >
          <span>Repository</span>
          <ExternalLink size={12} />
        </a>
        <span style={{ color: "var(--text-secondary)", fontSize: "12.5px", display: "inline-flex", alignItems: "center", gap: "8px" }}>
          <button 
            onClick={() => setShowEmails(!showEmails)}
            style={{ 
              background: "none", 
              border: "none", 
              color: "inherit", 
              cursor: "pointer", 
              padding: 0, 
              fontFamily: "inherit",
              fontSize: "inherit"
            }}
            className="g-footer-link"
          >
            Contact Us
          </button>
          {showEmails && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
              : 
              <a href="mailto:prathameshjawahire@gmail.com" className="g-footer-link" style={{ textDecoration: "none" }}>prathameshjawahire@gmail.com</a>,{" "}
              <a href="mailto:shraddhadeshmukh@gmail.com" className="g-footer-link" style={{ textDecoration: "none" }}>shraddhadeshmukh@gmail.com</a>,{" "}
              <a href="mailto:harshallaware@gmail.com" className="g-footer-link" style={{ textDecoration: "none" }}>harshallaware@gmail.com</a>
            </span>
          )}
        </span>
      </div>
    </footer>
  );
}
