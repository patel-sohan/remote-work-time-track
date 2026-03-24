const API_BASE_URL = import.meta.env.VITE_API_URL;

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Cache management methods
  getCacheKey(url, options = {}) {
    return `${url}_${JSON.stringify(options)}`;
  }

  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clearCache() {
    this.cache.clear();
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    // Check cache for GET requests
    if (!options.method || options.method === "GET") {
      const cacheKey = this.getCacheKey(endpoint, options);
      const cachedData = this.getFromCache(cacheKey);
      if (cachedData) {
        return cachedData;
      }
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      // Cache successful GET requests
      if (!options.method || options.method === "GET") {
        const cacheKey = this.getCacheKey(endpoint, options);
        this.setCache(cacheKey, data);
      }

      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email, password) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async getProfile() {
    return this.request("/auth/profile");
  }

  async updateProfile(userData) {
    return this.request("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  async changePassword(currentPassword, newPassword) {
    return this.request("/auth/change-password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  // Task endpoints
  async getTasks(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/tasks${queryString ? `?${queryString}` : ""}`);
  }

  async getTask(taskId) {
    return this.request(`/tasks/${taskId}`);
  }

  async createTask(taskData) {
    return this.request("/tasks", {
      method: "POST",
      body: JSON.stringify(taskData),
    });
  }

  async updateTask(taskId, taskData) {
    return this.request(`/tasks/${taskId}`, {
      method: "PUT",
      body: JSON.stringify(taskData),
    });
  }

  async deleteTask(taskId) {
    return this.request(`/tasks/${taskId}`, {
      method: "DELETE",
    });
  }

  async addTaskComment(taskId, content) {
    return this.request(`/tasks/${taskId}/comments`, {
      method: "POST",
      body: JSON.stringify({ content }),
    });
  }

  // Time tracking endpoints
  async getTimeEntries(params = {}) {
    const queryParams = new URLSearchParams(params);
    return this.request(`/time-entries?${queryParams}`);
  }

  async getActiveTimeEntry() {
    return this.request("/time-entries/active");
  }

  async startTimer(taskId, description = "", type = "manual") {
    return this.request("/time-entries/start", {
      method: "POST",
      body: JSON.stringify({ taskId, description, type }),
    });
  }

  async stopTimer(entryId) {
    return this.request(`/time-entries/${entryId}/stop`, {
      method: "PUT",
    });
  }

  async pauseTimer(entryId) {
    return this.request(`/time-entries/${entryId}/pause`, {
      method: "PUT",
    });
  }

  async resumeTimer(entryId) {
    return this.request(`/time-entries/${entryId}/resume`, {
      method: "PUT",
    });
  }

  async getTimeSummary(startDate, endDate) {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate.toISOString());
    if (endDate) params.append("endDate", endDate.toISOString());
    return this.request(`/time-entries/summary?${params}`);
  }

  // Analytics endpoints (to be implemented)
  async getProductivityMetrics(startDate, endDate) {
    const params = new URLSearchParams({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
    return this.request(`/analytics/productivity?${params}`);
  }
}

export const apiClient = new ApiClient();
export default apiClient;
