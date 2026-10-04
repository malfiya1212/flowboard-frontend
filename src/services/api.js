import axios from 'axios';

const API_BASE_URL =
    import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Needed if refresh tokens are stored in HttpOnly cookies
});

// Request Interceptor: Attach current access token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('flowboard_access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Expiration (401) & Silent Refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async(error) => {
        const originalRequest = error.config;

        // Detect expired session (401) and prevent infinite loop
        if (error.response ? .status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem('flowboard_refresh_token');

            if (!refreshToken) {
                handleSessionExpired();
                return Promise.reject(error);
            }

            try {
                const { data } = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
                    refreshToken,
                });

                const newAccessToken = data.accessToken;
                localStorage.setItem('flowboard_access_token', newAccessToken);

                if (data.refreshToken) {
                    localStorage.setItem('flowboard_refresh_token', data.refreshToken);
                }

                api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
                processQueue(null, newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                handleSessionExpired();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

function handleSessionExpired() {
    localStorage.removeItem('flowboard_access_token');
    localStorage.removeItem('flowboard_refresh_token');
    localStorage.removeItem('flowboard_role');
    localStorage.removeItem('flowboard_user');
    localStorage.removeItem('isAuthenticated');

    if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login?session_expired=true';
    } else {
        window.location.href = '/login?session_expired=true';
    }
}