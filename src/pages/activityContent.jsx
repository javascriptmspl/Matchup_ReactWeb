//   import React from "react";
// import { Link } from "react-router-dom";
// import userMale from "../dating/assets/images/myCollection/user-male.jpg"
// import { useDispatch, useSelector } from "react-redux";
// import { BASE_URL } from "../base";

// const ActivityTimeline = () => {
//   const activities = [
//     {
//       id: 1,
//       timestamp: "2024-01-17",
//       title: "Posted a new photo",
//       description:
//         "Shared a breathtaking sunset photo taken during a weekend hike.",
//       icon: "📸",
//     },
//     {
//       id: 2,
//       timestamp: "2024-01-16",
//       title: "Had a chat with John Doe",
//       description:
//         "Caught up with John to discuss the upcoming software release and project timelines.",
//       icon: "💬",
//     },
//     {
//       id: 3,
//       timestamp: "2024-01-15",
//       title: "Liked a post by Jane Doe",
//       description:
//         "Expressed appreciation for Jane's insightful article on the future of artificial intelligence.",
//       icon: "👍",
//     },
//     {
//       id: 4,
//       timestamp: "2024-01-14",
//       title: "Attended a webinar on React development",
//       description:
//         "Gained valuable insights into the latest React features and best practices from industry experts.",
//       icon: "👩‍💻",
//     },
//     {
//       id: 5,
//       timestamp: "2024-01-13",
//       title: "Updated profile information",
//       description:
//         "Enhanced the profile with a new profile picture and added details about recent projects.",
//       icon: "✏️",
//     },
//     {
//       id: 6,
//       timestamp: "2024-01-12",
//       title: "Received a job offer",
//       description:
//         "Thrilled to receive a job offer from a leading tech company. Exciting new opportunities ahead!",
//       icon: "🎉",
//     },
//     {
//       id: 7,
//       timestamp: "2024-01-11",
//       title: "Completed a coding challenge",
//       description:
//         "Successfully solved a challenging coding problem during the final interview.",
//       icon: "💻",
//     },
//     {
//       id: 8,
//       timestamp: "2024-01-10",
//       title: "Explored a new programming language",
//       description:
//         "Embarked on the journey of learning Python to broaden programming skills.",
//       icon: "🐍",
//     },
//     {
//       id: 9,
//       timestamp: "2024-01-09",
//       title: "Celebrated a friend's birthday",
//       description:
//         "Had an amazing time celebrating Jane's birthday with friends. Lots of laughter and fun!",
//       icon: "🎂",
//     },
//     {
//       id: 10,
//       timestamp: "2024-01-08",
//       title: "Started a fitness challenge",
//       description:
//         "Committed to a 30-day fitness challenge for better health and well-being.",
//       icon: "🏋️‍♂️",
//     },
//   ];

//   const profileData = useSelector((state) => state.profile.userData);

//   const User = profileData;
//   console.log("UserUser",User)

//   return (

//     <div className="group__bottom--body bg-white">
//       <div className="group__bottom--group">
//       <h3>Activity Timelines</h3>
//         <div className="activity-cards">
//         {activities.map((activity) => (
//             <div className="col"key={activity.id}>

//               <div className="activity__item">
//               <span className="timestamp">{activity.timestamp}</span>
//                 <div className="activity__inner">

//                   <div className="activity__thumb">
//                   <img
//                             src={
//                               User?.mainAvatar
//                                 ? `${BASE_URL}/assets/images/${User?.mainAvatar}`
//                                 : userMale
//                                 ?`${BASE_URL}/assets/images/${User?.avatars[0]}`
//                                 :userMale
//                             }
//                             alt="dating thumb"
//                           />
//                   </div>

//                   <h5>{activity.icon} {activity.title}</h5>
//                     <p>{activity.description}</p>
//                     <p>{activity.activety}</p>

//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ActivityTimeline;

// import React, { useEffect, useState } from "react";
// import { BASE_URL } from "../base";
// import userMale from "../dating/assets/images/myCollection/user-male.jpg";

// const ActivityTimeline = () => {
//   const datingId = localStorage.getItem("userData");
//   const user_Data = JSON.parse(datingId);
//   const userId = user_Data?.data?._id;

//   const [activities, setActivities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchActivities = async () => {
//       if (!userId) return;

//       try {
//         const response = await fetch(
//           `${BASE_URL}/activitys/getBySenderUserId/${userId}?modeId=68d103d5aa4b176726e60421&page_number=1&page_size=10`
//         );

//         if (!response.ok) {
//           throw new Error("Failed to fetch activities");
//         }

//         const data = await response.json();
//         setActivities(data?.data || []);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchActivities();
//   }, [userId]);

//   if (loading) return <p>Loading activities...</p>;
//   if (error) return <p style={{ color: "red" }}>{error}</p>;

//   return (
//     <div className="group__bottom--body bg-white">
//       <div className="group__bottom--group">
//         <h3>Activity Timelines</h3>
//         <div className="activity-cards">
//           {activities.length > 0 ? (
//             activities.map((activity) => (
//               <div className="col" key={activity._id}>
//                 <div className="activity__item">
//                   <span className="timestamp">
//                     {new Date(activity.createdAt).toLocaleDateString()}
//                   </span>
//                   <div className="activity__inner">
//                     <div className="activity__thumb">
//                       <img
//                         src={
//                           activity?.senderUserId?.mainAvatar
//                             ? `${BASE_URL}/assets/images/${activity.senderUserId.mainAvatar}`
//                             : userMale
//                         }
//                         alt="user"
//                       />
//                     </div>
//                     <h5>{activity.activityType}</h5>
//                     <p>{activity.description}</p>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p>No activities found</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ActivityTimeline;

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
