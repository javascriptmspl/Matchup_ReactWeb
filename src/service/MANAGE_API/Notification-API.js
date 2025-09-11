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
