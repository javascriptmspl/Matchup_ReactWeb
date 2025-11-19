import axios from "axios";
import { BASE_URL } from "../../base";



export const getUserNotificationsAPI = async (userId, page = 1, limit = 11) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/notifications/user/${userId}?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const markNotificationsAsRead = async (notificationIds) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/notifications/mark-as-read`,
      { notificationIds }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getUnreadNotificationCount = async (userId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/notifications/unread-count/${userId}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const markAllNotificationsAsRead = async (userId) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/notifications/mark-all-as-read/${userId}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
