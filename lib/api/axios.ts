// lib/api/axios.ts
import axios from "axios";

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1",
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor — injects auth token
apiClient.interceptors.request.use(
    (config) => {
        // In production: get token from next-auth session
        // For now: mock token
        const token = "mock-jwt-token";
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor — handles errors globally
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Redirect to login when Keycloak is integrated
            console.error("Unauthorized — redirect to login");
        }
        if (error.response?.status === 403) {
            console.error("Forbidden — insufficient permissions");
        }
        return Promise.reject(error);
    }
);

export default apiClient;