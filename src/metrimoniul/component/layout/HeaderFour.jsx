import React, { useState, useEffect } from "react";
import { Badge } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NotificationModal from "../../pagesMetrimoniul/notification-modal";
import logo from "../../assets/images/logo/image.png";
import { useDispatch, useSelector } from "react-redux";
import userMale from "../../../dating/assets/images/myCollection/user-male.jpg";
import { logout } from "../../../dating/store/slice/AuthSlice";
import { getUserProfileAsync } from "../../../dating/store/slice/profileSlice";
import { getKey } from "../../../utils";
import Search from "../../pagesMetrimoniul/search.jsx";
import { BASE_URL } from "../../../base";

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
    link: "https://www.facebook.com",
  },
  {
    iconName: "fa-brands fa-instagram",
    text: "Instagram",
    link: "https://www.instagram.com",
  },
  {
    iconName: "fa-brands fa-youtube",
    text: "Youtube",
    link: "https://www.youtube.com",
  },
];

const HeaderFour = ({ unreadCount }) => {
  const profileData = useSelector((state) => state.profile.userData);
  const avatarVersion = useSelector((state) => state.profile.avatarVersion);
  const userProfile = useSelector((state) => state.userCreate.user);
  const [username, setUsername] = useState(localStorage.getItem("userData"));
  const [userData, setUserData] = useState(localStorage.getItem("userData"));
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [logoutStatus, setLogoutStatus] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userDataObj = JSON.parse(userData);
  const userId = userDataObj?.data?._id || null;

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

  useEffect(() => {
    dispatch(getUserProfileAsync(userId));
  }, [dispatch, userId]);

  const handleLogoutApi = async () => {
    try {
      const response = await fetch(
        `https://datingapi.meander.software/User/${userId}/logout`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
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

  const Userssss = JSON.parse(userData);
  // Prefer the canonical profile slice (kept up-to-date after uploads),
  // fall back to userCreate slice if profile slice is empty
  const User = profileData?.[0] ?? userProfile?.data;

  const lastimg = User?.avatars.length - 1;

  useEffect(() => {}, [getKey]);

  return (
    <header className="header style231" id="navbar">
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

                  <li className="menu-item">
                    <Link to={`/${getKey()}/chat`}>Chat</Link>
                  </li>
                  <li className="menu-item">
                    <Link to={`/${getKey()}/blog`}>Blog</Link>
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
                          : User?.avatars?.[0]
                          ? `${BASE_URL}/assets/images/${User?.avatars?.[0]}?v=${avatarVersion}`
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
                        objectFit: "cover",
                        objectPosition: "top",
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
                        <Link className="dropdown-item" to="/purchase-history">
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
                        {unreadCount}
                      </Badge>
                    </span>
                    <ul
                      className="dropdown-menu dropdown-menu-notification _flowover"
                      aria-labelledby="moreoption"
                    >
                      <li>
                        <NotificationModal isOpen={isNotificationModalOpen} />
                      </li>
                    </ul>
                  </React.Fragment>
                )}
              </div>
              <div className="header__more header__more-search ml-2">
                {/* <img src="https://datingapi.meander.software/assets/images/search" alt="" /> */}
                <Link className="dropdown-item" to="/search">
                  <i class="fas fa-search"></i>
                </Link>
                {/* <Search /> */}
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default HeaderFour;
