import axios from 'axios';
import { BASE_URL } from '../../base';

// Get all chat rooms for a user
export const getChatRooms = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/chat/rooms?userId=${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get specific room details by roomId
export const getRoomById = async (roomId, userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/chat/rooms/${roomId}?userId=${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create a new chat room
export const createChatRoom = async (userId, toUserId) => {
  try {
    const response = await axios.post(`${BASE_URL}/chat/rooms`, {
      userId,
      toUserId
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Send a message in a room
export const sendMessage = async (roomId, userId, message, messageType = 'text', replyToMessageId = null, file = null) => {
  try {
    // If file is provided, use FormData
    if (file) {
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('message', message || '');
      formData.append('messageType', messageType || 'file');
      formData.append('file', file);
      
      if (replyToMessageId) {
        formData.append('replyToMessageId', replyToMessageId);
      }
      
      const response = await axios.post(`${BASE_URL}/chat/rooms/${roomId}/messages`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else {
      // Regular text message
      const payload = {
        userId,
        message,
        messageType
      };
      
      // Add replyToMessageId if provided
      if (replyToMessageId) {
        payload.replyToMessageId = replyToMessageId;
      }
      
      const response = await axios.post(`${BASE_URL}/chat/rooms/${roomId}/messages`, payload);
      return response.data;
    }
  } catch (error) {
    throw error;
  }
};

// Get messages for a specific room
export const getRoomMessages = async (roomId, userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/chat/rooms/${roomId}/messages?userId=${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get message by message ID
export const getMessageById = async (messageId) => {
  try {
    const response = await axios.get(`${BASE_URL}/chat/messages/${messageId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Edit/Update a message
export const editMessage = async (messageId, userId, newContent) => {
  try {
    const response = await axios.put(`${BASE_URL}/chat/messages/${messageId}`, {
      userId: userId,
      newContent: newContent
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete a message
export const deleteMessage = async (messageId, userId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/chat/messages/${messageId}`, {
      data: {
        userId: userId
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

