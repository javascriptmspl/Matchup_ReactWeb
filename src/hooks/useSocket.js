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

  const findRoomByUsers = useCallback((otherUserId) => {
    socketService.findRoomByUsers(otherUserId);
  }, []);

  const sendMessage = useCallback((content, replyToId = null) => {
    socketService.sendMessage(content, replyToId);
  }, []);

  const editMessage = useCallback((messageId, newContent) => {
    socketService.editMessage(messageId, newContent);
  }, []);

  const deleteMessage = useCallback((messageId) => {
    socketService.deleteMessage(messageId);
  }, []);

  const getChatHistory = useCallback((page = 1, limit = 50) => {
    socketService.getChatHistory(page, limit);
  }, []);

  const startTyping = useCallback(() => {
    socketService.startTyping();
  }, []);

  const stopTyping = useCallback(() => {
    socketService.stopTyping();
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
    findRoomByUsers,
    
    // Message methods
    sendMessage,
    editMessage,
    deleteMessage,
    getChatHistory,
    
    // Typing methods
    startTyping,
    stopTyping,
  };
};

