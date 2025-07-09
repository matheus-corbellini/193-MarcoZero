"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/menuItems/sidebar";
import Header from "../components/menuItems/header";
import Dashboard from "../pages/menuItems/dashboard";
import Details from "../pages/menuItems/details";
import ExtractionResults from "../pages/menuItems/extractionResults";
import "../styles/menu.css";

const menuTitles = {
  dashboard: "Dashboard",
  details: "Ver Detalhes",
  results: "Resultados da Extração",
};

export default function Layout() {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderContent = () => {
    switch (activeMenu) {
      case "dashboard":
        return <Dashboard />;
      case "details":
        return <Details />;
      case "results":
        return <ExtractionResults />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar
        activeMenu={activeMenu}
        onMenuChange={setActiveMenu}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="main-content">
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          title={menuTitles[activeMenu]}
        />
        <main className="content-area">{renderContent()}</main>
      </div>
    </div>
  );
}
