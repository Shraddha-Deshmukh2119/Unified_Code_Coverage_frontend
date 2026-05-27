import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Topbar from "./Topbar";
import Footer from "./Footer";

interface Props {
  children: ReactNode;
}

function MainLayout({ children }: Props) {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  // Trigger page transition loading animation on route changes
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 450); // fast transition
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="app-container">
      {/* Top transition blue loading indicator bar */}
      {loading && <div className="page-loader-bar" />}
      
      <Topbar />
      
      <div className="main-wrapper">
        <main className="content-pane">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default MainLayout;
