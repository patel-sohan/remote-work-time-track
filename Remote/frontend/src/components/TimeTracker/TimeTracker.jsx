import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import useToast from "../../hooks/useToast";
import LoadingSpinner from "../Loading/LoadingSpinner";
import apiClient from "../../utils/api";
import "./TimeTracker.css";

const TimeTracker = ({ taskId = null, taskTitle = null }) => {
  const { user } = useAuth();
  const toast = useToast();

  const [activeEntry, setActiveEntry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [description, setDescription] = useState("");
  const [showDescription, setShowDescription] = useState(false);

  // Fetch active time entry on component mount
  useEffect(() => {
    fetchActiveEntry();
  }, []);

  // Update timer display every second
  useEffect(() => {
    let interval;
    if (activeEntry && activeEntry.isActive && !activeEntry.isPaused) {
      interval = setInterval(() => {
        const elapsed = Date.now() - new Date(activeEntry.startTime).getTime();
        const pausedTime = activeEntry.pausedDuration || 0;
        setCurrentTime(elapsed - pausedTime);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeEntry]);

  const fetchActiveEntry = useCallback(async () => {
    try {
      const response = await apiClient.getActiveTimeEntry();
      if (response.success && response.data.timeEntry) {
        setActiveEntry(response.data.timeEntry);
        // Calculate current elapsed time
        const elapsed =
          Date.now() - new Date(response.data.timeEntry.startTime).getTime();
        const pausedTime = response.data.timeEntry.pausedDuration || 0;
        setCurrentTime(elapsed - pausedTime);
      }
    } catch (error) {
      console.error("Failed to fetch active time entry:", error);
    }
  }, []);

  const startTimer = useCallback(async () => {
    if (activeEntry) {
      toast.warning("You already have an active timer. Please stop it first.");
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.startTimer(
        taskId,
        description,
        "manual"
      );

      if (response.success) {
        setActiveEntry(response.data.timeEntry);
        setCurrentTime(0);
        toast.success("Timer started successfully!");
        setShowDescription(false);
        setDescription("");
      }
    } catch (error) {
      toast.error("Failed to start timer");
      console.error("Start timer error:", error);
    } finally {
      setLoading(false);
    }
  }, [activeEntry, taskId, description, toast]);

  const stopTimer = async () => {
    if (!activeEntry) return;

    try {
      setLoading(true);
      const response = await apiClient.stopTimer(activeEntry._id);

      if (response.success) {
        const duration = formatDuration(currentTime);
        toast.success(`Timer stopped! Total time: ${duration}`);
        setActiveEntry(null);
        setCurrentTime(0);
      }
    } catch (error) {
      toast.error("Failed to stop timer");
      console.error("Stop timer error:", error);
    } finally {
      setLoading(false);
    }
  };

  const pauseTimer = async () => {
    if (!activeEntry || activeEntry.isPaused) return;

    try {
      setLoading(true);
      const response = await apiClient.pauseTimer(activeEntry._id);

      if (response.success) {
        setActiveEntry((prev) => ({ ...prev, isPaused: true }));
        toast.info("Timer paused");
      }
    } catch (error) {
      toast.error("Failed to pause timer");
      console.error("Pause timer error:", error);
    } finally {
      setLoading(false);
    }
  };

  const resumeTimer = async () => {
    if (!activeEntry || !activeEntry.isPaused) return;

    try {
      setLoading(true);
      const response = await apiClient.resumeTimer(activeEntry._id);

      if (response.success) {
        setActiveEntry((prev) => ({ ...prev, isPaused: false }));
        toast.info("Timer resumed");
      }
    } catch (error) {
      toast.error("Failed to resume timer");
      console.error("Resume timer error:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = useCallback((milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }, []);

  const getTimerStatus = () => {
    if (!activeEntry) return "stopped";
    if (activeEntry.isPaused) return "paused";
    return "running";
  };

  const status = getTimerStatus();

  return (
    <div className={`time-tracker ${status}`}>
      <div className="timer-display">
        <div className="timer-time">{formatDuration(currentTime)}</div>

        {activeEntry && (
          <div className="timer-info">
            <div className="timer-task">
              {activeEntry.task?.title || taskTitle || "General Time"}
            </div>
            {activeEntry.description && (
              <div className="timer-description">{activeEntry.description}</div>
            )}
          </div>
        )}
      </div>

      <div className="timer-controls">
        {!activeEntry ? (
          <>
            <button
              className="timer-btn start-btn"
              onClick={() => setShowDescription(!showDescription)}
              disabled={loading}
            >
              Start Timer
            </button>

            {showDescription && (
              <div className="description-input">
                <input
                  type="text"
                  placeholder="What are you working on? (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && startTimer()}
                  className="description-field"
                />
                <button
                  className="timer-btn confirm-btn"
                  onClick={startTimer}
                  disabled={loading}
                >
                  {loading ? <LoadingSpinner size="small" text="" /> : "Start"}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="active-controls">
            {activeEntry.isPaused ? (
              <button
                className="timer-btn resume-btn"
                onClick={resumeTimer}
                disabled={loading}
              >
                Resume
              </button>
            ) : (
              <button
                className="timer-btn pause-btn"
                onClick={pauseTimer}
                disabled={loading}
              >
                Pause
              </button>
            )}

            <button
              className="timer-btn stop-btn"
              onClick={stopTimer}
              disabled={loading}
            >
              Stop
            </button>
          </div>
        )}
      </div>

      {loading && (
        <div className="timer-loading">
          <LoadingSpinner size="small" text="" />
        </div>
      )}
    </div>
  );
};

export default TimeTracker;
