import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import boy from "../assets/images/member/male/01.jpg";
import { deleteActivitySlice, getAllActivies, getBySenderUserIds,getActivitysByUsersId } from "../../dating/store/slice/ActivitiesSlice";
import { MODE_METRI } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import TimeAgo from "../component/popUps/setting/TimeAgo";
const NotificationModal = () => {
  const datingId = localStorage.getItem("userData");
  const user_Data =JSON.parse(datingId)
  const Store = useSelector((state) => state);
  let notificationActivity =  useSelector((state) =>Store?.activies?.allActivity?.data  || [])
  

  const [notifications, setNotifications] = useState([]);

  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(getActivitysByUsersId(
      {
        id:user_Data.data._id
      }
      ));
  }, [user_Data.data._id]);

  const NotificationItem = ({ notification }) => {
    return (
      <div className="notification-item ">
        <div className="notification-content ">
          <p className="notification-message">{notification.activityType}</p>
          {notification.activityType === "superlike" && (
            <div className="notification-action">
              <img
                // src={boy}
                src={
                  notification.receiverUser?.mainAvatar
                    ? `https://datingapi.meander.software/assets/images/${notification.receiverUser?.mainAvatar}`
                    : null
                }
                // {`url_to_profile_picture/${notification.viewer}.jpg`}
                // alt={`${notification.viewer}'s profile`}
                className="profile-picture-notification"
              />
           You Add on Favourite {notification.receiverUser?.name} profile
            </div>
          )}
          {notification.activityType === "like" && (
            <div className="notification-action">
              <img
              src={
                notification.receiverUser?.mainAvatar
                  ? `https://datingapi.meander.software/assets/images/${notification.receiverUser?.mainAvatar}`
                  : null
              }
                // src={boy}
                // {`url_to_profile_picture/${notification.viewer}.jpg`}
                // alt={`${notification.viewer}'s profile`}
                className="profile-picture-notification"
              />
           You only like {notification.receiverUser?.name} profile
            </div>
          )}

          {/* {notification.type === "connection-request" && (
            <p className="notification-action">
              🤝 {notification.sender} sent you a connection request
            </p>
          )} */}
        </div>
        <div className="notification-meta ">
          <p className="notification-timestamp">
          <TimeAgo createdAt={notification.created_at}/></p>
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
          <i class="fa fa-expand" aria-hidden="true" title="Full Screen view"></i>
             </Link>
        </div>
      </div>

      <div className="notification-modal">
        {notificationActivity.map((notification) => (
          <NotificationItem key={notification._id} notification={notification} />
        ))}
      </div>
    </>
  );
};

export default NotificationModal;
