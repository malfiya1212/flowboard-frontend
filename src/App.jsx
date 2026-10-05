import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { WorkspaceProvider } from './context/WorkspaceContext';
// 1. Import the AuthProvider
import { AuthProvider } from './context/AuthContext'; 

function App() {
  return (
    <BrowserRouter>
      {/* 2. Wrap your providers and routes with AuthProvider */}
      <AuthProvider>
        <WorkspaceProvider>
          <AppRoutes />
        </WorkspaceProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;