// import React, { useState } from "react";
// import { Link } from "react-router-dom";

// import boy from "../assets/images/member/male/01.jpg";

// const NotificationModal = () => {
//   const [notifications, setNotifications] = useState([
//     {
//       id: 1,
//       message: "You have a new connection request!",
//       type: "connection-request",
//       sender: "John Doe",
//       timestamp: "2 hours ago",
//     },
//     {
//       id: 2,
//       message: "Jane Smith viewed your profile.",
//       type: "profile-view",
//       viewer: "Jane Smith",
//       timestamp: "1 day ago",
//     },   
//     {
//       id: 3,
//       message: "You received a message from Alex.",
//       type: "message",
//       sender: "Alex",
//       timestamp: "3 days ago",
//     },
//     {
//       id: 4,
//       message: "Your profile photo has been liked by Emma.",
//       type: "like",
//       sender: "Emma",
//       timestamp: "4 days ago",
//     },
//     {
//       id: 5,
//       message: "New job recommendation: Software Engineer at XYZ Company.",
//       type: "job-recommendation",
//       timestamp: "1 week ago",
//     },
//     {
//       id: 6,
//       message: "You have a new follower: Bob.",
//       type: "follower",
//       sender: "Bob",
//       timestamp: "2 weeks ago",
//     },
//     {
//       id: 7,
//       message: "Congratulations! You reached 100 connections.",
//       type: "achievement",
//       timestamp: "3 weeks ago",
//     },
//     {
//       id: 8,
//       message: "Your post was shared by Alice.",
//       type: "share",
//       sender: "Alice",
//       timestamp: "1 month ago",
//     },
//     {
//       id: 9,
//       message: "You have an upcoming event: Networking Meetup.",
//       type: "event",
//       timestamp: "1 month ago",
//     },
//     {
//       id: 10,
//       message: "Your connection request to Mark was accepted.",
//       type: "connection-accepted",
//       sender: "Mark",
//       timestamp: "1 month ago",
//     },
//     // New Notifications from 11 onwards
//     {
//       id: 11,
//       message: "You received a new message from Sarah.",
//       type: "message",
//       sender: "Sarah",
//       timestamp: "2 months ago",
//     },
//     {
//       id: 12,
//       message: "Congratulations! Your post got featured.",
//       type: "achievement",
//       timestamp: "3 months ago",
//     },
//     {
//       id: 13,
//       message: "You've been invited to speak at a conference.",
//       type: "invitation",
//       timestamp: "4 months ago",
//     },
//     {
//       id: 14,
//       message: "Your job application has been approved.",
//       type: "job-approval",
//       timestamp: "5 months ago",
//     },
//     {
//       id: 15,
//       message: "You have a new follower: Alice.",
//       type: "follower",
//       sender: "Alice",
//       timestamp: "6 months ago",
//     },
//     {
//       id: 16,
//       message: "Someone mentioned you in a comment.",
//       type: "mention",
//       sender: "Chris",
//       timestamp: "7 months ago",
//     },
//     {
//       id: 17,
//       message: "Your post reached 1,000 likes!",
//       type: "achievement",
//       timestamp: "8 months ago",
//     },
//     {
//       id: 18,
//       message: "You have a new connection request from Michael.",
//       type: "connection-request",
//       sender: "Michael",
//       timestamp: "9 months ago",
//     },
//     {
//       id: 19,
//       message: "Your profile was visited by Tom.",
//       type: "profile-view",
//       viewer: "Tom",
//       timestamp: "10 months ago",
//     },
//     {
//       id: 20,
//       message: "You've been endorsed for a new skill: ReactJS.",
//       type: "skill-endorsement",
//       timestamp: "11 months ago",
//     },
//   ]);

//   const NotificationItem = ({ notification }) => {
//     return (
//       <div className="notification-item ">
//         <div className="notification-content ">
//           <p className="notification-message">{notification.message}</p>
//           {notification.type === "profile-view" && (
//             <div className="notification-action">
//               <img
//                 src={boy}
//                 // {`url_to_profile_picture/${notification.viewer}.jpg`}
//                 // alt={`${notification.viewer}'s profile`}
//                 className="profile-picture-notification"
//               />
//               {notification.viewer} viewed your profile
//             </div>
//           )}

//           {notification.type === "connection-request" && (
//             <p className="notification-action">
//               🤝 {notification.sender} sent you a connection request
//             </p>
//           )}
//         </div>
//         <div className="notification-meta ">
//           <p className="notification-timestamp">{notification.timestamp}</p>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <>
//       <div className="notification-modal-top col-12 d-flex">
//         <div className="left-head col-6">
//           <h3 className="notification-title mb-md-4">Notifications</h3>
//         </div>
//         <div className="right-icon col-6">
//           <Link to="/dating/notifications">
//           <i class="fa fa-expand" aria-hidden="true" title="Full Screen view"></i>
//              </Link>
//         </div>
//       </div>

//       <div className="notification-modal">
//         {notifications.map((notification) => (
//           <NotificationItem key={notification.id} notification={notification} />
//         ))}
//       </div>
//     </>
//   );
// };

// export default NotificationModal;




import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";


import TimeAgo from "../metrimoniul/component/popUps/setting/TimeAgo";
import { BASE_URL } from "../base";

const NotificationModal = () => {
  const datingId = localStorage.getItem("userData");
  const user_Data = datingId ? JSON.parse(datingId) : null;
  const userId = user_Data?.data?._id;

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