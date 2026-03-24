import { useState, useEffect, useRef, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import TimeTracker from "../components/TimeTracker/TimeTracker";
import LoadingSpinner from "../components/Loading/LoadingSpinner";
import useToast from "../hooks/useToast";
import apiClient from "../utils/api";
import "./Timer.css";

const Timer = () => {
  const { user } = useAuth();
  const toast = useToast();

  // Pomodoro Timer State
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState("work"); // 'work', 'shortBreak', 'longBreak'
  const [sessions, setSessions] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  // Time Tracking State
  const [timeEntries, setTimeEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  const modes = {
    work: {
      duration: 25 * 60,
      label: "Focus Time",
      icon: "🍅",
      color: "#667eea",
    },
    shortBreak: {
      duration: 5 * 60,
      label: "Short Break",
      icon: "☕",
      color: "#48bb78",
    },
    longBreak: {
      duration: 15 * 60,
      label: "Long Break",
      icon: "🛋️",
      color: "#ed8936",
    },
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            handleTimerComplete();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, timeLeft]);

  useEffect(() => {
    // Update document title with timer
    if (isActive && timeLeft > 0) {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      document.title = `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")} - ${modes[mode].label}`;
    } else {
      document.title = "Productivity Tracker";
    }

    return () => {
      document.title = "Productivity Tracker";
    };
  }, [timeLeft, isActive, mode]);

  // Fetch time tracking data
  useEffect(() => {
    fetchTimeEntries();
  }, [selectedPeriod]);

  const fetchTimeEntries = async () => {
    try {
      setLoading(true);

      // Calculate date range based on selected period
      const endDate = new Date();
      const startDate = new Date();

      switch (selectedPeriod) {
        case "today":
          startDate.setHours(0, 0, 0, 0);
          break;
        case "week":
          startDate.setDate(startDate.getDate() - 7);
          break;
        case "month":
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        default:
          startDate.setDate(startDate.getDate() - 7);
      }

      const response = await apiClient.getTimeEntries({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        limit: 20,
      });

      if (response.success) {
        setTimeEntries(response.data.timeEntries || []);
      }
    } catch (error) {
      console.error("Failed to fetch time entries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTimerComplete = () => {
    setIsActive(false);
    playNotificationSound();

    if (mode === "work") {
      setSessions((prev) => prev + 1);
      setTotalTime((prev) => prev + 25);

      // Auto-switch to break
      if ((sessions + 1) % 4 === 0) {
        switchMode("longBreak");
      } else {
        switchMode("shortBreak");
      }
    } else {
      // Auto-switch back to work after break
      switchMode("work");
    }

    // Show notification
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(`${modes[mode].label} Complete!`, {
        body: mode === "work" ? "Time for a break!" : "Ready to focus?",
        icon: "/favicon.ico",
      });
    }
  };

  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .catch((e) => console.log("Audio play failed:", e));
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setTimeLeft(modes[newMode].duration);
    setIsActive(false);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(modes[mode].duration);
  };

  const skipTimer = () => {
    setTimeLeft(0);
    handleTimerComplete();
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const getProgress = () => {
    const total = modes[mode].duration;
    return ((total - timeLeft) / total) * 100;
  };

  const requestNotificationPermission = () => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // Utility functions for time tracking
  const formatDuration = (milliseconds) => {
    if (!milliseconds) return "0h 0m";

    const totalMinutes = Math.floor(milliseconds / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Memoize time tracking statistics
  const timeStats = useMemo(() => {
    const totalDuration = timeEntries.reduce(
      (sum, entry) => sum + (entry.duration || 0),
      0
    );
    const todayEntries = timeEntries.filter((entry) => {
      const entryDate = new Date(entry.startTime).toDateString();
      const today = new Date().toDateString();
      return entryDate === today;
    });
    const todayDuration = todayEntries.reduce(
      (sum, entry) => sum + (entry.duration || 0),
      0
    );

    return {
      totalTime: formatDuration(totalDuration),
      todayTime: formatDuration(todayDuration),
      totalSessions: timeEntries.length,
      todaySessions: todayEntries.length,
    };
  }, [timeEntries]);

  return (
    <div className="timer-page">
      <Header />

      <main className="timer-content">
        <div className="timer-header">
          <h1>🍅 Pomodoro Timer</h1>
          <p>Stay focused and productive with the Pomodoro Technique</p>
        </div>

        <div className="timer-container">
          <div className="timer-modes">
            {Object.entries(modes).map(([key, modeData]) => (
              <button
                key={key}
                className={`mode-btn ${mode === key ? "active" : ""}`}
                onClick={() => switchMode(key)}
                disabled={isActive}
                style={{ "--mode-color": modeData.color }}
              >
                <span className="mode-icon">{modeData.icon}</span>
                {modeData.label}
              </button>
            ))}
          </div>

          <div className="timer-display">
            <div
              className="timer-circle"
              style={{
                "--progress": getProgress(),
                "--mode-color": modes[mode].color,
              }}
            >
              <div className="timer-inner">
                <div className="timer-time">{formatTime(timeLeft)}</div>
                <div className="timer-mode">{modes[mode].label}</div>
              </div>
            </div>
          </div>

          <div className="timer-controls">
            <button
              className={`control-btn primary ${isActive ? "pause" : "play"}`}
              onClick={toggleTimer}
              style={{ "--mode-color": modes[mode].color }}
            >
              {isActive ? (
                <>
                  <span className="btn-icon">⏸️</span>
                  Pause
                </>
              ) : (
                <>
                  <span className="btn-icon">▶️</span>
                  Start
                </>
              )}
            </button>

            <button
              className="control-btn secondary"
              onClick={resetTimer}
              disabled={timeLeft === modes[mode].duration}
            >
              <span className="btn-icon">🔄</span>
              Reset
            </button>

            <button
              className="control-btn secondary"
              onClick={skipTimer}
              disabled={!isActive && timeLeft === modes[mode].duration}
            >
              <span className="btn-icon">⏭️</span>
              Skip
            </button>
          </div>
        </div>

        <div className="timer-stats">
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <div className="stat-value">{sessions}</div>
              <div className="stat-label">Sessions Today</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏰</div>
            <div className="stat-content">
              <div className="stat-value">{totalTime}m</div>
              <div className="stat-label">Focus Time</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-content">
              <div className="stat-value">{Math.floor(sessions / 4)}</div>
              <div className="stat-label">Cycles Complete</div>
            </div>
          </div>
        </div>

        {/* Manual Time Tracking Section */}
        <div className="time-tracking-section">
          <h2>Manual Time Tracking</h2>
          <p>Track time for specific tasks and projects</p>
          <TimeTracker />
        </div>

        {/* Time Tracking Statistics */}
        <div className="tracking-stats">
          <div className="section-header">
            <h2>Time Tracking Summary</h2>
            <div className="period-selector">
              <button
                className={`period-btn ${
                  selectedPeriod === "today" ? "active" : ""
                }`}
                onClick={() => setSelectedPeriod("today")}
              >
                Today
              </button>
              <button
                className={`period-btn ${
                  selectedPeriod === "week" ? "active" : ""
                }`}
                onClick={() => setSelectedPeriod("week")}
              >
                Week
              </button>
              <button
                className={`period-btn ${
                  selectedPeriod === "month" ? "active" : ""
                }`}
                onClick={() => setSelectedPeriod("month")}
              >
                Month
              </button>
            </div>
          </div>

          <div className="tracking-summary">
            <div className="summary-card">
              <div className="card-content">
                <h3>Today's Time</h3>
                <p className="card-value">{timeStats.todayTime}</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="card-content">
                <h3>Total Time</h3>
                <p className="card-value">{timeStats.totalTime}</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="card-content">
                <h3>Today's Sessions</h3>
                <p className="card-value">{timeStats.todaySessions}</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="card-content">
                <h3>Total Sessions</h3>
                <p className="card-value">{timeStats.totalSessions}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Time Entries */}
        <div className="recent-entries">
          <h2>Recent Time Entries</h2>

          {loading ? (
            <div className="loading-container">
              <LoadingSpinner size="medium" text="Loading entries..." />
            </div>
          ) : timeEntries.length === 0 ? (
            <div className="empty-state">
              <h3>No time entries yet</h3>
              <p>Start tracking your time to see entries here!</p>
            </div>
          ) : (
            <div className="entries-list">
              {timeEntries.slice(0, 5).map((entry) => (
                <div key={entry._id} className="entry-card">
                  <div className="entry-header">
                    <div className="entry-task">
                      {entry.task?.title || "General Time"}
                    </div>
                    <div className="entry-duration">
                      {formatDuration(entry.duration)}
                    </div>
                  </div>

                  {entry.description && (
                    <div className="entry-description">{entry.description}</div>
                  )}

                  <div className="entry-footer">
                    <div className="entry-time">
                      {formatDate(entry.startTime)} -{" "}
                      {entry.endTime ? formatDate(entry.endTime) : "Active"}
                    </div>
                    <div className="entry-type">
                      <span className={`type-badge ${entry.type}`}>
                        {entry.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="timer-tips">
          <h3>💡 Pomodoro Tips</h3>
          <div className="tips-grid">
            <div className="tip-card">
              <div className="tip-icon">🎯</div>
              <div className="tip-content">
                <h4>Stay Focused</h4>
                <p>
                  During focus time, avoid all distractions and work on a single
                  task.
                </p>
              </div>
            </div>

            <div className="tip-card">
              <div className="tip-icon">☕</div>
              <div className="tip-content">
                <h4>Take Real Breaks</h4>
                <p>
                  Step away from your desk, stretch, or do something completely
                  different.
                </p>
              </div>
            </div>

            <div className="tip-card">
              <div className="tip-icon">📝</div>
              <div className="tip-content">
                <h4>Plan Your Tasks</h4>
                <p>
                  Before starting, decide what you want to accomplish in each
                  session.
                </p>
              </div>
            </div>

            <div className="tip-card">
              <div className="tip-icon">🔄</div>
              <div className="tip-content">
                <h4>Stick to the Rhythm</h4>
                <p>
                  Complete the full cycle: 4 pomodoros, then take a longer
                  break.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Audio element for notification sound */}
      <audio ref={audioRef} preload="auto">
        <source
          src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
          type="audio/wav"
        />
      </audio>
    </div>
  );
};

export default Timer;
