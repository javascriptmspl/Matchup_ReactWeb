import React, { useState, useEffect } from "react";
import { Badge } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NotificationModal from "../../../pages/notification-modal";
import { BASE_URL } from "../../../base";
import logo from "../../assets/images/logo/Logo-light-pink.png";

const HeaderFour = () => {
  const [username, setUsername] = useState(localStorage.getItem("userData"));
  const [userData, setUserData] = useState(localStorage.getItem("userData"));
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const userDataObj = userData ? JSON.parse(userData) : null;
  const userId = userDataObj?.data?._id || null;

  const isSmallScreen = window.innerWidth <= 768 && 992;

  useEffect(() => {
    if (location.pathname === "/notifications") {
      setIsNotificationModalOpen(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    const fetchNotificationCount = async () => {
      if (userId) {
        try {
          const response = await fetch(
            `${BASE_URL}/notifications/unread-count/${userId}`
          );
          const data = await response.json();
          setNotificationCount(data.count || 0);
        } catch (error) {
          console.error("Error fetching notification count:", error);
          setNotificationCount(0);
        }
      }
    };

    fetchNotificationCount();
    // Refresh notification count every 30 seconds
    const interval = setInterval(fetchNotificationCount, 30000);
    return () => clearInterval(interval);
  }, [userId]);

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

  const handleLogout = () => {
    localStorage.removeItem("username");
    setUsername(null);
  };
  return (
    <header className="header" id="navbar">
      <div className="">
        <div className="container">
          <nav className="navbar navbar-expand-lg">
            <Link className="navbar-brand" to="/">
              <img
                src={logo}
                alt="logo"
                style={{
                  width: "100px",
                  height: "40px",
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
              <div className="navbar-nav mainmenu">
                <ul>
                  <li className="menu-item">
                    <Link to="/dating/members">Find Partner</Link>
                  </li>
                  <li className="menu-item">
                    <Link to="/dating/match-page">Matches</Link>
                  </li>
                  <li className="menu-item">
                    <Link to="/dating/messenger-page">Chat</Link>
                  </li>
                  <li className="menu-item">
                    <Link to="/dating/blog">Blog</Link>
                  </li>

                  <li className="menu-item"></li>
                </ul>
              </div>

              <div className="header__more">
                {username ? (
                  <React.Fragment>
                    <img
                      src={`https://placekitten.com/40/40?image=${Math.floor(
                        Math.random() * 16
                      )}`}
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
                        <Link className="dropdown-item" to="/dating/profile">
                          My profile
                        </Link>
                      </li>

                      <li>
                        <Link className="dropdown-item" to="/dating/membership">
                          Subscribe now
                        </Link>
                      </li>
                      
                      <li>
                        <Link className="dropdown-item" to="/dating/purchase-history">
                          Purchase History
                        </Link>
                      </li>
                      
                      <li>
                        <Link
                          onClick={handleLogout}
                          className="dropdown-item"
                          to="#"
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
                {location.pathname !== "/notifications" && (
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
                        {notificationCount}
                      </Badge>
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
