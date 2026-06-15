import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import OfflineBanner from './OfflineBanner';
import { NAV_ITEMS } from '../../utils/constants';

const titles = Object.fromEntries(NAV_ITEMS.map((n) => [n.path, n.label]));

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const title = titles[pathname] || 'Dashboard';

  return (
    <div className="min-h-screen lg:flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col lg:pl-64">
        <Navbar onMenuClick={() => setSidebarOpen(true)} title={title} />
        <main className="flex-1 p-4 lg:p-6">
          <OfflineBanner />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
