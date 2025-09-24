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

//import data
import {
  messages,
  customMessages,
} from "../../dating/component/chat2-component/message";

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
import chatBG from "../assets/images/bg-img/marrage-chat-bg.jpg";
import dummyUserPic from "../../dating/assets/images/myCollection/user-male.jpg";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import CheckCompatibilityModalMetri from "../component/popUps/chat/checkCompatibilty";
import RelationshipMilestoneTrackerMetri from "../component/popUps/chat/MildStoneModal";
import BlockUserModalMetri from "../component/popUps/common-profile/block-user";
import ReportUserModalMetri from "../component/popUps/common-profile/reportUserModal";
import CalenderScheduleMetri from "../component/popUps/chat/calenderSchedule";
import NotificationScheduleMetri from "../component/popUps/chat/notificationSchedule";
import Lodder from "../component/layout/Lodder";
import LoaderChat from "../component/layout/loadderChat";
import EventCalenderScheduleModal from "../component/popUps/event/eventCalenderSchedule ";
import EventNotificationScheduleModal from "../component/popUps/event/eventNotificationSchedule ";
import { io } from "socket.io-client";
import { getBySenderUserIds } from "../../dating/store/slice/ActivitiesSlice";
import { MODE_METRI } from "../../utils";
import userMale from "../../dating/assets/images/myCollection/user-male.jpg";
import IncomingCallModal from "../component/popUps/incomingcalls/IncomingCallModal.jsx";
import VideoCallModal from "../component/popUps/incomingcalls/VideoCallModal.jsx";
import { BASE_URL } from "../../base";

export default function Chat() {
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
  const [selectedUser, setSelectedUser] = useState(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingChat, setLoadingChat] = useState(true);
  const [editIndex, setEditIndex] = useState(null);
  const [ViewUser, setViewUser] = useState([]);
  const dispatch = useDispatch();
  const datingId = localStorage.getItem("userData");
  const user_Data = JSON.parse(datingId);
  const Store = useSelector((state) => state);
  let matchUserList = useSelector(
    (state) => Store?.activies?.Activity?.data || []
  );

  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleHide = () => setShowModal(false);

  const [showVideoCallModal, setShowVideoCallModal] = useState(false);

  const handleShowVideoCall = () => setShowVideoCallModal(true);
  const handleHideVideoCall = () => setShowVideoCallModal(false);
  const user = user_Data.data;
  // const user = useSelector((state) => state.profile.userData[0]);
  const userPic = user?.avatars.length - 1;

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("https://liveapi.meander.software/chat/postMessage");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    dispatch(
      getBySenderUserIds({ modeid: MODE_METRI, id: user_Data.data._id })
    );
  }, [user_Data.data._id]);

  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (message) => {
        setChatMessages((prevMessages) => [...prevMessages, message]);
        scrollToBottom(); 
      });
    }

    return () => {
      if (socket) {
        socket.off("newMessage");
      }
    };
  }, [socket]);

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

  // const handleDateChange = (date) => {
  //   setSelectedDate(date);
  //   setShowCalendar(false);
  // };

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

  const handleUserSelect = (user) => {
    setTimeout(() => {
      setSelectedUser(user);
    }, 100);
  };

  const scrollToBottom = () => {
    if (scrollbarsRef.current) {
      scrollbarsRef.current.scrollToBottom();
    }
  };

  const handleSendMessage = () => {
    if (socket && inputMessage.trim() !== "") {
      const newMessage = {
        id: chatMessages.length + 1,
        avatar:
          "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp",
        content: inputMessage,
        timestamp:
          new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }) + "| Today",
        backgroundColor: "#f24570",
        sent: true,
        emojis: selectedEmojis,
        file: SelectedFile,
      };

      // Emit the new message to the server
      socket.emit("sendMessage", newMessage);

      // Update chatMessages state to include the new message
      setChatMessages((prevMessages) => [...prevMessages, newMessage]);

      setInputMessage("");
      setSelectedEmojis([]);
      setSelectedFile(null);
      setShowEmojiPicker(false);
      scrollToBottom();
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on("disconnect", () => {});
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
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
    //loader chat
  }, [loading, loadingChat, selectedUser]);

  useEffect(() => {
    if (loadingChat && selectedUser) {
      setTimeout(() => {
        setLoadingChat(false);
      }, 100);
    }
    //loader chat
  }, [selectedUser]);

  // Remove duplicate chat members by receiverUserId._id
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
              ? uniqueMatchUserList.map((val, i) => (
                  <li
                    key={i}
                    className="p-2 border-bottom"
                    onClick={() => handleUserSelect(val)}
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
                            // src={message.avatar}
                            alt="avatar"
                            className="d-flex align-self-center me-3 image21"
                            style={{
                              borderRadius: "50%",
                              maxWidth: "55px",
                            }}
                          />
                          <span className="badge bg-success badge-dot"></span>
                        </div>

                        <div className="pt-1">
                          <p className="fw-bold mb-0">
                            {val?.receiverUserId?.name}
                          </p>
                          <p className="small text-muted">
                            {val?.receiverUserId?.content}
                          </p>
                        </div>
                      </div>
                      <div className="pt-1">
                        <p className="small text-muted mb-1">
                          {val?.receiverUserId?.timestamp}
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
              : uniqueMatchUserList.map((val, i) => (
                  <li
                    key={i}
                    className="p-2 border-bottom"
                    onClick={() => handleUserSelect(val)}
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
                            // src={message.avatar}
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
                          <p className="small text-muted">
                            {val?.receiverUserId?.content}
                          </p>
                        </div>
                      </div>
                      <div className="pt-1">
                        <p className="small text-muted mb-1">
                          {val?.receiverUserId?.timestamp}
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

  const renderChatBox = () => {
    return (
      <div style={{ position: "relative" }}>
        {/* {loadingChat ? (
        <LoaderChat />
      ) : ( */}
        <div>
          {selectedUser ? (
            <div>
              <div
                className="row row12 py-1 mb-2 shadow bottom"
                // style={{ marginLeft: "1px", marginRight: "10px" }}
              >
                <div className="col-7 chat-dp">
                  {" "}
                  {/* Adjusted column width for medium screens and larger */}
                  <div className="row chat-status">
                    <div className="col-4 col-lg-2 ">
                      {" "}
                      {/* Adjusted column width for medium screens and larger */}
                      <img
                        src={
                          selectedUser?.receiverUserId?.mainAvatar
                            ? `${BASE_URL}/assets/images/${selectedUser?.receiverUserId?.mainAvatar}`
                            : selectedUser?.receiverUserId?.avatars?.[0]
                            ? `${BASE_URL}/assets/images/${selectedUser?.receiverUserId?.avatars[0]}`
                            : userMale
                        }
                        // src={selectedUser ? selectedUser?.receiverUserId?.mainAvatar : dummyUserPic}
                        alt="avatar"
                        className="d-flex align-self-center image21 "
                        style={{
                          borderRadius: "50%",
                          maxWidth: "55px",
                        }}
                      />
                    </div>

                    <div className="col-8 py-2 col-lg-8">
                      {" "}
                      {/* Adjusted column width for medium screens and larger */}
                      <h6>
                        {selectedUser
                          ? selectedUser?.receiverUserId?.name
                          : "Select a user"}
                        <br />
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
                            <i
                              class="fa fa-history me-3"
                              aria-hidden="true"
                            ></i>{" "}
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
                {selectedUser ? (
                  <Scrollbars
                    autoHide
                    className="msg-wrap"
                    style={{ position: "relative", height: "65vh" }}
                    id="chat-container"
                    ref={scrollbarsRef}
                  >
                    {chatMessages.map((message, newMessage) => (
                      <div
                        key={message.id}
                        className={`px-3 px-md-5 d-flex flex-row justify-content-${
                          message.id % 2 === 0 ? "end" : "start"
                        }`}
                      >
                        {message.id % 2 === 0 ? (
                          <>
                            <div style={{ maxWidth: "70%" }}>
                              {" "}
                              {/* Adjusted the maxWidth for better responsiveness */}
                              {message.file ? (
                                <img
                                  src={URL.createObjectURL(message.file)}
                                  alt={`file ${message.id}`}
                                  style={{
                                    borderRadius: "50%",
                                    maxWidth: "55px",
                                  }}
                                />
                              ) : (
                                <>
                                  <p
                                    className={`small p-2 me-3 mb-1 rounded-3`}
                                    style={{
                                      backgroundColor: "#f24570",
                                      color: "#ffffff",
                                    }}
                                  >
                                    {message.content}
                                  </p>
                                  <p
                                    className={`small me-3 mb-3 rounded-3 text-muted`}
                                  >
                                    {message?.timestamp}
                                  </p>
                                </>
                              )}
                            </div>

                            <img
                              src={
                                user?.mainAvatar
                                  ? `${BASE_URL}/assets/images/${user?.mainAvatar}`
                                  : user?.avatars?.[0]
                                  ? `${BASE_URL}/assets/images/${user?.avatars?.[0]}`
                                  : dummyUserPic
                              }
                              alt={`avatar ${message.id}`}
                              style={{
                                borderRadius: "50%",
                                width: "45px",
                                height: "45px",
                                maxWidth: "45px",
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
                              alt={`avatar ${message.id}`}
                              style={{
                                borderRadius: "50%",
                                width: "45px",
                                height: "45px",
                                maxWidth: "45px",
                              }}
                            />
                            <div style={{ maxWidth: "70%" }}>
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
                                  <p
                                    className={`small p-2 ms-3 mb-1 rounded-3`}
                                    style={{
                                      backgroundColor: "#f5f6f7",
                                      color: "#000000",
                                    }}
                                  >
                                    {message.content}
                                  </p>
                                  <p
                                    className={`small ms-3 mb-3 rounded-3 text-muted float-end`}
                                  >
                                    {message.timestamp}
                                  </p>
                                </>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </Scrollbars>
                ) : (
                  <div>
                    <img
                      src={chatBG}
                      alt="chat backgrount picture"
                      style={{ backgroundSize: "cover" }}
                    />
                  </div>
                )}
              </div>

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
                    <i
                      className="fa-solid fa-gift fa-xl"
                      aria-hidden="true"
                    ></i>{" "}
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

                <div className="input-vox-chat">
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
                  onk
                >
                  <MDBIcon fas icon="paper-plane" />
                </button>
              </div>
            </div>
          ) : (
            <div style={{ width: "60%", margin: "0 auto" }}>
              <img
                src={chatBG}
                alt="chat backgrount picture"
                className="chat-banner"
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="chat-main-wrap">
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
          {/* <NotificationScheduleMetri
          showModal={NotificationSchedule}
          hideModal={() => setNotificationSchedule(false)}
          calenderScheduleDAte={calenderScheduleDAte}
        /> */}

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



// import React, { useEffect, useRef, useState } from "react";
// import {
//   MDBContainer,
//   MDBRow,
//   MDBCol,
//   MDBCard,
//   MDBCardBody,
//   MDBIcon,
//   MDBTypography,
//   MDBInputGroup,
// } from "mdb-react-ui-kit";
// import { Scrollbars } from "react-custom-scrollbars-2";
// import HeaderFour from "../component/layout/HeaderFour";
// import EmojiPicker from "emoji-picker-react";
// import {
//   messages,
//   customMessages,
// } from "../../dating/component/chat2-component/message";

// //images
// import img2 from "../../dating/assets/images/shop/dating/1.jpg";
// import img1 from "../../dating/assets/images/shop/dating/2.jpg";
// import img3 from "../../dating/assets/images/shop/dating/3.jpg";
// import img4 from "../../dating/assets/images/shop/dating/4.jpg";
// import img5 from "../../dating/assets/images/shop/dating/5.jpg";
// import img6 from "../../dating/assets/images/shop/dating/6.jpg";
// import img7 from "../../dating/assets/images/shop/dating/7.jpg";
// import img8 from "../../dating/assets/images/shop/dating/8.jpg";
// import img9 from "../../dating/assets/images/shop/dating/9.jpg";
// import img10 from "../../dating/assets/images/shop/dating/10.png";
// import img11 from "../../dating/assets/images/shop/dating/11.png";
// import chatBG from "../assets/images/bg-img/marrage-chat-bg.jpg";
// import dummyUserPic from "../../dating/assets/images/myCollection/user-male.jpg";
// import { useSelector, useDispatch } from "react-redux";
// import { Link } from "react-router-dom";
// import CheckCompatibilityModalMetri from "../component/popUps/chat/checkCompatibilty";
// import RelationshipMilestoneTrackerMetri from "../component/popUps/chat/MildStoneModal";
// import BlockUserModalMetri from "../component/popUps/common-profile/block-user";
// import ReportUserModalMetri from "../component/popUps/common-profile/reportUserModal";
// import CalenderScheduleMetri from "../component/popUps/chat/calenderSchedule";
// import NotificationScheduleMetri from "../component/popUps/chat/notificationSchedule";
// import Lodder from "../component/layout/Lodder";
// import LoaderChat from "../component/layout/loadderChat";
// import EventCalenderScheduleModal from "../component/popUps/event/eventCalenderSchedule ";
// import EventNotificationScheduleModal from "../component/popUps/event/eventNotificationSchedule ";
// import { io } from "socket.io-client";
// import { getBySenderUserIds } from "../../dating/store/slice/ActivitiesSlice";
// import { MODE_METRI } from "../../utils";
// import userMale from "../../dating/assets/images/myCollection/user-male.jpg";
// import IncomingCallModal from "../component/popUps/incomingcalls/IncomingCallModal.jsx";
// import VideoCallModal from "../component/popUps/incomingcalls/VideoCallModal.jsx";
// import { BASE_URL } from "../../base";

// export default function Chat() {
//   const [inputMessage, setInputMessage] = useState("");
//   const [chatMessages, setChatMessages] = useState([...customMessages]);
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const [selectedEmojis, setSelectedEmojis] = useState([]);
//   const [SelectedFile, setSelectedFile] = useState(null);
//   const scrollbarsRef = useRef(null);
//   const [CheckCompatibility, setCheckCompatibility] = useState(false);
//   const [NotificationSchedule, setNotificationSchedule] = useState(false);
//   const [calenderSchedule, setCalenderSchedule] = useState(false);
//   const [blocklUser, setBlockUser] = useState(false);
//   const [reportUser, setReportUser] = useState(false);
//   const [Milestone, setMilestone] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [isMobileView, setIsMobileView] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filteredItems, setFilteredItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [loadingChat, setLoadingChat] = useState(true);
//   const dispatch = useDispatch();
//   const datingId = localStorage.getItem("userData");
//   const user_Data = JSON.parse(datingId);
//   const Store = useSelector((state) => state);
//   let matchUserList = useSelector(
//     (state) => Store?.activies?.Activity?.data || []
//   );

//   const [showModal, setShowModal] = useState(false);
//   const handleShow = () => setShowModal(true);
//   const handleHide = () => setShowModal(false);

//   const [showVideoCallModal, setShowVideoCallModal] = useState(false);
//   const handleShowVideoCall = () => setShowVideoCallModal(true);
//   const handleHideVideoCall = () => setShowVideoCallModal(false);

//   const user = user_Data.data;
//   const userPic = user?.avatars.length - 1;

//   const [socket, setSocket] = useState(null);

//   // ✅ socket connect
//   useEffect(() => {
//     const newSocket = io("https://liveapi.meander.software", {
//       path: "/chat",
//       transports: ["websocket"],
//     });
//     setSocket(newSocket);
//     return () => {
//       newSocket.disconnect();
//     };
//   }, []);

//   // ✅ fetch users
//   useEffect(() => {
//     dispatch(
//       getBySenderUserIds({ modeid: MODE_METRI, id: user_Data.data._id })
//     );
//   }, [user_Data.data._id]);

//   // ✅ listen for new messages
//   useEffect(() => {
//     if (socket) {
//       socket.on("newMessage", (message) => {
//         setChatMessages((prevMessages) => [...prevMessages, message]);
//         scrollToBottom();
//       });
//     }
//     return () => {
//       if (socket) socket.off("newMessage");
//     };
//   }, [socket]);

//   const handleToggleEmojiPicker = () => {
//     setShowEmojiPicker(!showEmojiPicker);
//   };

//   const handleSelectEmoji = (emojiObject) => {
//     setInputMessage((prevMessage) => prevMessage + emojiObject.emoji);
//   };

//   const handleFileChange = (e) => {
//     const files = e.target.files;
//     if (files.length > 0) setSelectedFile(files[0]);
//   };

//   const handleUserSelect = (user) => {
//     setTimeout(() => {
//       setSelectedUser(user);
//     }, 100);
//   };

//   const scrollToBottom = () => {
//     if (scrollbarsRef.current) scrollbarsRef.current.scrollToBottom();
//   };

//   const handleSendMessage = () => {
//     if (socket && inputMessage.trim() !== "") {
//       const newMessage = {
//         id: chatMessages.length + 1,
//         avatar: user?.mainAvatar
//           ? `${BASE_URL}/assets/images/${user?.mainAvatar}`
//           : dummyUserPic,
//         content: inputMessage,
//         timestamp: new Date().toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//         }),
//         backgroundColor: "#f24570",
//         sent: true,
//         emojis: selectedEmojis,
//         file: SelectedFile,
//       };

//       socket.emit("sendMessage", newMessage);
//       setChatMessages((prev) => [...prev, newMessage]);

//       setInputMessage("");
//       setSelectedEmojis([]);
//       setSelectedFile(null);
//       setShowEmojiPicker(false);
//       scrollToBottom();
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const giftItems = [
//     { id: 1, imgUrl: img1 },
//     { id: 2, imgUrl: img2 },
//     { id: 3, imgUrl: img3 },
//     { id: 4, imgUrl: img4 },
//     { id: 5, imgUrl: img5 },
//     { id: 6, imgUrl: img6 },
//     { id: 7, imgUrl: img7 },
//     { id: 8, imgUrl: img8 },
//     { id: 9, imgUrl: img9 },
//     { id: 10, imgUrl: img10 },
//     { id: 11, imgUrl: img11 },
//   ];

//   const handleSearch = (query) => {
//     const filtered = messages.filter((item) =>
//       item.name?.toLowerCase().includes(query?.toLowerCase())
//     );
//     setFilteredItems(filtered);
//   };

//   const handleChange = (event) => {
//     const query = event.target.value;
//     setSearchQuery(query);
//     handleSearch(query);
//   };

//   // responsive check
//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobileView(window.innerWidth <= 768);
//     };
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // loader
//   useEffect(() => {
//     if (loading) {
//       setTimeout(() => {
//         setLoading(false);
//       }, 500);
//     }
//   }, [loading]);

//   useEffect(() => {
//     if (loadingChat && selectedUser) {
//       setTimeout(() => {
//         setLoadingChat(false);
//       }, 100);
//     }
//   }, [selectedUser]);

//   // remove duplicate users
//   const uniqueMatchUserList = Array.isArray(matchUserList)
//     ? matchUserList.filter(
//         (item, index, self) =>
//           item?.receiverUserId?._id &&
//           index ===
//             self.findIndex(
//               (m) => m?.receiverUserId?._id === item?.receiverUserId?._id
//             )
//       )
//     : [];

//   // render users list
//   const renderChatUsersList = () => {
//     return (
//       <div>
//         <MDBInputGroup className="rounded mb-3 px-lg-3">
//           <input
//             className="form-control headerChat"
//             placeholder="Search"
//             type="search"
//             style={{ height: 50 }}
//             onChange={handleChange}
//           />
//           <span
//             className="input-group-text border-0 pointer"
//             style={{ backgroundColor: "rgb(242, 69, 112)", color: "#FFFF" }}
//           >
//             <MDBIcon fas icon="search" />
//           </span>
//         </MDBInputGroup>

//         <Scrollbars
//           className="chat-list-wrap"
//           autoHide
//           style={{ position: "relative", height: "68vh", padding: "0 0 0 10px" }}
//         >
//           <MDBTypography listUnStyled className="mb-0 m-3">
//             {uniqueMatchUserList.map((val, i) => (
//               <li
//                 key={i}
//                 className="p-2 border-bottom"
//                 onClick={() => handleUserSelect(val)}
//               >
//                 <a href="#!" className="d-flex justify-content-between">
//                   <div
//                     className="d-flex flex-row align-items-center"
//                     style={{ gap: "15px" }}
//                   >
//                     <div style={{ width: "60px", height: "60px" }}>
//                       <img
//                         src={
//                           val?.receiverUserId?.mainAvatar
//                             ? `${BASE_URL}/assets/images/${val?.receiverUserId?.mainAvatar}`
//                             : val?.receiverUserId?.avatars?.[0]
//                             ? `${BASE_URL}/assets/images/${val?.receiverUserId?.avatars[0]}`
//                             : userMale
//                         }
//                         alt="avatar"
//                         className="d-flex align-self-center me-3 image21 chat-profile"
//                         style={{
//                           borderRadius: "50%",
//                           objectFit: "cover",
//                         }}
//                       />
//                       <span className="badge bg-success badge-dot"></span>
//                     </div>

//                     <div className="pt-1">
//                       <p className="fw-bold mb-0">{val?.receiverUserId?.name}</p>
//                       <p className="small text-muted">
//                         {val?.receiverUserId?.content}
//                       </p>
//                     </div>
//                   </div>
//                 </a>
//               </li>
//             ))}
//           </MDBTypography>
//         </Scrollbars>
//       </div>
//     );
//   };

//   return (



//     <MDBContainer fluid className="py-3">
//       <MDBRow>
//         <MDBCol md="4">{renderChatUsersList()}</MDBCol>
//         <MDBCol md="8">
//           <MDBCard>
//             <MDBCardBody>
//               {selectedUser ? (
//                 <>
//                   {/* chat header */}
//                   {/* chat messages */}
//                   <Scrollbars
//                     autoHide
//                     className="msg-wrap"
//                     style={{ height: "65vh" }}
//                     ref={scrollbarsRef}
//                   >
//                     {chatMessages.map((message) => (
//                       <div
//                         key={message.id}
//                         className={`px-3 d-flex flex-row justify-content-${
//                           message.sent ? "end" : "start"
//                         }`}
//                       >
//                         {message.sent ? (
//                           <>
//                             <div style={{ maxWidth: "70%" }}>
//                               <p
//                                 className="small p-2 me-3 mb-1 rounded-3"
//                                 style={{
//                                   backgroundColor: "#f24570",
//                                   color: "#ffffff",
//                                 }}
//                               >
//                                 {message.content}
//                               </p>
//                               <p className="small me-3 mb-3 text-muted">
//                                 {message?.timestamp}
//                               </p>
//                             </div>
//                             <img
//                               src={message.avatar}
//                               alt="user"
//                               style={{
//                                 borderRadius: "50%",
//                                 width: "45px",
//                                 height: "45px",
//                               }}
//                             />
//                           </>
//                         ) : (
//                           <>
//                             <img
//                               src={userMale}
//                               alt="receiver"
//                               style={{
//                                 borderRadius: "50%",
//                                 width: "45px",
//                                 height: "45px",
//                               }}
//                             />
//                             <div style={{ maxWidth: "70%" }}>
//                               <p
//                                 className="small p-2 ms-3 mb-1 rounded-3"
//                                 style={{
//                                   backgroundColor: "#f5f6f7",
//                                   color: "#000",
//                                 }}
//                               >
//                                 {message.content}
//                               </p>
//                               <p className="small ms-3 mb-3 text-muted float-end">
//                                 {message.timestamp}
//                               </p>
//                             </div>
//                           </>
//                         )}
//                       </div>
//                     ))}
//                   </Scrollbars>

//                   {/* input */}
//                   <div
//                     className="inputChat text-muted d-flex align-items-center py-1 mt-4"
//                     style={{ backgroundColor: "#e9ecef" }}
//                   >
//                     <div className="header__more px-3">
//                       <span className="pointer" data-bs-toggle="dropdown">
//                         <i className="fa fa-paperclip fs-5"></i>
//                       </span>
//                       <ul className="dropdown-menu">
//                         <li>
//                           <label className="dropdown-item py-2">
//                             <i className="fa fa-picture-o me-2"></i> File
//                             <input
//                               type="file"
//                               style={{ display: "none" }}
//                               onChange={handleFileChange}
//                               id="fileInput"
//                             />
//                           </label>
//                         </li>
//                       </ul>
//                     </div>

//                     <div className="header__more">
//                       <span className="pointer" data-bs-toggle="dropdown">
//                         <i className="fa-solid fa-gift fa-xl"></i>
//                       </span>
//                       <ul className="dropdown-menu p-3" style={{ width: "300px" }}>
//                         {giftItems.map((item) => (
//                           <li key={item.id} style={{ display: "inline" }}>
//                             <img
//                               className="m-1 pointer"
//                               src={item.imgUrl}
//                               alt="gift"
//                               style={{ width: "80px", height: "80px" }}
//                             />
//                           </li>
//                         ))}
//                       </ul>
//                     </div>

//                     <div className="input-vox-chat flex-grow-1">
//                       <input
//                         type="text"
//                         className="form-control form-control-lg message-input"
//                         placeholder="Type a message..."
//                         value={inputMessage}
//                         onChange={(e) => setInputMessage(e.target.value)}
//                         onKeyDown={handleKeyDown}
//                       />
//                     </div>

//                     <button
//                       className="btn btn-primary ms-2"
//                       onClick={handleSendMessage}
//                     >
//                       <i className="fa fa-paper-plane"></i>
//                     </button>
//                   </div>
//                 </>
//               ) : (
//                 <div>
//                   <img src={chatBG} alt="chat bg" style={{ width: "100%" }} />
//                 </div>
//               )}
//             </MDBCardBody>
//           </MDBCard>
//         </MDBCol>
//       </MDBRow>
//     </MDBContainer>
//   );
// }

