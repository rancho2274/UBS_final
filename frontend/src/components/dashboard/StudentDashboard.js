// frontend/src/components/dashboard/StudentDashboard.js
import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import DashboardLayout from './DashboardLayout';
import { getUserInfo } from '../../utils/auth';
import StudentChatbot from '../chatbot/StudentChatbot';
import VideoConferencing from './VideoConferencing';
import FeedbackForm from '../feedback/FeedbackForm';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    school: '',
    class: '',
    rollNumber: '',
    email: '',
  });
  
  const [completedSessions, setCompletedSessions] = useState([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState({
    show: false,
    sessionId: null,
    volunteerId: null
  });
  const [timetable, setTimetable] = useState([]);
  const [studentStats, setStudentStats] = useState({
    attendance: '0%',
    assignments: 0
  });

  const userInfo = getUserInfo();

  const fetchStudentSpecificData = () => {
    if (!profile || !profile.email) return;
   
    // Create a lookup object with specific data for each student
    const studentData = {
      'arjun.kumar@ryanschool.com': {
        attendance: '92%',
        assignments: 3,
        completedSessions: [
          {
            id: 1,
            subject: 'Mathematics',
            topic: 'Calculus',
            date: 'March 28, 2025',
            volunteerName: 'Dr. Sunil Kumar',
            volunteerId: 1,
            hasFeedback: true,
            feedback: 'Great understanding of concepts'
          },
          {
            id: 2,
            subject: 'Physics',
            topic: 'Wave Mechanics',
            date: 'March 20, 2025',
            volunteerName: 'Prof. Neha Gupta',
            volunteerId: 2,
            hasFeedback: false
          }
        ],
        timetable: [
          { id: 1, subject: 'Mathematics', day: 'Monday', time: '10:00 AM - 11:00 AM', teacher: 'Dr. Sunil Kumar' },
          { id: 2, subject: 'Physics', day: 'Wednesday', time: '11:00 AM - 12:00 PM', teacher: 'Prof. Neha Gupta' },
          { id: 3, subject: 'Chemistry', day: 'Friday', time: '09:00 AM - 10:00 AM', teacher: 'Dr. Anil Kapoor' }
        ]
      },
      'priya.patel@ryanschool.com': {
        attendance: '85%',
        assignments: 2,
        completedSessions: [
          {
            id: 1,
            subject: 'Biology',
            topic: 'Cell Structure',
            date: 'March 25, 2025',
            volunteerName: 'Dr. Meena Iyer',
            volunteerId: 3,
            hasFeedback: false
          }
        ],
        timetable: [
          { id: 1, subject: 'Biology', day: 'Tuesday', time: '09:00 AM - 10:00 AM', teacher: 'Dr. Meena Iyer' },
          { id: 2, subject: 'English', day: 'Thursday', time: '10:00 AM - 11:00 AM', teacher: 'Ms. Anjali Sharma' }
        ]
      },
      'amit.sharma@dpsschool.com': {
        attendance: '78%',
        assignments: 4,
        completedSessions: [
          {
            id: 1,
            subject: 'Computer Science',
            topic: 'Algorithms',
            date: 'March 22, 2025',
            volunteerName: 'Mr. Rajesh Kumar',
            volunteerId: 4,
            hasFeedback: true,
            feedback: 'Needs to practice more examples'
          },
          {
            id: 2,
            subject: 'Mathematics',
            topic: 'Trigonometry',
            date: 'March 15, 2025',
            volunteerName: 'Dr. Sunil Kumar',
            volunteerId: 1,
            hasFeedback: true,
            feedback: 'Good grasp of basic concepts'
          }
        ],
        timetable: [
          { id: 1, subject: 'Computer Science', day: 'Monday', time: '12:00 PM - 01:00 PM', teacher: 'Mr. Rajesh Kumar' },
          { id: 2, subject: 'Mathematics', day: 'Wednesday', time: '09:00 AM - 10:00 AM', teacher: 'Dr. Sunil Kumar' },
          { id: 3, subject: 'Physics', day: 'Friday', time: '10:00 AM - 11:00 AM', teacher: 'Dr. Rahul Verma' }
        ]
      },
      'sneha.reddy@dpsschool.com': {
        attendance: '95%',
        assignments: 1,
        completedSessions: [],
        timetable: [
          { id: 1, subject: 'English', day: 'Tuesday', time: '11:00 AM - 12:00 PM', teacher: 'Ms. Anjali Sharma' }
        ]
      },
      'rohit.verma@pzpschool.com': {
        attendance: '88%',
        assignments: 5,
        completedSessions: [
          {
            id: 1,
            subject: 'History',
            topic: 'Modern India',
            date: 'March 27, 2025',
            volunteerName: 'Mr. Vikram Singh',
            volunteerId: 5,
            hasFeedback: false
          },
          {
            id: 2,
            subject: 'Geography',
            topic: 'Indian Geography',
            date: 'March 20, 2025',
            volunteerName: 'Ms. Priya Mehta',
            volunteerId: 6,
            hasFeedback: true,
            feedback: 'Excellent participation in class'
          },
          {
            id: 3,
            subject: 'Economics',
            topic: 'Microeconomics',
            date: 'March 15, 2025',
            volunteerName: 'Dr. Aniket Joshi',
            volunteerId: 7,
            hasFeedback: false
          }
        ],
        timetable: [
          { id: 1, subject: 'History', day: 'Monday', time: '09:00 AM - 10:00 AM', teacher: 'Mr. Vikram Singh' },
          { id: 2, subject: 'Geography', day: 'Wednesday', time: '10:00 AM - 11:00 AM', teacher: 'Ms. Priya Mehta' },
          { id: 3, subject: 'Economics', day: 'Friday', time: '11:00 AM - 12:00 PM', teacher: 'Dr. Aniket Joshi' },
          { id: 4, subject: 'Political Science', day: 'Thursday', time: '09:00 AM - 10:00 AM', teacher: 'Dr. Sunita Rao' }
        ]
      }
    };
   
    // Get the specific data for the logged-in student
    const studentSpecificData = studentData[profile.email] || {
      attendance: '75%',
      assignments: 2,
      completedSessions: [],
      timetable: []
    };
   
    // Update the state with this student's specific data
    setTimetable(studentSpecificData.timetable);
    setCompletedSessions(studentSpecificData.completedSessions);
   
    // Update other student-specific stats
    setStudentStats({
      attendance: studentSpecificData.attendance,
      assignments: studentSpecificData.assignments
    });
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/users/profile');
        setProfile(data);
        setFormData({
          name: data.profile?.name || '',
          school: data.profile?.school || '',
          class: data.profile?.class || '',
          rollNumber: data.profile?.rollNumber || '',
          email: data.email || '',
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile && profile.email) {
      fetchStudentSpecificData();
    }
  }, [profile]);
  
  const fetchCompletedSessions = async () => {
    try {
      // In the future, this would make an API call to get real data
      // For now, we're just using the mock data
      console.log('Fetching completed sessions...');
      // If you had a real API, you'd call it here
    } catch (error) {
      console.error('Error fetching completed sessions:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await api.put('/users/profile', formData);
      setProfile(data);
      setEditMode(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) return (
    <DashboardLayout title="Student" userType="student" userName={userInfo?.name || "Student"}>
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout title="Student" userType="student" userName={profile?.profile?.name || userInfo?.name || "Student"}>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`${
              activeTab === 'dashboard'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('liveClasses')}
            className={`${
              activeTab === 'liveClasses'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-4 md:px-6 border-b-2 font-medium text-sm`}
          >
            Live Classes
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`${
              activeTab === 'profile'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('chatbot')}
            className={`${
              activeTab === 'chatbot'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
          >
            Study Assistant
          </button>
        </nav>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg shadow-sm border border-blue-100">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Upcoming Classes</h3>
              <p className="text-blue-600 text-2xl font-bold">{timetable.length}</p>
              {timetable.length === 0 && (
                <p className="text-xs text-blue-500 mt-1">No classes scheduled yet</p>
              )}
            </div>
            <div className="bg-green-50 p-6 rounded-lg shadow-sm border border-green-100">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Assignments</h3>
              <p className="text-green-600 text-2xl font-bold">{studentStats.assignments}</p>
              {studentStats.assignments === 0 && (
                <p className="text-xs text-green-500 mt-1">No assignments yet</p>
              )}
            </div>
            <div className="bg-purple-50 p-6 rounded-lg shadow-sm border border-purple-100">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Attendance</h3>
              <p className="text-purple-600 text-2xl font-bold">{studentStats.attendance}</p>
              {studentStats.attendance === '0%' && (
                <p className="text-xs text-purple-500 mt-1">Attendance tracking will begin with your first class</p>
              )}
            </div>
          </div>

          <h3 className="text-xl font-semibold text-secondary-800 mb-4">Class Timetable</h3>
          {timetable.length > 0 ? (
            <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Day
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Teacher
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {timetable.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.subject}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.day}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.teacher}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <p className="text-gray-500">No classes have been scheduled yet. Your timetable will appear here once classes are assigned to you.</p>
            </div>
          )}

          <h3 className="text-xl font-semibold text-secondary-800 mb-4 mt-8">Upcoming Assignments</h3>
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <p className="text-gray-500">No assignments due. New assignments will appear here.</p>
          </div>

          <h3 className="text-xl font-semibold text-secondary-800 mb-4 mt-8">Completed Sessions</h3>
          {completedSessions.length > 0 ? (
            <div className="space-y-4">
              {completedSessions.map((session) => (
                <div key={session.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{session.subject}: {session.topic}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Volunteer: {session.volunteerName} | Date: {session.date}
                      </p>
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                      Completed
                    </span>
                  </div>
                  <div className="mt-4">
                    {session.hasFeedback ? (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Your feedback:</span> {session.feedback}
                      </div>
                    ) : (
                      <button 
                        onClick={() => setShowFeedbackModal({ show: true, sessionId: session.id, volunteerId: session.volunteerId })}
                        className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                      >
                        Provide Feedback
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <p className="text-gray-500">You haven't completed any sessions yet. Once you attend your first session with a volunteer, it will appear here.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'liveClasses' && (
        <div>
          <VideoConferencing userType="student" />
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-secondary-800">Student Information</h3>
            <button
              onClick={() => setEditMode(!editMode)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition duration-300 text-sm"
            >
              {editMode ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {editMode ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-1">
                    School Name
                  </label>
                  <input
                    type="text"
                    id="school"
                    name="school"
                    value={formData.school}
                    onChange={handleChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-1">
                    Class/Grade
                  </label>
                  <input
                    type="text"
                    id="class"
                    name="class"
                    value={formData.class}
                    onChange={handleChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Roll Number
                  </label>
                  <input
                    type="text"
                    id="rollNumber"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition duration-300 text-sm"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm font-medium text-gray-500">Full Name</p>
                <p className="text-base font-medium text-gray-900 mt-1">{profile?.profile?.name}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm font-medium text-gray-500">Email Address</p>
                <p className="text-base font-medium text-gray-900 mt-1">{profile?.email}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm font-medium text-gray-500">School Name</p>
                <p className="text-base font-medium text-gray-900 mt-1">{profile?.profile?.school}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm font-medium text-gray-500">Class/Grade</p>
                <p className="text-base font-medium text-gray-900 mt-1">{profile?.profile?.class}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm font-medium text-gray-500">Roll Number</p>
                <p className="text-base font-medium text-gray-900 mt-1">{profile?.profile?.rollNumber}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {showFeedbackModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Provide Feedback</h3>
                <button 
                  onClick={() => setShowFeedbackModal({ show: false, sessionId: null, volunteerId: null })}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
       
              <FeedbackForm 
                volunteerId={showFeedbackModal.volunteerId} 
                sessionId={showFeedbackModal.sessionId}
                onSubmitSuccess={() => {
                  setShowFeedbackModal({ show: false, sessionId: null, volunteerId: null });
                  // Optionally refresh completed sessions data
                  fetchCompletedSessions();
                }} 
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Chatbot Tab */}
      {activeTab === 'chatbot' && (
        <div>
          <h3 className="text-xl font-semibold text-secondary-800 mb-4">Study Assistant</h3>
          <p className="text-gray-600 mb-6">
            Upload PDF study materials and ask questions to enhance your learning. 
            The assistant will help you understand concepts better.
          </p>
          <StudentChatbot />
        </div>
      )}
    </DashboardLayout>
  );
};

export default StudentDashboard;