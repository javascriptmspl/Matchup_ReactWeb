
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row } from "react-bootstrap";
import HeaderFour from "../component/layout/HeaderFour";
import SelectProduct from "../component/select/selectproduct";
import { Link } from "react-router-dom";
import { BASE_URL } from "../base";
import { fetchNotifications } from "../service/common-service/notificationslice";
import TimeAgo from "../metrimoniul/component/popUps/setting/TimeAgo";

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
            />
          </Link>
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

const NotificationFullPage = () => {
  const dispatch = useDispatch();
  const {
    list: notifications,
    loading,
    error,
  } = useSelector((state) => state.notifications);

  const datingId = localStorage.getItem("userData");
  const user_Data = JSON.parse(datingId);
  const userId = user_Data.data._id;

  useEffect(() => {
    if (userId) {
      dispatch(fetchNotifications({ userId: userId, page: 1, limit: 11 }));
    }
  }, [dispatch, userId]);

  return (
    <>
      <Container>
        {loading && <p>Loading notifications...</p>}
        {error && <p style={{ color: "red" }}>Error: {error}</p>}

        <div className="notification-modal-page">
          {notifications.length === 0 ? (
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
      </Container>
    </>
  );
};

export default NotificationFullPage;
