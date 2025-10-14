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
import { Scrollbars } from "react-custom-scrollbars-2";
import HeaderFour from "../../component/layout/HeaderFour";
import EmojiPicker from "emoji-picker-react";
import { Link, useNavigate } from "react-router-dom";
import CheckCompatibilityModal from "../component/popUps/checkCompatibilty";
import NotificationScheduleModal from "../component/popUps/notificationSchedule";
import CalenderScheduleModal from "../component/popUps/calenderSchedule";
import BlockUserModal from "../component/popUps/client";
import ReportUserModal from "../component/popUps/reportUserModal";
import RelationshipMilestoneTracker from "../component/popUps/MildStoneModal";

//import data (keeping as fallback)
import { messages as staticMessages, customMessages } from "../component/chat2-component/message";

//images
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

  const handleShow = () => setShowModal(true);
  const handleHide = () => setShowModal(false);
  const handleShowVideoCall = () => setShowVideoCallModal(true);
  const handleHideVideoCall = () => setShowVideoCallModal(false);


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

      // Set selected room ID
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
          // Fallback: add message locally and refresh from server
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

          // Refresh from server to get the actual message
          setTimeout(() => {
            fetchRoomMessages(selectedRoomId);
          }, 1500);
        }
      } else {
        alert("Message sent but server returned unexpected response");
      }
    } catch (error) {
      // alert("Failed to send message. Please try again.");
      navigate("/dating/membership");
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
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

    // Get userId
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

  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
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
  }, [user?._id, storedUserId, dispatch]);

  // Re-check blocking status when blockedUsers changes
  useEffect(() => {
    if (selectedUser?._id) {
      checkBlockingStatus(selectedUser._id);
    }
  }, [blockedUsers, selectedUser?._id]);

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
                    </ul>
                  </Link>

                  <Link className="float-end fs-4 text-muted my-2"  onClick={handleShow}>
                    <i class="fa fa-phone" aria-hidden="true"></i>
                  </Link>
                  <IncomingCallModal show={showModal} onHide={handleHide} />

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
                                  ) : (
                                    <>
                                      <div
                                        className="small p-2 mb-1 rounded-3"
                                        style={{
                                          backgroundColor: "#f5f6f7",
                                          color: "#000",
                                          marginRight: "8px",
                                          display: "inline-block",
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

              <div className="header__more" >
                <span
                  to="#"
                  className="pointer"
                  style={{
                    fontWeight: "600",
                  }}
                  data-bs-toggle="dropdown"
                >
                  <i
                    className="fa-solid fa-gift fa-xl"
                    aria-hidden="true"
                  ></i>{" "}
                </span>
                <ul className="dropdown-menu p-3" style={{
                  width: "300px"
                }}>
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
                          style={{ width: "80px", height: "80px", }}
                        />
                      </span>
                      {item.name}
                    </li>
                  ))}
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
                  {/* <span
                    className="pointer"
                    style={{
                      fontWeight: "600",
                    }}
                    data-bs-toggle="dropdown"
                    onClick={handleToggleEmojiPicker}
                  >
                    <i
                      class="fa-solid fa-face-smile fa-xl"
                    ></i>{" "}
                  </span> */}
                  <div className="dropdown-menu">
                    <EmojiPicker onEmojiClick={handleSelectEmoji} />
                  </div>
                </div>
              </div>


              <button
                className="send-btn fs-4"
                onClick={handleSendMessage}
                onk
              >
                <MDBIcon fas icon="paper-plane" />
              </button>
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

      </MDBContainer>
    </div>
  );
}
