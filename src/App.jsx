import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { WorkspaceProvider } from './context/WorkspaceContext';

function App() {
  return (
    <BrowserRouter>
      <WorkspaceProvider>
        <AppRoutes />
      </WorkspaceProvider>
    </BrowserRouter>
  );
}

export default App