import axios from "axios";

const API_BASE_URL = "https://matchup-backend.meander.live";

// Create payment intent
export const createPaymentIntent = async (userId, subscriptionPlan) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/payment/create-payment-intent`,
      {
        userId,
        subscriptionPlan,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw error;
  }
};

// Confirm payment after successful transaction
export const confirmPayment = async (paymentIntentId, userId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/payment/confirm-payment`,
      {
        paymentIntentId,
        userId,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error confirming payment:", error);
    throw error;
  }
};

export const verifyPayment = async (paymentIntentId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/payment/verify/${paymentIntentId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error verifying payment:", error);
    throw error;
  }
};

export const getPaymentHistory = async (userId, pageNo = 1, pageSize = 10) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/payment/user/${userId}?page_no=${pageNo}&page_size=${pageSize}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching payment history:", error);
    throw error;
  }
};

