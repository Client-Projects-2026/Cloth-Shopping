import React, { Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { CatalogProvider } from './catalog';
import './styles.css';
import './boutique.css';

const Storefront = lazy(() => import('./App'));
const AdminApp = lazy(() => import('./admin/AdminApp'));
const isAdmin = window.location.pathname.replace(/\/$/, '') === '/admin';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Suspense
      fallback={
        <div className="app-loading" role="status">
          Loading…
        </div>
      }
    >
      {isAdmin ? (
        <AdminApp />
      ) : (
        <CatalogProvider>
          <Storefront />
        </CatalogProvider>
      )}
    </Suspense>
  </React.StrictMode>,
);
