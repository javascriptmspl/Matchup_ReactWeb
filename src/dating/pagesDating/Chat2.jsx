import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
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
import HeaderFour from "../../component/layout/HeaderFour";
import EmojiPicker from "emoji-picker-react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import CheckCompatibilityModal from "../component/popUps/checkCompatibilty";
import NotificationScheduleModal from "../component/popUps/notificationSchedule";
import CalenderScheduleModal from "../component/popUps/calenderSchedule";
import BlockUserModal from "../component/popUps/client";
import ReportUserModal from "../component/popUps/reportUserModal";
import RelationshipMilestoneTracker from "../component/popUps/MildStoneModal";


import { messages as staticMessages, customMessages } from "../component/chat2-component/message";

import img11 from "../../dating/assets/images/shop/dating/11.png";
import chatBG from "../../dating/assets/images/chat/ChatBG.jpg"
import chatBG2 from "../../dating/assets/images/chat/chatbg2.jpg"
import dummyUserPic from "../../dating/assets/images/myCollection/user-male.jpg"
import { useSelector, useDispatch } from "react-redux";
import { BASE_URL } from "../../base";
import { getRoomById, sendMessage as sendMessageAPI } from "../../service/MANAGE_API/chat-API";
import { getBlockedUsers, checkIfBlockedBy } from "../../service/common-service/blockSlice";
import { getAllGifts, sendGift, getUserCoins } from "../../service/MANAGE_API/gift-API";
import VideoCallModal from "../../metrimoniul/component/popUps/incomingcalls/VideoCallModal";
import IncomingCallModal from "../../metrimoniul/component/popUps/incomingcalls/IncomingCallModal";
import { useSocket } from "../../hooks/useSocket";
import socketService from "../../services/SocketService";



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
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [replyingToMessage, setReplyingToMessage] = useState(null);
  const [isSelectedUserBlocked, setIsSelectedUserBlocked] = useState(false);
  const [isBlockedBySelectedUser, setIsBlockedBySelectedUser] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showVideoCallModal, setShowVideoCallModal] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const [showIncomingCallModal, setShowIncomingCallModal] = useState(false);
  const [isCallModalManuallyClosed, setIsCallModalManuallyClosed] = useState(false);
  const [callHistory, setCallHistory] = useState([]);
  const [showCallHistory, setShowCallHistory] = useState(false);
  const [currentCallId, setCurrentCallId] = useState(null);
  const [callConnected, setCallConnected] = useState(false);
  const [callInitiated, setCallInitiated] = useState(false);
  const [callStartTime, setCallStartTime] = useState(null);
  const [isMicOn, setIsMicOn] = useState(false);
  const [gifts, setGifts] = useState([]);
  const [loadingGifts, setLoadingGifts] = useState(false);
  const [userCoins, setUserCoins] = useState(0);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [sendingGift, setSendingGift] = useState(false);
  const [updatingCoins, setUpdatingCoins] = useState(false);
  const [messagesByRoom, setMessagesByRoom] = useState({});
  const [typingUsers, setTypingUsers] = useState({});
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const selectedRoomIdRef = useRef(selectedRoomId);
  const user = useSelector((state) => state.profile.userData)
  useEffect(() => {
    selectedRoomIdRef.current = selectedRoomId;
  }, [selectedRoomId]);
  // Inject lightweight animation styles for gift bubbles (once)
  useEffect(() => {
    const styleId = 'gift-bubble-anim-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes giftPop {0%{transform:scale(0.6);opacity:0}60%{transform:scale(1.05);opacity:1}100%{transform:scale(1)} }
        .gift-pop { animation: giftPop 450ms ease-out; }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const startMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsMicOn(true);
      const audioTracks = stream.getAudioTracks();
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

  const handleShow = () => setShowModal(true);
  const handleHide = () => setShowModal(false);
  const handleShowVideoCall = () => setShowVideoCallModal(true);
  const handleHideVideoCall = () => setShowVideoCallModal(false);

  // Fetch gifts from API
  const fetchGifts = useCallback(async () => {
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
  }, []);
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
  // Fetch user coins
  const fetchUserCoins = useCallback(async () => {
    const latestUserId = user?._id || storedUserId;
    if (!latestUserId) return;

    try {
      const response = await getUserCoins(latestUserId);
      
      if (response.isSuccess) {
        const coins = response.data?.coins || response.data?.balance || 0;
        setUserCoins(coins);
      } else {
        calculateCoinsFromLocalStorage();
      }
    } catch (error) {
  
      calculateCoinsFromLocalStorage();
    }
  }, [user?._id, storedUserId]);

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

  // Manual function to set coins (for debugging)
  const setManualCoins = () => {
    setUserCoins(550);
  };

  // Resolve current user's avatar URL robustly for immediate local UI updates
  const getCurrentUserAvatar = () => {
    try {
      const main = user?.mainAvatar;
      if (main) return `${BASE_URL}/assets/images/${main}`;
      const arr = user?.avatars;
      if (Array.isArray(arr) && arr.length) {
        const last = arr[arr.length - 1];
        const file = typeof last === 'string' ? last : (last?.image || last?.imgUrl || last?.url || last?.path || last?.fileName);
        if (file) return `${BASE_URL}/assets/images/${file}`;
      }
      const ls = JSON.parse(localStorage.getItem('userData') || '{}');
      const lsMain = ls?.data?.mainAvatar || ls?.mainAvatar;
      if (lsMain) return `${BASE_URL}/assets/images/${lsMain}`;
    } catch (_) { /* ignore */ }
    return dummyUserPic;
  };

  const checkForIncomingCalls = () => {
    // Incoming calls are delivered via socket events (onIncomingCall)
  };

  const fetchCallHistory = () => {
    if (!userId || !isConnected) return;
    socketGetCallHistory(1, 20);
  };


  
  const userPic = user?.avatars.length - 1
  const blockedUsers = useSelector((state) => state.block.blockedUsers)

  

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

      if (messages.length > 0) {
        const transformedMessages = messages.map((msg, index) => {
          const base = msg.content || msg.message || '';
          const inferredType = base && typeof base === 'string' && base.includes('Sent a gift:') ? 'gift' : 'text';
          const messageType = msg.messageType || inferredType;
          const giftName = messageType === 'gift' ? base.split(':').slice(1).join(':').trim() : '';
          const matchedGift = messageType === 'gift' && gifts?.length
            ? gifts.find(g => (g.name || '').toLowerCase() === (giftName || '').toLowerCase())
            : undefined;

          return {
            ...msg,
            id: msg._id || index,
            content: base,
            timestamp: new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            sent: msg.msgFrom?._id === userId || msg.senderId?._id === userId,
            avatar: (msg.msgFrom?._id === userId || msg.senderId?._id === userId)
              ? getCurrentUserAvatar()
              : (selectedUser?.avatar || dummyUserPic),
            messageType,
            fileUrl: msg.fileUrl || msg.file || (msg.attachment ? `${BASE_URL}/${msg.attachment}` : null),
            giftData: messageType === 'gift'
              ? (msg.giftData || (matchedGift ? { _id: matchedGift._id, name: matchedGift.name, imageUrl: matchedGift.imageUrl } : undefined))
              : undefined,
            senderId: msg.msgFrom || msg.senderId,
          };
        });

        setMessagesByRoom(prev => ({
          ...prev,
          [currentSelectedRoomId]: transformedMessages
        }));

        if (transformedMessages.length > 0) {
          const lastMsg = transformedMessages[transformedMessages.length - 1];
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

        if (currentSelectedRoomId === selectedRoomIdRef.current) {
          setRoomMessages(prevMessages => {
            const existingMessagesMap = new Map(prevMessages.map(msg => [msg.id || msg._id, msg]));
            transformedMessages.forEach(msg => {
              existingMessagesMap.set(msg.id || msg._id, msg);
            });
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
      } else if (messagesByRoom[currentSelectedRoomId]?.length) {
        setHasMoreMessages(false);
      }
      setLoadingMessages(false);
    },
    onNewMessage: (message, roomId) => {
      const currentSelectedRoomId = selectedRoomIdRef.current;
      const transformedMessage = {
        ...message,
        id: message._id,
        content: message.content || message.message || '',
        timestamp: new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        sent: message.msgFrom?._id === userId || message.senderId?._id === userId,
        avatar: (message.msgFrom?._id === userId || message.senderId?._id === userId)
          ? getCurrentUserAvatar()
          : (selectedUser?.avatar || dummyUserPic),
        messageType: message.messageType || 'text',
        fileUrl: message.fileUrl || message.file || (message.attachment ? `${BASE_URL}/${message.attachment}` : null),
        senderId: message.msgFrom || message.senderId,
      };

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

        const isFromCurrentUser = message.msgFrom?._id === userId || message.senderId?._id === userId;
        if (!isFromCurrentUser && roomId !== currentSelectedRoomId) {
          setUnreadCounts(prev => ({
            ...prev,
            [roomId]: (prev[roomId] || 0) + 1
          }));
        }

        setMessagesByRoom(prev => {
          const roomMessages = prev[roomId] || [];
          const messageExists = roomMessages.some(msg => (msg.id || msg._id) === (transformedMessage.id || transformedMessage._id));
          if (messageExists) {
            return prev;
          }
          return {
            ...prev,
            [roomId]: [...roomMessages, transformedMessage]
          };
        });
      }

      if (roomId && currentSelectedRoomId && roomId === currentSelectedRoomId) {
        setRoomMessages(prevMessages => {
          const messageExists = prevMessages.some(msg => (msg.id || msg._id) === (transformedMessage.id || transformedMessage._id));
          if (messageExists) {
            return prevMessages;
          }
          return [...prevMessages, transformedMessage];
        });
        setTimeout(scrollToBottom, 100);
      }
    },
    onMessageEdited: (message, roomId) => {
      const currentSelectedRoomId = selectedRoomIdRef.current;

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

      if (roomId) {
        setMessagesByRoom(prev => {
          const roomMessages = prev[roomId] || [];
          return {
            ...prev,
            [roomId]: roomMessages.filter(msg => (msg._id || msg.id) !== messageId)
          };
        });
      }

      if (roomId && currentSelectedRoomId && roomId === currentSelectedRoomId) {
        setRoomMessages(prevMessages =>
          prevMessages.filter(msg => (msg._id || msg.id) !== messageId)
        );
      }
    },
    onRoomCreated: () => {
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
      const calls = Array.isArray(data) ? data : (data?.calls || data?.items || []);
      if (calls.length > 0) {
        setCallHistory(calls);
      }
    },
    onIncomingCall: (data) => {
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
      if (newIncomingCall.callType === 'video') {
        setShowVideoCallModal(true);
        setShowIncomingCallModal(false);
      } else {
          setShowIncomingCallModal(true);
        setShowVideoCallModal(false);
      }
      setIsCallModalManuallyClosed(false);
    },
    onCallStarted: (data) => {
      if (!currentCallId && data.callSessionId) {
        setCurrentCallId(data.callSessionId);
      }

      setCallConnected(true);
      setCallInitiated(false);
      if (incomingCall && incomingCall.callType === 'video') {
        setShowVideoCallModal(true);
        setShowIncomingCallModal(false);
      } else {
        setShowIncomingCallModal(true);
        setShowVideoCallModal(false);
      }
      setIsCallModalManuallyClosed(false);
      setIncomingCall(prev => prev ? { ...prev, status: 'connected' } : null);
      setCallStartTime(prevTime => prevTime || new Date());

      if (!isMicOn) {
        startMic();
      }
    },
    onCallEnded: (data) => {
      setCallConnected(false);
      setCallInitiated(false);
      setCurrentCallId(null);
      setCallStartTime(null);
      setShowIncomingCallModal(false);
      setShowVideoCallModal(false);
      setIncomingCall(null);
      setIsCallModalManuallyClosed(false);
      if (data?.callSessionId) {
        const notificationKey = `call_notification_${data.callSessionId}`;
        sessionStorage.removeItem(notificationKey);
      }
    },
    onCallDeclined: () => {
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
      const errorMessage = data?.message || 'Call error occurred';

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
    setInputMessage((prevMessage) => prevMessage + emoji);
    setShowEmojiPicker(false);
  };

  const handleAttachFile = () => {
    const fileInput = document.getElementById("fileInput");
    fileInput.click();
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const selectedFile = files[0];
      setSelectedFile(selectedFile);

      const imageUrl = URL.createObjectURL(selectedFile);
    }
  };

  const handleUserSelect = async (room) => {
    const roomId = room.roomId;
    if (!roomId) return;

    setSelectedRoomId(roomId);

    // Mark messages as read when room is opened
    setUnreadCounts(prev => ({
      ...prev,
      [roomId]: 0
    }));

    // Update last message as read
    setLastMessages(prev => ({
      ...prev,
      [roomId]: prev[roomId] ? { ...prev[roomId], isRead: true } : prev[roomId]
    }));

    // If we already have cached messages for this room, show them immediately
    if (messagesByRoom[roomId] && messagesByRoom[roomId].length > 0) {
      setRoomMessages(messagesByRoom[roomId]);
    } else {
      setRoomMessages([]);
    }

    await fetchRoomDetails(roomId);

    if (!gifts || gifts.length === 0) {
      await fetchGifts();
    }

    // Fetch messages from server (will update cache via socket callback)
    await fetchRoomMessages(roomId);

    await checkBlockingStatus(room.otherUser?._id);
  };

  const checkBlockingStatus = async (targetUserId) => {
    if (!targetUserId) return;
    
    const currentUserId = user?._id || storedUserId;
    if (!currentUserId) return;

    try {
      if (blockedUsers.length === 0) {
        await dispatch(getBlockedUsers(currentUserId)).unwrap();
      }

      const isBlocked = blockedUsers.some(blockedUser => {
        const blockedId = blockedUser?.blocked?._id || blockedUser?._id || blockedUser?.id;
        return blockedId === targetUserId;
      });
      setIsSelectedUserBlocked(isBlocked);

      const blockedByResult = await dispatch(checkIfBlockedBy({ 
        currentUserId, 
        targetUserId 
      })).unwrap();
      
      setIsBlockedBySelectedUser(blockedByResult?.isBlocked || false);
      
    } catch (error) {
      console.error("Error checking blocking status:", error);
    }
  };

  const fetchRoomDetails = async (roomId) => {
    if (!roomId) return;

    const userId = user?._id || storedUserId;
    if (!userId) return;

    try {
      const response = await getRoomById(roomId, userId);
      if (response?.isSuccess && response?.data) {
        const roomData = response.data;

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

  const fetchRoomMessages = async (roomId, page = 1, limit = 50) => {
    if (!roomId || !userId) return;
    if (loadingMessages || (page > 1 && !hasMoreMessages)) return;

    setLoadingMessages(true);
    try {
      if (socketService?.currentRoom !== roomId) {
        socketService.joinRoom(roomId);
      }
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

    try {
      const messageText = inputMessage.trim();
      const replyToId = replyingToMessage?._id || null;

      // If file selected, upload via API, then socket will emit new_message
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
            toast.success("Image sent successfully!");
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
        // Text message via socket
        if (replyToId) {
          socketSendMessage(selectedRoomId, messageText, replyToId);
        } else {
          socketSendMessage(selectedRoomId, messageText);
        }

        setInputMessage("");
        setSelectedEmojis([]);
        setSelectedFile(null);
        setFilePreview(null);
        setShowEmojiPicker(false);
        setReplyingToMessage(null);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
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
      socketEditMessage(editingMessageId, editedContent.trim());
        setEditingMessageId(null);
        setEditedContent('');
    } catch (error) {
      console.error('Error editing message:', error);
      toast.error('Failed to edit message. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditedContent('');
  };

  const handleDeleteMessage = async (messageId) => {
    if (!messageId) {
      console.error("No message ID provided");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this message?")) {
      return;
    }


    try {
      socketDeleteMessage(messageId);
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message. Please try again.');
    }
  };

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

    setTimeout(() => {
      const inputField = document.getElementById("exampleFormControlInput2");
      if (inputField) {
        inputField.focus();
      }
    }, 100);
  };

  const handleCancelReply = () => {
    setReplyingToMessage(null);
  };

  const handleGiftClick = async (giftItem) => {
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

    if (userCoins <= 0) {
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
      
      setTimeout(() => {
        navigate('/dating/membership');
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
          onClick: () => navigate('/dating/membership')
        }
      })
      navigate('/dating/membership');
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
      const giftData = {
        senderId: userId,
        receiverId: selectedUser._id,
        giftId: giftItem._id,
        message: giftItem.description || giftItem.name
      };

      const response = await sendGift(giftData);

      if (response?.isSuccess) {
        const newBalance = response.data.remainingCoins || (userCoins - giftItem.coinCost);
        console.log(`Updating coin balance: ${userCoins} - ${giftItem.coinCost} = ${newBalance}`);
        setUpdatingCoins(true);
        setUserCoins(newBalance);
        
        try {
          const userData = JSON.parse(localStorage.getItem('userData') || '{}');
          if (userData?.data) {
            userData.data.coins = newBalance;
          } else {
            userData.coins = newBalance;
          }
          localStorage.setItem('userData', JSON.stringify(userData));
          console.log('Updated localStorage with new coin balance:', newBalance);
        } catch (error) {
          console.error('Error updating localStorage:', error);
        }
        
        const giftMessage = `🎁 Sent a gift: ${giftItem.name}`;
        socketSendMessage(selectedRoomId, giftMessage);
        
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

        setTimeout(() => {
          fetchUserCoins();
          setUpdatingCoins(false);
        }, 1000);

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
    if (userId && isConnected) {
      getMyRooms();
    }

    if (userId) {
      dispatch(getBlockedUsers(userId));
    }

    fetchGifts();
    const coinTimer = setTimeout(() => {
      fetchUserCoins();
    }, 1000);

    return () => clearTimeout(coinTimer);
  }, [userId, isConnected, dispatch, fetchGifts, fetchUserCoins]);

  useEffect(() => {
    if (selectedUser?._id) {
      checkBlockingStatus(selectedUser._id);
    }
  }, [selectedUser?._id]);

  useEffect(() => {
    if (user?._id || storedUserId) {
      console.log("User data changed, refreshing coins");
      setTimeout(() => {
        fetchUserCoins();
      }, 500);
    }
  }, [user?._id, storedUserId, fetchUserCoins]);

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

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);



  // Real-time call and chat handling happens inside useSocket callbacks

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
            {chatRooms.length === 0 ? (
              <div className="text-center text-muted p-4">
                <p>No chat rooms available</p>
              </div>
            ) : (filteredItems.length > 0 ? filteredItems : chatRooms).map((room) => (
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
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <p className="fw-bold mb-0" style={{ 
                          flex: 1, 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap',
                          fontSize: '15px'
                        }}>
                          {room.otherUser?.name}
                        </p>
                      </div>
                      <p className="small mb-0" style={{ 
                        color: unreadCounts[room.roomId] > 0 ? '#000' : '#6c757d',
                        fontWeight: unreadCounts[room.roomId] > 0 ? '500' : '400',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontSize: '13px'
                      }}>
                        {unreadCounts[room.roomId] > 0 ? (
                          <span style={{ color: '#25D366', fontWeight: '600' }}>New message</span>
                        ) : lastMessages[room.roomId] ? (
                          lastMessages[room.roomId].message.length > 30 
                            ? lastMessages[room.roomId].message.substring(0, 30) + '...'
                            : lastMessages[room.roomId].message
                        ) : (
                          'No messages yet'
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="pt-1 text-end" style={{ minWidth: '60px' }}>
                    <p className="small text-muted mb-0" style={{ fontSize: '12px' }}>
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
        <style>{`
          @keyframes chatFadeIn { from {opacity: 0; transform: translateY(6px)} to {opacity: 1; transform: translateY(0)} }
          @keyframes bubblePop { 0% { transform: scale(0.96); opacity:.8 } 60% { transform: scale(1.02) } 100% { transform: scale(1); opacity:1 } }
          @keyframes slideInR { from {opacity:0; transform: translateX(14px)} to {opacity:1; transform: translateX(0)} }
          @keyframes slideInL { from {opacity:0; transform: translateX(-14px)} to {opacity:1; transform: translateX(0)} }
          @keyframes dotBounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
          @keyframes glowPulse { 0%{ box-shadow:0 0 0 0 rgba(242,69,112,0.35)} 70%{ box-shadow:0 0 0 10px rgba(242,69,112,0)} 100%{ box-shadow:0 0 0 0 rgba(242,69,112,0)} }
          @keyframes subtleShake { 0%,100%{ transform: translateY(0)} 50%{ transform: translateY(-2px)} }
          @keyframes fadeDown { from{ opacity:0; transform: translateY(-6px)} to{ opacity:1; transform: translateY(0)} }
          @keyframes ripple { to { width:160px; height:160px; opacity:0 } }
          @keyframes sheen { 0%{ left: -60% } 100%{ left: 120% } }

          .msg-anim { animation: chatFadeIn .35s ease-out; }
          .chat-bubble { box-shadow: 0 6px 16px rgba(0,0,0,.06); animation: bubblePop .25s ease-out; transition: transform .18s ease, box-shadow .18s ease; }
          .chat-bubble:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(0,0,0,.14); }
          .bubble-sent { background: linear-gradient(135deg, #f24570 0%, #ff7e9a 100%) !important; color: #fff !important; }
          .bubble-recv { background: #f5f6f7 !important; color: #2d3436 !important; }
          .msg-time { opacity:.7; font-size:11px; animation: chatFadeIn .4s ease .12s both; }
          .typing-indicator { display:flex; align-items:center; gap:6px; margin: 0 8px; }
          .typing-indicator span { width:6px; height:6px; background:#6c757d; border-radius:50%; display:inline-block; animation: dotBounce 1.4s infinite; }
          .typing-indicator span:nth-child(2){ animation-delay: .15s }
          .typing-indicator span:nth-child(3){ animation-delay: .3s }
          .msg-row.sent .chat-bubble{ animation: slideInR .32s ease-out, bubblePop .25s ease-out; }
          .msg-row.recv .chat-bubble{ animation: slideInL .32s ease-out, bubblePop .25s ease-out; }
          .chat-bubble.with-tail{ position: relative; }
          .bubble-sent:hover::before{ content:""; position:absolute; top:0; left:-60%; width:40%; height:100%; background: linear-gradient( to right, rgba(255,255,255,0) 0%, rgba(255,255,255,.25) 50%, rgba(255,255,255,0) 100% ); transform: skewX(-20deg); animation: sheen .9s ease; border-radius: inherit; }
          /* Use rotated square so tail color perfectly matches the bubble */
          .chat-bubble.with-tail.bubble-sent:after{
            content:""; position:absolute; right:-6px; bottom:12px; width:12px; height:12px;
            background: linear-gradient(135deg, #f24570 0%, #ff7e9a 100%);
            transform: rotate(45deg); border-radius:2px; box-shadow: 0 1px 0 rgba(0,0,0,.06);
          }
          .chat-bubble.with-tail.bubble-recv:before{
            content:""; position:absolute; left:-6px; bottom:12px; width:12px; height:12px;
            background: #f5f6f7; transform: rotate(45deg); border-radius:2px; box-shadow: 0 1px 0 rgba(0,0,0,.06);
          }
          .avatar-hover:hover{ transform: scale(1.05); transition: transform .18s ease; }
          .chat-solo img{ transition: transform .18s ease; }
          .chat-solo img:hover{ transform: scale(1.05); }
          .new-pulse{ animation: glowPulse 1.5s ease-out 1; }
          .gift-pop{ animation: subtleShake 1.6s ease-in-out; }
          .dropdown-menu{ animation: fadeDown .18s ease-out; transform-origin: top right; z-index: 50000; }
          .chat-opt{ position: relative; z-index: 1200; }
          /* Ensure header actions and menus stack above the message scroller */
          .chat-header{ position: relative; z-index: 40000; }
          .send-btn{ position: relative; overflow: hidden; }
          .send-btn:active::after{ content:""; position:absolute; left:50%; bottom:50%; width:6px; height:6px; background: rgba(242,69,112,.35); border-radius:50%; transform: translate(-50%,-50%); animation: ripple .5s ease-out; }
          /* Nice scroll thumbs in webkit browsers */
          .msg-wrap::-webkit-scrollbar{ width: 10px; }
          .msg-wrap::-webkit-scrollbar-thumb{ background: rgba(0,0,0,.12); border-radius: 8px; }
          .msg-wrap::-webkit-scrollbar-thumb:hover{ background: rgba(0,0,0,.22); }
          /* Animate file images */
          img[alt^="file "]{ animation: chatFadeIn .3s ease-out; }
          /* Coins UI animations */
          @keyframes coinFloat { 0%,100%{ transform: translateY(0) } 50%{ transform: translateY(-2px) } }
          @keyframes coinPulse { 0%{ box-shadow:0 0 0 0 rgba(255,193,7,.35) } 70%{ box-shadow:0 0 0 12px rgba(255,193,7,0) } 100%{ box-shadow:0 0 0 0 rgba(255,193,7,0) } }
          @keyframes coinShimmer { 0%{ left:-40% } 100%{ left:120% } }
          .coin-badge{ display:inline-flex; align-items:center; gap:6px; padding:4px 8px; border-radius:999px; background: #fff; border:1px solid rgba(0,0,0,.06); box-shadow: 0 6px 16px rgba(0,0,0,.06); transition: transform .16s ease, box-shadow .16s ease; position: relative; overflow: hidden; }
          .coin-badge:hover{ transform: translateY(-1px); box-shadow: 0 10px 24px rgba(0,0,0,.12); }
          .coin-badge:hover .coin-count{ text-shadow: 0 1px 0 rgba(0,0,0,.08); }
          .coin-badge:hover::after{ content:""; position:absolute; top:0; left:-40%; width:40%; height:100%; background: linear-gradient( to right, rgba(255,255,255,0) 0%, rgba(255,255,255,.45) 50%, rgba(255,255,255,0) 100% ); transform: skewX(-20deg); animation: coinShimmer .9s ease; }
          .coin-icon{ display:inline-flex; align-items:center; justify-content:center; width:20px; height:20px; border-radius:50%; background: radial-gradient(circle at 30% 30%, #ffe082, #ffc107 60%, #ffb300); box-shadow: inset 0 1px 2px rgba(255,255,255,.6), inset 0 -1px 2px rgba(0,0,0,.1), 0 1px 2px rgba(0,0,0,.06); color:#7a5e00; font-size:12px; animation: coinFloat 2.2s ease-in-out infinite; }
          .coin-count{ font-size:.8rem; color:#6c757d; font-weight:600; letter-spacing:.2px; }
          .coin-badge.is-updating{ animation: coinPulse 1.4s ease-out infinite; }
          /* Status chip */
          .status-chip{ display:inline-flex; align-items:center; gap:6px; padding:1px 8px; border-radius:999px; background: rgba(25,135,84,.08); color:#198754 !important; border:1px solid rgba(25,135,84,.15); font-weight:600; }
          .status-chip::before{ content:""; width:6px; height:6px; border-radius:50%; background:#16a34a; box-shadow:0 0 0 4px rgba(22,163,74,.15); }
          /* Header action icons */
          @keyframes iconPulse { 0%{ box-shadow:0 0 0 0 rgba(242,69,112,.35)} 70%{ box-shadow:0 0 0 12px rgba(242,69,112,0)} 100%{ box-shadow:0 0 0 0 rgba(242,69,112,0)} }
          .action-icon{ position:relative; display:inline-flex; align-items:center; justify-content:center; width:34px; height:34px; border-radius:50%; transition: transform .16s ease, color .16s ease, background .16s ease; }
          .action-icon:hover{ transform: translateY(-1px); color:#f24570 !important; background: rgba(242,69,112,.08); }
          .action-icon:active{ transform: scale(.96); }
          .action-icon.pulse{ animation: iconPulse 1.6s ease-out 1; }
          .action-trigger{ padding:6px; border-radius:8px; transition: background .16s ease; }
          .action-trigger:hover{ background: rgba(0,0,0,.06); }
          /* Chat list item hover */
          .chat-list-wrap a{ border-radius:12px; padding:6px 8px; }
          .chat-list-wrap a:hover{ background: rgba(0,0,0,.035); }
          /* Messages area background */
          .msg-wrap{ background: radial-gradient(1200px 600px at 100% -200px, rgba(242,69,112,.06), transparent 70%) no-repeat, #fff; }
          .chat-header{ background: linear-gradient(180deg, #ffffff 0%, #fff6f8 70%); border-bottom: 1px solid rgba(0,0,0,.06); backdrop-filter: saturate(1.1); position: relative; z-index: 40000; }
          .chat-dp img:hover{ box-shadow: 0 0 0 3px rgba(242,69,112,.15), 0 6px 16px rgba(0,0,0,.12); transform: translateY(-1px); transition: transform .16s ease, box-shadow .16s ease; }
          .coin-refresh:hover{ box-shadow: inset 0 0 0 2px rgba(242,69,112,.35); border-color:#f24570; color:#f24570; }
          .dropdown-menu .dropdown-item{ border-radius:8px; margin:2px 6px; }
          .dropdown-menu .dropdown-item:hover{ background: rgba(242,69,112,.08); color:#f24570; }
          /* Shared modal backdrop/classes for consistent blur overlay */
          .rb-backdrop-blur { backdrop-filter: blur(6px); background-color: rgba(0,0,0,0.35) !important; z-index: 50010 !important; }
          .modal.rb-call-modal { z-index: 50020 !important; }
          @keyframes dotPulse { 0%{ box-shadow:0 0 0 0 rgba(22,163,74,.4);} 70%{ box-shadow:0 0 0 8px rgba(22,163,74,0);} 100%{ box-shadow:0 0 0 0 rgba(22,163,74,0);} }
          .badge-dot{ position:absolute; right:0; bottom:0; width:10px; height:10px; border-radius:50%; animation: dotPulse 1.6s ease infinite; }
        `}</style>
        {selectedUser ? (
          <div>
            <div
              className="row py-1 mb-2 border-bottom shadow-md bg-[#f5f5f5]; chat-header"
            >
              <div className="col-7 chat-dp">
                {" "}
                <div className="row chat-status">
                  <div className="col-4 col-lg-2">
                    {" "}
                    <img
                      src={selectedUser ? selectedUser.avatar : dummyUserPic}
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

                  <div className="col-8 py-2 col-lg-8 d-flex gap-3">
                    {" "}
                    <h6>
                      {selectedUser ? selectedUser.name : "Select a user"}<br />
                      <small
                        className="status-chip"
                        style={{
                          color: "green",
                          fontSize: "0.9rem",
                          marginTop: "-10px",
                        }}
                      >
                        Active
                      </small>
                    </h6>
                    <div className="mt-1 d-flex align-items-center gap-2">
                      <small
                        className={`coin-badge ${updatingCoins ? 'is-updating' : ''}`}
                        style={{
                          color: "#6c757d",
                          fontSize: "0.8rem",
                          fontWeight: 600
                        }}
                        title="Your coin balance"
                      >
                        <span className="coin-icon">💰</span>
                        {updatingCoins ? (
                          <span className="coin-count" style={{ color: "#cc9a06" }}>
                            <i className="fa fa-spinner fa-spin"></i> Updating...
                          </span>
                        ) : (
                          <span className="coin-count">{`${userCoins} coins`}</span>
                        )}
                      </small>
                      <button 
                        className="btn btn-sm btn-outline-primary coin-refresh"
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
                <div className="dropdown float-end me-2 con-info" data-bs-auto-close="false" data-bs-display="static">
                  {" "}
                  <button
                    type="button"
                    className="btn btn-link header__more fs-3 my-2 text-muted action-trigger"
                    style={{ fontWeight: "700" }}
                    data-bs-toggle="dropdown"
                      data-bs-display="static" 
                    aria-expanded="false"
                  >
                    <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end" style={{ width: "200px" }}>
                      <li>
                        <button className="dropdown-item py-2"
                          onClick={() => setCalenderSchedule(true)}
                        >
                          <i
                            className="fa-solid fa-circle-info me-3"
                            aria-hidden="true"
                            title="date Schedule"
                          ></i>{" "}
                          Schedule Date
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item py-2"
                          onClick={() => setCheckCompatibility(true)}
                        >
                          <i
                            className="fa fa-question-circle-o me-3"
                            aria-hidden="true"
                            title="Check Compatibility"
                          ></i>{" "}
                          Compatibility
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item py-2"
                          onClick={() => setMilestone(true)}
                        >
                          <i class="fa fa-history me-3" aria-hidden="true"></i>
                          {" "}
                          Track Milestone
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item py-2"
                          onClick={() => setBlockUser(true)}
                        >
                          <i
                            class="fa fa-ban me-3"
                            aria-hidden="true"
                          ></i>{" "}
                          {isSelectedUserBlocked ? "Unblock" : "Block"}
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item py-2"
                          onClick={() => setReportUser(true)}
                        >
                          <i
                            class="fa fa-flag me-3"
                            aria-hidden="true"
                          ></i>{" "}
                          Report
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item py-2"
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
                        </button>
                      </li>
                  </ul>
                
   <Link className="float-end fs-4 text-muted my-2 action-icon"  onClick={handleShow}>
                    <i class="fa fa-phone" aria-hidden="true"></i>
                  </Link>
                  <IncomingCallModal 
                    show={showModal} 
                    onHide={handleHide}
                    selectedUser={selectedUser}
                    currentUserId={user?._id || storedUserId}
                    selectedRoomId={selectedRoomId}
                  />

                  <Link className="float-end fs-4 text-muted my-2">
                    <i
                      class="fa fa-video-camera"
                      aria-hidden="true"
                      onClick={handleShowVideoCall}
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
                  ) : roomMessages.length === 0 ? (
                    <div className="text-center text-muted p-5">
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    <>
                      {roomMessages.map((message, index) => {
                        return (
                          <div
                            key={message.id}
                            className={`px-3 px-md-5 d-flex flex-row chat-solo msg-row ${message.sent ? 'sent' : 'recv'} justify-content-${message.sent ? "end" : "start"} ${message.sent ? 'animate-slide-in-right' : 'animate-slide-in-left'}`}
                          >
                          {message.sent ? (
                            <>

                              <div style={{ maxWidth: "70%", display: "flex", alignItems: "center" }}>
                                {message.file ? (
                                  <img
                                    src={URL.createObjectURL(message.file)}
                                    alt={`file ${message.id}`}
                                    style={{
                                      borderRadius: '50%',
                                      maxWidth: "55px",
                                    }}
                                  />
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
                                            className="small p-2 me-3 mb-1 rounded-3 chat-bubble bubble-sent with-tail msg-anim new-pulse"
                                            style={{
                                              backgroundColor: "#f24570",
                                              color: "#ffffff",
                                              display: "inline-block",
                                              fontSize: "14px",
                                              lineHeight: "1.4",
                                              wordBreak: "break-word",
                                              animationDelay: `${Math.min(index * 0.03, 0.25)}s`
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
                                                  Replied to: {message.replyTo.senderId?.name || 'User'}
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
                                            className="small me-3 mb-0 text-muted msg-time"
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
                                src={message.avatar}
                                alt={`avatar ${message.id}`}
                                className="avatar-hover"
                                style={{
                                  borderRadius: '50%',
                                  width: "45px",
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
                                  src={selectedUser ? selectedUser.avatar : dummyUserPic}
                                  alt="avatar"
                                  className="d-flex align-self-center avatar-hover"
                                  style={{
                                    borderRadius: "50%",
                                    width: "45px",
                                    height: "45px",
                                    flexShrink: 0,
                                  }}
                                />

                                <div style={{ display: "flex", alignItems: "center", maxWidth: "80%", flexWrap: "wrap" }}>
                                  {message.file ? (
                                    <img
                                      src={URL.createObjectURL(message.file)}
                                      alt={`file ${message.id}`}
                                      style={{
                                        maxWidth: "100%",
                                        height: "auto",
                                        borderRadius: "8px",
                                      }}
                                    />
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
                                        className="small p-2 mb-1 rounded-3 chat-bubble bubble-recv with-tail msg-anim new-pulse"
                                        style={{
                                          backgroundColor: "#f5f6f7",
                                          color: "#000",
                                          marginRight: "8px",
                                          display: "inline-block",
                                          fontSize: "14px",
                                          lineHeight: "1.4",
                                          wordBreak: "break-word",
                                          animationDelay: `${Math.min(index * 0.03, 0.25)}s`
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
                                        className="small text-muted mb-0 msg-time"
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
                    <label className="dropdown-item py-2">
                      <i
                        className="fa fa-picture-o me-2"
                        aria-hidden="true"
                      ></i>{" "}
                      File
                      <input
                        type="file"
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
                  ) : gifts.length === 0 ? (
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
                        onClick={() => navigate('/dating/membership')}
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
                  onChange={(e) => setInputMessage(e.target.value)}
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
        <CalenderScheduleModal
          showModal={calenderSchedule}
          hideModal={() => setCalenderSchedule(false)}
          calenderDate={calenderDate}
          NotifyScheduleData={NotifyScheduleData}
          clockTime={clockTime}
        />
        <CheckCompatibilityModal
          showModal={CheckCompatibility}
          hideModal={() => setCheckCompatibility(false)}
        />
        <NotificationScheduleModal
          showModal={NotificationSchedule}
          hideModal={() => setNotificationSchedule(false)}
          calenderScheduleDAte={calenderScheduleDAte}
          selectedUser={selectedUser}
          scheduledData={selectedData}
        />
        <BlockUserModal
          showModal={blocklUser}
          hideModal={() => setBlockUser(false)}
          selectedUser={selectedUser}
          isBlocked={isSelectedUserBlocked}
          onBlockStatusChange={() => checkBlockingStatus(selectedUser?._id)}
        />
        <ReportUserModal
          showModal={reportUser}
          hideModal={() => setReportUser(false)}
          selectedUser={selectedUser}
        />
        <RelationshipMilestoneTracker
          showModal={Milestone}
          hideModal={() => setMilestone(false)}
          selectedUser={selectedUser}
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

        {/* Incoming Call Modal (voice/video) */}
        {incomingCall && incomingCall.callType === 'video' ? (
          <VideoCallModal 
            show={showVideoCallModal} 
            onHide={() => {
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
              if (incomingCall && incomingCall.status === 'ringing' && !callConnected) {
                setShowIncomingCallModal(false);
                setIsCallModalManuallyClosed(true);
              } else {
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
        <Modal show={showCallHistory} onHide={() => setShowCallHistory(false)} size="lg" centered className="rb-call-modal" backdropClassName="rb-backdrop-blur">
          <Modal.Header closeButton>
            <Modal.Title>Call History</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {callHistory.length === 0 ? (
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
