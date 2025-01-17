// src/services/loginService.js

import API from "./api";

// Utility function to handle errors
const handleError = (error) => {
  console.error("API call error:", error.response ? error.response.data : error);
  throw error.response ? error.response.data : error;
};

// Function to register a new user
export const register = async (userData) => {
  try {
    const response = await API.post("auth/register", userData);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Function to login a user

export const loginUser = async (credentials) => {
  try {
    const response = await API.post("auth/login", credentials);
    if (response && response.data) {
      return response.data;
    } else {
      throw new Error("Invalid response from server.");
    }
  } catch (error) {
  
    throw error;
  }
};

// Function to logout a user
export const logout = () => {
  localStorage.removeItem("token");
};

// Function to get the current user's profile
export const getProfile = async () => {
  try {
    const response = await API.get("/auth/profile");
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
