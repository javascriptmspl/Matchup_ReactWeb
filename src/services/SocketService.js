import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.currentRoom = null;
    this.userId = null;
    this.callbacks = {};
    this.SOCKET_URL = 'https://matchup-backend.meander.live/';
    
    // Bind methods to maintain 'this' context
    this.on = this.on.bind(this);
    this.off = this.off.bind(this);
    this.emit = this.emit.bind(this);
  }

  connect(userId, userName = null) {
    if (this.socket?.connected) {
     
      return;
    }

    if (this.socket) {
      this.socket.disconnect();
    }

    this.userId = userId;

 

    this.socket = io(this.SOCKET_URL, {
      secure: true,
      transports: ['polling', 'websocket'],
      query: {
        userId: userId,
        userName: userName || 'User'
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.setupEventListeners();
  }

  setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
  
      this.isConnected = true;
      if (this.callbacks.onConnect) {
        this.callbacks.onConnect(this.socket.id);
      }
    });

    this.socket.on('connect_error', (err) => {
      console.error('❌ Connect Error: ' + err.message);
      this.isConnected = false;
      if (this.callbacks.onConnectError) {
        this.callbacks.onConnectError(err);
      }
    });

    this.socket.on('disconnect', (reason) => {
   
      this.isConnected = false;
      if (this.callbacks.onDisconnect) {
        this.callbacks.onDisconnect(reason);
      }
    });

    // User events
    this.socket.on('user_connected', (data) => {
   
      if (this.callbacks.onUserConnected) {
        this.callbacks.onUserConnected(data);
      }
    });

    this.socket.on('user_disconnected', (data) => {

      if (this.callbacks.onUserDisconnected) {
        this.callbacks.onUserDisconnected(data);
      }
    });

    // Room events
    this.socket.on('rooms_joined', (data) => {
   
      if (this.callbacks.onRoomsJoined) {
        this.callbacks.onRoomsJoined(data);
      }
    });

    this.socket.on('rooms_list', (rooms) => {
      
      if (this.callbacks.onRoomsList) {
        this.callbacks.onRoomsList(rooms);
      }
    });

    this.socket.on('room_created', (data) => {
    
      if (this.callbacks.onRoomCreated) {
        this.callbacks.onRoomCreated(data);
      }
    });

    this.socket.on('room_joined', (data) => {
      
      this.currentRoom = data.roomId;
      if (this.callbacks.onRoomJoined) {
        this.callbacks.onRoomJoined(data);
      }
    });

    this.socket.on('room_deleted', (data) => {
      if (this.currentRoom === data.roomId) {
        this.currentRoom = null;
      }
      if (this.callbacks.onRoomDeleted) {
        this.callbacks.onRoomDeleted(data);
      }
    });

    // Message events
    this.socket.on('new_message', (data) => {
      if (this.callbacks.onNewMessage) {
        this.callbacks.onNewMessage(data.message, data.roomId);
      }
    });

    this.socket.on('message_edited', (data) => {
      if (this.callbacks.onMessageEdited) {
        this.callbacks.onMessageEdited(data.message, data.roomId);
      }
    });

    this.socket.on('message_deleted', (data) => {
      if (this.callbacks.onMessageDeleted) {
        this.callbacks.onMessageDeleted(data.messageId, data.roomId);
      }
    });

    this.socket.on('message_replied', (data) => {
      if (this.callbacks.onMessageReplied) {
        this.callbacks.onMessageReplied(data.message, data.roomId);
      }
    });

    this.socket.on('chat_history', (data) => {
      if (this.callbacks.onChatHistory) {
        this.callbacks.onChatHistory(data);
      }
    });

    // Typing events
    this.socket.on('user_typing', (data) => {
      if (this.callbacks.onUserTyping) {
        this.callbacks.onUserTyping(data);
      }
    });

    this.socket.on('user_stopped_typing', (data) => {
      if (this.callbacks.onUserStoppedTyping) {
        this.callbacks.onUserStoppedTyping(data);
      }
    });

    // Friend request events
    this.socket.on('friend_request_sent', (data) => {
      if (this.callbacks.onFriendRequestSent) {
        this.callbacks.onFriendRequestSent(data);
      }
    });

    this.socket.on('friend_request_received', (data) => {
      if (this.callbacks.onFriendRequestReceived) {
        this.callbacks.onFriendRequestReceived(data);
      }
    });

    this.socket.on('friend_request_accepted', (data) => {
      if (this.callbacks.onFriendRequestAccepted) {
        this.callbacks.onFriendRequestAccepted(data);
      }
    });

    this.socket.on('friend_request_rejected', (data) => {
      if (this.callbacks.onFriendRequestRejected) {
        this.callbacks.onFriendRequestRejected(data);
      }
    });

    this.socket.on('friends_list', (data) => {
      if (this.callbacks.onFriendsList) {
        this.callbacks.onFriendsList(data);
      }
    });

    this.socket.on('pending_friend_requests', (data) => {
      if (this.callbacks.onPendingFriendRequests) {
        this.callbacks.onPendingFriendRequests(data);
      }
    });

    this.socket.on('friend_removed', (data) => {
      if (this.callbacks.onFriendRemoved) {
        this.callbacks.onFriendRemoved(data);
      }
    });

    // Call events
    this.socket.on('call_initiated', (data) => {
      if (this.callbacks.onCallInitiated) {
        this.callbacks.onCallInitiated(data);
      }
    });

    this.socket.on('incoming_call', (data) => {
      if (this.callbacks.onIncomingCall) {
        this.callbacks.onIncomingCall(data);
      }
    });

    this.socket.on('call_answered', (data) => {
      if (this.callbacks.onCallAnswered) {
        this.callbacks.onCallAnswered(data);
      }
    });

    this.socket.on('call_started', (data) => {
      if (this.callbacks.onCallStarted) {
        this.callbacks.onCallStarted(data);
      }
    });

    this.socket.on('call_declined', (data) => {
      if (this.callbacks.onCallDeclined) {
        this.callbacks.onCallDeclined(data);
      }
    });

    this.socket.on('call_ended', (data) => {
      if (this.callbacks.onCallEnded) {
        this.callbacks.onCallEnded(data);
      }
    });

    this.socket.on('webrtc_offer', (data) => {
      if (this.callbacks.onWebRTCOffer) {
        this.callbacks.onWebRTCOffer(data);
      }
    });

    this.socket.on('webrtc_answer', (data) => {
      if (this.callbacks.onWebRTCAnswer) {
        this.callbacks.onWebRTCAnswer(data);
      }
    });

    this.socket.on('webrtc_ice_candidate', (data) => {
      if (this.callbacks.onWebRTCIceCandidate) {
        this.callbacks.onWebRTCIceCandidate(data);
      }
    });

    this.socket.on('active_calls', (data) => {
      if (this.callbacks.onActiveCalls) {
        this.callbacks.onActiveCalls(data);
      }
    });

    this.socket.on('call_statistics', (data) => {
      if (this.callbacks.onCallStatistics) {
        this.callbacks.onCallStatistics(data);
      }
    });

    this.socket.on('call_history', (data) => {
      if (this.callbacks.onCallHistory) {
        this.callbacks.onCallHistory(data);
      }
    });

    this.socket.on('call_error', (data) => {
      console.error('📩 call_error:', data);
      if (this.callbacks.onCallError) {
        this.callbacks.onCallError(data);
      }
    });

    // Error event
    this.socket.on('error', (data) => {
      console.error('📩 error:', data);
      if (this.callbacks.onError) {
        this.callbacks.onError(data);
      }
    });

    // Log all events for debugging
    this.socket.onAny((event, data) => {
      
    });
  }

  setCallbacks(callbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.currentRoom = null;
    }
  }

  // Room methods
  createRoom(toUserId) {
    if (!this.socket || !this.isConnected) {
      console.error('Socket not connected');
      return;
    }
    this.socket.emit('create_room', {
      toUserId,
      userId: this.userId
    });
  }

  getMyRooms() {
    if (!this.socket || !this.isConnected) {
      console.error('Socket not connected');
      return;
    }
    this.socket.emit('get_my_rooms');
  }

  joinRoom(roomId) {
    if (!this.socket || !this.isConnected) {
      console.error('Socket not connected');
      return;
    }
    this.socket.emit('join_room', { roomId });
  }

  deleteRoom(roomId) {
    if (!this.socket || !this.isConnected) {
      console.error('Socket not connected');
      return;
    }
    this.socket.emit('delete_room', { roomId });
  }

  // Message methods
  sendMessage(roomId, message, replyToId = null) {
    if (!this.socket || !this.isConnected) {
      console.error('Socket not connected');
      return;
    }
    const payload = {
      roomId,
      message
    };
    if (replyToId) {
      payload.replyToId = replyToId;
    }
    this.socket.emit('send_message', payload);
  }

  replyMessage(roomId, replyToId, message) {
    if (!this.socket || !this.isConnected) {
      console.error('Socket not connected');
      return;
    }
    this.socket.emit('reply_message', {
      roomId,
      replyToId,
      message
    });
  }

  editMessage(messageId, newContent) {
    if (!this.socket || !this.isConnected) {
      console.error('Socket not connected');
      return;
    }
    this.socket.emit('edit_message', {
      messageId,
      newContent
    });
  }

  deleteMessage(messageId) {
    if (!this.socket || !this.isConnected) {
      console.error('Socket not connected');
      return;
    }
    this.socket.emit('delete_message', { messageId });
  }

  getChatHistory(roomId, page = 1, limit = 50) {
    if (!this.socket || !this.isConnected) {
      console.error('Socket not connected');
      return;
    }
    this.socket.emit('get_chat', {
      roomId,
      page,
      limit
    });
  }

  // Typing methods
  startTyping(roomId) {
    if (!this.socket || !this.isConnected) {
      console.error('Socket not connected');
      return;
    }
    this.socket.emit('typing_start', { roomId });
  }

  stopTyping(roomId) {
    if (!this.socket || !this.isConnected) {
      console.error('Socket not connected');
      return;
    }
    this.socket.emit('typing_stop', { roomId });
  }

  // Friend request methods
  sendFriendRequest(toUserId) {
    if (!this.socket || !this.isConnected) {
      console.error('Socket not connected');
      return;
    }
    this.socket.emit('send_friend_request', { toUserId });
  }

  acceptFriendRequest(fromUserId) {
    if (!this.socket || !this.isConnected) {
      console.error('Socket not connected');
      return;
    }
    this.socket.emit('accept_friend_request', { fromUserId });
  }

  rejectFriendRequest(fromUserId) {
    if (!this.socket || !this.isConnected) {
      console.error('Socket not connected');
      return;
    }
    this.socket.emit('reject_friend_request', { fromUserId });
  }

  removeFriend(friendId) {
    if (!this.socket || !this.isConnected) {
      console.error('Socket not connected');
      return;
    }
    this.socket.emit('remove_friend', { friendId });
  }

  // Call methods
  initiateCall(calleeId, roomId, callType = 'audio') {
    if (!this.socket || !this.isConnected) {
      console.error('Socket not connected');
      return;
    }
    this.socket.emit('initiate_call', {
      calleeId,
      roomId,
      callType
    });
  }

  answerCall(callSessionId) {
    if (!this.socket || !this.isConnected) {
      console.error('Socket not connected');
      return;
    }
    this.socket.emit('answer_call', { callSessionId });
  }

  declineCall(callSessionId) {
    if (!this.socket || !this.isConnected) {
      console.error('Socket not connected');
      return;
    }
    this.socket.emit('decline_call', { callSessionId });
  }

  endCall(callSessionId, reason = 'User ended call') {
    if (!this.socket || !this.isConnected) {
      console.error('Socket not connected');
      return;
    }
    this.socket.emit('end_call', {
      callSessionId,
      reason
    });
  }

  sendWebRTCOffer(callSessionId, offer, calleeId) {
    if (!this.socket || !this.isConnected) {
      console.error('Socket not connected');
      return;
    }
    this.socket.emit('webrtc_offer', {
      callSessionId,
      offer,
      calleeId
    });
  }

  sendWebRTCAnswer(callSessionId, answer, callerId) {
    if (!this.socket || !this.isConnected) {
      console.error('Socket not connected');
      return;
    }
    this.socket.emit('webrtc_answer', {
      callSessionId,
      answer,
      callerId
    });
  }

  sendWebRTCIceCandidate(callSessionId, candidate, targetUserId) {
    if (!this.socket || !this.isConnected) {
      console.error('Socket not connected');
      return;
    }
    this.socket.emit('webrtc_ice_candidate', {
      callSessionId,
      candidate,
      targetUserId
    });
  }

  getCallHistory(page = 1, limit = 20) {
    if (!this.socket || !this.isConnected) {
      console.error('Socket not connected');
      return;
    }
    this.socket.emit('get_call_history', { page, limit });
  }

  getActiveCalls() {
    if (!this.socket || !this.isConnected) {
      console.error('Socket not connected');
      return;
    }
    this.socket.emit('get_active_calls');
  }

  getCallStatistics() {
    if (!this.socket || !this.isConnected) {
      console.error('Socket not connected');
      return;
    }
    this.socket.emit('get_call_statistics');
  }

  // Add event listener
  on(eventName, callback) {
    if (!this.socket) {
      console.error('Socket not initialized');
      return;
    }
    this.socket.on(eventName, callback);
  }

  // Remove event listener
  off(eventName, callback) {
    if (!this.socket) {
      console.error('Socket not initialized');
      return;
    }
    if (callback) {
      this.socket.off(eventName, callback);
    } else {
      this.socket.off(eventName);
    }
  }

  // Emit event
  emit(eventName, data) {
    if (!this.socket || !this.isConnected) {
      console.error('Socket not connected');
      return;
    }
    this.socket.emit(eventName, data);
  }
}

const socketService = new SocketService();

export default socketService;

