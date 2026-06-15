import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';
import './index.css';

// Remove legacy mock-only localStorage (data now lives in MongoDB)
['ghms_store', 'ghms_version'].forEach((key) => localStorage.removeItem(key));

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <DataProvider>
          <AuthProvider>
            <App />
            <Toaster
              position="top-right"
              toastOptions={{
                className: 'dark:!bg-slate-800 dark:!text-white',
                duration: 3000,
              }}
            />
          </AuthProvider>
        </DataProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
