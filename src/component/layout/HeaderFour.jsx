import React, { useState, useEffect } from "react";
import { Badge } from "react-bootstrap";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import NotificationModal from "../../pages/notification-modal";
import logo from "../../assets/images/logo/Matchup-logo.png";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserProfileAsync,
  uploadProfilePictureAsync,
} from "../../dating/store/slice/profileSlice";
import userMale from "../../dating/assets/images/myCollection/user-male.jpg";
import { logout } from "../../dating/store/slice/AuthSlice";
import { MODE_DATING, MODE_METRI } from "../../utils";
import { log } from "handlebars/runtime";
import { BASE_URL } from "../../base";

// const dfimg = "../../assets/images/avtar.jpg";
let HeaderInfoList = [
  {
    iconName: "fa-solid fa-phone",
    text: "(+ 1) 455-4345455",
  },
  {
    iconName: "fa-solid fa-location-dot",
    text: "Rochester, New York, United States",
  },
];

let HeaderSocialList = [
  {
    iconName: "fa-brands fa-facebook-f",
    text: "Facebook",
    link: "https://www.facebook.com/",
  },
  {
    iconName: "fa-brands fa-instagram",
    text: "Instagram",
    link: "https://www.instagram.com/",
  },
  {
    iconName: "fa-brands fa-youtube",
    text: "Youtube",
    link: "https://www.youtube.com/",
  },
];

const HeaderFour = () => {
  const profileData = useSelector((state) => state.profile?.userData);
  const avatarVersion = useSelector((state) => state.profile?.avatarVersion);
  const [username, setUsername] = useState(localStorage.getItem("userData"));
  const [userData, setUserData] = useState(localStorage.getItem("userData"));
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [logoutStatus, setLogoutStatus] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userDataObj = userData ? JSON.parse(userData) : null;

  const userId = userDataObj?.data?._id || null;
  const [forceUpdate, setForceUpdate] = useState(false);

  const isSmallScreen = window.innerWidth <= 768 && 992;
  useEffect(() => {
    if (location.pathname === "/notifications") {
      setIsNotificationModalOpen(false);
    }
  }, [location.pathname]);

  const handleNotificationClick = () => {
    if (isSmallScreen) {
      navigate("/notifications");
    } else {
      setIsNotificationModalOpen(!isNotificationModalOpen);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      var value = window.scrollY;
      const header = document.querySelector(".header");
      if (value > 200) {
        header.classList.add("header-fixed", "animated", "fadeInDown");
      } else {
        header.classList.remove("header-fixed", "animated", "fadeInDown");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      dispatch(uploadProfilePictureAsync({ imageData: file, userId })).then(
        () => {
          setForceUpdate(!forceUpdate);
        }
      );
    }
  };

  useEffect(() => {
    dispatch(getUserProfileAsync(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    const fetchNotificationCount = async () => {
      if (userId) {
        try {
          const response = await fetch(
            `${BASE_URL}/notifications/user/${userId}?page=1&limit=100`
          );
          const data = await response.json();
          setNotificationCount(data.length);
        } catch (error) {
          console.error("Error fetching notification count:", error);
        }
      }
    };

    fetchNotificationCount();
    // Refresh notification count every 30 seconds
    const interval = setInterval(fetchNotificationCount, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  const handleLogoutApi = async () => {
    try {
      const response = await fetch(`${BASE_URL}/User/${userId}/logout`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        setLogoutStatus("Logout successful");
      } else {
        setLogoutStatus("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      setLogoutStatus("Error during logout");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("token");

    dispatch(logout());
    handleLogoutApi();
    setUsername(null);
  };

  const Userssss = userData ? JSON.parse(userData) : null;

  const User = profileData ?? userDataObj?.data ?? {};
  const lastimg = Array.isArray(User?.avatars) ? User.avatars.length - 1 : -1;

  const getKey = () => {
    const datingId = localStorage.getItem("userData");
    const dattingObj = datingId ? JSON.parse(datingId) : null;

    if (dattingObj?.data?.mode === MODE_METRI) {
      return "metrimonial";
    } else if (dattingObj?.data?.mode === MODE_DATING) {
      return "dating";
    } else {
      return "dating";
    }
  };

  useEffect(() => {}, [getKey]);

  return (
    <header className="header" id="navbar">
      <div className="">
        <div className="header__top d-none d-lg-block">
          <div className="header__top--area">
            <div className="header__top--left">
              <ul>
                {HeaderInfoList.map((val, i) => (
                  <li key={i}>
                    <i className={val.iconName}></i> <span>{val.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="header__top--right">
              <ul>
                {HeaderSocialList.map((val, i) => (
                  <li key={i}>
                    <a href={val.link}>
                      <i className={val.iconName}></i> {val.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="container">
          <nav className="navbar navbar-expand-lg ">
            <Link className="navbar-brand" to={`/${getKey()}/`}>
              <img
                src={logo}
                alt="logo"
                style={{
                  width: "135px",
                  height: "50px",
                }}
              />
            </Link>
            <button
              className="navbar-toggler collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNavAltMarkup"
              aria-controls="navbarNavAltMarkup"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler--icon"></span>
            </button>
            <div
              className="collapse navbar-collapse justify-content-end"
              id="navbarNavAltMarkup"
            >
              <div className="navb.ar-nav mainmenu">
                <ul>
                  <li className="menu-item">
                    <Link to={`/${getKey()}/members`}>Find Partner</Link>
                  </li>
                  <li className="menu-item">
                    <Link to={`/${getKey()}/match-page`}>Matches</Link>
                  </li>
                  <li className="menu-item">
                    <Link to={`/${getKey()}/events`}>Events</Link>
                  </li>

                  {/* <li className="menu-item">
                    <Link to={`/${getKey()}/chat`}>Chat</Link>
                  </li>
                  <li className="menu-item">
<Link to={`/${getKey()}/chat-page2`}>Chat</Link>
</li> */}

                  {getKey() === "metrimonial" ? (
                    <li className="menu-item">
                      <Link to={`/${getKey()}/chat`}>Chat</Link>
                    </li>
                  ) : (
                    <li className="menu-item">
                      <Link to={`/${getKey()}/chat-page2`}>Chat</Link>
                    </li>
                  )}

                  <li className="menu-item">
                    <Link to={`/${getKey()}/blog`}>Blog</Link>
                  </li>
                  <li className="menu-item">
                    <Link to={`/${getKey()}/shop-page`}>Shop</Link>
                  </li>
                  <li className="menu-item">
                    <Link to={`/${getKey()}/news`}>News</Link>
                  </li>
                </ul>
              </div>

              <div className="header__more">
                {username ? (
                  <React.Fragment>
                    <img
                      src={
                        User?.mainAvatar
                          ? `${BASE_URL}/assets/images/${User?.mainAvatar}?v=${avatarVersion}`
                          : Array.isArray(User?.avatars) &&
                            User?.avatars?.length > 0
                          ? `${BASE_URL}/assets/images/${User?.avatars[0]}?v=${avatarVersion}`
                          : userMale
                      }
                      // ||
                      // `https://placekitten.com/40/40?image=${Math.floor(
                      //   Math.random() * 16
                      // )}`

                      // src={dfimg}
                      alt="user"
                      className="dropdown-toggle"
                      data-bs-toggle="dropdown"
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        margin: "0 20px",
                        cursor: "pointer",
                      }}
                    />
                    <ul className="dropdown-menu" aria-labelledby="moreoption">
                      <li>
                        <Link
                          className="dropdown-item"
                          to={`/${getKey()}/profile`}
                        >
                          My profile
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item"
                          to={`/${getKey()}/membership`}
                        >
                          Subscribe now
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item"
                          to={`/${getKey()}/purchase-history`}
                        >
                          Purchase History
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item"
                          to={`/${getKey()}/settings`}
                        >
                          Settings
                        </Link>
                      </li>
                      <li></li>
                      <li>
                        <Link
                          className="dropdown-item"
                          to={`/${getKey()}/help&support`}
                        >
                          Help & Support
                        </Link>
                      </li>
                      <li>
                        <Link
                          onClick={handleLogout}
                          className="dropdown-item"
                          to="/"
                        >
                          Logout
                        </Link>
                      </li>
                    </ul>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <button
                      className=" me-4 default-btn dropdown-toggle"
                      type="button"
                      id="moreoption"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      My Account
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="moreoption">
                      <li>
                        <Link className="dropdown-item" to="/login">
                          Log In
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/register">
                          Sign Up
                        </Link>
                      </li>
                    </ul>
                  </React.Fragment>
                )}
              </div>
              <div className="header__more header__more-notification ">
                {location.pathname !== `/notifications` && (
                  <React.Fragment>
                    <span
                      to="#"
                      className="dropdown-toggle"
                      data-bs-toggle="dropdown"
                      onClick={handleNotificationClick}
                      style={{
                        cursor: isNotificationModalOpen ? "pointer" : "pointer",
                      }}
                    >
                      <Link>
                        <i className="fa fa-bell-o fs-5" aria-hidden="true"></i>
                      </Link>
                      {notificationCount > 0 && (
                        <Badge
                          className="notification-badge"
                          bg="danger"
                          style={{
                            position: "absolute",
                            top: "-13px",
                            left: "12px",
                            cursor: "pointer",
                          }}
                        >
                          {notificationCount}
                        </Badge>
                      )}
                    </span>
                    <ul
                      className="dropdown-menu dropdown-menu-notification"
                      aria-labelledby="moreoption"
                    >
                      <li>
                        <NotificationModal isOpen={isNotificationModalOpen} />
                      </li>
                    </ul>
                  </React.Fragment>
                )}
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default HeaderFour;
