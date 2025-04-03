// frontend/src/components/dashboard/VolunteerDashboard.js
import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import DashboardLayout from './DashboardLayout';
import { getUserInfo } from '../../utils/auth';
import VideoConferencing from './VideoConferencing';
import FeedbackList from '../feedback/FeedbackList';
// import SyllabusList from './SyllabusList';

const VolunteerDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState([]);
const [averageRating, setAverageRating] = useState(0);
const [loadingFeedback, setLoadingFeedback] = useState(false);
 
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    qualification: '',
    skills: [],
    email: '',
  });

  const userInfo = getUserInfo();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/users/profile');
        setProfile(data);
        setFormData({
          name: data.profile?.name || '',
          qualification: data.profile?.qualification || '',
          skills: data.profile?.skills || [],
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const fetchFeedback = async () => {
    try {
      setLoadingFeedback(true);
      const { data } = await api.get(`/feedback/volunteer/${userInfo.id}`);
      setFeedback(data.feedback);
      setAverageRating(data.averageRating);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setLoadingFeedback(false);
    }
  };
   
  // Call this function in useEffect
  useEffect(() => {
    // ... existing code
    fetchFeedback();
  }, []);
   
  const handleSkillsChange = (e) => {
    const options = e.target.options;
    const selectedSkills = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedSkills.push(options[i].value);
      }
    }
    setFormData({
      ...formData,
      skills: selectedSkills,
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

  // Mock data for teaching opportunities and sessions
  const opportunities = [
    { id: 1, school: 'Zilla Parishad School, Pune', subject: 'Mathematics', class: 'Class 10', topic: 'Algebra', date: 'April 10, 2025' },
    { id: 2, school: 'Government School, Mumbai', subject: 'Science', class: 'Class 9', topic: 'Physics', date: 'April 15, 2025' },
    { id: 3, school: 'Municipal School, Nagpur', subject: 'English', class: 'Class 8', topic: 'Grammar', date: 'April 20, 2025' },
  ];

  const sessions = [
    { id: 1, school: 'Zilla Parishad School, Pune', subject: 'Mathematics', class: 'Class 10', topic: 'Geometry', date: 'March 25, 2025', status: 'Completed' },
    { id: 2, school: 'Municipal School, Nagpur', subject: 'Mathematics', class: 'Class 9', topic: 'Trigonometry', date: 'April 5, 2025', status: 'Upcoming' },
  ];

  const skillOptions = [
    'Mathematics', 'Science', 'Physics', 'Chemistry', 'Biology',
    'English', 'Hindi', 'Social Studies', 'History', 'Geography',
    'Computer Science', 'Art', 'Music', 'Physical Education'
  ];

  if (loading && !profile) return (
    <DashboardLayout title="Volunteer" userType="volunteer" userName={userInfo?.name || "Volunteer"}>
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout title="Volunteer" userType="volunteer" userName={profile?.profile?.name || userInfo?.name || "Volunteer"}>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex flex-wrap -mb-px">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`${
              activeTab === 'dashboard'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-4 md:px-6 border-b-2 font-medium text-sm`}
          >
            Dashboard
          </button>
          <button
  onClick={() => setActiveTab('feedback')}
  className={`${
    activeTab === 'feedback'
      ? 'border-primary-500 text-primary-600'
      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
  } whitespace-nowrap py-4 px-4 md:px-6 border-b-2 font-medium text-sm`}
>
  Feedback
</button>
 
          <button
            onClick={() => setActiveTab('opportunities')}
            className={`${
              activeTab === 'opportunities'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-4 md:px-6 border-b-2 font-medium text-sm`}
          >
            Opportunities
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
            onClick={() => setActiveTab('sessions')}
            className={`${
              activeTab === 'sessions'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-4 md:px-6 border-b-2 font-medium text-sm`}
          >
            My Sessions
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`${
              activeTab === 'profile'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-4 md:px-6 border-b-2 font-medium text-sm`}
          >
            Profile
          </button>
        </nav>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg shadow-sm border border-blue-100">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Available Opportunities</h3>
              <p className="text-blue-600 text-2xl font-bold">{opportunities.length}</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg shadow-sm border border-green-100">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Upcoming Sessions</h3>
              <p className="text-green-600 text-2xl font-bold">
                {sessions.filter(s => s.status === 'Upcoming').length}
              </p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg shadow-sm border border-purple-100">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Completed Sessions</h3>
              <p className="text-purple-600 text-2xl font-bold">
                {sessions.filter(s => s.status === 'Completed').length}
              </p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-secondary-800 mb-4">Upcoming Sessions</h3>
          {sessions.filter(s => s.status === 'Upcoming').length > 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
              {sessions.filter(s => s.status === 'Upcoming').map(session => (
                <div key={session.id} className="p-4">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{session.subject}: {session.topic}</h4>
                      <p className="text-sm text-gray-600 mt-1">{session.school} - {session.class}</p>
                      <p className="text-sm text-gray-500 mt-1">Date: {session.date}</p>
                    </div>
                    <div>
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        {session.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md transition duration-300 text-xs">
                      View Details
                    </button>
                    <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md transition duration-300 text-xs">
                      Cancel Session
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <p className="text-gray-500">No upcoming sessions. Browse opportunities to find teaching sessions.</p>
            </div>
          )}

          
        </div>
      )}
      {activeTab === 'liveClasses' && (
  <div>
    <VideoConferencing userType="volunteer" />
  </div>
)}

      {/* Opportunities Tab */}
      {activeTab === 'opportunities' && (
        <div>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-secondary-800 mb-4">Available Teaching Opportunities</h3>
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <select className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                      <option value="">All Subjects</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Science">Science</option>
                      <option value="English">English</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Class
                    </label>
                    <select className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                      <option value="">All Classes</option>
                      <option value="Class 10">Class 10</option>
                      <option value="Class 9">Class 9</option>
                      <option value="Class 8">Class 8</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <select className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                      <option value="">All Locations</option>
                      <option value="Pune">Pune</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Nagpur">Nagpur</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition duration-300 text-sm">
                      Search
                    </button>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        School
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Class
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Topic
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {opportunities.map(opportunity => (
                      <tr key={opportunity.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {opportunity.school}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {opportunity.subject}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {opportunity.class}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {opportunity.topic}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {opportunity.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded-md transition duration-300 text-xs">
                            Apply
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'feedback' && (
  <div>
    <h3 className="text-xl font-semibold text-secondary-800 mb-6">Student Feedback</h3>
 
    {loadingFeedback ? (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    ) : (
      <FeedbackList feedback={feedback} averageRating={averageRating} />
    )}
  </div>
)}

      {/* Sessions Tab */}
      {activeTab === 'sessions' && (
        <div>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-secondary-800 mb-4">My Teaching Sessions</h3>
            <div className="grid grid-cols-1 gap-4">
              {sessions.map(session => (
                <div key={session.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{session.subject}: {session.topic}</h4>
                      <p className="text-sm text-gray-600 mt-1">{session.school} - {session.class}</p>
                      <p className="text-sm text-gray-500 mt-1">Date: {session.date}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded ${
                      session.status === 'Completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {session.status}
                    </span>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    {session.status === 'Upcoming' ? (
                      <>
                        <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md transition duration-300 text-xs">
                          View Details
                        </button>
                        <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md transition duration-300 text-xs">
                          Cancel Session
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded-md transition duration-300 text-xs">
                          View Details
                        </button>
                        <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-md transition duration-300 text-xs">
                          Upload Materials
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
              
              {sessions.length === 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                  <p className="text-gray-500">You don't have any sessions yet. Browse opportunities to find teaching sessions.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-secondary-800">Volunteer Information</h3>
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
                  <label htmlFor="qualification" className="block text-sm font-medium text-gray-700 mb-1">
                    Qualification
                  </label>
                  <input
                    type="text"
                    id="qualification"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
                    Skills (Hold Ctrl/Cmd to select multiple)
                  </label>
                  <select
                    id="skills"
                    name="skills"
                    multiple
                    value={formData.skills}
                    onChange={handleSkillsChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                  >
                    {skillOptions.map((skill) => (
                      <option key={skill} value={skill}>
                        {skill}
                      </option>
                    ))}
                  </select>
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
                <p className="text-sm font-medium text-gray-500">Qualification</p>
                <p className="text-base font-medium text-gray-900 mt-1">{profile?.profile?.qualification}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm font-medium text-gray-500">Skills</p>
                <p className="text-base font-medium text-gray-900 mt-1">
                  {profile?.profile?.skills?.join(', ') || 'None specified'}
                </p>
              </div>
            </div>
          )}
          
          
        </div>
      )}
    </DashboardLayout>
  );
};

export default VolunteerDashboard;