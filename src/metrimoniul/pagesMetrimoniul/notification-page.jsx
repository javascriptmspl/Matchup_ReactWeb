import React, { useState,useEffect } from "react";
import { Badge, Container, Row } from "react-bootstrap";
import HeaderFour from "../component/layout/HeaderFour";
import boy from "../assets/images/member/male/01.jpg";
import connectionRequestImage from "../assets/images/member/male/02.jpg";
import defaultImage from "../assets/images/member/male/03.jpg";
import SelectProduct from "../component/select/selectproduct";
import { deleteActivitySlice, getAllActivies, getBySenderUserIds,getActivitysByUsersId } from "../../dating/store/slice/ActivitiesSlice";
import { MODE_METRI } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import dummyUserPic from "../../dating/assets/images/myCollection/user-male.jpg"
import userPic from "../../assets/images/member/profile/download (3).jpeg";

const NotificationItem = ({ notification, markAsRead }) => {
  const user = useSelector((state) => state.profile.userData[0])
  const renderNotificationImage = () => {

   

    switch (notification.activityType === "like" ) {
      case "profile-view":
        return (
          <img
          src={
            notification.receiverUser?.mainAvatar
              ? `https://datingapi.meander.software/assets/images/${notification.receiverUser?.mainAvatar}`
              : userPic
          }
            // src={boy}
            className="profile-picture-notification"
            alt={`${notification.receiverUser?.name}'s profile`}
          />
        );
      case "connection-request":
        return (
          <img
            className="profile-picture-notification"
            src={connectionRequestImage}
            alt="Connection Request"
          />
        );
      default:
        return (
          <img
            className="profile-picture-notification"
            src={
              notification.receiverUser?.mainAvatar
                ? `https://datingapi.meander.software/assets/images/${notification.receiverUser?.mainAvatar}`
                : userPic
            }
            // src={defaultImage}
            alt="Default"
          />
        );
    }
  };

  return (
    <div
      className={`notification-item-page ${!notification.isRead ? "unread" : ""}`}
      onClick={() => markAsRead(notification.id)}
    >
      {renderNotificationImage()}
      <div className="notification-content-page">
        <div className="notification-details">
          <p
            className={`notification-title ${!notification.isRead ? "unread" : ""}`}
            style={{
              color: "#213366",
              fontWeight: notification.isRead ? "400" : "bold",
            }}
          >
            You only like {notification.receiverUser?.name} profile
          </p>
          {notification.type === "connection-request" && (
            <p className="notification-action">
              🤝 {notification.sender} sent you a connection request
            </p>
          )}
        </div>
      </div>
      <div className="notification-meta">
        <p className="notification-timestamp">{notification.timestamp}</p>
      </div>
    </div>
  );
};

const NotificationFullPage = () => {
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

  const markAsRead = (notificationId) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  return (
    <>
      <HeaderFour />
      <Container>
        <Row className="align-items-center">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2 className="notification-title-page">
              Notifications <Badge bg="danger">{unreadCount}</Badge>
            </h2>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div
              className="member__info--right member__info--right-notification "
             
            >
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
        <div className="notification-modal-page">
          {notificationActivity.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              markAsRead={markAsRead}
            />
          ))}
        </div>
      </Container>
    </>
  );
};

export default NotificationFullPage;
