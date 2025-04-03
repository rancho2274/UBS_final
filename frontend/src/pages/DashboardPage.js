// frontend/src/pages/DashboardPage.js
import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { getUserType, isAuthenticated } from '../utils/auth';

// Dashboard Components
import StudentDashboard from '../components/dashboard/StudentDashboard';
import SchoolDashboard from '../components/dashboard/SchoolDashboard';
import VolunteerDashboard from '../components/dashboard/VolunteerDashboard';

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const userType = getUserType();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    // Check if userType exists
    if (!userType) {
      navigate('/login');
      return;
    }
    
    setLoading(false);
  }, [userType, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Redirect to appropriate dashboard based on user type
  const getRedirectPath = () => {
    switch (userType) {
      case 'student':
        return '/dashboard/student';
      case 'school':
        return '/dashboard/school';
      case 'volunteer':
        return '/dashboard/volunteer';
      default:
        return '/login';
    }
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to={getRedirectPath()} />} />
      <Route path="/student" element={<StudentDashboard />} />
      <Route path="/school" element={<SchoolDashboard />} />
      <Route path="/volunteer" element={<VolunteerDashboard />} />
      <Route path="*" element={<Navigate to={getRedirectPath()} />} />
    </Routes>
  );
};

export default DashboardPage;