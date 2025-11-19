
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { markAsRead, markAllAsRead } from "../../service/common-service/notificationslice";
import TimeAgo from "../component/popUps/setting/TimeAgo";
import { BASE_URL } from "../../base";

const NotificationModal = () => {
  const datingId = localStorage.getItem("userData");
  const user_Data = JSON.parse(datingId);
  const userId = user_Data.data._id;
  const dispatch = useDispatch();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleNotificationClick = async (notification) => {
    // Mark as read if unread
    if (notification.status === 'UNREAD') {
      try {
        await dispatch(markAsRead([notification._id])).unwrap();
        // Update local state
        setNotifications(prev => 
          prev.map(n => 
            n._id === notification._id 
              ? { ...n, status: 'READ' }
              : n
          )
        );
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await dispatch(markAllAsRead(userId)).unwrap();
      // Update local state to mark all as read
      setNotifications(prev => 
        prev.map(n => ({ ...n, status: 'READ' }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

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
        onClick={() => handleNotificationClick(notification)}
        style={{ cursor: 'pointer' }}
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
      <div className="notification-modal-top col-12 d-flex justify-content-between align-items-center">
        <div className="left-head">
          <h3 className="notification-title mb-md-4">Notifications</h3>
        </div>
        <div className="right-actions d-flex align-items-center">
          {notifications.some(n => n.status === 'UNREAD') && (
            <button 
              className="btn btn-sm btn-outline-primary me-2"
              onClick={handleMarkAllAsRead}
              style={{ fontSize: '12px', padding: '4px 8px' }}
            >
              Mark all as read
            </button>
          )}
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
