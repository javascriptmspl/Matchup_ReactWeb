
import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBTypography,
  MDBInputGroup,
} from "mdb-react-ui-kit";
import { Modal, Button } from 'react-bootstrap';
import { Scrollbars } from "react-custom-scrollbars-2";
import HeaderFour from "../component/layout/HeaderFour";
import EmojiPicker from "emoji-picker-react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

//import data (keeping as fallback)
import { messages as staticMessages, customMessages } from "../../dating/component/chat2-component/message";

//images
import chatBG from "../assets/images/bg-img/marrage-chat-bg.jpg";
import chatBG2 from "../../dating/assets/images/chat/chatbg2.jpg"
import dummyUserPic from "../../dating/assets/images/myCollection/user-male.jpg";
import { useSelector, useDispatch } from "react-redux";
import { BASE_URL } from "../../base";
import { getRoomById, sendMessage as sendMessageAPI } from "../../service/MANAGE_API/chat-API";
import { getAllGifts, getUserCoins, sendGift as sendGiftApi } from "../../service/MANAGE_API/gift-API";
import { getBlockedUsers, checkIfBlockedBy } from "../../service/common-service/blockSlice";
import { useSocket } from "../../hooks/useSocket";

// Matrimonial specific modals
import CheckCompatibilityModalMetri from "../component/popUps/chat/checkCompatibilty";
import RelationshipMilestoneTrackerMetri from "../component/popUps/chat/MildStoneModal";
import BlockUserModalMetri from "../component/popUps/common-profile/block-user";
import ReportUserModalMetri from "../component/popUps/common-profile/reportUserModal";
import CalenderScheduleMetri from "../component/popUps/chat/calenderSchedule";
import EventCalenderScheduleModal from "../component/popUps/event/eventCalenderSchedule ";
import EventNotificationScheduleModal from "../component/popUps/event/eventNotificationSchedule ";
import IncomingCallModal from "../component/popUps/incomingcalls/IncomingCallModal.jsx";
import VideoCallModal from "../component/popUps/incomingcalls/VideoCallModal.jsx";
import socketService from "../../services/SocketService.js";

export default function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [inputMessage, setInputMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([...customMessages]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmojis, setSelectedEmojis] = useState([]);
  const [SelectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const scrollbarsRef = useRef(null);
  const [CheckCompatibility, setCheckCompatibility] = useState(false);
  const [NotificationSchedule, setNotificationSchedule] = useState(false);
  const [calenderSchedule, setCalenderSchedule] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [blocklUser, setBlockUser] = useState(false);
  const [reportUser, setReportUser] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showClock, setShowClock] = useState(false);
  const [Milestone, setMilestone] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null)
  
  const [isMobileView, setIsMobileView] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [roomMessages, setRoomMessages] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({}); // { roomId: count }
  const [lastMessages, setLastMessages] = useState({}); // { roomId: { message, timestamp, isRead } }
  
  // Store messages per room to persist them when switching
  const [messagesByRoom, setMessagesByRoom] = useState({});
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [replyingToMessage, setReplyingToMessage] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [ViewUser] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showVideoCallModal, setShowVideoCallModal] = useState(false);
  const [isSelectedUserBlocked, setIsSelectedUserBlocked] = useState(false);
  const [isBlockedBySelectedUser, setIsBlockedBySelectedUser] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const [showIncomingCallModal, setShowIncomingCallModal] = useState(false);
  const [isCallModalManuallyClosed, setIsCallModalManuallyClosed] = useState(false);
  const [callHistory, setCallHistory] = useState([]);
  const [showCallHistory, setShowCallHistory] = useState(false);
  const [gifts, setGifts] = useState([]);
  const [loadingGifts, setLoadingGifts] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [sendingGift, setSendingGift] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [currentCallId, setCurrentCallId] = useState(null);
  const [callConnected, setCallConnected] = useState(false);
  const [callInitiated, setCallInitiated] = useState(false);
  const [callStartTime, setCallStartTime] = useState(null);
  const [isMicOn, setIsMicOn] = useState(false);
  // Use ref to track current selectedRoomId in callbacks
  const selectedRoomIdRef = useRef(selectedRoomId);
  
  // Update ref when selectedRoomId changes
  useEffect(() => {
    selectedRoomIdRef.current = selectedRoomId;
  }, [selectedRoomId]);

  // Handle microphone access
  const startMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsMicOn(true);
      
      // Store the stream in a ref to clean up later
      const audioTracks = stream.getAudioTracks();
      
      // Cleanup function to stop tracks when component unmounts or mic is turned off
      return () => {
        audioTracks.forEach(track => track.stop());
        setIsMicOn(false);
      };
    } catch (err) {
      console.error('Error accessing microphone:', err);
      toast.error('Could not access microphone. Please check permissions.');
      setIsMicOn(false);
    }
  };

  // Add gift pop animation styles (once)
  useEffect(() => {
    const styleId = 'gift-bubble-anim-style-metri';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `@keyframes giftPop{0%{transform:scale(0.6);opacity:0}60%{transform:scale(1.05);opacity:1}100%{transform:scale(1)}}.gift-pop{animation:giftPop 450ms ease-out}@keyframes typingDot{0%,60%,100%{opacity:0.3}30%{opacity:1}}.typing-dot{display:inline-block;animation:typingDot 1.4s infinite;font-size:20px;line-height:1}`;
      document.head.appendChild(style);
    }
  }, []);

  const handleShow = () => setShowModal(true);
  const handleHide = () => setShowModal(false);
  const handleShowVideoCall = () => setShowVideoCallModal(true);
  const handleHideVideoCall = () => setShowVideoCallModal(false);

  // Function to check for incoming calls using socket
  // Note: Incoming calls are handled via real-time 'incoming_call' socket event
  // This function is kept for backward compatibility but shouldn't trigger modal
  const checkForIncomingCalls = () => {
    // Don't poll for incoming calls - they come via real-time socket events
    // Only fetch history if needed for other purposes
    // if (!userId || !isConnected) return;
    // socketGetCallHistory(1, 5);
  };

  // Function to fetch call history using socket
  const fetchCallHistory = () => {
    if (!userId || !isConnected) return;
    // Request call history via socket
    socketGetCallHistory(1, 20);
  };


  const user = useSelector((state) => state.profile.userData)
 
  const userPic = user?.avatars?.length - 1
  const blockedUsers = useSelector((state) => state.block.blockedUsers)

  // Get userId from localStorage as fallback using useMemo to prevent recalculation
  const storedUserId = useMemo(() => {
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        return parsedUser?.data?._id || parsedUser?._id;
      }
    } catch (error) {
      console.error("Error parsing userData from localStorage:", error);
    }
    return null;
  }, []);

  // Socket integration
  const userId = user?._id || storedUserId;
  const {
    isConnected,
    createRoom: socketCreateRoom,
    getMyRooms,
    joinRoom,
    sendMessage: socketSendMessage,
    editMessage: socketEditMessage,
    deleteMessage: socketDeleteMessage,
    getChatHistory,
    startTyping,
    stopTyping,
    getCallHistory: socketGetCallHistory
  } = useSocket(userId, {
    onRoomsList: (rooms) => {
    
      setChatRooms(rooms || []);
    
    },
    onChatHistory: (data) => {
      
      const currentSelectedRoomId = selectedRoomIdRef.current;
 
      if (!currentSelectedRoomId) return;
      const messages = Array.isArray(data) ? data : (data?.messages || []);

      // const messages = Array.isArray(data) ? data : (data?.items || []);
     
      if (messages?.length > 0) {
        const transformedMessages = messages.map((msg, index) => {
          const base = msg.content || msg.message || '';
          const inferredType = base && typeof base === 'string' && base.includes('Sent a gift:') ? 'gift' : 'text';
          const messageType = msg.messageType || inferredType;
          const giftName = messageType === 'gift' ? base.split(':').slice(1).join(':').trim() : '';
          const matchedGift = messageType === 'gift' && gifts?.length
            ? gifts.find(g => (g.name || '').toLowerCase() === (giftName || '').toLowerCase())
            : undefined;
          return ({
            ...msg,
            id: msg._id || index,
            content: base,
            timestamp: new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            sent: msg.msgFrom?._id === userId || msg.senderId?._id === userId,
            avatar: (msg.msgFrom?._id === userId || msg.senderId?._id === userId)
              ? (user?.mainAvatar ? `${BASE_URL}/assets/images/${user.mainAvatar}` : "mainnnnn12" )
              : (selectedUser?.avatar),
            messageType,
            fileUrl: msg.fileUrl || msg.file || (msg.attachment ? `${BASE_URL}/${msg.attachment}` : null),
            giftData: messageType === 'gift' ? (msg.giftData || (matchedGift ? { _id: matchedGift._id, name: matchedGift.name, imageUrl: matchedGift.imageUrl } : undefined)) : undefined,
            senderId: msg.msgFrom || msg.senderId,
          });
        });
        
        // Store messages per room
        setMessagesByRoom(prev => ({
          ...prev,
          [currentSelectedRoomId]: transformedMessages
        }));
        
        // Update last message from chat history
        if (transformedMessages?.length > 0) {
          const lastMsg = transformedMessages[transformedMessages?.length - 1];
          const messageText = lastMsg.content || 
            (lastMsg.messageType === 'gift' ? 'Sent a gift' : 
             lastMsg.messageType === 'file' ? 'Sent a file' : 'Message');
          
          setLastMessages(prev => ({
            ...prev,
            [currentSelectedRoomId]: {
              message: messageText,
              timestamp: lastMsg.createdAt || new Date(),
              isRead: currentSelectedRoomId === selectedRoomIdRef.current
            }
          }));
        }
        
        // Only update current room messages if this is the selected room
        if (currentSelectedRoomId === selectedRoomIdRef.current) {
          // Merge with existing messages to avoid losing newly sent messages
          setRoomMessages(prevMessages => {
            // Create a map of existing messages by ID
            const existingMessagesMap = new Map(prevMessages.map(msg => [msg.id || msg._id, msg]));
            
            // Add/update messages from server
            transformedMessages.forEach(msg => {
              existingMessagesMap.set(msg.id || msg._id, msg);
            });
            
            // Convert back to array and sort by timestamp
            const merged = Array.from(existingMessagesMap.values());
            merged.sort((a, b) => {
              const timeA = new Date(a.createdAt || a.timestamp).getTime();
              const timeB = new Date(b.createdAt || b.timestamp).getTime();
              return timeA - timeB;
            });
            
            return merged;
          });
          setTimeout(scrollToBottom, 100);
        }
      }
      setLoadingMessages(false);
    },
    onNewMessage: (message, roomId) => {
    
      // Use ref to get the latest selectedRoomId value
      const currentSelectedRoomId = selectedRoomIdRef.current;
      
      const transformedMessage = {
        ...message,
        id: message._id,
        content: message.content || message.message || '',
        timestamp: new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        sent: message.msgFrom?._id === userId || message.senderId?._id === userId,
        avatar: (message.msgFrom?._id === userId || message.senderId?._id === userId)
          ? (user?.mainAvatar ? `${BASE_URL}/assets/images/${user.mainAvatar}`:"main2222" )
          : (selectedUser?.avatar ),
        messageType: message.messageType || 'text',
        fileUrl: message.fileUrl || message.file || (message.attachment ? `${BASE_URL}/${message.attachment}` : null),
        senderId: message.msgFrom || message.senderId,
      };
    
      
      // Update last message for this room
      if (roomId) {
        const messageText = transformedMessage.content || 
          (transformedMessage.messageType === 'gift' ? 'Sent a gift' : 
           transformedMessage.messageType === 'file' ? 'Sent a file' : 'Message');
        
        setLastMessages(prev => ({
          ...prev,
          [roomId]: {
            message: messageText,
            timestamp: transformedMessage.createdAt || new Date(),
            isRead: roomId === currentSelectedRoomId
          }
        }));
        
        // Increment unread count if message is not from current user and room is not currently open
        const isFromCurrentUser = message.msgFrom?._id === userId || message.senderId?._id === userId;
        if (!isFromCurrentUser && roomId !== currentSelectedRoomId) {
          setUnreadCounts(prev => ({
            ...prev,
            [roomId]: (prev[roomId] || 0) + 1
          }));
        }
        
        // Always store the message in the room's message map
        setMessagesByRoom(prev => {
          const roomMessages = prev[roomId] || [];
          const messageExists = roomMessages.some(msg => (msg.id || msg._id) === (transformedMessage.id || transformedMessage._id));
          if (messageExists) {
            return prev; // Don't add duplicate
          }
          return {
            ...prev,
            [roomId]: [...roomMessages, transformedMessage]
          };
        });
      }
      
      // Only add message to current view if it's for the currently selected room
      if (roomId && currentSelectedRoomId && roomId === currentSelectedRoomId) {
        setRoomMessages(prevMessages => {
          const messageExists = prevMessages.some(msg => (msg.id || msg._id) === (transformedMessage.id || transformedMessage._id));
       
          if (messageExists) {
            return prevMessages;
          }
          return [...prevMessages, transformedMessage];
        });
        setTimeout(scrollToBottom, 100);
      } else {
        console.log('Message stored but not displayed - not for current room. roomId:', roomId, 'selectedRoomId:', currentSelectedRoomId);
      }
    },
    onMessageEdited: (message, roomId) => {
      
      const currentSelectedRoomId = selectedRoomIdRef.current;
      
      // Update in messagesByRoom cache
      if (roomId) {
        setMessagesByRoom(prev => {
          const roomMessages = prev[roomId] || [];
          return {
            ...prev,
            [roomId]: roomMessages.map(msg =>
              (msg._id || msg.id) === (message._id || message.id)
                ? { ...msg, content: message.content || message.message, isEdited: true }
                : msg
            )
          };
        });
      }
      
      // Update in current view if it's the selected room
      if (roomId && currentSelectedRoomId && roomId === currentSelectedRoomId) {
        setRoomMessages(prevMessages =>
          prevMessages.map(msg =>
            (msg._id || msg.id) === (message._id || message.id)
              ? { ...msg, content: message.content || message.message, isEdited: true }
              : msg
          )
        );
      }
    },
    onMessageDeleted: (messageId, roomId) => {
      
      const currentSelectedRoomId = selectedRoomIdRef.current;
      
      // Update in messagesByRoom cache
      if (roomId) {
        setMessagesByRoom(prev => {
          const roomMessages = prev[roomId] || [];
          return {
            ...prev,
            [roomId]: roomMessages.filter(msg => (msg._id || msg.id) !== messageId)
          };
        });
      }
      
      // Update in current view if it's the selected room
      if (roomId && currentSelectedRoomId && roomId === currentSelectedRoomId) {
        setRoomMessages(prevMessages =>
          prevMessages.filter(msg => (msg._id || msg.id) !== messageId)
        );
      }
    },
    onRoomCreated: (data) => {
    
      getMyRooms();
    },
    onUserTyping: (data) => {
      const currentSelectedRoomId = selectedRoomIdRef.current;
      if (data.roomId && currentSelectedRoomId && data.roomId === currentSelectedRoomId) {
        setTypingUsers(prev => ({
          ...prev,
          [data.roomId]: {
            userId: data.userId,
            userName: data.userName || 'Someone',
            isTyping: true
          }
        }));
        // Auto-clear typing indicator after 3 seconds
        setTimeout(() => {
          setTypingUsers(prev => {
            const updated = { ...prev };
            if (updated[data.roomId]?.userId === data.userId) {
              delete updated[data.roomId];
            }
            return updated;
          });
        }, 3000);
      }
    },
    onUserStoppedTyping: (data) => {
      const currentSelectedRoomId = selectedRoomIdRef.current;
      if (data.roomId && currentSelectedRoomId && data.roomId === currentSelectedRoomId) {
        setTypingUsers(prev => {
          const updated = { ...prev };
          if (updated[data.roomId]?.userId === data.userId) {
            delete updated[data.roomId];
          }
          return updated;
        });
      }
    },
    onCallHistory: (data) => {
      
      // Handle different response formats
      const calls = Array.isArray(data) ? data : (data?.calls || data?.items || []);
      if (calls?.length > 0) {
        // Only set call history, don't show incoming call modal from history
        // Incoming calls should only come from real-time socket events
        setCallHistory(calls);
      }
    },
    onIncomingCall: (data) => {
     
      // Handle real-time incoming call - ONLY show modal for actual incoming calls
      // Check if this is for the current user (calleeId can be string or object)
      const calleeId = typeof data.calleeId === 'object' ? data.calleeId._id : data.calleeId;
      const currentUserIdStr = String(userId);
      const calleeIdStr = String(calleeId);
      
      if (calleeId && calleeIdStr !== currentUserIdStr) {
        return;
      }

      const notificationKey = `call_notification_${data.callSessionId}`;
          const alreadyNotified = sessionStorage.getItem(notificationKey);
          
          if (!alreadyNotified) {
        toast(`📞 Incoming call from ${data.callerName || 'Someone'}!`, {
              duration: 3000,
              position: 'top-center',
              style: {
                background: '#ffc107',
                color: '#000',
                fontWeight: 'bold',
                fontSize: '16px',
              },
              icon: '📞',
            });

            if (Notification.permission === 'granted') {
              new Notification('📞 Incoming Call', {
            body: `${data.callerName || 'Someone'} is calling you`,
                icon: '/favicon.ico',
                tag: 'incoming-call',
                requireInteraction: true
              });
            }

            sessionStorage.setItem(notificationKey, 'true');
          }

      // Transform socket data to match expected format
      const newIncomingCall = {
        _id: data.callSessionId,
        callerId: {
          _id: data.callerId,
          name: data.callerName,
          mainAvatar: data.callerAvatar || null
        },
        calleeId: {
          _id: userId
        },
        status: 'ringing',
        roomId: data.roomId,
        callType: data.callType
      };
      setIncomingCall(newIncomingCall);
      // Show appropriate modal based on call type
      if (newIncomingCall.callType === 'video') {
        setShowVideoCallModal(true);
        setShowIncomingCallModal(false);
      } else {
        setShowIncomingCallModal(true);
        setShowVideoCallModal(false);
      }
      setIsCallModalManuallyClosed(false); // Reset when new call comes
    },
     onCallStarted: (data) => {

      // Update current call ID if not set
      if (!currentCallId && data.callSessionId) {
        setCurrentCallId(data.callSessionId);
      }

      // Update call state for both caller and callee
      setCallConnected(true);
      setCallInitiated(false);
      // Always show modal when call starts - reopen if it was closed
      // Check if we have incomingCall to determine call type
      if (incomingCall && incomingCall.callType === 'video') {
        setShowVideoCallModal(true);
        setShowIncomingCallModal(false);
      } else {
        setShowIncomingCallModal(true);
        setShowVideoCallModal(false);
      }
      setIsCallModalManuallyClosed(false);
      
      // Update incomingCall status to 'connected'
      setIncomingCall(prev => prev ? { ...prev, status: 'connected' } : null);
      
      // Only update call start time if not already set
      setCallStartTime(prevTime => prevTime || new Date());
      
      // Start microphone if not already started
      if (!isMicOn) {
        startMic();
      }
      
    },

  onCallEnded: (data) => {
    // Clear all call-related state
    setCallConnected(false);
    setCallInitiated(false);
    setCurrentCallId(null);
    setCallStartTime(null);
    setShowIncomingCallModal(false);
    setShowVideoCallModal(false);
    setIncomingCall(null);
    setIsCallModalManuallyClosed(false);
    // Clear any notification flags
    if (data?.callSessionId) {
      const notificationKey = `call_notification_${data.callSessionId}`;
      sessionStorage.removeItem(notificationKey);
    }
  },
  onCallDeclined: (data) => {
    // Clear call state when call is declined
    setCallConnected(false);
    setCallInitiated(false);
    setShowIncomingCallModal(false);
    setShowVideoCallModal(false);
    setIsCallModalManuallyClosed(false);
    if (incomingCall) {
      const notificationKey = `call_notification_${incomingCall._id}`;
      sessionStorage.removeItem(notificationKey);
    }
    setIncomingCall(null);
  },
  onCallError: (data) => {
    console.error('Call error received:', data);
    const errorMessage = data?.message || 'Call error occurred';
    
    // If error is "Call already in progress", clear the call state
    if (errorMessage.includes('already in progress') || errorMessage.includes('Call already in progress')) {
      toast.error('Another call is already in progress. Please end the current call first.', {
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#dc3545',
          color: '#fff',
          fontWeight: '500',
        },
        icon: '⚠️',
      });
      // Clear call state
      setCallConnected(false);
      setCallInitiated(false);
      setCurrentCallId(null);
      setShowIncomingCallModal(false);
      setIncomingCall(null);
    } else {
      toast.error(errorMessage, {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#dc3545',
          color: '#fff',
          fontWeight: '500',
        },
        icon: '❌',
      });
    }
  },
    onError: (error) => {
      console.error('Socket error:', error);
      toast.error(error.message || 'An error occurred');
    }
  });

  const clockTime = () => {
    setCalenderSchedule(false);
    setTimeout(() => {
      setShowClock(true);
    }, 500);
  };

  const calenderDate = () => {
    setCalenderSchedule(false);
    setTimeout(() => {
      setShowCalendar(true);
    }, 500);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowCalendar(false);
  };

  const calenderScheduleDAte = () => {
    setNotificationSchedule(false);
    setTimeout(() => {
      setCalenderSchedule(true);
    }, 500);
  };

  const NotifyScheduleData = (data) => {
    setSelectedData(data);
    setCalenderSchedule(false);
    setTimeout(() => {
      setNotificationSchedule(true);
    }, 500);
  }

  const handleToggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleSelectEmoji = (emojiObject) => {
    const { emoji } = emojiObject;
    // Use emoji Unicode character directly
    setInputMessage((prevMessage) => prevMessage + emoji);
    // Close emoji picker after selection
    setShowEmojiPicker(false);
  };

  const handleAttachFile = () => {
    const fileInput = document.getElementById("fileInput");
    fileInput.click();
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files?.length > 0) {
      const selectedFile = files[0];
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(selectedFile.type)) {
        alert('Please select an image file (JPEG, PNG, GIF, or WebP)');
        e.target.value = ''; // Clear the input
        return;
      }
      
      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (selectedFile.size > maxSize) {
        alert('File size must be less than 10MB');
        e.target.value = ''; // Clear the input
        return;
      }
      
      setSelectedFile(selectedFile);

      // Create preview URL
      const imageUrl = URL.createObjectURL(selectedFile);
      setFilePreview(imageUrl);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
      setFilePreview(null);
    }
    // Clear the file input
    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleUserSelect = async (room) => {
    setTimeout(async () => {
      // Set selected room ID first
      setSelectedRoomId(room.roomId);
      
      // Mark messages as read when room is opened
      setUnreadCounts(prev => ({
        ...prev,
        [room.roomId]: 0
      }));
      
      // Update last message as read
      setLastMessages(prev => ({
        ...prev,
        [room.roomId]: prev[room.roomId] ? { ...prev[room.roomId], isRead: true } : prev[room.roomId]
      }));
      
      // Load messages from cache if available, otherwise fetch from server
      if (messagesByRoom[room.roomId] && messagesByRoom[room.roomId].length > 0) {
        // Restore messages from cache
        setRoomMessages(messagesByRoom[room.roomId]);
      } else {
        // Clear messages if no cache available
        setRoomMessages([]);
      }

      // First, get room details
      await fetchRoomDetails(room.roomId);

      // Ensure gifts are loaded before fetching messages (so gift images can be resolved)
      if (!gifts || gifts?.length === 0) {
        await fetchGifts();
      }

      // Then fetch messages
      await fetchRoomMessages(room.roomId);

      // Check blocking status after selecting user
      await checkBlockingStatus(room.otherUser?._id);
    }, 100);
  };

  // Function to check if selected user is blocked or has blocked current user
  const checkBlockingStatus = async (targetUserId) => {
    if (!targetUserId) return;
    
    const currentUserId = user?._id || storedUserId;
    if (!currentUserId) return;

    try {
      // Fetch blocked users list if not already loaded
      if (blockedUsers?.length === 0) {
        await dispatch(getBlockedUsers(currentUserId)).unwrap();
      }

      // Check if current user has blocked the selected user
      const isBlocked = blockedUsers.some(blockedUser => {
        const blockedId = blockedUser?.blocked?._id || blockedUser?._id || blockedUser?.id;
        return blockedId === targetUserId;
      });
      setIsSelectedUserBlocked(isBlocked);

      // Check if current user is blocked by the selected user
      const blockedByResult = await dispatch(checkIfBlockedBy({ 
        currentUserId, 
        targetUserId 
      })).unwrap();
      
      setIsBlockedBySelectedUser(blockedByResult?.isBlocked || false);
      
    } catch (error) {
      console.error("Error checking blocking status:", error);
    }
  };

  // Fetch room details first
  const fetchRoomDetails = async (roomId) => {
    if (!roomId) return;

    const userId = user?._id || storedUserId;
    if (!userId) return;

    try {
      const response = await getRoomById(roomId, userId);
      if (response?.isSuccess && response?.data) {
        const roomData = response.data;

        // Find the other user (not the current user)
        const otherUser = roomData.users?.find(u => u._id !== userId);

        if (otherUser) {
          setSelectedUser({
            ...otherUser,
            avatar: `${BASE_URL}/assets/images/${otherUser.mainAvatar}`,
            name: otherUser.name,
            _id: otherUser._id
          });
        }
      }
    } catch (error) {
      console.error("❌ Error fetching room details:", error);
      console.error("Error details:", error.response?.data || error.message);
    }
  };

  // Fetch messages for a specific room using socket
  // const fetchRoomMessages = async (roomId) => {
  //   if (!roomId) return;
  //   if (!userId) return;

  //   setLoadingMessages(true);
  //   try {
  //     // Join the room first
  //     joinRoom(roomId);
  //     // Then get chat history
  //     getChatHistory(roomId, 1, 50);
  //     console.log("✅ Room messages fetched successfully");
  //   } catch (error) {
  //     console.error("Error fetching room messages:", error);
  //         setRoomMessages([]);
  //     setLoadingMessages(false);
  //   }
  // };

  const fetchRoomMessages = async (roomId, page = 1, limit = 50) => {
  if (!roomId || !userId) return;

  // Don't fetch if we're already loading or if there are no more messages
  if (loadingMessages || (page > 1 && !hasMoreMessages)) return;

  setLoadingMessages(true);
  try {
    // Join the room first if not already joined
    if (socketService?.currentRoom !== roomId) {
      socketService.joinRoom(roomId);
    }
    
    // Get chat history with pagination
    getChatHistory(roomId, page, limit);
    
  } catch (error) {
    console.error("Error fetching room messages:", error);
    setLoadingMessages(false);
  }
};

  const scrollToBottom = () => {
    if (scrollbarsRef.current) {
      scrollbarsRef.current.scrollToBottom();
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !SelectedFile) {
      return;
    }

    if (!selectedRoomId) {
      console.error("No room selected");
      return;
    }

    if (!userId) {
      console.error("No user ID available");
      return;
    }

    setIsUploading(true);

    try {
      const messageText = inputMessage.trim();
      const replyToId = replyingToMessage?._id || null;

      // If file is selected, upload via API first, then socket will receive the message
      if (SelectedFile) {
        try {
          const response = await sendMessageAPI(
        selectedRoomId,
        userId,
            messageText || 'Sent an image',
            'file',
            replyToId,
        SelectedFile
      );

      if (response?.isSuccess) {
            // File uploaded successfully
            // The message will be received via socket onNewMessage callback
            toast.success("Image sent successfully!");
            
        // Clear input immediately
        setInputMessage("");
        setSelectedEmojis([]);
        setSelectedFile(null);
            if (filePreview) {
              URL.revokeObjectURL(filePreview);
            }
        setFilePreview(null);
        setShowEmojiPicker(false);
        setReplyingToMessage(null);
          } else {
            toast.error("Failed to upload image. Please try again.");
          }
        } catch (error) {
          console.error("Error uploading file:", error);
          toast.error("Failed to upload image. Please try again.");
        }
        } else {
        // Send text message via socket
        if (replyToId) {
          // Use reply_message if replying
          socketSendMessage(selectedRoomId, messageText, replyToId);
        } else {
          // Use send_message for regular messages
          socketSendMessage(selectedRoomId, messageText);
        }

        // Clear input immediately
        setInputMessage("");
        setSelectedEmojis([]);
        setSelectedFile(null);
        setFilePreview(null);
        setShowEmojiPicker(false);
        setReplyingToMessage(null);

        // Note: The message will be added via onNewMessage callback when server confirms
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
    // Open emoji picker with Ctrl+E
    if (e.ctrlKey && e.key === "e") {
      e.preventDefault();
      setShowEmojiPicker(!showEmojiPicker);
    }
  };

  const handleStartEdit = (message) => {
    setEditingMessageId(message._id);
    setEditedContent(message.content);
  };

  const handleSaveEdit = async () => {
    if (!editedContent.trim() || !editingMessageId) {
      return;
    }

    if (!userId) {
      console.error("No user ID available");
      toast.error("Cannot edit message: User not authenticated");
      return;
    }

    try {
      // Send edit via socket
      socketEditMessage(editingMessageId, editedContent.trim());

      // Clear editing state immediately (optimistic update)
      // The actual update will come via onMessageEdited callback
        setEditingMessageId(null);
        setEditedContent('');
    } catch (error) {
      console.error('Error editing message:', error);
      toast.error('Failed to edit message. Please try again.');
    }
  };

  // Handle canceling edit
  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditedContent('');
  };

  // Handle deleting a message
  const handleDeleteMessage = async (messageId) => {
    if (!messageId) {
      console.error("No message ID provided");
      return;
    }

    if (!userId) {
      console.error("No user ID available");
      toast.error("Cannot delete message: User not authenticated");
      return;
    }

    // Optional: Ask for confirmation
    if (!window.confirm("Are you sure you want to delete this message?")) {
      return;
    }

    try {
      // Send delete via socket
      socketDeleteMessage(messageId);

      // Optimistic update - message will be removed via onMessageDeleted callback
      // But we can also remove it immediately
        setRoomMessages(prevMessages =>
          prevMessages.filter(msg => msg._id !== messageId)
        );
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message. Please try again.');
    }
  };

  // Handle replying to a message
  const handleReplyToMessage = (message) => {
    if (!message) {
      return;
    }

    setReplyingToMessage({
      _id: message._id,
      content: message.content,
      senderName: message.senderId?.name || selectedUser?.name || 'User',
      senderId: message.senderId?._id,
      sent: message.sent
    });

    // Automatically focus on input field
    setTimeout(() => {
      const inputField = document.getElementById("exampleFormControlInput2");
      if (inputField) {
        inputField.focus();
      }
    }, 100);
  };

  // Handle canceling reply
  const handleCancelReply = () => {
    setReplyingToMessage(null);
  };

  // Handle gift sending with membership check
  const [userCoins, setUserCoins] = useState(0);
  const [updatingCoins, setUpdatingCoins] = useState(false);

  // Fetch gifts from API
  const fetchGifts = async () => {
    setLoadingGifts(true);
    try {
      const response = await getAllGifts(1, 11);
      if (response.isSuccess) {
        setGifts(response.data.gifts);
      }
    } catch (error) {
      console.error('Error fetching gifts:', error);
      toast.error('Failed to load gifts. Please try again.', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#dc3545',
          color: '#fff',
          fontWeight: '500',
        },
        icon: '❌',
      });
    } finally {
      setLoadingGifts(false);
    }
  };

  // Fetch user coins
  const fetchUserCoins = async () => {
    const userId = user?._id || storedUserId;
    if (!userId) return;

    try {
      const response = await getUserCoins(userId);
      
      if (response.isSuccess) {
        const coins = response.data?.coins || response.data?.balance || 0;
        setUserCoins(coins);
      } else {
        calculateCoinsFromLocalStorage();
      }
    } catch (error) {
      calculateCoinsFromLocalStorage();
    }
  };

  const calculateCoinsFromLocalStorage = () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const storedCoins = userData?.data?.coins || userData?.coins || 0;
      
      if (storedCoins > 0) {
        setUserCoins(storedCoins);
      } else {
        setUserCoins(550);
      }
    } catch (error) {
      setUserCoins(550);
    }
  };

  useEffect(() => {
    const initCoins = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const userId = userData?.data?._id || user?._id || storedUserId;
        if (!userId) return;
        const res = await getUserCoins(userId);
        if (res?.isSuccess) {
          const coins = res.data?.coins || res.data?.balance || 0;
          setUserCoins(coins);
        }
      } catch (e) {
        // ignore
      }
    };
    initCoins();
  }, [user?._id, storedUserId]);

  const handleGiftClick = async (giftItem) => {
    // Check if a room is selected first
    if (!selectedRoomId || !selectedUser) {
      toast.error('Please select a chat to send the gift.', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#dc3545',
          color: '#fff',
          fontWeight: '500',
        },
        icon: '❌',
      });
      return;
    }

    // Check if user has any coins at all
    if (userCoins <= 0) {
      // No coins available - redirect to subscribe page
      toast.error('You need coins to send gifts! Please subscribe to get coins.', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#f24570',
          color: '#fff',
          fontWeight: '500',
        },
        icon: '💎',
      });
      
      // Redirect after a short delay to let user see the toast
      setTimeout(() => {
        navigate('/metrimonial/membership');
      }, 1500);
      return;
    }

    if (userCoins < giftItem.coinCost) {
      toast.error(`Insufficient coins! You need ${giftItem.coinCost} coins but have ${userCoins}. Please get more coins.`, {
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#dc3545',
          color: '#fff',
          fontWeight: '500',
        },
        icon: '💰',
        action: {
          label: 'Get Coins',
          onClick: () => navigate('/metrimonial/membership')
        }
      })
      navigate('/metrimonial/membership');
      return;
    }

    await sendGiftToUser(giftItem);
  };

  const sendGiftToUser = async (giftItem) => {
    if (!selectedRoomId || !selectedUser) {
      console.error("No room or user selected");
      return;
    }

    const userId = user?._id || storedUserId;
    if (!userId) {
      console.error("No user ID available");
      return;
    }

    setSendingGift(true);
    try {
      // Send gift via API
        const giftData = {
          senderId: userId,
          receiverId: selectedUser._id,
          giftId: giftItem._id,
        message: giftItem.description || giftItem.name
      };

      const response = await sendGiftApi(giftData);

      if (response?.isSuccess) {
        const newBalance = response.data.remainingCoins || (userCoins - giftItem.coinCost);
          setUpdatingCoins(true);
          setUserCoins(newBalance);
        
        // Update localStorage with new balance
        try {
          const userData = JSON.parse(localStorage.getItem('userData') || '{}');
          if (userData?.data) {
            userData.data.coins = newBalance;
          } else {
            userData.coins = newBalance;
          }
          localStorage.setItem('userData', JSON.stringify(userData));
        } catch (error) {
          console.error('Error updating localStorage:', error);
        }
        
        // Create gift message for chat
      const giftMessage = `🎁 Sent a gift: ${giftItem.name}`;

        // Send gift message via socket
        socketSendMessage(selectedRoomId, giftMessage);
        
        // Note: The message will be added via onNewMessage callback when server confirms
        
        // Show success toast with updated balance
        toast.success(`Gift "${giftItem.name}" sent successfully! Coins deducted: ${giftItem.coinCost}. New balance: ${newBalance}`, {
          duration: 4000,
          position: 'top-center',
          style: {
            background: '#28a745',
            color: '#fff',
            fontWeight: '500',
          },
          icon: '🎁',
        });

        // Refresh coin balance from API to ensure accuracy
        setTimeout(() => {
          fetchUserCoins();
          setUpdatingCoins(false);
        }, 1000);

        // Notify other components about coin balance change
        window.dispatchEvent(new CustomEvent('coinBalanceUpdated', { 
          detail: { newBalance, deductedAmount: giftItem.coinCost } 
        }));
      }
    } catch (error) {
      console.error("Error sending gift:", error);
      toast.error("Failed to send gift. Please try again.", {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#dc3545',
          color: '#fff',
          fontWeight: '500',
        },
        icon: '❌',
      });
    } finally {
      setSendingGift(false);
    }
  };

  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };


  const handleSearch = (query) => {
    const filtered = chatRooms.filter((room) =>
      room.otherUser?.name?.toLowerCase().includes(query?.toLowerCase()) ||
      room.otherUser?.userName?.toLowerCase().includes(query?.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  const handleChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };



  useEffect(() => {
    // Fetch rooms using socket
    if (userId && isConnected) {
      getMyRooms();
    }

    // Fetch blocked users on component mount
    if (userId) {
      dispatch(getBlockedUsers(userId));
    }

    // Fetch gifts and user coins
    fetchGifts();
    // Delay coin fetching to ensure user data is available
    setTimeout(() => {
      fetchUserCoins();
    }, 1000);
  }, [userId, isConnected, dispatch]);

  // Re-check blocking status when selectedUser changes
  useEffect(() => {
    if (selectedUser?._id) {
      checkBlockingStatus(selectedUser._id);
    }
  }, [selectedUser?._id]);

  // Refresh coins when user data changes
  useEffect(() => {
    if (user?._id || storedUserId) {
      setTimeout(() => {
        fetchUserCoins();
      }, 500);
    }
  }, [user?._id, storedUserId]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showEmojiPicker && !event.target.closest('.emoji-picker-container') && !event.target.closest('.smile-message-input')) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  // Cleanup file preview URL on unmount
  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  // Request notification permission on component mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Incoming calls are handled via real-time socket events (onIncomingCall)
  // No need to poll - socket will notify us immediately when a call comes in
  // useEffect removed - incoming calls come via socket events only

  const renderChatUsersList = () => {
    return (
      <div>
        <MDBInputGroup className="rounded mb-3 px-lg-3">
          <input
            className="form-control headerChat"
            placeholder="Search" 
            type="search"
            style={{ height: 50 }}
            onChange={handleChange}
          />
          <span
            className="input-group-text border-0 pointer"
            id="search-addon"
            style={{
              backgroundColor: "rgb(242, 69, 112)",
              color: "#FFFF",
            }}
          >
            <MDBIcon fas icon="search" />
          </span>
        </MDBInputGroup>

        <Scrollbars className="chat-list-wrap"
          autoHide
          style={{ position: "relative", height: "72vh", padding: "0 0 0 10px" }}
        >
          <MDBTypography listUnStyled className="mb-0 m-3">
            {chatRooms?.length === 0 ? (
              <div className="text-center text-muted p-4">
                <p>No chat rooms available</p>
              </div>
            ) : (filteredItems?.length > 0 ? filteredItems : chatRooms).map((room) => (
              <li
                key={room.roomId}
                className="p-2 border-bottom pointer"
                onClick={() => handleUserSelect(room)}
              >
                <a
                  href="#!"
                  className="d-flex justify-content-between"
                >
                  <div className="d-flex flex-row" style={{ gap: '15px' }}>
                    <div style={{ width: '60px', height: '60px', position: 'relative' }}>
                      <img
                        src={`${BASE_URL}/assets/images/${room.otherUser?.mainAvatar}`}
                        alt="avatar"
                        className="d-flex align-self-center me-3"
                        style={{
                          borderRadius: '50%',
                          objectFit: 'cover',
                          width: '55px',
                          height: '55px'
                        }}
                        onError={(e) => {
                          e.target.src = dummyUserPic;
                        }}
                      />
                      {unreadCounts[room.roomId] > 0 && (
                        <span 
                          className="badge bg-danger rounded-pill"
                          style={{ 
                            position: 'absolute',
                            top: '-5px',
                            right: '-5px',
                            fontSize: '10px',
                            minWidth: '18px',
                            height: '18px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '0 5px',
                            border: '2px solid white',
                            zIndex: 1
                          }}
                        >
                          {unreadCounts[room.roomId] > 99 ? '99+' : unreadCounts[room.roomId]}
                        </span>
                      )}
                      <span className="badge bg-success badge-dot"></span>
                    </div>

                    <div className="pt-1" style={{ flex: 1, minWidth: 0 }}>
                      <div className="d-flex justify-content-between align-items-start">
                        <p className="fw-bold mb-0" style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {room.otherUser?.name}
                        </p>
                        {unreadCounts[room.roomId] > 0 && (
                          <span 
                            className="badge bg-danger rounded-pill ms-2"
                            style={{ 
                              fontSize: '11px',
                              minWidth: '20px',
                              height: '20px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '0 6px'
                            }}
                          >
                            {unreadCounts[room.roomId] > 99 ? '99+' : unreadCounts[room.roomId]}
                          </span>
                        )}
                      </div>
                      <p className="small mb-0" style={{ 
                        color: unreadCounts[room.roomId] > 0 ? '#000' : '#6c757d',
                        fontWeight: unreadCounts[room.roomId] > 0 ? '500' : '400',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {unreadCounts[room.roomId] > 0 ? (
                          <span style={{ color: '#25D366', fontWeight: '600' }}>New message</span>
                        ) : lastMessages[room.roomId] ? (
                          lastMessages[room.roomId].message
                        ) : (
                          ''
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="pt-1 text-end" style={{ minWidth: '60px' }}>
                    <p className="small text-muted mb-0">
                      {lastMessages[room.roomId]?.timestamp 
                        ? new Date(lastMessages[room.roomId].timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                        : new Date(room.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      }
                    </p>
                  </div>
                </a>
              </li>
            ))}
          </MDBTypography>
        </Scrollbars>
      </div>
    );
  };

  const renderChatBox = () => {
    return (
      <div>
        {selectedUser ? (
          <div>
            <div
              className="row py-1 mb-2 border-bottom shadow-md bg-[#f5f5f5];"
            // style={{ marginLeft: "1px", marginRight: "10px" }}
            >
              <div className="col-7 chat-dp">
                {" "}
                {/* Adjusted column width for medium screens and larger */}
                <div className="row chat-status">
                  <div className="col-4 col-lg-2">
                    {" "}
                    {/* Adjusted column width for medium screens and larger */}
                    <img
                      src={ selectedUser.avatar }
                      alt="avatar"
                      className="d-flex align-self-center"
                      style={{
                        borderRadius: '50%',
                        width: "50px",
                        height: "50px",
                        maxWidth: "45px",
                      }}
                    />
                  </div>

                  <div className="col-8 py-2 col-lg-8 d-flex gap-2">
                    {" "}
                    {/* Adjusted column width for medium screens and larger */}
                    <h6>
                      {selectedUser ? selectedUser.name : "Select a user"}<br />
                      <small
                        style={{
                          color: "green",
                          fontSize: "0.9rem",
                          marginTop: "-10px",
                        }}
                      >
                        Active
                      </small>
                    </h6>
                    {/* User coins display */}
                    <div className="mt-1 d-flex align-items-center gap-2">
                      <small style={{
                        color: "#6c757d",
                        fontSize: "0.8rem",
                        fontWeight: "500"
                      }}>
                        💰 {updatingCoins ? (
                          <span style={{ color: "#ffc107" }}>
                            <i className="fa fa-spinner fa-spin"></i> Updating...
                          </span>
                        ) : (
                          `${userCoins} coins`
                        )}
                      </small>
                      <button 
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => {
                          fetchUserCoins();
                        }}
                        style={{ 
                          fontSize: "8px", 
                          padding: "1px 4px",
                          lineHeight: "1"
                        }}
                        title="Refresh coin balance"
                      >
                        <i className="fa fa-refresh"></i>
                      </button>
                      
                    </div>

                  </div>
                </div>
              </div>

              <div className="col-5 chat-opt">
                {" "}
                <div className="float-end me-2 con-info">
                  {" "}
                  <Link className="float-end header__more fs-3 my-2 text-muted" >
                    <span
                      to="#"
                      className="pointer"
                      style={{
                        fontWeight: "700",
                      }}
                      data-bs-toggle="dropdown"
                    >
                      <i
                        class="fa fa-ellipsis-v"
                        aria-hidden="true"
                      ></i>
                    </span>
                    <ul className="dropdown-menu" style={{
                      width: "200px"
                    }}>
                      <li>

                        <Link className="dropdown-item py-2"
                          onClick={() => setCalenderSchedule(true)}
                        >
                          <i
                            className="fa-solid fa-circle-info me-3"
                            aria-hidden="true"
                            title="date Schedule"
                          ></i>{" "}
                          Schedule Date
                        </Link>
                      </li>
                      <li>

                        <Link className="dropdown-item py-2"
                          onClick={() => setCheckCompatibility(true)}
                        >
                          <i
                            className="fa fa-question-circle-o me-3"
                            aria-hidden="true"
                            title="Check Compatibility"
                          ></i>{" "}
                          Compatibility
                        </Link>
                      </li>
                      <li>

                        <Link className="dropdown-item py-2"
                          onClick={() => setMilestone(true)}
                        >
                          <i class="fa fa-history me-3" aria-hidden="true"></i>
                          {" "}
                          Track Milestone
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item py-2"
                          onClick={() => setBlockUser(true)}
                        >
                          <i
                            class="fa fa-ban me-3"
                            aria-hidden="true"
                          ></i>{" "}
                          {isSelectedUserBlocked ? "Unblock" : "Block"}
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item py-2"
                          onClick={() => setReportUser(true)}
                        >
                          <i
                            class="fa fa-flag me-3"
                            aria-hidden="true"
                          ></i>{" "}
                          Report
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item py-2"
                          onClick={() => {
                            setShowCallHistory(true);
                            fetchCallHistory();
                          }}
                        >
                          <i
                            class="fa fa-history me-3"
                            aria-hidden="true"
                          ></i>{" "}
                          Call History
                        </Link>
                      </li>
                    </ul>
                  </Link>

                  <Link className="float-end fs-4 text-muted my-2" onClick={handleShow}>
                    <i class="fa fa-phone" aria-hidden="true"></i>
                  </Link>
                  <IncomingCallModal 
                    show={showModal} 
                    onHide={handleHide}
                    selectedUser={selectedUser}
                    currentUserId={user?._id || storedUserId}
                    selectedRoomId={selectedRoomId}
                  />

                  <Link className="float-end fs-4 text-muted my-2" onClick={handleShowVideoCall}>
                    <i
                      class="fa fa-video-camera"
                      aria-hidden="true"
                    ></i>
                  </Link>
                  <VideoCallModal 
                    show={showVideoCallModal} 
                    onHide={handleHideVideoCall}
                    selectedUser={selectedUser}
                    currentUserId={user?._id || storedUserId}
                    selectedRoomId={selectedRoomId}
                  />

                </div>
              </div>
            </div>

            <div className="message-box">
              {selectedUser ?
                <Scrollbars
                  autoHide className="msg-wrap"
                  style={{ position: "relative", height: "65vh", paddingBottom: "120px" }}
                  id="chat-container"
                  ref={scrollbarsRef}
                >
                  {(() => {
                   
                    return null;
                  })()}

                  {loadingMessages ? (
                    <div className="text-center p-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Loading messages...</span>
                      </div>
                    </div>
                  ) : roomMessages?.length === 0 ? (
                    <div className="text-center text-muted p-5">
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    <>
                      {roomMessages.map((message) => {
                       
                        return (
                          <div
                            key={message.id}
                            className={`px-3 px-md-5 d-flex flex-row chat-solo justify-content-${message.sent ? "end" : "start"
                              }`}
                          >
                          {message.sent ? (
                            <>

                              <div style={{ maxWidth: "70%", display: "flex", alignItems: "center" }}>
                                {message.messageType === 'file' || message.fileUrl ? (
                                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                                  <img
                                      src={message.fileUrl ? (message.fileUrl.startsWith('http') ? message.fileUrl : `${BASE_URL}/${message.fileUrl}`) : (message.file ? URL.createObjectURL(message.file) : '')}
                                    alt={`file ${message.id}`}
                                    style={{
                                        maxWidth: "200px",
                                        maxHeight: "200px",
                                        borderRadius: "8px",
                                        objectFit: "cover",
                                        cursor: "pointer"
                                      }}
                                      onError={(e) => {
                                        console.error('Error loading image:', message.fileUrl);
                                        e.target.src = dummyUserPic;
                                      }}
                                      onClick={() => {
                                        // Open image in new tab for full view
                                        const imageUrl = message.fileUrl ? (message.fileUrl.startsWith('http') ? message.fileUrl : `${BASE_URL}/${message.fileUrl}`) : (message.file ? URL.createObjectURL(message.file) : '');
                                        if (imageUrl) {
                                          window.open(imageUrl, '_blank');
                                        }
                                      }}
                                    />
                                    {message.content && (
                                      <div
                                        className="small p-2 me-3 mb-1 rounded-3"
                                        style={{
                                          backgroundColor: "#f24570",
                                          color: "#ffffff",
                                          display: "inline-block",
                                          marginTop: "8px"
                                        }}
                                      >
                                        {message.content}
                                      </div>
                                    )}
                                  </div>
                                ) : message.messageType === 'gift' ? (
                                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                                    {(() => {
                                      const parsedName = (message?.content || "").split(": ")[1] || "";
                                      const imgUrl = message?.giftData?.imageUrl || (gifts.find(g => g.name === parsedName)?.imageUrl);
                                      return (
                                        <div className="small p-2 me-3 mb-1 rounded-3 gift-pop" style={{ backgroundColor: "#f24570", color: "#ffffff", display: "flex", alignItems: "center", gap: "10px", border: "2px solid #ffd700" }}>
                                          {imgUrl ? (
                                            <img src={imgUrl} alt={parsedName || 'gift'} style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover' }} />
                                          ) : (
                                            <span style={{ fontSize: "20px" }}>🎁</span>
                                          )}
                                          <div>
                                            <div style={{ fontWeight: "600" }}>Gift Sent!</div>
                                            {parsedName && <div style={{ fontSize: "12px", opacity: 0.9 }}>{parsedName}</div>}
                                          </div>
                                        </div>
                                      );
                                    })()}
                                  </div>
                                ) : (
                                  <>
                                    <div className="dropdown" style={{ marginRight: "8px" }}>
                                      <button
                                        className="btn btn-sm btn-link text-muted p-1 mt-[10px] ml-[10px]" style={{ marginRight: "10px", marginTop: "10px" }}
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                      >
                                        ⋮
                                      </button>
                                      <ul className="dropdown-menu">
                                        <li>
                                          <button
                                            className="dropdown-item"
                                            onClick={() => handleStartEdit(message)}
                                          >
                                            Edit
                                          </button>
                                        </li>
                                        <li>
                                          <button
                                            className="dropdown-item"
                                            onClick={() => handleDeleteMessage(message._id)}
                                          >
                                            Delete
                                          </button>
                                        </li>
                                        <li>
                                          <button
                                            className="dropdown-item"
                                            onClick={() => handleReplyToMessage(message)}
                                          >
                                            Reply
                                          </button>
                                        </li>
                                      </ul>
                                    </div>

                                    <div>
                                      {editingMessageId === message._id ? (
                                        <div className="d-flex flex-column">
                                          <input
                                            type="text"
                                            className="form-control mb-2"
                                            value={editedContent}
                                            onChange={(e) => setEditedContent(e.target.value)}
                                            onKeyDown={(e) => {
                                              if (e.key === 'Enter') {
                                                handleSaveEdit();
                                              } else if (e.key === 'Escape') {
                                                handleCancelEdit();
                                              }
                                            }}
                                            autoFocus
                                            style={{
                                              backgroundColor: "#fff",
                                              color: "#000",
                                            }}
                                          />
                                          <div className="d-flex gap-2">
                                            <button
                                              className="btn btn-sm btn-success"
                                              onClick={handleSaveEdit}
                                            >
                                              Save
                                            </button>
                                            <button
                                              className="btn btn-sm btn-secondary"
                                              onClick={handleCancelEdit}
                                            >
                                              Cancel
                                            </button>
                                          </div>
                                        </div>
                                      ) : (
                                        <>
                                          <div
                                            className="small p-2 me-3 mb-1 rounded-3"
                                            style={{
                                              backgroundColor: "#f24570",
                                              color: "#ffffff",
                                              display: "inline-block",
                                              fontSize: "14px",
                                              lineHeight: "1.4",
                                              wordBreak: "break-word"
                                            }}
                                          >
                                            {/* Reply Information */}
                                            {message.replyTo && (
                                              <div
                                                style={{
                                                  backgroundColor: "rgba(255,255,255,0.15)",
                                                  padding: "6px 8px",
                                                  borderRadius: "4px",
                                                  marginBottom: "6px",
                                                  fontSize: "11px",
                                                  borderLeft: "3px solid #fff"
                                                }}
                                              >
                                                <div style={{ fontWeight: "600", marginBottom: "2px" }}>
                                                  Replied by: {message.replyTo.senderId?.name || 'You'}
                                                </div>
                                                <div style={{ opacity: 0.85, fontStyle: "italic" }}>
                                                  {message.replyTo.content?.length > 40
                                                    ? message.replyTo.content.substring(0, 40) + '...'
                                                    : message.replyTo.content}
                                                </div>
                                              </div>
                                            )}
                                            {message.content}
                                          </div>
                                          <p
                                            className="small me-3 mb-0 text-muted"
                                            style={{ fontSize: "11px" }}
                                          >
                                            {message.timestamp}
                                          </p>
                                        </>
                                      )}
                                    </div>
                                  </>
                                )}
                              </div>


                              <img
                                src={`${BASE_URL}/assets/images/${user.mainAvatar}`}
                                alt={`avatar ${message.id}`}
                                style={{
                                  borderRadius: '50%',
                                  width: "45px",
                                  height: "45px",
                                  objectFit: 'cover',
                                  height: "45px",
                                  maxWidth: "45px",
                                }}
                                onError={(e) => {
                                  e.target.src = dummyUserPic;
                                }}
                              />
                            </>
                          ) : (


                            <>
                              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", maxWidth: "100%" }}>

                                <img
                                  src={selectedUser ? selectedUser.avatar :"main233333"}
                                  alt="avatar"
                                  className="d-flex align-self-center"
                                  style={{
                                    borderRadius: "50%",
                                    width: "45px",
                                    height: "45px",
                                    flexShrink: 0,
                                  }}
                                />

                                <div style={{ display: "flex", alignItems: "center", maxWidth: "80%", flexWrap: "wrap" }}>
                                  {message.messageType === 'file' || message.fileUrl ? (
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                                    <img
                                        src={message.fileUrl ? (message.fileUrl.startsWith('http') ? message.fileUrl : `${BASE_URL}/${message.fileUrl}`) : (message.file ? URL.createObjectURL(message.file) : '')}
                                      alt={`file ${message.id}`}
                                      style={{
                                          maxWidth: "200px",
                                          maxHeight: "200px",
                                        borderRadius: "8px",
                                          objectFit: "cover",
                                          cursor: "pointer"
                                        }}
                                        onError={(e) => {
                                          console.error('Error loading image:', message.fileUrl);
                                          e.target.src = dummyUserPic;
                                        }}
                                        onClick={() => {
                                          // Open image in new tab for full view
                                          const imageUrl = message.fileUrl ? (message.fileUrl.startsWith('http') ? message.fileUrl : `${BASE_URL}/${message.fileUrl}`) : (message.file ? URL.createObjectURL(message.file) : '');
                                          if (imageUrl) {
                                            window.open(imageUrl, '_blank');
                                          }
                                        }}
                                      />
                                      {message.content && (
                                        <div
                                          className="small p-2 mb-1 rounded-3"
                                          style={{
                                            backgroundColor: "#f5f6f7",
                                            color: "#000",
                                            marginRight: "8px",
                                            display: "inline-block",
                                            marginTop: "8px"
                                          }}
                                        >
                                          {message.content}
                                        </div>
                                      )}
                                    </div>
                                  ) : message.messageType === 'gift' ? (
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                                      {(() => {
                                        const parsedName = (message?.content || "").split(": ")[1] || "";
                                        const imgUrl = message?.giftData?.imageUrl || (gifts.find(g => g.name === parsedName)?.imageUrl);
                                        return (
                                          <div className="small p-2 mb-1 rounded-3 gift-pop" style={{ backgroundColor: "#f5f6f7", color: "#000", marginRight: "8px", display: "flex", alignItems: "center", gap: "10px", border: "2px solid #ffd700" }}>
                                            {imgUrl ? (
                                              <img src={imgUrl} alt={parsedName || 'gift'} style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover' }} />
                                            ) : (
                                              <span style={{ fontSize: "20px" }}>🎁</span>
                                            )}
                                            <div>
                                              <div style={{ fontWeight: "600", color: "#f24570" }}>Gift Received!</div>
                                              {parsedName && <div style={{ fontSize: "12px", color: "#6c757d" }}>{parsedName}</div>}
                                            </div>
                                          </div>
                                        );
                                      })()}
                                    </div>
                                  ) : (
                                    <>
                                      <div
                                        className="small p-2 mb-1 rounded-3"
                                        style={{
                                          backgroundColor: "#f5f6f7",
                                          color: "#000",
                                          marginRight: "8px",
                                          display: "inline-block",
                                          fontSize: "14px",
                                          lineHeight: "1.4",
                                          wordBreak: "break-word"
                                        }}
                                      >
                                        {/* Reply Information */}
                                        {message.replyTo && (
                                          <div
                                            style={{
                                              backgroundColor: "rgba(242, 69, 112, 0.1)",
                                              padding: "6px 8px",
                                              borderRadius: "4px",
                                              marginBottom: "6px",
                                              fontSize: "11px",
                                              borderLeft: "3px solid #f24570"
                                            }}
                                          >
                                            <div style={{ fontWeight: "600", marginBottom: "2px", color: "#f24570" }}>
                                              Replied to: {message.replyTo.senderId?.name || 'You'}
                                            </div>
                                            <div style={{ color: "#6c757d", fontStyle: "italic" }}>
                                              {message.replyTo.content?.length > 40
                                                ? message.replyTo.content.substring(0, 40) + '...'
                                                : message.replyTo.content}
                                            </div>
                                          </div>
                                        )}
                                        {message.content}
                                      </div>

                                      <div className="dropdown" style={{ marginLeft: "10px", marginTop: "0px" }}>
                                        <button
                                          className="btn btn-sm btn-link text-muted p-1 mt-[10px] " style={{ marginLeft: "10px", marginTop: "10px" }}
                                          type="button"
                                          data-bs-toggle="dropdown"
                                          aria-expanded="false"
                                        >
                                          ⋮
                                        </button>
                                        <ul className="dropdown-menu">

                                        
                                          <li>
                                            <button
                                              className="dropdown-item"
                                              onClick={() => handleReplyToMessage(message)}
                                            >
                                              Reply
                                            </button>
                                          </li>
                                        </ul>
                                      </div>

                                      <p
                                        className="small text-muted mb-0"
                                        style={{
                                          fontSize: "11px",
                                          width: "100%",
                                          marginLeft: "4px",
                                        }}
                                      >
                                        {message.timestamp}
                                      </p>
                                    </>
                                  )}
                                </div>
                              </div>
                            </>

                          )}
                          </div>
                        )
                      })}
                      
                      {/* Typing Indicator */}
                      {typingUsers[selectedRoomId] && (
                        <div className="px-3 px-md-5 d-flex flex-row chat-solo justify-content-start">
                          <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                            <img
                              src={`${BASE_URL}/assets/images/${selectedUser?.mainAvatar}`}
                              alt="avatar"
                              className="d-flex align-self-center"
                              style={{
                                borderRadius: "50%",
                                width: "45px",
                                height: "45px",
                                flexShrink: 0,
                              }}
                            />
                            <div
                              className="small p-2 mb-1 rounded-3"
                              style={{
                                backgroundColor: "#f5f6f7",
                                color: "#6c757d",
                                display: "inline-block",
                                fontSize: "14px",
                                fontStyle: "italic"
                              }}
                            >
                              {typingUsers[selectedRoomId].userName} is typing...
                              <span className="ms-2">
                                <span className="typing-dot" style={{ animationDelay: '0s' }}>.</span>
                                <span className="typing-dot" style={{ animationDelay: '0.2s' }}>.</span>
                                <span className="typing-dot" style={{ animationDelay: '0.4s' }}>.</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Unblock button at the end of messages (Instagram style) */}
                      {isSelectedUserBlocked && (
                        <div className="text-center py-3 px-3">
                          <button
                            className="btn btn-outline-success"
                            onClick={() => setBlockUser(true)}
                            style={{
                              borderRadius: "25px",
                              padding: "10px 25px",
                              fontSize: "14px",
                              fontWeight: "500",
                              borderWidth: "2px",
                              borderColor: "rgb(242, 69, 112)",
                              color: "rgb(242, 69, 112)",
                              transition: "all 0.3s ease"
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = "rgb(242, 69, 112)";
                              e.target.style.color = "white";
                              // Make icon white on hover
                              const icon = e.target.querySelector('i');
                              if (icon) {
                                icon.style.color = "white";
                              }
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = "transparent";
                              e.target.style.color = "rgb(242, 69, 112)";
                              // Make icon pink again when not hovering
                              const icon = e.target.querySelector('i');
                              if (icon) {
                                icon.style.color = "rgb(242, 69, 112)";
                              }
                            }}
                            >
                              <i className="fa fa-unlock me-2" aria-hidden="true" style={{ color: "rgb(242, 69, 112)" }}></i>
                              Unblock {selectedUser?.name}
                            </button>
                        </div>
                      )}
                    </>
                  )}
                </Scrollbars> : <div>
                  <img
                    src={chatBG}
                    alt="chat backgrount picture"
                    style={{ backgroundSize: "cover" }}
                  />
                </div>
              }
            </div>

            {/* File Preview */}
            {filePreview && (
              <div
                className="file-preview px-3 py-2 mt-2 mx-2"
                style={{
                  backgroundColor: "#f8f9fa",
                  borderLeft: "4px solid #28a745",
                  borderRadius: "4px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
                  <img
                    src={filePreview}
                    alt="File preview"
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginRight: "10px"
                    }}
                  />
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: "600", color: "#28a745" }}>
                      Photo selected
                    </div>
                    <div style={{ fontSize: "11px", color: "#6c757d" }}>
                      {SelectedFile?.name || 'Image file'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleRemoveFile}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "20px",
                    cursor: "pointer",
                    color: "#dc3545",
                    padding: "0 10px"
                  }}
                  title="Remove file"
                >
                  ×
                </button>
              </div>
            )}

            {/* Reply Preview */}
            {replyingToMessage && (
              <div
                className="reply-preview px-3 py-2 mt-2 mx-2"
                style={{
                  backgroundColor: "#f8f9fa",
                  borderLeft: "4px solid #f24570",
                  borderRadius: "4px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "12px", fontWeight: "600", color: "#f24570" }}>
                    {replyingToMessage.sent
                      ? `Replying to yourself`
                      : `Replying to ${replyingToMessage.senderName}`}
                  </div>
                  <div style={{ fontSize: "13px", color: "#6c757d", marginTop: "4px" }}>
                    {replyingToMessage.content?.length > 50
                      ? replyingToMessage.content.substring(0, 50) + '...'
                      : replyingToMessage.content}
                  </div>
                </div>
                <button
                  onClick={handleCancelReply}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "20px",
                    cursor: "pointer",
                    color: "#6c757d",
                    padding: "0 10px"
                  }}
                  title="Cancel reply"
                >
                  ×
                </button>
              </div>
            )}

            {/* Show block message if blocked or being blocked */}
            {(isSelectedUserBlocked || isBlockedBySelectedUser) ? (
              <div 
                className="text-center py-4 mt-4"
                style={{
                  backgroundColor: "#f8d7da",
                  color: "#721c24",
                  borderRadius: "8px",
                  margin: "0 20px"
                }}
              >
                <i className="fa fa-ban me-2" aria-hidden="true"></i>
                <div className="mb-3">
                  {isSelectedUserBlocked 
                    ? "You have blocked this user. Chat is disabled."
                    : "This user has blocked you. Chat is disabled."}
                </div>
                {/* Unblock button for when current user has blocked the other user */}
                {isSelectedUserBlocked && (
                  <button
                    className="btn btn-success"
                    onClick={() => setBlockUser(true)}
                    style={{
                      borderRadius: "20px",
                      padding: "8px 20px",
                      fontSize: "14px",
                      fontWeight: "500"
                    }}
                  >
                    <i className="fa fa-unlock me-2" aria-hidden="true"></i>
                    Unblock
                  </button>
                )}
              </div>
            ) : (
              <div
                className=" inputChat text-muted d-flex  align-items-center  py-1 mt-4"
                style={{
                  float: "right",
                  backgroundColor: "#e9ecef",
                }}
              >
              <div className="header__more px-3">
                <span
                  to="#"
                  className="pointer "
                  style={{
                    fontWeight: "700",
                  }}
                  data-bs-toggle="dropdown"
                >
                  <i
                    class="fa fa-paperclip fs-5"
                    aria-hidden="true"
                  ></i>{" "}
                </span>
                <ul className="dropdown-menu">
                  <li>
                    <label className="dropdown-item py-2" style={{ cursor: "pointer" }}>
                      <i
                        className="fa fa-picture-o me-2"
                        aria-hidden="true"
                      ></i>{" "}
                      Photo
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                        id="fileInput"
                      />
                    </label>
                  </li>
                  <li>
                    <Link className="dropdown-item py-2">
                      <i
                        class="fa fa-map-marker me-2"
                        aria-hidden="true"
                      ></i>{" "}
                      Location
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="header__more dropup" >
                <span
                  to="#"
                  className="pointer"
                  style={{
                    fontWeight: "600",
                  }}
                  data-bs-toggle="dropdown"
                  onClick={fetchGifts}
                >
                  <i
                    className="fa-solid fa-gift fa-xl"
                    aria-hidden="true"
                  ></i>{" "}
                </span>
                <ul className="dropdown-menu p-3" style={{
                  width: "450px"
                }}>
                  {/* User coins display */}
                  <div className="mb-3 p-2" style={{
                    backgroundColor: userCoins > 0 ? "#d4edda" : "#f8d7da",
                    borderRadius: "8px",
                    border: `1px solid ${userCoins > 0 ? "#c3e6cb" : "#f5c6cb"}`
                  }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <span style={{ 
                        fontWeight: "600", 
                        color: userCoins > 0 ? "#155724" : "#721c24" 
                      }}>
                        💰 Your Coins: {userCoins}
                        {userCoins <= 0 && (
                          <small className="d-block" style={{ fontSize: "10px", color: "#721c24" }}>
                            No coins available - Subscribe to get coins!
                          </small>
                        )}
                      </span>
                      <button 
                        className="btn btn-sm btn-outline-primary"
                        onClick={fetchUserCoins}
                        style={{ fontSize: "10px", padding: "2px 6px" }}
                      >
                        Refresh
                      </button>
                    </div>
                  </div>

                  {loadingGifts ? (
                    <div className="text-center p-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Loading gifts...</span>
                      </div>
                      <p className="mt-2 mb-0" style={{ fontSize: "12px", color: "#6c757d" }}>
                        Loading gifts...
                      </p>
                    </div>
                  ) : gifts?.length === 0 ? (
                    <div className="text-center p-4">
                      <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
                        No gifts available
                      </p>
                    </div>
                  ) : userCoins <= 0 ? (
                    <div className="text-center p-4">
                      <div style={{ fontSize: "48px", color: "#dc3545", marginBottom: "15px" }}>
                        💰
                      </div>
                      <h5 style={{ color: "#721c24", marginBottom: "10px" }}>No Coins Available</h5>
                      <p style={{ color: "#6c757d", marginBottom: "20px" }}>
                        You need coins to send gifts. Subscribe to get coins and start sending gifts!
                      </p>
                      <button 
                        className="btn btn-primary"
                        onClick={() => navigate('/metrimonial/membership')}
                        style={{
                          borderRadius: "25px",
                          padding: "10px 25px",
                          fontWeight: "500"
                        }}
                      >
                        <i className="fa fa-gem me-2"></i>
                        Get Coins Now
                      </button>
                    </div>
                  ) : (
                  <div style={{
                    display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: "12px",
                    listStyle: "none",
                    padding: 0,
                    margin: 0
                }}>
                      {gifts.map((item) => (
                        <li key={item._id} style={{ 
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                          cursor: "pointer",
                          padding: "8px",
                          borderRadius: "8px",
                          transition: "background-color 0.2s ease",
                          backgroundColor: userCoins >= item.coinCost ? "transparent" : "#f8f9fa"
                        }}
                        onMouseEnter={(e) => {
                          if (userCoins >= item.coinCost) {
                            e.currentTarget.style.backgroundColor = "#f8f9fa";
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = userCoins >= item.coinCost ? "transparent" : "#f8f9fa";
                        }}>
                          <div
                        role="img"
                        aria-label="gift icon"
                        aria-hidden="true"
                          onClick={() => handleGiftClick(item)}
                            style={{ 
                              cursor: userCoins >= item.coinCost ? "pointer" : "not-allowed",
                              opacity: userCoins >= item.coinCost ? 1 : 0.5
                            }}
                      >
                        <img
                          className="m-1 pointer"
                              src={item.imageUrl}
                          alt={item.name}
                            style={{ 
                              width: "60px", 
                              height: "60px",
                              transition: "transform 0.2s ease",
                              borderRadius: "8px",
                              objectFit: "cover"
                            }}
                            onMouseEnter={(e) => {
                                if (userCoins >= item.coinCost) {
                              e.target.style.transform = "scale(1.1)";
                              e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
                                }
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = "scale(1)";
                              e.target.style.boxShadow = "none";
                            }}
                        />
                          </div>
                        <div style={{ 
                          fontSize: "10px", 
                          textAlign: "center", 
                          marginTop: "5px",
                          fontWeight: "500",
                            color: userCoins >= item.coinCost ? "#495057" : "#6c757d"
                        }}>
                      {item.name}
                        </div>
                          <div style={{ 
                            fontSize: "9px", 
                            textAlign: "center", 
                            marginTop: "2px",
                            fontWeight: "600",
                            color: userCoins >= item.coinCost ? "#28a745" : "#dc3545"
                          }}>
                            💰 {item.coinCost} coins
                          </div>
                          {userCoins < item.coinCost && (
                            <div style={{ 
                              fontSize: "8px", 
                              textAlign: "center", 
                              marginTop: "2px",
                              color: "#dc3545",
                              fontWeight: "500"
                            }}>
                              Insufficient coins
                            </div>
                          )}
                    </li>
                  ))}
                  </div>
                  )}
                </ul>
              </div>

              <div
                className="input-vox-chat"

              >
                <input
                  type="text"
                  className="form-control form-control-lg message-input"
                  id="exampleFormControlInput2"
                  placeholder="Type message"
                  value={inputMessage}
                  onChange={(e) => {
                    setInputMessage(e.target.value);
                    // Start typing indicator
                    if (selectedRoomId && e.target.value.trim()) {
                      startTyping(selectedRoomId);
                    }
                  }}
                  onBlur={() => {
                    // Stop typing indicator when input loses focus
                    if (selectedRoomId) {
                      stopTyping(selectedRoomId);
                    }
                  }}
                  multiple
                  onKeyDown={handleKeyDown}
                />
                <div className="smile-message-input">
                  
                  
                  <span
                    className="pointer"
                    style={{
                      fontWeight: "600",
                      cursor: "pointer",
                      padding: "8px",
                      borderRadius: "50%",
                      transition: "background-color 0.2s"
                    }}
                    onClick={handleToggleEmojiPicker}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#f0f0f0";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "transparent";
                    }}
                    title="Emoji Picker (Ctrl+E)"
                  >
                    <i
                      className="fa-solid fa-face-smile fa-xl"
                      style={{ color: showEmojiPicker ? "#f24570" : "#6c757d" }}
                    ></i>
                  </span>
                </div>
              </div>


              <button
                className="send-btn fs-4"
                onClick={handleSendMessage}
                disabled={isUploading || sendingGift}
                style={{
                  opacity: (isUploading || sendingGift) ? 0.6 : 1,
                  cursor: (isUploading || sendingGift) ? 'not-allowed' : 'pointer'
                }}
              >
                {(isUploading || sendingGift) ? (
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="sr-only">Sending...</span>
                  </div>
                ) : (
                <MDBIcon fas icon="paper-plane" />
                )}
              </button>

              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div
                  className="emoji-picker-container"
                  style={{
                    position: "absolute",
                    bottom: "70px",
                    right: "20px",
                    zIndex: 1000,
                    backgroundColor: "white",
                    borderRadius: "12px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                    border: "1px solid #e0e0e0"
                  }}
                >
                  <EmojiPicker 
                    onEmojiClick={handleSelectEmoji}
                    width={350}
                    height={400}
                    searchDisabled={false}
                    skinTonesDisabled={false}
                    previewConfig={{
                      showPreview: true
                    }}
                  />
                </div>
              )}
            </div>
            )}
          </div>) : (
          <div className="chat-banner">
            <img
              src={chatBG2}
              alt="chat backgrount picture"
              className="vh-100 chat-bg"
            />
          </div>
        )}
      </div>
    );
  };


  return (
    <div className="dating-chat-wrap">
      <HeaderFour />
      <MDBContainer fluid className="custom-fluid" >
        <MDBRow>
          <MDBCol md="12" style={{ paddingLeft: "0", paddingRight: "0" }}>
            <MDBCard id="chat3" style={{ borderRadius: "0" }}>
              <MDBCardBody className="p-0">
                <MDBRow>
                  <MDBCol
                    md="5"
                    lg="4"
                    xl="3"
                    className="mb-4 mb-md-0 p-0"
                    style={{ borderRight: "2px solid lightgray" }}
                  >
                    {isMobileView && !selectedUser && renderChatUsersList()}
                    {!isMobileView && renderChatUsersList()}
                  </MDBCol>


                  <MDBCol md="7" lg="8" xl="9" className="p-0">
                    {!isMobileView && !selectedUser && renderChatBox()}
                    {selectedUser && renderChatBox()}
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
        <CalenderScheduleMetri
          showModal={calenderSchedule}
          hideModal={() => setCalenderSchedule(false)}
          calenderDate={calenderDate}
          clockTime={clockTime}
        />
        <CheckCompatibilityModalMetri
          showModal={CheckCompatibility}
          hideModal={() => setCheckCompatibility(false)}
        />
        <EventNotificationScheduleModal
          showModal={NotificationSchedule}
          hideModal={() => setNotificationSchedule(false)}
          calenderScheduleDAte={calenderScheduleDAte}
          selectedUser={selectedUser}
          editIndex={editIndex}
          ViewUser={ViewUser}
          setEditIndex={setEditIndex}
          userInfoDate={() => setNotificationSchedule(true)}
          scheduledData={selectedData}
        />
        <BlockUserModalMetri
          showModal={blocklUser}
          hideModal={() => setBlockUser(false)}
          selectedUser={selectedUser}
          isBlocked={isSelectedUserBlocked}
          onBlockStatusChange={() => checkBlockingStatus(selectedUser?._id)}
        />
        <ReportUserModalMetri
          showModal={reportUser}
          hideModal={() => setReportUser(false)}
          selectedUser={selectedUser}
        />
        <RelationshipMilestoneTrackerMetri
          showModal={Milestone}
          hideModal={() => setMilestone(false)}
          selectedUser={selectedUser}
        />

        <EventCalenderScheduleModal
          showModal={calenderSchedule}
          hideModal={() => setCalenderSchedule(false)}
          calenderDate={calenderDate}
          NotifyScheduleData={NotifyScheduleData}
          clockTime={clockTime}
        />

        {/* Persistent Call Notification Bar (like WhatsApp) */}
        {incomingCall && !showIncomingCallModal && !showVideoCallModal && incomingCall.status === 'ringing' && !callConnected && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 10000,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
              cursor: 'pointer',
              animation: 'slideDown 0.3s ease-out'
            }}
            onClick={() => {
              if (incomingCall.callType === 'video') {
                setShowVideoCallModal(true);
              } else {
                setShowIncomingCallModal(true);
              }
              setIsCallModalManuallyClosed(false);
            }}
          >
            <style>{`
              @keyframes slideDown {
                from {
                  transform: translateY(-100%);
                  opacity: 0;
                }
                to {
                  transform: translateY(0);
                  opacity: 1;
                }
              }
              @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.6; }
              }
            `}</style>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'pulse 2s infinite'
              }}>
                {incomingCall.callerId.mainAvatar ? (
                  <img 
                    src={`${BASE_URL}/assets/images/${incomingCall.callerId.mainAvatar}`}
                    alt={incomingCall.callerId.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <i className="fa fa-user" style={{ fontSize: '20px' }}></i>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                  {incomingCall.callerId.name}
                </div>
                <div style={{ fontSize: '12px', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ animation: 'pulse 1.5s infinite' }}>📞</span>
                  Incoming {incomingCall.callType === 'video' ? 'Video' : 'Voice'} Call
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (incomingCall.callType === 'video') {
                    setShowVideoCallModal(true);
                  } else {
                    setShowIncomingCallModal(true);
                  }
                  setIsCallModalManuallyClosed(false);
                }}
                style={{
                  background: 'rgba(255,255,255,0.3)',
                  border: 'none',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '14px',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.4)'}
                onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
              >
                Open
              </button>
            </div>
          </div>
        )}

        {/* Incoming Call Modal - Show VideoCallModal for video calls, IncomingCallModal for audio */}
        {incomingCall && incomingCall.callType === 'video' ? (
          <VideoCallModal 
            show={showVideoCallModal} 
            onHide={() => {
              // Don't clear incomingCall if call is still ringing - just hide modal
              if (incomingCall && incomingCall.status === 'ringing' && !callConnected) {
                setShowVideoCallModal(false);
                setIsCallModalManuallyClosed(true);
              } else {
                if (incomingCall) {
                  const notificationKey = `call_notification_${incomingCall._id}`;
                  sessionStorage.removeItem(notificationKey);
                }
                setShowVideoCallModal(false);
                setIncomingCall(null);
                setIsCallModalManuallyClosed(false);
              }
            }}
            selectedUser={{
              _id: incomingCall.callerId._id,
              name: incomingCall.callerId.name,
              avatar: `${BASE_URL}/assets/images/${incomingCall.callerId.mainAvatar}`
            }}
            currentUserId={user?._id || storedUserId}
            selectedRoomId={incomingCall.roomId}
            callId={incomingCall._id}
            isIncomingCall={incomingCall.status === 'ringing'}
            callerName={incomingCall.callerId.name}
            initialCallConnected={callConnected || incomingCall.status === 'connected'}
            initialCallStartTime={callStartTime || incomingCall.startTime}
          />
        ) : incomingCall && (
          <IncomingCallModal 
            show={showIncomingCallModal} 
            onHide={() => {
              // Don't clear incomingCall if call is still ringing - just hide modal
              // This allows the notification bar to show
              if (incomingCall && incomingCall.status === 'ringing' && !callConnected) {
                setShowIncomingCallModal(false);
                setIsCallModalManuallyClosed(true);
                // Keep incomingCall state so notification bar can show
              } else {
                // Call ended or declined - clear everything
                if (incomingCall) {
                  const notificationKey = `call_notification_${incomingCall._id}`;
                  sessionStorage.removeItem(notificationKey);
                }
                setShowIncomingCallModal(false);
                setIncomingCall(null);
                setIsCallModalManuallyClosed(false);
              }
            }}
            selectedUser={{
              _id: incomingCall.callerId._id,
              name: incomingCall.callerId.name,
              avatar: `${BASE_URL}/assets/images/${incomingCall.callerId.mainAvatar}`
            }}
            currentUserId={user?._id || storedUserId}
            selectedRoomId={incomingCall.roomId}
            callId={incomingCall._id}
            isIncomingCall={incomingCall.status === 'ringing'}
            callerName={incomingCall.callerId.name}
            initialCallConnected={callConnected || incomingCall.status === 'connected'}
            initialCallStartTime={callStartTime || incomingCall.startTime}
          />
        )}

        {/* Call History Modal */}
        <Modal show={showCallHistory} onHide={() => setShowCallHistory(false)} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>Call History</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {callHistory?.length === 0 ? (
                <div className="text-center text-muted p-4">
                  <p>No call history available</p>
                </div>
              ) : (
                callHistory.map((call) => {
                  const isIncoming = call.calleeId._id === (user?._id || storedUserId);
                  const otherUser = isIncoming ? call.callerId : call.calleeId;
                  const statusColor = {
                    'connected': '#28a745',
                    'declined': '#dc3545',
                    'ringing': '#ffc107'
                  };

                  const isActiveCall = call.status === 'connected';
                  
                  return (
                    <div 
                      key={call._id} 
                      className={`d-flex align-items-center p-3 border-bottom ${isActiveCall ? 'cursor-pointer' : ''}`}
                      style={{
                        cursor: isActiveCall ? 'pointer' : 'default',
                        backgroundColor: isActiveCall ? '#f8f9fa' : 'transparent',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        if (isActiveCall) {
                          e.currentTarget.style.backgroundColor = '#e9ecef';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (isActiveCall) {
                          e.currentTarget.style.backgroundColor = '#f8f9fa';
                        }
                      }}
                      onClick={() => {
                        if (isActiveCall) {
                          // Open call modal for active call
                          setIncomingCall({
                            _id: call._id,
                            callerId: {
                              _id: otherUser._id,
                              name: otherUser.name,
                              mainAvatar: otherUser.mainAvatar || null
                            },
                            calleeId: {
                              _id: user?._id || storedUserId
                            },
                            status: 'connected',
                            roomId: call.roomId,
                            callType: call.callType,
                            startTime: call.startTime
                          });
                          setCurrentCallId(call._id);
                          setCallConnected(true);
                          setCallInitiated(false);
                          // Set call start time if available
                          if (call.startTime) {
                            setCallStartTime(new Date(call.startTime));
                          }
                          // Show appropriate modal based on call type
                          if (call.callType === 'video') {
                            setShowVideoCallModal(true);
                            setShowIncomingCallModal(false);
                          } else {
                            setShowIncomingCallModal(true);
                            setShowVideoCallModal(false);
                          }
                          setShowCallHistory(false); // Close call history modal
                        }
                      }}
                    >
                      <img
                        src={`${BASE_URL}/assets/images/${otherUser.mainAvatar}`}
                        alt={otherUser.name}
                        style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          marginRight: '15px'
                        }}
                        onError={(e) => {
                          e.target.src = dummyUserPic;
                        }}
                      />
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h6 className="mb-1">
                              {otherUser.name}
                              {isActiveCall && (
                                <span className="ms-2" style={{ fontSize: '12px', color: '#28a745' }}>
                                  <i className="fa fa-circle" style={{ fontSize: '8px' }}></i> Active
                                </span>
                              )}
                            </h6>
                            <small className="text-muted">
                              {isIncoming ? 'Incoming' : 'Outgoing'} • {call.callType} call
                              {isActiveCall && (
                                <span className="ms-2" style={{ color: '#28a745', fontWeight: '500' }}>
                                  Tap to view call
                                </span>
                              )}
                            </small>
                          </div>
                          <div className="text-end">
                            <span
                              className="badge"
                              style={{
                                backgroundColor: statusColor[call.status] || '#6c757d',
                                color: 'white'
                              }}
                            >
                              {call.status === 'connected' ? 'Call Accepted' : call.status}
                            </span>
                            <br />
                            <small className="text-muted">
                              {new Date(call.startTime).toLocaleString()}
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCallHistory(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

      </MDBContainer>
      <Toaster position="top-center" />
    </div>
  );
}
