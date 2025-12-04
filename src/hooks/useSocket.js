import { useEffect, useCallback } from 'react';
import socketService from '../services/SocketService';

export const useSocket = (userId, callbacks = {}) => {
  // Connect on mount
  useEffect(() => {
    if (!userId) return;

    socketService.connect(userId);
    socketService.setCallbacks(callbacks);

    return () => {
      socketService.disconnect();
    };
  }, [userId]); // Only reconnect if userId changes

  // Update callbacks when they change
  useEffect(() => {
    socketService.setCallbacks(callbacks);
  }, [callbacks]);

  // Return service methods
  const createRoom = useCallback((toUserId) => {
    socketService.createRoom(toUserId);
  }, []);

  const getMyRooms = useCallback(() => {
    socketService.getMyRooms();
  }, []);

  const joinRoom = useCallback((roomId) => {
    socketService.joinRoom(roomId);
  }, []);

  const deleteRoom = useCallback((roomId) => {
    socketService.deleteRoom(roomId);
  }, []);

  const sendMessage = useCallback((roomId, message, replyToId = null) => {
    socketService.sendMessage(roomId, message, replyToId);
  }, []);

  const replyMessage = useCallback((roomId, replyToId, message) => {
    socketService.replyMessage(roomId, replyToId, message);
  }, []);

  const editMessage = useCallback((messageId, newContent) => {
    socketService.editMessage(messageId, newContent);
  }, []);

  const deleteMessage = useCallback((messageId) => {
    socketService.deleteMessage(messageId);
  }, []);

  const getChatHistory = useCallback((roomId, page = 1, limit = 50) => {
    socketService.getChatHistory(roomId, page, limit);
  }, []);

  const startTyping = useCallback((roomId) => {
    socketService.startTyping(roomId);
  }, []);

  const stopTyping = useCallback((roomId) => {
    socketService.stopTyping(roomId);
  }, []);

  const getCallHistory = useCallback((page = 1, limit = 20) => {
    socketService.getCallHistory(page, limit);
  }, []);

  return {
    // Connection state
    isConnected: socketService.isConnected,
    currentRoom: socketService.currentRoom,
    
    // Room methods
    createRoom,
    getMyRooms,
    joinRoom,
    deleteRoom,
    
    // Message methods
    sendMessage,
    replyMessage,
    editMessage,
    deleteMessage,
    getChatHistory,
    
    // Typing methods
    startTyping,
    stopTyping,
    
    // Call methods
    getCallHistory,
  };
};

