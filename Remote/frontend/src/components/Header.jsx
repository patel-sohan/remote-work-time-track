import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./Header.css";

const Header = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || "dashboard";
      setCurrentPage(hash);
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange();

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          <div className="logo">
            <span className="logo-icon">🚀</span>
            <span className="logo-text">Productivity Tracker</span>
          </div>
        </div>

        <nav className="header-nav">
          <button
            className={`nav-link ${
              currentPage === "dashboard" ? "active" : ""
            }`}
            onClick={() => (window.location.hash = "#dashboard")}
          >
            Dashboard
          </button>
          <button
            className={`nav-link ${currentPage === "tasks" ? "active" : ""}`}
            onClick={() => (window.location.hash = "#tasks")}
          >
            Tasks
          </button>
          <button
            className={`nav-link ${currentPage === "timer" ? "active" : ""}`}
            onClick={() => (window.location.hash = "#timer")}
          >
            Timer
          </button>

          <button
            className={`nav-link ${
              currentPage === "analytics" ? "active" : ""
            }`}
            onClick={() => (window.location.hash = "#analytics")}
          >
            Analytics
          </button>

          <button
            className={`nav-link ${currentPage === "profile" ? "active" : ""}`}
            onClick={() => (window.location.hash = "#profile")}
          >
            Settings
          </button>
          {user?.role === "manager" && (
            <button
              className={`nav-link ${currentPage === "team" ? "active" : ""}`}
              onClick={() => (window.location.hash = "#team")}
            >
              Team
            </button>
          )}
        </nav>

        <div className="header-right">
          

          <div className="user-menu">
            <button
              className="user-btn"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="user-avatar">
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </div>
              <div className="user-info">
                <span className="user-name">
                  {user?.firstName} {user?.lastName}
                </span>
                <span className="user-role">
                  {user?.role?.replace("_", " ")}
                </span>
              </div>
              <span className="dropdown-arrow">▼</span>
            </button>

            {showDropdown && (
              <div className="user-dropdown">
                <div className="dropdown-header">
                  <div className="user-avatar large">
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </div>
                  <div>
                    <div className="dropdown-name">
                      {user?.firstName} {user?.lastName}
                    </div>
                    <div className="dropdown-email">{user?.email}</div>
                  </div>
                </div>

                <div className="dropdown-divider"></div>

                <div className="dropdown-menu">
                  <button
                    className="dropdown-item"
                    onClick={() => (window.location.hash = "#profile")}
                  >
                    <span className="item-icon">👤</span>
                    Profile
                  </button>
                  <button className="dropdown-item">
                    <span className="item-icon">⚙️</span>
                    Settings
                  </button>
                  <button className="dropdown-item">
                    <span className="item-icon">📊</span>
                    My Reports
                  </button>
                  <button className="dropdown-item">
                    <span className="item-icon">❓</span>
                    Help & Support
                  </button>

                  <div className="dropdown-divider"></div>

                  <button
                    className="dropdown-item logout"
                    onClick={handleLogout}
                  >
                    <span className="item-icon">🚪</span>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
