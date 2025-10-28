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
import HeaderFour from "../../component/layout/HeaderFour";
import EmojiPicker from "emoji-picker-react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from 'axios';
import CheckCompatibilityModal from "../component/popUps/checkCompatibilty";
import NotificationScheduleModal from "../component/popUps/notificationSchedule";
import CalenderScheduleModal from "../component/popUps/calenderSchedule";
import BlockUserModal from "../component/popUps/client";
import ReportUserModal from "../component/popUps/reportUserModal";
import RelationshipMilestoneTracker from "../component/popUps/MildStoneModal";

import { messages as staticMessages, customMessages } from "../component/chat2-component/message";

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
import chatBG from "../../dating/assets/images/chat/ChatBG.jpg"
import chatBG2 from "../../dating/assets/images/chat/chatbg2.jpg"
import dummyUserPic from "../../dating/assets/images/myCollection/user-male.jpg"
import { useSelector, useDispatch } from "react-redux";
import { BASE_URL } from "../../base";
import { getChatRooms, getRoomById, getRoomMessages, sendMessage, createChatRoom, editMessage, deleteMessage } from "../../service/MANAGE_API/chat-API";
import { getBlockedUsers, checkIfBlockedBy } from "../../service/common-service/blockSlice";
import { getAllGifts, sendGift, getUserCoins } from "../../service/MANAGE_API/gift-API";
import VideoCallModal from "../../metrimoniul/component/popUps/incomingcalls/VideoCallModal";
import IncomingCallModal from "../../metrimoniul/component/popUps/incomingcalls/IncomingCallModal";



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
  const [callHistory, setCallHistory] = useState([]);
  const [showCallHistory, setShowCallHistory] = useState(false);
  const [gifts, setGifts] = useState([]);
  const [loadingGifts, setLoadingGifts] = useState(false);
  const [userCoins, setUserCoins] = useState(0);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [sendingGift, setSendingGift] = useState(false);
  const [updatingCoins, setUpdatingCoins] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleHide = () => setShowModal(false);
  const handleShowVideoCall = () => setShowVideoCallModal(true);
  const handleHideVideoCall = () => setShowVideoCallModal(false);

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

  // Manual function to set coins (for debugging)
  const setManualCoins = () => {
    setUserCoins(550);
  };

  const checkForIncomingCalls = async () => {
    const userId = user?._id || storedUserId;
    if (!userId) {
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/chat/calls/history?page=1&limit=5&userId=${userId}`);
      
      if (response.data.isSuccess && response.data.data.calls) {
        const calls = response.data.data.calls;
        setCallHistory(calls); // Update call history
        
        const incomingCall = calls.find(call => 
          call.calleeId._id === userId && 
          call.status === 'ringing'
        );

        const declinedCalls = calls.filter(call => 
          call.callerId._id === userId && 
          call.status === 'declined'
        );

        if (declinedCalls.length > 0 && showModal) {
          setShowModal(false);
        }

        if (incomingCall && !showIncomingCallModal) {
          // Check if we've already shown notification for this call
          const notificationKey = `call_notification_${incomingCall._id}`;
          const alreadyNotified = sessionStorage.getItem(notificationKey);
          
          if (!alreadyNotified) {
            toast(`📞 Incoming call from ${incomingCall.callerId.name}!`, {
              duration: 2000,
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
                body: `${incomingCall.callerId.name} is calling you`,
                icon: '/favicon.ico',
                tag: 'incoming-call',
                requireInteraction: true
              });
            }

            // Mark this call as notified
            sessionStorage.setItem(notificationKey, 'true');
          }

          setIncomingCall(incomingCall);
          setShowIncomingCallModal(true);
        }
      }
    } catch (error) {
      console.error('Error checking for incoming calls:', error);
    }
  };

  // Function to fetch call history
  const fetchCallHistory = async () => {
    const userId = user?._id || storedUserId;
    if (!userId) return;

    try {
      const response = await axios.get(`${BASE_URL}/chat/calls/history?page=1&limit=20&userId=${userId}`);
      
      if (response.data.isSuccess && response.data.data.calls) {
        setCallHistory(response.data.data.calls);
      }
    } catch (error) {
      console.error('Error fetching call history:', error);
    }
  };


  const user = useSelector((state) => state.profile.userData[0])
  const userPic = user?.avatars.length - 1
  const blockedUsers = useSelector((state) => state.block.blockedUsers)

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
    if (files.length > 0) {
      const selectedFile = files[0];
      setSelectedFile(selectedFile);

      const imageUrl = URL.createObjectURL(selectedFile);
    }
  };

  const handleUserSelect = async (room) => {
    setTimeout(async () => {

      setSelectedRoomId(room.roomId);

      // First, get room details
      await fetchRoomDetails(room.roomId);

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
      if (blockedUsers.length === 0) {
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

  // Fetch messages for a specific room
  const fetchRoomMessages = async (roomId) => {
    if (!roomId) return;
    const userId = user?._id || storedUserId;
    if (!userId) return;

    setLoadingMessages(true);
    try {


      const response = await getRoomMessages(roomId, userId);
      setRoomMessages(response.data.messages);

      if (response?.isSuccess && response?.data) {
        // Ensure response.data is an array
        const messagesArray = response.data.messages;
        if (messagesArray.length === 0) {
          setRoomMessages([]);
          setLoadingMessages(false);
          return;
        }

     
        const transformedMessages = messagesArray.map((msg, index) => ({
          ...msg, // keep all original fields
          id: msg._id || index, // optional unique id for UI
          content: msg.content || msg.message, // normalize content field
          timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          sent: msg.senderId._id === userId,
          avatar: msg.senderId._id === userId
            ? (msg.senderId.mainAvatar ? `${BASE_URL}/assets/images/${msg.senderId.mainAvatar}` : dummyUserPic)
            : (selectedUser?.mainAvatar || dummyUserPic),
          messageType: msg.messageType || 'text'
        }));

        setRoomMessages(prevMessages => {

          if (prevMessages.length > transformedMessages.length) {
            return prevMessages;
          }


          if (prevMessages.length === transformedMessages.length) {

            const lastPrevId = prevMessages[prevMessages.length - 1]?.id;
            const lastTransId = transformedMessages[transformedMessages.length - 1]?.id;

            if (lastPrevId === lastTransId) {
              return prevMessages;
            }
          }

          return transformedMessages;
        });

        setTimeout(scrollToBottom, 100);
      } else {
        console.log("⚠️ No messages data in response:", response);
      }
    } catch (error) {
      console.error("❌ Error fetching messages:", error);
      setRoomMessages([]); // Reset to empty array on error
    } finally {
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

    const userId = user?._id || storedUserId;
    if (!userId) {
      console.error("No user ID available");
      return;
    }

    try {
      const response = await sendMessage(
        selectedRoomId,
        userId,
        inputMessage.trim(),
        SelectedFile ? 'file' : 'text',
        replyingToMessage?._id || null
      );

      if (response?.isSuccess) {
        // Clear input immediately
        const messageText = inputMessage;
        setInputMessage("");
        setSelectedEmojis([]);
        setSelectedFile(null);
        setShowEmojiPicker(false);
        setReplyingToMessage(null);

        // If server returns the message data, use it
        if (response.data && response.data._id) {
          const serverMessage = {
            id: response.data._id,
            content: response.data.message || messageText,
            timestamp: new Date(response.data.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            sent: true,
            avatar: user?.mainAvatar
              ? `${BASE_URL}/assets/images/${user.mainAvatar}`
              : dummyUserPic,
            messageType: response.data.messageType || 'text'
          };

          setRoomMessages(prevMessages => {
            // Check if message already exists (avoid duplicates)
            const messageExists = prevMessages.some(msg => msg.id === serverMessage.id);
            if (messageExists) {
              return prevMessages;
            }
            const updated = [...prevMessages, serverMessage];
            return updated;
          });

          // Scroll to bottom
          setTimeout(scrollToBottom, 100);
        } else {
          const localMessage = {
            id: Date.now(),
            content: messageText,
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            sent: true,
            avatar: user?.mainAvatar
              ? `${BASE_URL}/assets/images/${user.mainAvatar}`
              : dummyUserPic,
            messageType: SelectedFile ? 'file' : 'text'
          };

          setRoomMessages(prevMessages => [...prevMessages, localMessage]);
          setTimeout(scrollToBottom, 100);

          setTimeout(() => {
            fetchRoomMessages(selectedRoomId);
          }, 1500);
        }
      } else {
        alert("Message sent but server returned unexpected response");
      }
    } catch (error) {
      navigate("/dating/membership");
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

    const userId = user?._id || storedUserId;
    if (!userId) {
      console.error("No user ID available");
      alert("Cannot edit message: User not authenticated");
      return;
    }

 
    try {
      const response = await editMessage(editingMessageId, userId, editedContent.trim());

      if (response?.isSuccess) {
        setRoomMessages(prevMessages =>
          prevMessages.map(msg =>
            msg._id === editingMessageId
              ? { ...msg, content: response.data.content, isEdited: true }
              : msg
          )
        );

        // Clear editing state
        setEditingMessageId(null);
        setEditedContent('');
      } else {
        alert('Failed to edit message');
      }
    } catch (error) {
      console.error('Error editing message:', error);
      console.error('Error details:', error.response?.data || error.message);
      alert('Failed to edit message. Please try again.');
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

    // Get userId
    const userId = user?._id || storedUserId;
    if (!userId) {
      console.error("No user ID available");
      alert("Cannot delete message: User not authenticated");
      return;
    }

    // Optional: Ask for confirmation
    if (!window.confirm("Are you sure you want to delete this message?")) {
      return;
    }


    try {
      const response = await deleteMessage(messageId, userId);

      if (response?.isSuccess) {
        // Remove the message from state
        setRoomMessages(prevMessages =>
          prevMessages.filter(msg => msg._id !== messageId)
        );
      } else {
        alert('Failed to delete message');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      console.error('Error details:', error.response?.data || error.message);
      alert('Failed to delete message. Please try again.');
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

  // Handle gift sending with coin balance check
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
      // Send gift via API
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
        
        // Update localStorage with new balance
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
        
        // Create gift message for chat
        const giftMessage = `🎁 Sent a gift: ${giftItem.name}`;
        
        const messageResponse = await sendMessage(
          selectedRoomId,
          userId,
          giftMessage,
          'gift',
          null,
          null
        );

        if (messageResponse?.isSuccess) {
          const giftMessageObj = {
            id: messageResponse.data._id || Date.now(),
            content: giftMessage,
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            sent: true,
            avatar: user?.mainAvatar
              ? `${BASE_URL}/assets/images/${user.mainAvatar}`
              : dummyUserPic,
            messageType: 'gift',
            giftData: giftItem
          };

          setRoomMessages(prevMessages => [...prevMessages, giftMessageObj]);
          setTimeout(scrollToBottom, 100);
        }
        
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


  // Dynamic gifts will be loaded from API


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


    const fetchRooms = async () => {
      // Use user ID from Redux or fallback to localStorage
      const userId = user?._id || storedUserId;

      if (!userId) {

        return;
      }


      try {
        const response = await getChatRooms(userId);


        if (response?.isSuccess && response?.data) {
          setChatRooms(response.data);

        } else {
          ;
        }
      } catch (error) {
        console.error("❌ Error fetching chat rooms:", error);
        console.error("Error details:", error.response?.data || error.message);
        console.error("Full error:", error);
      }
    };

    fetchRooms();

    // Fetch blocked users on component mount
    const userId = user?._id || storedUserId;
    if (userId) {
      dispatch(getBlockedUsers(userId));
    }

    // Fetch gifts and user coins
    fetchGifts();
    // Delay coin fetching to ensure user data is available
    setTimeout(() => {
      fetchUserCoins();
    }, 1000);
  }, [user?._id, storedUserId, dispatch]);

  // Re-check blocking status when selectedUser changes
  useEffect(() => {
    if (selectedUser?._id) {
      checkBlockingStatus(selectedUser._id);
    }
  }, [selectedUser?._id]);

  // Refresh coins when user data changes
  useEffect(() => {
    if (user?._id || storedUserId) {
      console.log("User data changed, refreshing coins");
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

  // Request notification permission on component mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);



  useEffect(() => {
    const userId = user?._id || storedUserId;
    if (!userId) return;
  
    checkForIncomingCalls(); // initial fetch
  
    const pollForCalls = setInterval(() => {
      checkForIncomingCalls();
    }, 9000); // or 5000 ms — 1s is too frequent
  
    return () => clearInterval(pollForCalls);
  }, []);

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
                    <div style={{ width: '60px', height: '60px' }}>
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
                      <span className="badge bg-success badge-dot"></span>
                    </div>

                    <div className="pt-1">
                      <p className="fw-bold mb-0">
                        {room.otherUser?.name}
                      </p>
                      <p className="small text-muted">
                        @{room.otherUser?.userName}
                      </p>
                    </div>
                  </div>
                  <div className="pt-1">
                    <p className="small text-muted mb-1">
                      {new Date(room.updatedAt).toLocaleDateString()}
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

                  <div className="col-8 py-2 col-lg-8">
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

                  <Link className="float-end fs-4 text-muted my-2"  onClick={handleShow}>
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
                       <VideoCallModal show={showVideoCallModal} onHide={handleHideVideoCall} />


                </div>
              </div>
            </div>

            <div className="message-box">
              {selectedUser ?
                <Scrollbars
                  autoHide className="msg-wrap"
                  style={{ position: "relative", height: "65vh" }}
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
                                    <div
                                      className="small p-3 me-3 mb-1 rounded-3"
                                      style={{
                                        backgroundColor: "#f24570",
                                        color: "#ffffff",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        border: "2px solid #ffd700"
                                      }}
                                    >
                                      <span style={{ fontSize: "20px" }}>🎁</span>
                                      <div>
                                        <div style={{ fontWeight: "600" }}>Gift Sent!</div>
                                        <div style={{ fontSize: "12px", opacity: 0.9 }}>
                                          {message.content}
                                        </div>
                                      </div>
                                    </div>
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
                                src={message.avatar}
                                alt={`avatar ${message.id}`}
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
                                  className="d-flex align-self-center"
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
                                      <div
                                        className="small p-3 mb-1 rounded-3"
                                        style={{
                                          backgroundColor: "#f5f6f7",
                                          color: "#000",
                                          marginRight: "8px",
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "10px",
                                          border: "2px solid #ffd700"
                                        }}
                                      >
                                        <span style={{ fontSize: "20px" }}>🎁</span>
                                        <div>
                                          <div style={{ fontWeight: "600", color: "#f24570" }}>Gift Received!</div>
                                          <div style={{ fontSize: "12px", color: "#6c757d" }}>
                                            {message.content}
                                          </div>
                                        </div>
                                      </div>
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

        {/* Incoming Call Modal */}
        {incomingCall && (
          <IncomingCallModal 
            show={showIncomingCallModal} 
            onHide={() => {
              // Clear notification flag when modal is closed
              if (incomingCall) {
                const notificationKey = `call_notification_${incomingCall._id}`;
                sessionStorage.removeItem(notificationKey);
              }
              setShowIncomingCallModal(false);
              setIncomingCall(null);
            }}
            selectedUser={{
              _id: incomingCall.callerId._id,
              name: incomingCall.callerId.name,
              avatar: `${BASE_URL}/assets/images/${incomingCall.callerId.mainAvatar}`
            }}
            currentUserId={user?._id || storedUserId}
            selectedRoomId={incomingCall.roomId}
            callId={incomingCall._id}
            isIncomingCall={true}
            callerName={incomingCall.callerId.name}
          />
        )}

        {/* Call History Modal */}
        <Modal show={showCallHistory} onHide={() => setShowCallHistory(false)} size="lg" centered>
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

                  return (
                    <div key={call._id} className="d-flex align-items-center p-3 border-bottom">
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
                            <h6 className="mb-1">{otherUser.name}</h6>
                            <small className="text-muted">
                              {isIncoming ? 'Incoming' : 'Outgoing'} • {call.callType} call
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
