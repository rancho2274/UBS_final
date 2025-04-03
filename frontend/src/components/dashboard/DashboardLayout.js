// frontend/src/components/dashboard/DashboardLayout.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../utils/auth';

const DashboardLayout = ({ children, title, userType, userName }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-secondary-800 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">EdConnect</h1>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline">Welcome, {userName}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-300 text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-secondary-800 mb-6">{title} Dashboard</h2>
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;