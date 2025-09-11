// import React, { useState, useEffect } from "react";
// import { Badge, Container, Row } from "react-bootstrap";
// import HeaderFour from "../component/layout/HeaderFour";
// import boy from "../assets/images/member/male/01.jpg";
// import connectionRequestImage from "../assets/images/member/male/02.jpg";
// import defaultImage from "../assets/images/member/male/03.jpg";
// import SelectProduct from "../component/select/selectproduct";
// import {
//   deleteActivitySlice,
//   getAllActivies,
//   getBySenderUserIds,
//   getActivitysByUsersId,
// } from "../../dating/store/slice/ActivitiesSlice";
// import { MODE_METRI } from "../../utils";
// import { useDispatch, useSelector } from "react-redux";
// import dummyUserPic from "../../dating/assets/images/myCollection/user-male.jpg";
// import userPic from "../../assets/images/member/profile/download (3).jpeg";
// import { BASE_URL } from "../../base";

// const NotificationItem = ({ notification }) => {
//   return (
//     <div className="notification-item ">
//       <div className="notification-content ">
//         <p className="notification-message">{notification.activityType}</p>
//         {notification.activityType === "superlike" && (
//           <div className="notification-action">
//             <img
//               src={
//                 notification.receiverUser?.mainAvatar
//                   ? `${BASE_URL}/assets/images/${notification.receiverUser?.mainAvatar}`
//                   : userPic
//                   ?`${BASE_URL}/assets/images/${notification.receiverUser?.avatars[0]}`
//                   :null
//               }
//               className="profile-picture-notification"
//               alt={notification.receiverUser?.name || "User"}
//             />
//             You Add on Favourite {notification.receiverUser?.name} profile
//           </div>
//         )}
//         {notification.activityType === "like" && (
//           <div className="notification-action">
//             <img
//               src={
//                 notification.receiverUser?.mainAvatar
//                   ? `${BASE_URL}/assets/images/${notification.receiverUser?.mainAvatar}`
//                   : userPic
//                   ?`${BASE_URL}/assets/images/${notification.receiverUser?.avatars[0]}`
//                   :null
//               }
//               className="profile-picture-notification"
//               alt={notification.receiverUser?.name || "User"}
//             />
//             You only like {notification.receiverUser?.name} profile
//           </div>
//         )}
//       </div>
//       <div className="notification-meta ">
//         <p className="notification-timestamp">{notification.created_at}</p>
//       </div>
//     </div>
//   );
// };

// const NotificationFullPage = () => {
//   const datingId = localStorage.getItem("userData");
//   const user_Data = JSON.parse(datingId);
//   const dispatch = useDispatch();
//   let notificationActivity = useSelector(
//     (state) => state.activies.allActivity?.data || []
//   );

//   useEffect(() => {
//     dispatch(getActivitysByUsersId({ id: user_Data.data._id }));
//   }, [user_Data.data._id]);

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
//         <div className="notification-modal-page">
//           {notificationActivity.map((notification) => (
//             <NotificationItem
//               key={notification._id}
//               notification={notification}
//             />
//           ))}
//         </div>
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
import { fetchNotifications } from "../../service/common-service/notificationslice";

const NotificationItem = ({ notification }) => {
  return (
    <div className="notification-item">
      <div className="notification-content">
        <p className="notification-message">{notification.notificationType}</p>

        {notification.notificationType === "SUPERLIKE" && (
          <div className="notification-action">
            <img
              src={
                notification.senderUserId?.avatars?.length
                  ? `${BASE_URL}/assets/images/${notification.senderUserId.avatars[0]}`
                  : "/default-avatar.png"
              }
              className="profile-picture-notification"
              alt={notification.senderUserId?.name || "User"}
            />
            {notification.senderUserId?.name} {notification.message}
          </div>
        )}

        {notification.notificationType === "LIKE" && (
          <div className="notification-action">
            <img
              src={
                notification.senderUserId?.avatars?.length
                  ? `${BASE_URL}/assets/images/${notification.senderUserId.avatars[0]}`
                  : "/default-avatar.png"
              }
              className="profile-picture-notification"
              alt={notification.senderUserId?.name || "User"}
            />
            {notification.senderUserId?.name}  {notification.message}
          </div>
        )}
      </div>

      <div className="notification-meta">
        <p className="notification-timestamp">
          {new Date(notification.createdAt).toLocaleString()}
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
            <div className="member__info--right member__info--right-notification ">
              <div className="member__info--customselect right w-100">
                <div className="default-btn">
                  <span>Order By:</span>
                </div>
                <div className="banner__inputlist">
                  <SelectProduct select={"Newest"} />
                </div>
              </div>
            </div>
          </div>
        </Row>

        {loading && <p>Loading notifications...</p>}
        {error && <p style={{ color: "red" }}>Error: {error}</p>}

        <div className="notification-modal-page">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
            />
          ))}
        </div>
      </Container>
    </>
  );
};

export default NotificationFullPage;
