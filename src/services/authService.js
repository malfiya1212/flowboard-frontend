export const authService = {
    logout: (navigate) => {
        // Clear tokens & persistent role states
        localStorage.removeItem('token');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('flowboard_role');
        localStorage.removeItem('flowboard_user');

        // Clear any volatile session states
        sessionStorage.clear();

        // Redirect to public login with replaced history
        if (navigate) {
            navigate('/login', { replace: true });
        } else {
            window.location.href = '/login';
        }
    },
};