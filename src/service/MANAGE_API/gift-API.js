import axios from 'axios';
import { BASE_URL } from '../../base';

// Fetch all gifts with pagination
export const getAllGifts = async (pageNo = 1, pageSize = 11) => {
  try {
    const response = await axios.get(`${BASE_URL}/gift/all`, {
      params: {
        page_no: pageNo,
        page_size: pageSize
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching gifts:', error);
    throw error;
  }
};

// Send a gift
export const sendGift = async (giftData) => {
  try {
    const response = await axios.post(`${BASE_URL}/gift/send`, giftData);
    return response.data;
  } catch (error) {
    console.error('Error sending gift:', error);
    throw error;
  }
};

// Get user's coin balance (if you have this endpoint)
export const getUserCoins = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/coins/balance/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user coins:', error);
    // Return a fallback response structure
    return {
      isSuccess: false,
      data: { coins: 0 },
      message: 'Failed to fetch user coins'
    };
  }
};
