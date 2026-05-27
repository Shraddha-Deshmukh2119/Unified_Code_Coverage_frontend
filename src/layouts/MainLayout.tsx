import type { ReactNode } from "react";
import Sidebar from "../layouts/Sidebar.tsx";
import Topbar from "../layouts/Topbar";

interface Props {
  children: ReactNode;
}

function MainLayout({ children }: Props) {
  return (
    <div
      style={{
        display: "flex",
        background: "#08111F",
      }}
    >
      <Sidebar />

      <div style={{ flex: 1 }}>
        <Topbar />

        <div
          style={{
            padding: "20px",
            color: "white",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default MainLayout;