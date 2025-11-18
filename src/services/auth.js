// services/auth.js
export const isAuthenticated = () => {
  return !!localStorage.getItem("auth_token") || !!localStorage.getItem("user");
};

export const loginUser = (userData) => {
  if (userData.token) localStorage.setItem("auth_token", userData.token);
  localStorage.setItem("user", JSON.stringify(userData.user || userData));
};

export const logoutUser = () => {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user");
};

// Save the pending artwork (if user clicked "Buy" before login)
export const savePendingArtwork = (artwork) => {
  localStorage.setItem("pendingArtwork", JSON.stringify(artwork));
};

// Retrieve and clear pending artwork after login
export const getPendingArtwork = () => {
  const data = localStorage.getItem("pendingArtwork");
  if (!data) return null;
  localStorage.removeItem("pendingArtwork");
  return JSON.parse(data);
};
