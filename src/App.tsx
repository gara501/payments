import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DatabaseProvider, DatabaseLoadingScreen, DatabaseErrorScreen, useDatabaseContext } from './db/DatabaseProvider';
import { seedDatabase } from './db/seedData';
import { Dashboard, MetricsPage, ToastContainer, NavigationHeader, Breadcrumb } from './components';
import { ToastProvider, useToast } from './hooks/useToast';

function AppContent() {
  const { isInitialized, isLoading, error, retry, adapter } = useDatabaseContext();
  const { toasts, removeToast } = useToast();

  useEffect(() => {
    if (isInitialized && adapter) {
      // Seed database with sample data
      seedDatabase(adapter);
    }
  }, [isInitialized, adapter]);

  if (isLoading) {
    return <DatabaseLoadingScreen />;
  }

  if (error) {
    return <DatabaseErrorScreen error={error} onRetry={retry} />;
  }

  if (!isInitialized) {
    return <DatabaseLoadingScreen />;
  }

  return (
    <>
      <NavigationHeader />
      <Breadcrumb />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/metrics" element={<MetricsPage />} />
      </Routes>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
}

function App() {
  // Use base path from Vite config for GitHub Pages deployment
  const basename = import.meta.env.BASE_URL;
  
  return (
    <BrowserRouter basename={basename}>
      <DatabaseProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </DatabaseProvider>
    </BrowserRouter>
  );
}

export default App
