
import React, { useEffect, useRef, useState } from "react";
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
import { Scrollbars } from "react-custom-scrollbars-2";
import HeaderFour from "../component/layout/HeaderFour";
import EmojiPicker from "emoji-picker-react";
import io from "socket.io-client";

import { messages } from "../../dating/component/chat2-component/message";

import img2 from "../../dating/assets/images/shop/dating/1.jpg";
import img1 from "../../dating/assets/images/shop/dating/2.jpg";
import img3 from "../../dating/assets/images/shop/dating/3.jpg";
import img4 from "../../dating/assets/images/shop/dating/4.jpg";
import img5 from "../../dating/assets/images/shop/dating/5.jpg";
import img6 from "../../dating/assets/images/shop/dating/6.jpg";
import img7 from "../../dating/assets/images/shop/dating/7.jpg";
import img8 from "../../dating/assets/images/shop/dating/8.jpg";
import img9 from "../../dating/assets/images/shop/dating/9.jpg";
import img10 from "../../dating/assets/images/shop/dating/10.png";
import img11 from "../../dating/assets/images/shop/dating/11.png";
import chatBG from "../assets/images/bg-img/marrage-chat-bg.jpg";
import dummyUserPic from "../../dating/assets/images/myCollection/user-male.jpg";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import CheckCompatibilityModalMetri from "../component/popUps/chat/checkCompatibilty";
import RelationshipMilestoneTrackerMetri from "../component/popUps/chat/MildStoneModal";
import BlockUserModalMetri from "../component/popUps/common-profile/block-user";
import ReportUserModalMetri from "../component/popUps/common-profile/reportUserModal";
import CalenderScheduleMetri from "../component/popUps/chat/calenderSchedule";
import Lodder from "../component/layout/Lodder";
import LoaderChat from "../component/layout/loadderChat";
import EventCalenderScheduleModal from "../component/popUps/event/eventCalenderSchedule ";
import EventNotificationScheduleModal from "../component/popUps/event/eventNotificationSchedule ";
import userMale from "../../dating/assets/images/myCollection/user-male.jpg";
import IncomingCallModal from "../component/popUps/incomingcalls/IncomingCallModal.jsx";
import VideoCallModal from "../component/popUps/incomingcalls/VideoCallModal.jsx";
import { BASE_URL } from "../../base";
import { getBlockedUsers, unblockUser, checkIfBlockedBy } from "../../service/common-service/blockSlice";

const SOCKET_URL = "http://38.242.230.126:4457";

export default function Chat() {
  const dispatch = useDispatch();
  const [inputMessage, setInputMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
 
  const [allMessages, setAllMessages] = useState({}); 
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmojis, setSelectedEmojis] = useState([]);
  const [SelectedFile, setSelectedFile] = useState(null);
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
  const [selectedUser, setSelectedUser] = useState(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingChat, setLoadingChat] = useState(true);
  const [editIndex, setEditIndex] = useState(null);
  const [ViewUser] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [inboxRooms, setInboxRooms] = useState([]);
  const [editingMessage, setEditingMessage] = useState(null);
  const [replyingToMessage, setReplyingToMessage] = useState([]);
  const currentRoomObj = inboxRooms.find((room) => room.roomId === currentRoom);
  const otherUserName = currentRoomObj?.otherUser?.name;
  const [chatPagination, setChatPagination] = useState({ page: 1, limit: 50, total: 0, pages: 0 });
  const [messageRestricted, setMessageRestricted] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  
  const blockedUsersRaw = useSelector((state) => state.block.blockedUsers);
  const blockedUsers = Array.isArray(blockedUsersRaw) ? blockedUsersRaw : [];
  const blockedByUsers = useSelector((state) => state.block.blockedByUsers || {});

  const saveChatToStorage = (roomId, messages) => {
    try {
      const chatKey = `chat_history_${roomId}`;
      const chatData = {
        messages: messages,
        timestamp: new Date().toISOString(),
        userId: user?._id
      };
      localStorage.setItem(chatKey, JSON.stringify(chatData));
      console.log("💾 Saved chat history to localStorage for room:", roomId, "Messages:", messages.length);
    } catch (error) {
      console.error("❌ Failed to save chat to localStorage:", error);
    }
  };

  const loadChatFromStorage = (roomId) => {
    try {
      const chatKey = `chat_history_${roomId}`;
      const storedData = localStorage.getItem(chatKey);
      
      if (storedData) {
        const chatData = JSON.parse(storedData);
        
        const dataAge = new Date() - new Date(chatData.timestamp);
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        
        if (chatData.userId === user?._id && dataAge < maxAge) {
          console.log("📂 Loaded chat history from localStorage for room:", roomId, "Messages:", chatData.messages.length);
          return chatData.messages;
        } else {
          localStorage.removeItem(chatKey);
          console.log("🗑️ Removed old/invalid chat data for room:", roomId);
        }
      }
    } catch (error) {
      console.error("❌ Failed to load chat from localStorage:", error);
    }
    return [];
  };

  const clearOldChatCache = () => {
    try {
      const keys = Object.keys(localStorage);
      const chatKeys = keys.filter(key => key.startsWith('chat_history_'));
      
      chatKeys.forEach(key => {
        try {
          const storedData = localStorage.getItem(key);
          if (storedData) {
            const chatData = JSON.parse(storedData);
            const dataAge = new Date() - new Date(chatData.timestamp);
            const maxAge = 24 * 60 * 60 * 1000; // 24 hours
            
            if (dataAge >= maxAge || chatData.userId !== user?._id) {
              localStorage.removeItem(key);
              console.log("🗑️ Cleared old chat cache:", key);
            }
          }
        } catch (error) {
          localStorage.removeItem(key);
          console.log("🗑️ Removed corrupted chat data:", key);
        }
      });
    } catch (error) {
      console.error("❌ Failed to clear old chat cache:", error);
    }
  };

  const profileData = useSelector((state) => state.profile.userData);

  const User = profileData;

  const datingId = localStorage.getItem("userData");
  const user_Data = JSON.parse(datingId);
  const user = user_Data?.data;
  const Store = useSelector((state) => state);
  let matchUserList = useSelector(
    (state) => Store?.activies?.Activity?.data || []
  );

  const isCurrentUserBlockedByMe = () => {
    if (!selectedUser?.receiverUserId?._id) return false;
    return blockedUsers.some(
      (blockedUser) => blockedUser?.blocked?._id === selectedUser?.receiverUserId?._id
    );
  };

  const isBlockedByCurrentUser = () => {
    if (!selectedUser?.receiverUserId?._id) return false;
    return blockedByUsers[selectedUser?.receiverUserId?._id] === true;
  };

  const handleUnblockFromChat = async () => {
    if (!selectedUser?.receiverUserId?._id) return;
    
    try {
      console.log(`Unblocking user from chat: ${selectedUser?.receiverUserId?._id}`);
      await dispatch(unblockUser(selectedUser?.receiverUserId?._id)).unwrap();
      if (user?._id) {
        dispatch(getBlockedUsers(user._id));
      }
    } catch (error) {
      console.error('Failed to unblock user:', error);
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [showVideoCallModal, setShowVideoCallModal] = useState(false);

  const socketRef = useRef(null);

  const handleShow = () => setShowModal(true);
  const handleHide = () => setShowModal(false);
  const handleShowVideoCall = () => setShowVideoCallModal(true);
  const handleHideVideoCall = () => setShowVideoCallModal(false);

  useEffect(() => {
    if (user?._id) {
      dispatch(getBlockedUsers(user._id));
    }
  }, [dispatch, user?._id]);


  useEffect(() => {
    if (user?._id && selectedUser?.receiverUserId?._id) {
      dispatch(checkIfBlockedBy({
        currentUserId: user._id,
        targetUserId: selectedUser.receiverUserId._id
      }));
    }
  }, [dispatch, user?._id, selectedUser?.receiverUserId?._id]);

  useEffect(() => {
    if (!user?._id) return;

    clearOldChatCache();

    socketRef.current = io(SOCKET_URL, {
      query: { userId: user._id },
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to chat server");
      setSocketConnected(true);
    });

    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from chat server");
      setSocketConnected(false);
    });

    socketRef.current.on("user_connected", (data) => {
      console.log("User connected:", data);
      if (data.roomId === currentRoom) {
        console.log("Other user joined the current room");
      }
    });

    socketRef.current.on("user_disconnected", (data) => {
      console.log("User disconnected:", data);
      if (data.roomId === currentRoom) {
        console.log("Other user left the current room");
      }
    });

    socketRef.current.on("room_created", (data) => {
      console.log("Room created:", data);
    });

    socketRef.current.on("room_list", (data) => {
      console.log("My rooms:", data);
      setInboxRooms(data || []);
    });

    socketRef.current.on("room_joined", (data) => {
      console.log("Room joined:", data);
      console.log("Current user ID:", user._id, "joined room:", data.roomId);
      if (data.roomId) {
        console.log("Requesting chat history for joined room:", data.roomId);
        socketRef.current.emit("get_chat", {
          roomId: data.roomId,
          page: 1,
          limit: 50,
        });
      }
    });

    socketRef.current.on("new_message", (data) => {
      console.log("New message received:", data);
      console.log("Current room:", currentRoom);
      console.log("Message room ID:", data.roomId);
      console.log("Message data:", data.message);
      console.log("Message sender ID:", data.message.senderId?._id);
      console.log("Current user ID:", user._id);
      
      const senderId = data.message.senderId?._id;
      const isBlockedSender = blockedUsers.some(
        (blockedUser) => blockedUser?.blocked?._id === senderId
      );
      
     
      const isBlockedByThisSender = blockedByUsers[senderId] === true;
      
     
      if (isBlockedSender || isBlockedByThisSender) {
        console.log("Message blocked - user is blocked or has blocked you");
        return;
      }
     
      if (data.message.senderId?._id !== user._id) {
        console.log("Message from other user - resetting restriction");
        setMessageRestricted(false);
      }
      
      setAllMessages((prev) => {
        const updatedMessages = [...(prev[data.roomId] || []), data.message];
        
      
        saveChatToStorage(data.roomId, updatedMessages);
        
        return {
          ...prev,
          [data.roomId]: updatedMessages,
        };
      });

      setInboxRooms((prev) => {
        return prev.map((room) => {
          if (room.roomId === data.roomId) {
            return {
              ...room,
              lastMessage: {
                content: data.message.content || data.message.message,
                createdAt: data.message.createdAt || new Date().toISOString(),
                senderId: data.message.senderId
              },
              updatedAt: new Date().toISOString()
            };
          }
          return room;
        });
      });

      if (data.roomId === currentRoom) {
        console.log("Updating current chat messages");
        
        if (data.message.senderId?._id === user._id) {
          setChatMessages((prev) => {
            const filteredMessages = prev.filter(msg => !msg.isTemporary);
            console.log("Removing temporary messages and adding real message");
            return [...filteredMessages, data.message];
          });
        } else {
          setChatMessages((prev) => [...prev, data.message]);
        }
        
        scrollToBottom();
      } else {
        console.log("Message not for current room, storing in cache");
      }
    });

    socketRef.current.on("message_edited", (data) => {
      console.log("Message edited:", data);
      setAllMessages((prev) => ({
        ...prev,
        [data.roomId]:
          prev[data.roomId]?.map((msg) =>
            msg._id === data.message._id ? data.message : msg
          ) || [],
      }));

      if (data.roomId === currentRoom) {
        setChatMessages((prev) =>
          prev.map((msg) => (msg._id === data.message._id ? data.message : msg))
        );
      }
    });

    socketRef.current.on("message_deleted", (data) => {
      console.log("Message deleted:", data);
      setAllMessages((prev) => ({
        ...prev,
        [data.roomId]:
          prev[data.roomId]?.filter((msg) => msg._id !== data.messageId) || [],
      }));

      if (data.roomId === currentRoom) {
        setChatMessages((prev) =>
          prev.filter((msg) => msg._id !== data.messageId)
        );
      }
    });

    socketRef.current.on("message_replied", (data) => {
      console.log("Message replied:", data);
      console.log("Reply sender ID:", data.message.senderId?._id);
      console.log("Current user ID:", user._id);
      
      if (data.message.senderId?._id !== user._id) {
        console.log("Reply from other user - resetting restriction");
        setMessageRestricted(false);
      }
      
      setAllMessages((prev) => {
        const updatedMessages = [...(prev[data.roomId] || []), data.message];
        
       
        saveChatToStorage(data.roomId, updatedMessages);
        
        return {
          ...prev,
          [data.roomId]: updatedMessages,
        };
      });

     
      setInboxRooms((prev) => {
        return prev.map((room) => {
          if (room.roomId === data.roomId) {
            return {
              ...room,
              lastMessage: {
                content: data.message.content || data.message.message,
                createdAt: data.message.createdAt || new Date().toISOString(),
                senderId: data.message.senderId
              },
              updatedAt: new Date().toISOString()
            };
          }
          return room;
        });
      });

     
      if (data.roomId === currentRoom) {
        console.log("Updating current chat messages with reply");
        setChatMessages((prev) => [...prev, data.message]);
        scrollToBottom();
      }
    });

    socketRef.current.on("chat_history", (data) => {
      console.log("Chat history received for room:", data.roomId, "Messages:", data.messages?.length || 0);
      console.log("Current room:", currentRoom);
      console.log("Messages data:", data.messages);
      console.log("Pagination data:", data.pagination);
      
     
      if (data.messages && data.messages.length > 0) {
        const hasMessagesFromBothUsers = data.messages.some(msg => 
          msg.senderId?._id !== user._id
        );
        if (hasMessagesFromBothUsers) {
          console.log("Both users have exchanged messages - enabling unlimited chat");
          setMessageRestricted(false);
        }
      }
      
     
      if (data.pagination) {
        setChatPagination(data.pagination);
        console.log("Updated pagination:", data.pagination);
      }

     
      const isFirstPage = !data.pagination || data.pagination.page === 1;
      
     
      setAllMessages((prev) => {
        const existingMessages = prev[data.roomId] || [];
        const newMessages = data.messages || [];
        
        let updatedMessages;
        if (isFirstPage) {
         
          updatedMessages = newMessages;
        } else {
         
          const combinedMessages = [...newMessages, ...existingMessages];
          updatedMessages = combinedMessages.filter((msg, index, self) => 
            index === self.findIndex(m => m._id === msg._id)
          );
        }

       
        saveChatToStorage(data.roomId, updatedMessages);

        return {
          ...prev,
          [data.roomId]: updatedMessages,
        };
      });

      
      if (data.roomId === currentRoom) {
        console.log("Updating current chat messages with:", data.messages?.length || 0, "messages");
        
        if (isFirstPage) {
          
          setChatMessages(data.messages || []);
        } else {
          
          setChatMessages((prev) => {
            const newMessages = data.messages || [];
            const combinedMessages = [...newMessages, ...prev];
            const uniqueMessages = combinedMessages.filter((msg, index, self) => 
              index === self.findIndex(m => m._id === msg._id)
            );
            return uniqueMessages;
          });
        }
        
        setLoadingChat(false);
        setTimeout(() => scrollToBottom(), 100);
      } else {
        console.log("Room ID mismatch - not updating current chat");
      }
    });

    
    socketRef.current.on("room_found", (roomData) => {
      console.log("Room found via fallback:", roomData);
      if (roomData && roomData.roomId) {
        setCurrentRoom(roomData.roomId);
        setLoadingChat(false);
        
        
        socketRef.current.emit("get_chat", {
          roomId: roomData.roomId,
          page: 1,
          limit: 50,
        });
      }
    });

    
    socketRef.current.on("user_typing", (data) => {
      if (data.roomId === currentRoom && data.userId !== user._id) {
        setTypingUser(data.userName);
        setIsTyping(true);
      }
    });

    socketRef.current.on("user_stopped_typing", (data) => {
      if (data.roomId === currentRoom && data.userId !== user._id) {
        setIsTyping(false);
        setTypingUser(null);
      }
    });

    
    socketRef.current.on("error", (error) => {
      console.error("Socket error:", error);
      
      
      // E11000 duplicate errors are handled by ensureRoomForUser's room_error handler
      // Don't handle them in this global error handler to avoid conflicts
      
      
      if (error.message && error.message.includes("not_allowed_more_messages")) {
        console.log("Message sending restricted:", error.message);
        setMessageRestricted(true);
        
        
        setChatMessages((prev) => prev.filter(msg => !msg.isTemporary));
        setAllMessages((prev) => ({
          ...prev,
          [currentRoom]: prev[currentRoom]?.filter(msg => !msg.isTemporary) || []
        }));
        
        alert("You have reached the message limit. Please wait for the other user to respond to continue the conversation.");
      }


      if (error.message && error.message.includes("chat_history")) {
        console.log("Chat history error:", error.message);
        setLoadingChat(false);
        
        // alert("Failed to load chat history. Please try again.");
      }
    });

    
    socketRef.current.emit("get_my_rooms", { userId: user._id });

    
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user?._id, currentRoom]);

    
    useEffect(() => {
      if (currentRoom && socketRef.current) {
        console.log("Room changed to:", currentRoom);
        console.log("All messages cache:", allMessages);
        
        
        if (allMessages[currentRoom] && allMessages[currentRoom].length > 0) {
          const nonTemporaryMessages = allMessages[currentRoom].filter(msg => !msg.isTemporary);
          console.log("Loading cached messages for room:", currentRoom, "Count:", nonTemporaryMessages.length);
          setChatMessages(nonTemporaryMessages);
          setLoadingChat(false);
          setTimeout(() => scrollToBottom(), 100);
        } else {
          
          const cachedMessages = loadChatFromStorage(currentRoom);
          if (cachedMessages.length > 0) {
            console.log("📂 Loading messages from localStorage for room:", currentRoom, "Count:", cachedMessages.length);
            setChatMessages(cachedMessages);
            setAllMessages((prev) => ({
              ...prev,
              [currentRoom]: cachedMessages,
            }));
            setLoadingChat(false);
            setTimeout(() => scrollToBottom(), 100);
            
            
            socketRef.current.emit("join_room", { roomId: currentRoom });
          } else {
            console.log("No cached messages, joining room and fetching chat history:", currentRoom);
            
            socketRef.current.emit("join_room", { roomId: currentRoom });
          }
        }
      } else {
        setChatMessages([]);
      }
    }, [currentRoom, allMessages]);

  
  useEffect(() => {
    let typingTimer;

    if (inputMessage.trim() && currentRoom && socketRef.current) {
      socketRef.current.emit("typing_start", { roomId: currentRoom });

      clearTimeout(typingTimer);
      typingTimer = setTimeout(() => {
        if (socketRef.current) {
          socketRef.current.emit("typing_stop", { roomId: currentRoom });
        }
      }, 1000);
    }

    return () => clearTimeout(typingTimer);
  }, [inputMessage, currentRoom]);

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

  const calenderScheduleDAte = () => {
    setNotificationSchedule(false);
    setTimeout(() => {
      setCalenderSchedule(true);
    }, 500);
  };

  const userInfoDate = (data) => {
    setTimeout(() => {
      setNotificationSchedule(true);
    }, 500);
  };

  const handleToggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleSelectEmoji = (emojiObject) => {
    const { emoji } = emojiObject;
    setInputMessage((prevMessage) => prevMessage + emoji);
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) { 
      const selectedFile = files[0];
      setSelectedFile(selectedFile);
      // const imageUrl = URL.createObjectURL(selectedFile);
    }
  };

  
  const ensureRoomForUser = (targetUserId) => { 
    console.log("🔄 ensureRoomForUser called for:", targetUserId);
    
    if (!socketRef.current || !user?._id || !targetUserId) {
      console.log("❌ Missing socket, user, or targetUserId");
      setLoadingChat(false);
      return;
    }

    
    socketRef.current.off("room_list");     
    socketRef.current.off("rooms_list");    
    socketRef.current.off("room_created");
    socketRef.current.off("room_error");

    setIsCreatingRoom(true);

    const handleRoomsList = (rooms = []) => {
      console.log("📋 Rooms list received:", rooms?.length, "rooms");
      console.log("Looking for room with user:", targetUserId);
      console.log("All rooms:", rooms);
      

      const existing = rooms.find((r) => {
        if (r?.otherUser?._id === targetUserId) return true;
        
        if (Array.isArray(r?.users)) {
          return r.users.some(u => u?._id === targetUserId || u === targetUserId);
        }
        
        if (Array.isArray(r?.participants)) {
          return r.participants.some(p => p?._id === targetUserId || p === targetUserId);
        }
        
        return false;
      });
      
      if (existing) {
        const roomId = existing.roomId || existing._id || existing.id;
        console.log("✅ Found existing room:", roomId);
        setCurrentRoom(roomId);
        socketRef.current.emit("join_room", { roomId });
        setLoadingChat(false);
        setIsCreatingRoom(false);
        cleanup();
      } else {
        console.log("➕ No existing room found, creating new room");
        console.log("Creating room between:", user._id, "and", targetUserId);
        socketRef.current.emit("create_room", { userId: user._id, toUserId: targetUserId });
      }
    };

    const handleRoomCreated = (roomData = {}) => {
      const roomId = roomData.roomId || roomData._id || roomData.id;
      console.log("🎉 Room created successfully:", roomId);
      console.log("Room data:", roomData);
      
      if (roomId) {
        setCurrentRoom(roomId);
        socketRef.current.emit("join_room", { roomId });
        console.log("🚪 Joining room:", roomId);
      } else {
        console.log("❌ No room ID in room_created response");
      }
      setLoadingChat(false);
      setIsCreatingRoom(false);
      cleanup();
    };

    const handleRoomError = (error) => {
      console.log("❌ Room error:", error);
      
      if (error?.message?.includes("E11000 duplicate key error")) {
        console.log("🔁 Room already exists, trying to find it...");
        
        console.log("Searching for existing room between:", user._id, "and", targetUserId);
        socketRef.current.emit("find_room_by_users", { 
          userId: user._id, 
          otherUserId: targetUserId 
        });
        
        setTimeout(() => {
          socketRef.current.emit("get_my_rooms", { userId: user._id });
        }, 500);
        
        return; 
      }
      
      console.log("❌ Unhandled room error, stopping");
      setLoadingChat(false);
      setIsCreatingRoom(false);
      cleanup();
    };

    const handleRoomFound = (roomData) => {
      console.log("🔍 Room found:", roomData);
      const roomId = roomData?.roomId || roomData?._id || roomData?.id;
      
      if (roomId) {
        console.log("✅ Using found room:", roomId);
        setCurrentRoom(roomId);
        socketRef.current.emit("join_room", { roomId });
        setLoadingChat(false);
        setIsCreatingRoom(false);
        cleanup();
      } else {
        console.log("❌ Found room but no ID");
      }
    };

    const cleanup = () => {
      console.log("🧹 Cleaning up room event listeners");
      socketRef.current.off("room_list", handleRoomsList);
      socketRef.current.off("rooms_list", handleRoomsList);
      socketRef.current.off("room_created", handleRoomCreated);
      socketRef.current.off("room_error", handleRoomError);
      socketRef.current.off("room_found", handleRoomFound);
    };

    socketRef.current.on("room_list", handleRoomsList);
    socketRef.current.on("rooms_list", handleRoomsList);
    socketRef.current.on("room_created", handleRoomCreated);
    socketRef.current.on("room_error", handleRoomError);
    socketRef.current.on("room_found", handleRoomFound);

    console.log("📡 Requesting user's rooms from server");
    socketRef.current.emit("get_my_rooms", { userId: user._id });
  };

  const handleUserSelect = async (userData) => {
    console.log("👤 User selected:", userData?.receiverUserId?.name, userData?.receiverUserId?._id);
    
    if (selectedUser?.receiverUserId?._id === userData.receiverUserId._id) {
      console.log("⚠️ Same user selected, ignoring");
      return;
    }
    
    console.log("🔄 Switching to new user...");
    setLoadingChat(true);
    setSelectedUser(userData);
    
    console.log("🗑️ Clearing current room and messages");
    setCurrentRoom(null);
    setChatMessages([]);
    
    setIsTyping(false);
    setTypingUser(null);
    setIsCreatingRoom(false);
    
    console.log("🚀 Starting room creation/join process");
    ensureRoomForUser(userData.receiverUserId._id);
  };

  const scrollToBottom = () => {
    if (scrollbarsRef.current) {
      scrollbarsRef.current.scrollToBottom();
    }
  };

  const handleSendMessage = () => {
    console.log("Attempting to send message:", {
      inputMessage: inputMessage.trim(),
      currentRoom,
      socketConnected: !!socketRef.current,
      messageRestricted
    });

    if (!inputMessage.trim()) {
      console.log("No message to send");
      return;
    }

    if (!currentRoom) {
      console.log("No current room set");
      alert("Please select a user first");
      return;
    }

    if (!socketRef.current) {
      console.log("Socket not connected");
      alert("Connection lost. Please refresh the page.");
      return;
    }

    // Check if either user is blocked
    if (isCurrentUserBlockedByMe()) {
      console.log("Cannot send message - you have blocked this user");
      alert("You have blocked this user. Unblock to send messages.");
      return;
    }

    if (isBlockedByCurrentUser()) {
      console.log("Cannot send message - you are blocked by this user");
      alert("You are blocked by this user. Cannot send messages.");
      return;
    }

    // Send message via socket
    const messageData = {
      roomId: currentRoom,
      message: inputMessage.trim(),
      replyToId: replyingToMessage?._id || null,
    };
    
    console.log("Sending message:", messageData);
    socketRef.current.emit("send_message", messageData);

   
    const tempMessage = {
      _id: `temp_${Date.now()}`,
      content: inputMessage.trim(),
      senderId: { _id: user._id, name: user.name },
      roomId: currentRoom,
      createdAt: new Date().toISOString(),
      isTemporary: true,
      replyTo: replyingToMessage
    };


    setChatMessages((prev) => [...prev, tempMessage]);

    console.log("Message sent successfully");
    setInputMessage("");
    setSelectedEmojis([]);
    setSelectedFile(null);
    setShowEmojiPicker(false);
    setReplyingToMessage(null);

    
    if (socketRef.current) {
      socketRef.current.emit("typing_stop", { roomId: currentRoom });
    }

    
    setTimeout(() => scrollToBottom(), 100);
  };

  
  const handleEditMessage = (messageId, newContent) => {
    if (!socketRef.current || !messageId || !newContent.trim()) {
      return;
    }

    console.log("Editing message:", { messageId, newContent });
    socketRef.current.emit("edit_message", {
      messageId: messageId,
      newContent: newContent.trim()
    });

    setEditingMessage(null);
  };

  
  const handleDeleteMessage = (messageId) => {
    if (!socketRef.current || !messageId) {
      return;
    }

    if (window.confirm("Are you sure you want to delete this message?")) {
      console.log("Deleting message:", messageId);
      socketRef.current.emit("delete_message", {
        messageId: messageId
      });
    }
  };

  
  const handleReplyToMessage = (message) => {
    setReplyingToMessage(message);
    
    setTimeout(() => {
      const inputElement = document.querySelector('input[type="text"]');
      if (inputElement) {
        inputElement.focus();
      }
    }, 100);
  };

  
  const handleLoadMoreMessages = () => {
    if (!socketRef.current || !currentRoom || loadingChat) {
      return;
    }

    const nextPage = chatPagination.page + 1;
    if (nextPage <= chatPagination.pages) {
      console.log("Loading more messages, page:", nextPage);
      socketRef.current.emit("get_chat", {
        roomId: currentRoom,
        page: nextPage,
        limit: chatPagination.limit
      });
    }
  };

  
  const requestChatHistory = (roomId, page = 1, limit = 50) => {
    if (!socketRef.current || !roomId) {
      console.error("Socket not connected or room ID missing");
      return;
    }

    console.log("🔄 Requesting chat history for room:", roomId, "page:", page, "limit:", limit);
    setLoadingChat(true);
    
    socketRef.current.emit("get_chat", {
      roomId: roomId,
      page: page,
      limit: limit
    });
  };

  
  const refreshCurrentChatHistory = () => {
    if (currentRoom) {
      console.log("🔄 Refreshing chat history for current room:", currentRoom);
      requestChatHistory(currentRoom, 1, 50);
    } else {
      console.log("❌ No current room to refresh");
    }
  };

  
  const testChatHistory = () => {
    console.log("🧪 Testing chat history functionality:");
    console.log("- Current room:", currentRoom);
    console.log("- Socket connected:", !!socketRef.current);
    console.log("- Current messages count:", chatMessages.length);
    console.log("- Pagination:", chatPagination);
    console.log("- Cached messages in localStorage:", currentRoom ? loadChatFromStorage(currentRoom).length : 0);
    
    if (currentRoom && socketRef.current) {
      console.log("✅ All conditions met, requesting chat history...");
      requestChatHistory(currentRoom, 1, 10); 
    } else {
      console.log("❌ Cannot test - missing room or socket connection");
    }
  };


  const testPersistence = () => {
    console.log("🧪 Testing chat persistence:");
    console.log("- Current room:", currentRoom);
    
    if (currentRoom) {
      const cachedMessages = loadChatFromStorage(currentRoom);
      console.log("- Cached messages count:", cachedMessages.length);
      console.log("- Cached messages:", cachedMessages);
      
      
      const keys = Object.keys(localStorage).filter(key => key.startsWith('chat_history_'));
      console.log("- All chat cache keys:", keys);
      
      keys.forEach(key => {
        const data = JSON.parse(localStorage.getItem(key));
        console.log(`- ${key}:`, {
          messageCount: data.messages?.length || 0,
          timestamp: data.timestamp,
          userId: data.userId
        });
      });
    } else {
      console.log("❌ No current room to test persistence");
    }
  };

  
  const clearAllChatCache = () => {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('chat_history_'));
    keys.forEach(key => localStorage.removeItem(key));
    console.log("🗑️ Cleared all chat cache:", keys.length, "entries");
  };

  
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      window.testChatHistory = testChatHistory;
      window.testPersistence = testPersistence;
      window.requestChatHistory = requestChatHistory;
      window.clearAllChatCache = clearAllChatCache;
      
    }
  }, [currentRoom, socketRef.current]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const giftItems = [
    { id: 1, name: "", imgUrl: img1 },
    { id: 2, name: "", imgUrl: img2 },
    { id: 3, name: "", imgUrl: img3 },
    { id: 4, name: "", imgUrl: img4 },
    { id: 5, name: "", imgUrl: img5 },
    { id: 6, name: "", imgUrl: img6 },
    { id: 7, name: "", imgUrl: img7 },
    { id: 8, name: "", imgUrl: img8 },
    { id: 9, name: "", imgUrl: img9 },
    { id: 10, name: "", imgUrl: img10 },
    { id: 11, name: "", imgUrl: img11 },
  ];

  const handleSearch = (query) => {
    const filtered = messages.filter((item) =>
      item.name?.toLowerCase().includes(query?.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  const handleChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };

  const [selectedData, setSelectedData] = useState([]);

  const NotifyScheduleData = (data) => {
    setSelectedData(data);
    setCalenderSchedule(false);
    setTimeout(() => {
      setNotificationSchedule(true);
    }, 500);
  };

  ///mobile view functions
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

  //loader main
  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }, [loading, loadingChat, selectedUser]);

  useEffect(() => {
    if (loadingChat && selectedUser) {
      setTimeout(() => {
        setLoadingChat(false);
      }, 100);
    }
  }, [selectedUser, loadingChat]);

  
  const uniqueMatchUserList = Array.isArray(matchUserList)
    ? matchUserList.filter(
        (item, index, self) =>
          item?.receiverUserId?._id &&
          index ===
            self.findIndex(
              (m) => m?.receiverUserId?._id === item?.receiverUserId?._id
            )
      )
    : [];

  
  const combinedUserList = React.useMemo(() => {
    const combined = uniqueMatchUserList
      .filter(user => {
        
        const userId = user?.receiverUserId?._id;
        if (!userId) return false;
        
        const isBlocked = blockedUsers.some(
          (blockedUser) => blockedUser?.blocked?._id === userId
        );
        const isBlockedBy = blockedByUsers[userId] === true;
        
        return !isBlocked && !isBlockedBy;
      })
      .map(user => ({
        ...user,
        receiverUserId: {
          ...user.receiverUserId
        }
      }));
    

    inboxRooms.forEach((room) => {
      const userId = room?.otherUser?._id;
      if (userId) {
        const isBlocked = blockedUsers.some(
          (blockedUser) => blockedUser?.blocked?._id === userId
        );
        const isBlockedBy = blockedByUsers[userId] === true;
        
        if (isBlocked || isBlockedBy) {
          return; 
        }
      }
      
      const existingUserIndex = combined.findIndex(
        (user) => user?.receiverUserId?._id === room?.otherUser?._id
      );
      
      if (existingUserIndex === -1 && room?.otherUser) {
        
        combined.push({
          receiverUserId: {
            ...room.otherUser,
            lastMessage: room.lastMessage,
            roomId: room.roomId,
            updatedAt: room.updatedAt
          }
        });
      } else if (existingUserIndex !== -1 && room?.lastMessage) {
        
        combined[existingUserIndex] = {
          ...combined[existingUserIndex],
          receiverUserId: {
            ...combined[existingUserIndex].receiverUserId,
            lastMessage: room.lastMessage,
            roomId: room.roomId,
            updatedAt: room.updatedAt
          }
        };
      }
    });
    
    
    return combined.sort((a, b) => {
      const timeA = new Date(a?.receiverUserId?.updatedAt || a?.receiverUserId?.lastMessage?.createdAt || 0);
      const timeB = new Date(b?.receiverUserId?.updatedAt || b?.receiverUserId?.lastMessage?.createdAt || 0);
      return timeB - timeA;
    });
  }, [uniqueMatchUserList, inboxRooms, blockedUsers, blockedByUsers]);

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

        <Scrollbars
          className="chat-list-wrap"
          autoHide
          style={{
            position: "relative",
            height: "68vh",
            padding: "0 0 0 10px",
          }}
        >
          <MDBTypography listUnStyled className="mb-0 m-3">
            {filteredItems.length > 0
              ? combinedUserList.map((val, i) => (
                  <li
                    key={i}
                    className={`p-2 border-bottom ${
                      selectedUser?.receiverUserId?._id === val?.receiverUserId?._id
                        ? "bg-light"
                        : ""
                    }`}
                    onClick={() => handleUserSelect(val)}
                    style={{
                      cursor: "pointer",
                      backgroundColor: selectedUser?.receiverUserId?._id === val?.receiverUserId?._id ? "#f8f9fa" : "transparent"
                    }}
                  >
                    <a href="#!" className="d-flex justify-content-between">
                      <div className="d-flex flex-row">
                        <div>
                          <img
                            src={
                              val?.receiverUserId?.mainAvatar
                                ? `${BASE_URL}/assets/images/${val?.receiverUserId?.mainAvatar}`
                                : val?.receiverUserId?.avatars?.[0]
                                ? `${BASE_URL}/assets/images/${val?.receiverUserId?.avatars[0]}`
                                : userMale
                            }
                            alt="avatar"
                            className="d-flex align-self-center me-3 image21"
                            style={{
                              borderRadius: "50%",
                              maxWidth: "55px",
                            }}
                            onLoad={() => {
                              console.log("Avatar image loaded successfully");
                            }}
                            onError={(e) => {
                              console.log("Avatar image failed to load:", e.target.src);
                              console.log("User data:", val?.receiverUserId);
                              e.target.src = userMale;
                            }}
                          />
                          <span className="badge bg-success badge-dot"></span>
                        </div>

                        <div className="pt-1">
                          <p className="fw-bold mb-0">
                            {val?.receiverUserId?.name}
                          </p>
                          <p 
                            className="small text-muted"
                            style={{
                              fontFamily: "'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', 'Android Emoji', 'EmojiSymbols', 'EmojiOne Mozilla', 'Twemoji Mozilla', 'Segoe UI Symbol', sans-serif"
                            }}
                          >
                            {renderMessageContent(val?.receiverUserId?.lastMessage?.content || val?.receiverUserId?.content || "No messages yet")}
                          </p>
                        </div>
                      </div>
                      <div className="pt-1">
                        <p className="small text-muted mb-1">
                          {val?.receiverUserId?.lastMessage?.createdAt ? 
                            new Date(val.receiverUserId.lastMessage.createdAt).toLocaleTimeString() : 
                            val?.receiverUserId?.timestamp
                          }
                        </p>
                        {val?.receiverUserId?.unreadCount && (
                          <span className="badge bg-danger rounded-pill float-end">
                            {val?.receiverUserId?.unreadCount}
                          </span>
                        )}
                      </div>
                    </a>
                  </li>
                ))
              : combinedUserList.map((val, i) => (
                  <li
                    key={i}
                    className={`p-2 border-bottom ${
                      selectedUser?.receiverUserId?._id === val?.receiverUserId?._id
                        ? "bg-light"
                        : ""
                    }`}
                    onClick={() => handleUserSelect(val)}
                    style={{
                      cursor: "pointer",
                      backgroundColor: selectedUser?.receiverUserId?._id === val?.receiverUserId?._id ? "#f8f9fa" : "transparent"
                    }}
                  >
                    <a href="#!" className="d-flex justify-content-between">
                      <div
                        className="d-flex flex-row align-items-center"
                        style={{ gap: "15px" }}
                      >
                        <div style={{ width: "60px", height: "60px" }}>
                          <img
                            src={
                              val?.receiverUserId?.mainAvatar
                                ? `${BASE_URL}/assets/images/${val?.receiverUserId?.mainAvatar}`
                                : val?.receiverUserId?.avatars?.[0]
                                ? `${BASE_URL}/assets/images/${val?.receiverUserId?.avatars[0]}`
                                : userMale
                            }
                            alt="avatar"
                            className="d-flex align-self-center me-3 image21 chat-profile"
                            style={{
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                          />
                          <span className="badge bg-success badge-dot"></span>
                        </div>

                        <div className="pt-1">
                          <p className="fw-bold mb-0">
                            {val?.receiverUserId?.name}
                          </p>
                          <p 
                            className="small text-muted"
                            style={{
                              fontFamily: "'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', 'Android Emoji', 'EmojiSymbols', 'EmojiOne Mozilla', 'Twemoji Mozilla', 'Segoe UI Symbol', sans-serif"
                            }}
                          >
                            {renderMessageContent(val?.receiverUserId?.lastMessage?.content || val?.receiverUserId?.content || "No messages yet")}
                          </p>
                        </div>
                      </div>
                      <div className="pt-1">
                        <p className="small text-muted mb-1">
                          {val?.receiverUserId?.lastMessage?.createdAt ? 
                            new Date(val.receiverUserId.lastMessage.createdAt).toLocaleTimeString() : 
                            val?.receiverUserId?.timestamp
                          }
                        </p>
                        {val?.receiverUserId?.unreadCount && (
                          <span className="badge bg-danger rounded-pill float-end">
                            {val?.receiverUserId?.unreadCount}
                          </span>
                        )}
                      </div>
                    </a>
                  </li>
                ))}
          </MDBTypography>
        </Scrollbars>
      </div>
    );
  };

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    return (
      date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }) + (isToday ? " | Today" : ` | ${date.toLocaleDateString()}`)
    );
  };

  
  const renderMessageContent = (content) => {
    if (!content) return "";
    
    
    return (
      <span 
        style={{
          fontFamily: "'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', 'Android Emoji', 'EmojiSymbols', 'EmojiOne Mozilla', 'Twemoji Mozilla', 'Segoe UI Symbol', sans-serif",
          fontSize: "inherit",
          lineHeight: "inherit"
        }}
      >
        {content}
      </span>
    );
  };

  const renderChatBox = () => {
    return (
      <div style={{ position: "relative" }}>
        {selectedUser ? (
          <div>
            <div className="row row12 py-1 mb-2 shadow bottom">
              <div className="col-7 chat-dp">
                <div className="row chat-status">
                  <div className="col-4 col-lg-2">
                    <img
                      src={
                        selectedUser?.receiverUserId?.mainAvatar
                          ? `${BASE_URL}/assets/images/${selectedUser?.receiverUserId?.mainAvatar}`
                          : selectedUser?.receiverUserId?.avatars?.[0]
                          ? `${BASE_URL}/assets/images/${selectedUser?.receiverUserId?.avatars[0]}`
                          : userMale
                      }
                      alt="avatar"
                      className="d-flex align-self-center image21"
                      style={{
                        borderRadius: "50%",
                        maxWidth: "55px",
                      }}
                      onError={(e) => {
                        console.log("Header avatar image failed to load:", e.target.src);
                        e.target.src = userMale;
                      }}
                    />
                  </div>

                  <div className="col-8 py-2 col-lg-8">
                    <h6>
                      {selectedUser?.receiverUserId?.name}
                      <br />
                      <small
                        style={{
                          color: socketConnected ? "green" : "orange",
                          fontSize: "0.9rem",
                          marginTop: "-10px",
                        }}
                      >
                        {isTyping
                          ? `${typingUser || "User"} is typing...`
                          : socketConnected 
                            ? (currentRoom ? "Connected" : "Connected - No room")
                            : "Connecting..."}
                      </small>
                      <br />
                      <small style={{ fontSize: "0.7rem", color: "#666" }}>
                        Room: {currentRoom ? currentRoom.substring(0, 8) + "..." : "None"}
                      </small>
                    </h6>
                  </div>
                </div>
              </div>

              <div className="col-5 chat-opt">
                <div className="float-end me-2 con-info">

                  <Link 
                    className="float-end fs-4 text-muted my-2 me-2"
                    onClick={refreshCurrentChatHistory}
                    title="Refresh chat history"
                    style={{ 
                      cursor: loadingChat ? 'not-allowed' : 'pointer',
                      opacity: loadingChat ? 0.5 : 1
                    }}
                  >
                    <i className="fa fa-refresh" aria-hidden="true"></i>
                  </Link>
                  
                  <Link className="float-end header__more fs-3 my-2 text-muted">
                    <span
                      to="#"
                      className="pointer"
                      style={{
                        fontWeight: "700",
                      }}
                      data-bs-toggle="dropdown"
                    >
                      <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
                    </span>
                    <ul
                      className="dropdown-menu"
                      style={{
                        width: "200px",
                      }}
                    >
                      <li>
                        <Link
                          className="dropdown-item py-2"
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
                        <Link
                          className="dropdown-item py-2"
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
                        <Link
                          className="dropdown-item py-2"
                          onClick={() => setMilestone(true)}
                        >
                          <i class="fa fa-history me-3" aria-hidden="true"></i>{" "}
                          Track Milestone
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item py-2"
                          onClick={() => setBlockUser(true)}
                        >
                          <i class="fa fa-ban me-3" aria-hidden="true"></i>{" "}
                          Block
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item py-2"
                          onClick={() => setReportUser(true)}
                        >
                          <i class="fa fa-flag me-3" aria-hidden="true"></i>{" "}
                          Report
                        </Link>
                      </li>
                    </ul>
                  </Link>
                  <Link
                    className="float-end fs-4 text-muted my-2"
                    onClick={handleShow}
                  >
                    <i className="fa fa-phone" aria-hidden="true"></i>
                  </Link>
                  <IncomingCallModal show={showModal} onHide={handleHide} />
                  <Link
                    className="float-end fs-4 text-muted my-2"
                    onClick={handleShowVideoCall}
                  >
                    <i class="fa fa-video-camera" aria-hidden="true"></i>
                  </Link>
                  <VideoCallModal
                    show={showVideoCallModal}
                    onHide={handleHideVideoCall}
                  />
                </div>
              </div>
            </div>

            <div className="message-box">
              <Scrollbars
                autoHide
                className="msg-wrap"
                style={{ position: "relative", height: "65vh" }}
                id="chat-container"
                ref={scrollbarsRef}
              >
                {loadingChat ? (
                  <LoaderChat />
                ) : chatMessages.length === 0 ? (
                  <div className="text-center p-4">
                    <p className="text-muted">No messages yet. Start a conversation!</p>
                    <small className="text-muted">
                      Room: {currentRoom ? currentRoom.substring(0, 8) + "..." : "None"} | 
                      Messages: {chatMessages.length}
                    </small>
                  </div>
                ) : (
                  chatMessages
                    .filter((message) => {
                      const senderId = message.senderId?._id;
                      if (!senderId || senderId === user._id) return true; // Always show own messages
                      
                      const isBlockedSender = blockedUsers.some(
                        (blockedUser) => blockedUser?.blocked?._id === senderId
                      );
                      const isBlockedByThisSender = blockedByUsers[senderId] === true;
                      
                      return !isBlockedSender && !isBlockedByThisSender;
                    })
                    .map((message) => (
                 
                    <div
                      key={message._id || message.id}
                      className={`px-3 px-md-5 d-flex flex-row justify-content-${
                        message.senderId?._id === user._id ? "end" : "start"
                      }`}
                    >
                      {message.senderId?._id === user._id ? (
                        <>
                          <div style={{ maxWidth: "70%" }}>
                            {message.replyTo && (
                              <div className="small p-2 me-3 mb-1 rounded-3 bg-light border-start border-3 border-primary">
                                <p className="mb-1 text-muted small">
                                   {otherUserName|| 'You replied'}
                                </p>
                                <p 
                                  className="mb-0 small"
                                  style={{
                                    fontFamily: "'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', 'Android Emoji', 'EmojiSymbols', 'EmojiOne Mozilla', 'Twemoji Mozilla', 'Segoe UI Symbol', sans-serif"
                                  }}
                                >
                                  {renderMessageContent(message.replyTo.content)}
                                </p>
                              </div>
                            )}
                            
                            {message.file ? (
                              <img
                                src={URL.createObjectURL(message.file)}
                                alt={`file ${message._id}`}
                                style={{
                                  borderRadius: "50%",
                                  maxWidth: "55px",
                                }}
                              />
                            ) : editingMessage?._id === message._id ? (
                              <div className="d-flex flex-column me-3 mb-1">
                                <input
                                  type="text"
                                  className="form-control form-control-sm mb-2"
                                  defaultValue={message.content}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      handleEditMessage(message._id, e.target.value);
                                    } else if (e.key === 'Escape') {
                                      setEditingMessage(null);
                                    }
                                  }}
                                  autoFocus
                                />
                                <div className="d-flex gap-2">
                                  <button
                                    className="btn btn-sm btn-success"
                                    onClick={(e) => {
                                      const input = e.target.parentElement.previousElementSibling;
                                      handleEditMessage(message._id, input.value);
                                    }}
                                  >
                                    Save
                                  </button>
                                  <button
                                    className="btn btn-sm btn-secondary"
                                    onClick={() => setEditingMessage(null)}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="d-flex align-items-start">
                                  <p
                                    className={`small p-2 me-3 mb-1 rounded-3 flex-grow-1`}
                                    style={{
                                      backgroundColor: "#f24570",
                                      color: "#ffffff",
                                      fontFamily: "'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', 'Android Emoji', 'EmojiSymbols', 'EmojiOne Mozilla', 'Twemoji Mozilla', 'Segoe UI Symbol', sans-serif"
                                    }}
                                  >
                                    {renderMessageContent(message.content)}
                                    {message.isEdited && (
                                      <span className="text-muted small ms-2">(edited)</span>
                                    )}
                                  </p>
                                  <div className="dropdown">
                                    <button
                                      className="btn btn-sm btn-link text-muted p-1"
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
                                          onClick={() => setEditingMessage(message)}
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
                                </div>
                                <p
                                  className={`small me-3 mb-3 rounded-3 text-muted`}
                                >
                                  {formatMessageTime(message.createdAt)}
                                </p>
                              </>
                            )}
                          </div>

                          <img
                            src={
                              User?.mainAvatar
                                ? `${BASE_URL}/assets/images/${User?.mainAvatar}`
                                : User?.avatars?.[0]
                                ? `${BASE_URL}/assets/images/${User?.avatars?.[0]}`
                                : dummyUserPic
                            }
                            alt={`avatar ${message._id}`}
                            style={{
                              borderRadius: "50%",
                              width: "45px",
                              height: "45px",
                              maxWidth: "45px",
                            }}
                            onError={(e) => {
                              console.log("Message avatar image failed to load:", e.target.src);
                              e.target.src = dummyUserPic;
                            }}
                          />
                        </>
                      ) : (
                        <>
                          <img
                            src={
                              selectedUser?.receiverUserId?.mainAvatar
                                ? `${BASE_URL}/assets/images/${selectedUser?.receiverUserId?.mainAvatar}`
                                : selectedUser?.receiverUserId?.avatars?.[0]
                                ? `${BASE_URL}/assets/images/${selectedUser?.receiverUserId?.avatars[0]}`
                                : userMale
                            }
                            alt={`avatar ${message._id}`}
                            style={{
                              borderRadius: "50%",
                              width: "45px",
                              height: "45px",
                              maxWidth: "45px",
                            }}
                            onError={(e) => {
                              console.log("Other user message avatar failed to load:", e.target.src);
                              e.target.src = userMale;
                            }}
                          />
                          <div style={{ maxWidth: "70%" }}>
                            {message.replyTo && (
                              <div className="small p-2 ms-3 mb-1 rounded-3 bg-light border-start border-3 border-primary">
                                <p className="mb-1 text-muted small">
                                  Replied to {  message.senderId?.namess || 'You'}
                                </p>
                                <p 
                                  className="mb-0 small"
                                  style={{
                                    fontFamily: "'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', 'Android Emoji', 'EmojiSymbols', 'EmojiOne Mozilla', 'Twemoji Mozilla', 'Segoe UI Symbol', sans-serif"
                                  }}
                                >
                                  {renderMessageContent(message.replyTo.content)}
                                </p>
                              </div>
                            )}
                            
                            {message.file ? (
                              <img
                                src={URL.createObjectURL(message.file)}
                                alt={`file ${message._id}`}
                                style={{
                                  maxWidth: "100%",
                                  height: "auto",
                                  borderRadius: "8px",
                                }}
                              />
                            ) : (
                              <>
                                <div className="d-flex align-items-start">
                                  <p
                                    className={`small p-2 ms-3 mb-1 rounded-3 flex-grow-1`}
                                    style={{
                                      backgroundColor: "#f5f6f7",
                                      color: "#000000",
                                      fontFamily: "'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', 'Android Emoji', 'EmojiSymbols', 'EmojiOne Mozilla', 'Twemoji Mozilla', 'Segoe UI Symbol', sans-serif"
                                    }}
                                  >
                                    {renderMessageContent(message.content)}
                                    {message.isEdited && (
                                      <span className="text-muted small ms-2">(edited)</span>      
                                    )}
                                  </p>
                                  <div className="dropdown">
                                    <button
                                      className="btn btn-sm btn-link text-muted p-1"
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
                                </div>
                                <p
                                  className={`small ms-3 mb-3 rounded-3 text-muted float-end`}
                                >
                                  {formatMessageTime(message.createdAt)}
                                </p>
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </Scrollbars>
              
              {/* Load More Messages Button */}
              {chatPagination.page < chatPagination.pages && (
                <div className="text-center py-2">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={handleLoadMoreMessages}
                    disabled={loadingChat}
                  >
                    {loadingChat ? "Loading..." : "Load More Messages"}
                  </button>
                </div>
              )}
            </div>

            {/* Reply Preview */}
            {replyingToMessage && (
              <div className="px-3 py-2 bg-light border-top">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="small">
                    <span className="text-muted">Replying to the3 {replyingToMessage.senderId?.namesss || 'Unknownsss3'}:</span>
                    <div 
                      className="text-truncate" 
                      style={{ 
                        maxWidth: "300px",
                        fontFamily: "'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', 'Android Emoji', 'EmojiSymbols', 'EmojiOne Mozilla', 'Twemoji Mozilla', 'Segoe UI Symbol', sans-serif"
                      }}
                    >
                      {renderMessageContent(replyingToMessage.content)}
                    </div>
                  </div>
                  <button
                    className="btn btn-sm btn-link text-muted p-0"
                    onClick={() => setReplyingToMessage(null)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

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
                  <i class="fa fa-paperclip fs-5" aria-hidden="true"></i>{" "}
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
                      <i class="fa fa-map-marker me-2" aria-hidden="true"></i>{" "}
                      Location
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="header__more">
                <span
                  to="#"
                  className="pointer"
                  style={{
                    fontWeight: "600",
                  }}
                  data-bs-toggle="dropdown"
                >
                  <i className="fa-solid fa-gift fa-xl" aria-hidden="true"></i>{" "}
                </span>
                <ul
                  className="dropdown-menu p-3"
                  style={{
                    width: "300px",
                  }}
                >
                  {giftItems.map((item) => (
                    <li key={item.id} style={{ display: "inline" }}>
                      <span
                        role="img"
                        aria-label="gift icon"
                        aria-hidden="true"
                      >
                        <img
                          className="m-1 pointer"
                          src={item.imgUrl}
                          alt={item.name}
                          style={{ width: "80px", height: "80px" }}
                        />
                      </span>
                      {item.name}
                    </li>
                  ))}
                </ul>
              </div>

              {isCurrentUserBlockedByMe() ? (
                <div className="blocked-user-message" style={{
                  padding: '20px',
                  textAlign: 'center',
                  backgroundColor: '#f8d7da',
                  borderRadius: '10px',
                 display: 'flex',
                  width: '100%',
                  maxWidth: '100%',
                  height: '50px'
                
                }}>
                  <div style={{ marginBottom: '15px' }}>
                    <i className="fa-solid fa-ban" style={{ fontSize: '24px', color: '#721c24', marginRight: '10px' }}></i>
                    <span style={{ color: '#721c24', fontWeight: '600', fontSize: '16px' }}>
                      You have blocked this person
                    </span>
                  </div>
                  {/* <button 
                    className="btn btn-danger btn-sm"
                    onClick={handleUnblockFromChat}
                    style={{ 
                        
                      fontWeight: '500',
                      margin: '0 auto'
                    }}
                  >
                    <i className="fa-solid fa-unlock" style={{ marginRight: '8px' }}></i>
                    Unblock User
                  </button> */}
                </div>
              ) : isBlockedByCurrentUser() ? (
                <div className="blocked-user-message" style={{
                  padding: '20px',
                  textAlign: 'center',
                  backgroundColor: '#fff3cd',
                  borderRadius: '10px',
                  margin: '10px 0'
                }}>
                  <div>
                    <i className="fa-solid fa-circle-exclamation" style={{ fontSize: '24px', color: '#856404', marginRight: '10px' }}></i>
                    <span style={{ color: '#856404', fontWeight: '600', fontSize: '16px' }}>
                      This user has blocked you. You cannot send or receive messages.
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="input-vox-chat">
                    <input
                      type="text"
                      className="form-control form-control-lg message-input"
                      id="exampleFormControlInput2"
                      placeholder={
                        messageRestricted 
                          ? "Message limit reached. Wait for response." 
                          : currentRoom 
                            ? "Type message" 
                            : "Select a user to start chatting"
                      }
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={!currentRoom || messageRestricted}
                      style={{
                        opacity: currentRoom && !messageRestricted ? 1 : 0.6
                      }}
                    />
                    <div className="smile-message-input">
                      <span
                        className="pointer"
                        style={{
                          fontWeight: "600",
                        }}
                        data-bs-toggle="dropdown"
                        onClick={handleToggleEmojiPicker}
                      >
                        <i class="fa-solid fa-face-smile fa-xl"></i>{" "}
                      </span>
                      <div className="dropdown-menu">
                        <EmojiPicker onEmojiClick={handleSelectEmoji} />
                      </div>
                    </div>
                  </div>

                  <button
                    className="send-btn fs-4"
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || !currentRoom || messageRestricted}
                    style={{ 
                      opacity: messageRestricted ? 0.5 : 1,
                      cursor: messageRestricted ? 'not-allowed' : 'pointer'
                    }}
                    title={messageRestricted ? "Message limit reached. Wait for response." : "Send message"}
                  >
                    <MDBIcon fas icon="paper-plane" />
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div style={{ width: "60%", margin: "0 auto" }}>
            <img src={chatBG} alt="chat background" className="chat-banner" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="chat-main-wrap">
      {/* Emoji Support CSS */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .chat-main-wrap .message-content,
          .chat-main-wrap .small,
          .chat-main-wrap p {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', 'Android Emoji', 'EmojiSymbols', 'EmojiOne Mozilla', 'Twemoji Mozilla', 'Segoe UI Symbol', sans-serif !important;
          
            font-feature-settings: "liga", "clig", "kern", "calt", "ccmp", "cv01", "cv02", "cv03", "cv04", "cv05", "cv06", "cv07", "cv08", "cv09", "cv10", "cv11", "cv12", "cv13", "cv14", "cv15", "cv16", "cv17", "cv18", "cv19", "cv20", "cv21", "cv22", "cv23", "cv24", "cv25", "cv26", "cv27", "cv28", "cv29", "cv30", "cv31", "cv32", "cv33", "cv34", "cv35", "cv36", "cv37", "cv38", "cv39", "cv40", "cv41", "cv42", "cv43", "cv44", "cv45", "cv46", "cv47", "cv48", "cv49", "cv50", "cv51", "cv52", "cv53", "cv54", "cv55", "cv56", "cv57", "cv58", "cv59", "cv60", "cv61", "cv62", "cv63", "cv64", "cv65", "cv66", "cv67", "cv68", "cv69", "cv70", "cv71", "cv72", "cv73", "cv74", "cv75", "cv76", "cv77", "cv78", "cv79", "cv80", "cv81", "cv82", "cv83", "cv84", "cv85", "cv86", "cv87", "cv88", "cv89", "cv90", "cv91", "cv92", "cv93", "cv94", "cv95", "cv96", "cv97", "cv98", "cv99", "cv100" !important;
          }
        `
      }} />
      <HeaderFour />
      {loading ? (
        <Lodder />
      ) : (
        <MDBContainer fluid className="custom-fluid">
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

          <CheckCompatibilityModalMetri
            showModal={CheckCompatibility}
            hideModal={() => setCheckCompatibility(false)}
          />
          <RelationshipMilestoneTrackerMetri
            showModal={Milestone}
            hideModal={() => setMilestone(false)}
            selectedUser={selectedUser}
          />
          <BlockUserModalMetri
            showModal={blocklUser}
            hideModal={() => setBlockUser(false)}
            selectedUser={selectedUser}
          />
          <ReportUserModalMetri
            showModal={reportUser}
            hideModal={() => setReportUser(false)}
            selectedUser={selectedUser}
          />
          <CalenderScheduleMetri
            showModal={calenderSchedule}
            hideModal={() => setCalenderSchedule(false)}
            calenderDate={calenderDate}
            clockTime={clockTime}
          />

          <EventCalenderScheduleModal
            showModal={calenderSchedule}
            hideModal={() => setCalenderSchedule(false)}
            calenderDate={calenderDate}
            NotifyScheduleData={NotifyScheduleData}
            clockTime={clockTime}
          />

          <EventNotificationScheduleModal
            showModal={NotificationSchedule}
            hideModal={() => setNotificationSchedule(false)}
            calenderScheduleDAte={calenderScheduleDAte}
            selectedUser={selectedUser}
            editIndex={editIndex}
            ViewUser={ViewUser}
            setEditIndex={setEditIndex}
            userInfoDate={userInfoDate}
            scheduledData={selectedData}
          />
        </MDBContainer>
      )}
    </div>
  );
}
