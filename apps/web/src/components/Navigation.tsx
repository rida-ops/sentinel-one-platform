'use client';

import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';

export default function Navigation() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-2xl font-bold">SENTINEL ONE</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">
              {user?.firstName} {user?.lastName} ({user?.role})
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
