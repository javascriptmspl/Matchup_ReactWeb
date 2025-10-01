import io from 'socket.io-client';

const SOCKET_URL = "http://38.242.230.126:4457";

class SocketService {
  constructor() {
    this.socket = null;
    this.userId = null;
    this.currentRoom = null;
    this.isConnected = false;
    
    // Callbacks
    this.onConnect = () => {};
    this.onDisconnect = () => {};
    this.onError = () => {};
    this.onRoomCreated = () => {};
    this.onRoomsList = () => {};
    this.onRoomJoined = () => {};
    this.onRoomDeleted = () => {};
    this.onNewMessage = () => {};
    this.onMessageEdited = () => {};
    this.onMessageDeleted = () => {};
    this.onChatHistory = () => {};
    this.onTyping = () => {};
    this.onTypingStop = () => {};
  }

  // Initialize connection
  connect(userId) {
    if (this.socket && this.isConnected) {
      console.log("Already connected");
      return;
    }

    this.userId = userId;
    this.socket = io(SOCKET_URL, {
      query: { userId }
    });

    this.setupEventListeners();
  }

  // Setup all event listeners
  setupEventListeners() {
    // Connection events
    this.socket.on('connect', () => {
      console.log('✅ Connected to chat server');
      this.isConnected = true;
      this.onConnect();
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from chat server');
      this.isConnected = false;
      this.onDisconnect();
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
      this.onError(error);
    });

    // Room events
    this.socket.on('room_created', (data) => {
      console.log('🎉 Room created:', data);
      this.onRoomCreated(data);
    });

    this.socket.on('rooms_list', (data) => {
      console.log('📋 Rooms list:', data);
      this.onRoomsList(data);
    });

    this.socket.on('room_list', (data) => {
      console.log('📋 Room list (singular):', data);
      this.onRoomsList(data);
    });

    this.socket.on('room_joined', (data) => {
      console.log('🚪 Room joined:', data);
      this.onRoomJoined(data);
    });

    this.socket.on('room_deleted', (data) => {
      console.log('🗑️ Room deleted:', data);
      this.onRoomDeleted(data);
    });

    this.socket.on('room_error', (error) => {
      console.log('❌ Room error:', error);
      this.onError(error);
    });

    this.socket.on('room_found', (data) => {
      console.log('🔍 Room found:', data);
      this.onRoomCreated(data); // Treat as room created
    });

    // Message events
    this.socket.on('new_message', (data) => {
      console.log('💬 New message:', data);
      this.onNewMessage(data);
    });

    this.socket.on('message_edited', (data) => {
      console.log('✏️ Message edited:', data);
      this.onMessageEdited(data);
    });

    this.socket.on('message_deleted', (data) => {
      console.log('🗑️ Message deleted:', data);
      this.onMessageDeleted(data);
    });

    this.socket.on('chat_history', (data) => {
      console.log('📜 Chat history:', data);
      this.onChatHistory(data);
    });

    // Typing events
    this.socket.on('typing', (data) => {
      this.onTyping(data);
    });

    this.socket.on('typing_stop', (data) => {
      this.onTypingStop(data);
    });
  }

  // Room Management Methods
  createRoom(toUserId) {
    if (!this.isConnected) {
      this.onError({ message: 'Not connected to server' });
      return;
    }

    console.log('➕ Creating room with:', toUserId);
    this.socket.emit('create_room', {
      toUserId,
      userId: this.userId
    });
  }

  getMyRooms() {
    if (!this.isConnected) {
      this.onError({ message: 'Not connected to server' });
      return;
    }

    console.log('📡 Getting my rooms');
    this.socket.emit('get_my_rooms', { userId: this.userId });
  }

  joinRoom(roomId) {
    if (!this.isConnected) {
      this.onError({ message: 'Not connected to server' });
      return;
    }

    this.currentRoom = roomId;
    console.log('🚪 Joining room:', roomId);
    this.socket.emit('join_room', { roomId });
  }

  deleteRoom(roomId) {
    if (!this.isConnected) {
      this.onError({ message: 'Not connected to server' });
      return;
    }

    console.log('🗑️ Deleting room:', roomId);
    this.socket.emit('delete_room', { roomId });
  }

  findRoomByUsers(otherUserId) {
    if (!this.isConnected) {
      this.onError({ message: 'Not connected to server' });
      return;
    }

    console.log('🔍 Finding room with user:', otherUserId);
    this.socket.emit('find_room_by_users', {
      userId: this.userId,
      otherUserId
    });
  }

  // Message Methods
  sendMessage(content, replyToId = null) {
    if (!this.isConnected || !this.currentRoom) {
      this.onError({ message: 'Not connected or no room selected' });
      return;
    }

    console.log('📤 Sending message');
    this.socket.emit('send_message', {
      roomId: this.currentRoom,
      message: content,
      replyToId
    });
  }

  editMessage(messageId, newContent) {
    if (!this.isConnected) {
      this.onError({ message: 'Not connected to server' });
      return;
    }

    console.log('✏️ Editing message:', messageId);
    this.socket.emit('edit_message', {
      messageId,
      newContent
    });
  }

  deleteMessage(messageId) {
    if (!this.isConnected) {
      this.onError({ message: 'Not connected to server' });
      return;
    }

    console.log('🗑️ Deleting message:', messageId);
    this.socket.emit('delete_message', { messageId });
  }

  replyToMessage(replyToId, content) {
    if (!this.isConnected || !this.currentRoom) {
      this.onError({ message: 'Not connected or no room selected' });
      return;
    }

    console.log('↩️ Replying to message:', replyToId);
    this.socket.emit('reply_message', {
      roomId: this.currentRoom,
      replyToId,
      message: content
    });
  }

  getChatHistory(page = 1, limit = 50) {
    if (!this.isConnected || !this.currentRoom) {
      this.onError({ message: 'Not connected or no room selected' });
      return;
    }

    console.log(`📜 Getting chat history (page ${page})`);
    this.socket.emit('get_chat', {
      roomId: this.currentRoom,
      page,
      limit
    });
  }

  // Typing indicators
  startTyping() {
    if (!this.isConnected || !this.currentRoom) return;
    
    this.socket.emit('typing', { roomId: this.currentRoom });
  }

  stopTyping() {
    if (!this.isConnected || !this.currentRoom) return;
    
    this.socket.emit('typing_stop', { roomId: this.currentRoom });
  }

  // Disconnect
  disconnect() {
    if (this.socket) {
      console.log('👋 Disconnecting from server');
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.currentRoom = null;
    }
  }

  // Set callback handlers
  setCallbacks(callbacks) {
    if (callbacks.onConnect) this.onConnect = callbacks.onConnect;
    if (callbacks.onDisconnect) this.onDisconnect = callbacks.onDisconnect;
    if (callbacks.onError) this.onError = callbacks.onError;
    if (callbacks.onRoomCreated) this.onRoomCreated = callbacks.onRoomCreated;
    if (callbacks.onRoomsList) this.onRoomsList = callbacks.onRoomsList;
    if (callbacks.onRoomJoined) this.onRoomJoined = callbacks.onRoomJoined;
    if (callbacks.onRoomDeleted) this.onRoomDeleted = callbacks.onRoomDeleted;
    if (callbacks.onNewMessage) this.onNewMessage = callbacks.onNewMessage;
    if (callbacks.onMessageEdited) this.onMessageEdited = callbacks.onMessageEdited;
    if (callbacks.onMessageDeleted) this.onMessageDeleted = callbacks.onMessageDeleted;
    if (callbacks.onChatHistory) this.onChatHistory = callbacks.onChatHistory;
    if (callbacks.onTyping) this.onTyping = callbacks.onTyping;
    if (callbacks.onTypingStop) this.onTypingStop = callbacks.onTypingStop;
  }
}

// Export singleton instance
const socketService = new SocketService();
export default socketService;

