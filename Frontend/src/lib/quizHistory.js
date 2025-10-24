// Utility functions for managing quiz attempt history

const QUIZ_HISTORY_KEY = 'quizHistory';

/**
 * Save a quiz attempt to localStorage
 * @param {Object} attemptData - The quiz attempt data
 * @param {string} attemptData.quizId - Quiz ID
 * @param {string} attemptData.quizTitle - Quiz title
 * @param {number} attemptData.score - Number of correct answers
 * @param {number} attemptData.totalQuestions - Total number of questions
 * @param {number} attemptData.percentage - Percentage score
 * @param {number} attemptData.timeTaken - Time taken in seconds
 * @param {number} attemptData.totalTime - Total time allowed in seconds
 * @param {Date} attemptData.completedAt - When the quiz was completed
 * @param {string} attemptData.performanceLevel - Performance level (Excellent, Good, etc.)
 */
export const saveQuizAttempt = (attemptData) => {
  try {
    const userId = localStorage.getItem('id') || 'guest';
    const userHistoryKey = `${QUIZ_HISTORY_KEY}_${userId}`;
    
    // Get existing history or initialize empty array
    const existingHistory = JSON.parse(localStorage.getItem(userHistoryKey) || '[]');
    
    // Add new attempt with unique ID
    const newAttempt = {
      id: Date.now().toString(),
      ...attemptData,
      completedAt: new Date().toISOString()
    };
    
    // Add to beginning of array (most recent first)
    existingHistory.unshift(newAttempt);
    
    // Keep only last 50 attempts to prevent localStorage bloat
    const trimmedHistory = existingHistory.slice(0, 50);
    
    // Save back to localStorage
    localStorage.setItem(userHistoryKey, JSON.stringify(trimmedHistory));
    
    console.log('Quiz attempt saved successfully:', newAttempt);
    return true;
  } catch (error) {
    console.error('Error saving quiz attempt:', error);
    return false;
  }
};

/**
 * Get all quiz attempts for the current user
 * @returns {Array} Array of quiz attempts
 */
export const getQuizHistory = () => {
  try {
    const userId = localStorage.getItem('id') || 'guest';
    const userHistoryKey = `${QUIZ_HISTORY_KEY}_${userId}`;
    
    const history = JSON.parse(localStorage.getItem(userHistoryKey) || '[]');
    
    // Parse dates and sort by most recent
    return history.map(attempt => ({
      ...attempt,
      completedAt: new Date(attempt.completedAt)
    })).sort((a, b) => b.completedAt - a.completedAt);
  } catch (error) {
    console.error('Error retrieving quiz history:', error);
    return [];
  }
};

/**
 * Get quiz attempts for a specific quiz
 * @param {string} quizId - The quiz ID to filter by
 * @returns {Array} Array of attempts for the specific quiz
 */
export const getQuizAttemptsByQuizId = (quizId) => {
  const allHistory = getQuizHistory();
  return allHistory.filter(attempt => attempt.quizId === quizId);
};

/**
 * Get user's quiz statistics
 * @returns {Object} Statistics object
 */
export const getQuizStatistics = () => {
  const history = getQuizHistory();
  
  if (history.length === 0) {
    return {
      totalAttempts: 0,
      averageScore: 0,
      bestScore: 0,
      totalQuizzesCompleted: 0,
      recentActivity: []
    };
  }
  
  // Calculate statistics
  const totalAttempts = history.length;
  const averageScore = history.reduce((sum, attempt) => sum + attempt.percentage, 0) / totalAttempts;
  const bestScore = Math.max(...history.map(attempt => attempt.percentage));
  const uniqueQuizzes = new Set(history.map(attempt => attempt.quizId)).size;
  
  // Get recent activity (last 10 attempts)
  const recentActivity = history.slice(0, 10);
  
  return {
    totalAttempts,
    averageScore: Math.round(averageScore * 10) / 10,
    bestScore,
    totalQuizzesCompleted: uniqueQuizzes,
    recentActivity
  };
};

/**
 * Clear all quiz history for the current user
 * @returns {boolean} Success status
 */
export const clearQuizHistory = () => {
  try {
    const userId = localStorage.getItem('id') || 'guest';
    const userHistoryKey = `${QUIZ_HISTORY_KEY}_${userId}`;
    
    localStorage.removeItem(userHistoryKey);
    console.log('Quiz history cleared successfully');
    return true;
  } catch (error) {
    console.error('Error clearing quiz history:', error);
    return false;
  }
};

/**
 * Format time duration for display
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
export const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  
  if (mins === 0) {
    return `${secs}s`;
  } else if (mins < 60) {
    return `${mins}m ${secs}s`;
  } else {
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hours}h ${remainingMins}m`;
  }
};

/**
 * Get performance level based on percentage
 * @param {number} percentage - Score percentage
 * @returns {Object} Performance level info
 */
export const getPerformanceLevel = (percentage) => {
  if (percentage >= 90) return { level: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-100' };
  if (percentage >= 80) return { level: 'Very Good', color: 'text-blue-600', bgColor: 'bg-blue-100' };
  if (percentage >= 70) return { level: 'Good', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
  if (percentage >= 60) return { level: 'Average', color: 'text-orange-600', bgColor: 'bg-orange-100' };
  return { level: 'Needs Improvement', color: 'text-red-600', bgColor: 'bg-red-100' };
};