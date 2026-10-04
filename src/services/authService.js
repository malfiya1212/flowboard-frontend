import { api } from './api';

export const authService = {
    // Admin Login against backend endpoint
    adminLogin: async({ email, password, twoFactorCode }) => {
        const response = await api.post('/admin/auth/login', {
            email,
            password,
            twoFactorCode: twoFactorCode || undefined,
        });
        return response.data; // Expected: { user, accessToken, refreshToken, role: 'Admin' }
    },

    // Invalidate tokens and session on the server
    logout: async() => {
        try {
            const refreshToken = localStorage.getItem('flowboard_refresh_token');
            await api.post('/auth/logout', { refreshToken });
        } catch (err) {
            console.error('Logout error on server:', err);
        } finally {
            localStorage.removeItem('flowboard_access_token');
            localStorage.removeItem('flowboard_refresh_token');
            localStorage.removeItem('flowboard_role');
            localStorage.removeItem('flowboard_user');
            localStorage.removeItem('isAuthenticated');
            sessionStorage.clear();
        }
    },

    // Active Sessions Management
    getActiveSessions: async() => {
        const response = await api.get('/admin/security/sessions');
        return response.data; // Expected: array of session records
    },

    revokeSession: async(sessionId) => {
        const response = await api.delete(`/admin/security/sessions/${sessionId}`);
        return response.data;
    },

    revokeAllOtherSessions: async() => {
        const response = await api.post('/admin/security/sessions/revoke-others');
        return response.data;
    },
};