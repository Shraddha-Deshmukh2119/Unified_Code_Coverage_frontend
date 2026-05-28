import { ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="g-footer">
      <div>
        <span>&copy; {new Date().getFullYear()} Unified Coverage Intelligence. All rights reserved.</span>
      </div>
      <div className="g-footer-links">
        <a 
          href="https://github.com/Prathamesh-Jawahire" 
          target="_blank" 
          rel="noopener noreferrer"
          className="g-footer-link"
          style={{ display: "inline-flex", alignItems: "center", gap: "4px", textDecoration: "none" }}
        >
          <span>Repository</span>
          <ExternalLink size={12} />
        </a>
        <span style={{ color: "var(--grey-300)" }}>|</span>
        <a href="#docs" className="g-footer-link" style={{ textDecoration: "none" }}>Documentation</a>
        <span style={{ color: "var(--grey-300)" }}>|</span>
        <a href="#support" className="g-footer-link" style={{ textDecoration: "none" }}>Support &amp; Feedback</a>
      </div>
    </footer>
  );
}
