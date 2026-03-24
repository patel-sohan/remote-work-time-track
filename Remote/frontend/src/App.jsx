import { useState, useEffect, Suspense, lazy } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import LoadingSpinner from "./components/Loading/LoadingSpinner";
import ToastContainer from "./components/Toast/ToastContainer";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import "./App.css";
import "./styles/responsive.css";

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home"));
const Landing = lazy(() => import("./pages/Landing"));
const Tasks = lazy(() => import("./pages/Tasks"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Profile = lazy(() => import("./pages/Profile"));
const Timer = lazy(() => import("./pages/Timer"));
const ScreenshotMonitoring = lazy(() => import("./pages/ScreenshotMonitoring"));

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState("landing");

  console.log("🎯 App State - Loading:", loading, "User:", !!user, user?.email);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || "landing";
      setCurrentPage(hash);
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange(); // Set initial page

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page only when specifically requested
  if (currentPage === "login") {
    return <Login />;
  }

  // Show landing page for non-authenticated users by default
  if (!user && currentPage !== "login") {
    return <Landing />;
  }

  // Render different pages based on current route with Suspense
  const renderPage = () => {
    switch (currentPage) {
      case "tasks":
        return <Tasks />;
      case "timer":
        return <Timer />;
      case "screenshot-monitoring":
        return <ScreenshotMonitoring />;
      case "analytics":
        return <Analytics />;
      case "profile":
        return <Profile />;
      case "landing":
        return <Landing />;
      case "dashboard":
      default:
        // For authenticated users, default to dashboard
        return <Home />;
    }
  };

  return (
    <Suspense
      fallback={
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <LoadingSpinner size="large" text="Loading..." />
        </div>
      }
    >
      {renderPage()}
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
        <ToastContainer />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
