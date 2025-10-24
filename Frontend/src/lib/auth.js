// Authentication utility functions
export const logout = () => {
  // Clear all authentication data from localStorage
  localStorage.removeItem('jwtToken');
  localStorage.removeItem('id');
  localStorage.removeItem('name');
  localStorage.removeItem('email');
  localStorage.removeItem('role');
  localStorage.removeItem('profilePicture');
  
  // Clear any other app-specific data
  localStorage.removeItem('userPreferences');
  localStorage.removeItem('quizProgress');
  
  // Return to home page
  window.location.href = '/';
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('jwtToken');
  const role = localStorage.getItem('role');
  return !!(token && role);
};

export const getUserRole = () => {
  return localStorage.getItem('role');
};

export const getUserData = () => {
  return {
    id: localStorage.getItem('id'),
    name: localStorage.getItem('name'),
    email: localStorage.getItem('email'),
    role: localStorage.getItem('role'),
    profilePicture: localStorage.getItem('profilePicture'),
    token: localStorage.getItem('jwtToken')
  };
};

export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    return true;
  }
};

export const checkAuthStatus = () => {
  const token = localStorage.getItem('jwtToken');
  
  if (!token || isTokenExpired(token)) {
    logout();
    return false;
  }
  
  return true;
};