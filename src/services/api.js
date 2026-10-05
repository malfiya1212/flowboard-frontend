import axios from 'axios';

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// 1. Request Interceptor: Attach Access Token
api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('flowboard_access_token');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 2. Response Interceptor: Handle Token Expiration (401)
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

        if (error.response?.status === 401 && !originalRequest._retry) {
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
                handleSessionExpiration();
                return Promise.reject(error);
            }

            try {
                const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                    refreshToken,
                });

                const newAccessToken = data.accessToken;
                localStorage.setItem('flowboard_access_token', newAccessToken);

                if (data.refreshToken) {
                    localStorage.setItem('flowboard_refresh_token', data.refreshToken);
                }

                api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                processQueue(null, newAccessToken);
                return api(originalRequest);
            } catch (refreshErr) {
                processQueue(refreshErr, null);
                handleSessionExpiration();
                return Promise.reject(refreshErr);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

function handleSessionExpiration() {
    const isAdmin = localStorage.getItem('flowboard_role') === 'Admin';
    localStorage.removeItem('flowboard_access_token');
    localStorage.removeItem('flowboard_refresh_token');
    localStorage.removeItem('flowboard_user');
    localStorage.removeItem('flowboard_role');
    localStorage.removeItem('isAuthenticated');

    window.location.href = isAdmin ? '/admin/login?session=expired' : '/login?session=expired';
}

// Export both named and default so all import styles work
export { api };
export default api;