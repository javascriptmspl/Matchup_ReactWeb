
// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Container, Row } from "react-bootstrap";
// import HeaderFour from "../component/layout/HeaderFour";
// import SelectProduct from "../component/select/selectproduct";

// import { Link } from "react-router-dom";
// import { fetchNotifications, markAsRead } from "../../service/common-service/notificationslice";
// import { BASE_URL } from "../../base";
// import TimeAgo from "../../metrimoniul/component/popUps/setting/TimeAgo";


// const NotificationItem = ({ notification }) => {
//   const avatar = notification.senderUserId?.mainAvatar
//     ? `${BASE_URL}/assets/images/${notification.senderUserId.mainAvatar}`
//     : notification.senderUserId?.avatars?.length
//     ? `${BASE_URL}/assets/images/${notification.senderUserId.avatars[0]}`
//     : "/default-avatar.png";

//   return (
//     <div
//       className={`notification-item ${
//         notification.status === "UNREAD" ? "unread" : "read"
//       }`}
//     >
//       <div className="notification-content">
//         <div className="notification-action">
//         <Link
//                               to={`/dating/user-profile/${notification.senderUserId?._id}`}
//                             >


                          
       
//           <img
//             src={avatar}
//             className="profile-picture-notification"
//             alt={notification.senderUserId?.name || "User"}
//           />
//             </Link>
//           <span>
//             <strong>{notification.senderUserId?.name}</strong>{" "}
//             {notification.message}
//           </span>
//         </div>
//       </div>

//       <div className="notification-meta">
//         <p className="notification-timestamp">
//           <TimeAgo createdAt={notification.createdAt} />
//         </p>
//       </div>
//     </div>
//   );
// };


// const NotificationFullPage = () => {
//   const dispatch = useDispatch();
//   const { list: notifications, loading, error } = useSelector(
//     (state) => state.notifications
//   );

//   const datingId = localStorage.getItem("userData");
//   const user_Data = JSON.parse(datingId);
//   const userId = user_Data.data._id;

//   useEffect(() => {
//     if (userId) {
//       dispatch(fetchNotifications({ userId: userId, page: 1, limit: 11 }));
//     }
//   }, [dispatch, userId]);

//   return (
//     <>
//       <HeaderFour />
//       <Container>
//         <Row className="align-items-center">
//           <div className="col-lg-6 col-md-6 col-sm-12">
//             <h2 className="notification-title-page">Notifications</h2>
//           </div>
//           <div className="col-lg-6 col-md-6 col-sm-12">
//             <div className="member__info--right member__info--right-notification ">
//               <div className="member__info--customselect right w-100">
//                 <div className="default-btn">
//                   <span>Order By:</span>
//                 </div>
//                 <div className="banner__inputlist">
//                   <SelectProduct select={"Newest"} />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </Row>

//         {loading && <p>Loading notifications...</p>}
//         {error && <p style={{ color: "red" }}>Error: {error}</p>}

//         <div className="notification-modal-page">
//   {notifications.length === 0 ? (
//     <p>No notifications found.</p>
//   ) : (
//     notifications.map((notification) => (
//       <NotificationItem key={notification._id} notification={notification} />
//     ))
//   )}
// </div>
//       </Container>
//     </>
//   );
// };

// export default NotificationFullPage;



import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row } from "react-bootstrap";
import HeaderFour from "../component/layout/HeaderFour";
import SelectProduct from "../component/select/selectproduct";
import { BASE_URL } from "../../base";
import { fetchNotifications, markAsRead, markAllAsRead } from "../../service/common-service/notificationslice";
import { Link } from "react-router-dom";
import TimeAgo from "../../metrimoniul/component/popUps/setting/TimeAgo";


const NotificationItem = ({ notification, onClick }) => {
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
      onClick={() => onClick(notification)}
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
  const { list: notifications, loading, error } = useSelector(
    (state) => state.notifications
  );

  const datingId = localStorage.getItem("userData");
  const user_Data = JSON.parse(datingId);
  const userId = user_Data.data._id;

  const handleNotificationClick = async (notification) => {
    // Mark as read if unread
    if (notification.status === 'UNREAD') {
      try {
        await dispatch(markAsRead([notification._id])).unwrap();
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await dispatch(markAllAsRead(userId)).unwrap();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      dispatch(fetchNotifications({ userId: userId, page: 1, limit: 11 }));
    }
  }, [dispatch, userId]);

  return (
    <>
      <HeaderFour />
      <Container>
        <Row className="align-items-center">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2 className="notification-title-page">Notifications</h2>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="member__info--right member__info--right-notification d-flex justify-content-end align-items-center">
              {notifications.some(n => n.status === 'UNREAD') && (
                <button 
                  className="btn btn-sm btn-outline-primary me-3"
                  onClick={handleMarkAllAsRead}
                  style={{ fontSize: '14px', padding: '6px 12px' }}
                >
                  Mark all as read
                </button>
              )}
              <div className="member__info--customselect right w-100">
                <div className="default-btn">
                  <span>Order By:</span>
                  <select className="select__border--none">
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </Row>

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
        onClick={handleNotificationClick}
      />
    ))
  )}
</div>
      </Container>
    </>
  );
};

export default NotificationFullPage;
