
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TimeAgo from "../component/popUps/setting/TimeAgo";
import { BASE_URL } from "../../base";

const NotificationModal = () => {
  const datingId = localStorage.getItem("userData");
  const user_Data = JSON.parse(datingId);
  const userId = user_Data.data._id;

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (userId) {
        try {
          const response = await fetch(
            `${BASE_URL}/notifications/user/${userId}?page=1&limit=11`
          );
          const data = await response.json();

          setNotifications(data);
        } catch (error) {
          console.error("Error fetching notifications:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchNotifications();
  }, [userId]);

  const NotificationItem = ({ notification }) => {


    
    const avatar = notification.senderUserId?.mainAvatar
      ? `${BASE_URL}/assets/images/${notification.senderUserId.mainAvatar}`
      : notification.senderUserId?.avatars?.length
      ? `${BASE_URL}/assets/images/${notification.senderUserId.avatars[0]}`
      : "/default-avatar.png";

    return (
      <div
        className={`notification-item ${
          notification.status === "UNREAD" ? "unread" : "read"
        }`}
      >
        <div className="notification-content">
          <div className="notification-action">
         
          <Link
                              to={`/metrimonial/user-profile/${notification.senderUserId?._id}`}
                            >

            <img
              src={avatar}
              className="profile-picture-notification"
              alt={notification.senderUserId?.name || "User"}
            /> </Link>
            <span>
              <strong>{notification.senderUserId?.name}</strong>{" "}
              {notification.message}
            </span>
          </div>
        </div>

        <div className="notification-meta">
          <p className="notification-timestamp">
            <TimeAgo createdAt={notification.createdAt} />
          </p>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="notification-modal-top col-12 d-flex">
        <div className="left-head col-6">
          <h3 className="notification-title mb-md-4">Notifications</h3>
        </div>
        <div className="right-icon col-6">
          <Link to="/metrimonial/notifications">
            <i
              className="fa fa-expand"  
              aria-hidden="true"
              title="Full Screen view"
            ></i>
          </Link>
        </div>
      </div>

      <div className="notification-modal">
        {loading ? (
          <p>Loading...</p>
        ) : notifications.length === 0 ? (
          <p>No notifications found.</p>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
            />
          ))
        )}
      </div>
    </>
  );
};

export default NotificationModal;
