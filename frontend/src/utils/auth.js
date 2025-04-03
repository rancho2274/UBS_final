// Check if user is authenticated
export const isAuthenticated = () => {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? true : false;
  };
  
  // Get user info
  export const getUserInfo = () => {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  };
  
  // Get user type (student, school, volunteer)
  export const getUserType = () => {
    const userInfo = getUserInfo();
    return userInfo ? userInfo.userType : null;
  };
  
  // Logout user
  export const logout = () => {
    localStorage.removeItem('userInfo');
    window.location.href = '/';
  };