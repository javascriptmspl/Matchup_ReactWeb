



import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);

  const notificationsData = [
    {
       "id": 1,
       "type": "match",
       "message": "Congratulations! You have a new match. Click to view their profile.",
       "timestamp": "2023-11-15T10:30:00Z"
     },
     {
       "id": 2,
       "type": "message",
       "message": "You've received a new message from John. Click to read.",
       "timestamp": "2023-11-14T18:45:00Z"
     },
     {
       "id": 3,
       "type": "interest",
       "message": "Someone has expressed interest in your profile. Check it out.",
       "timestamp": "2023-11-13T12:15:00Z"
     },
     {
       "id": 4,
       "type": "reminder",
       "message": "Don't forget to update your profile picture for better visibility!",
       "timestamp": "2023-11-12T09:00:00Z"
     },
     {
       "id": 5,
       "type": "match",
       "message": "Great news! Another match found for you. Click to see who it is.",
       "timestamp": "2023-11-11T15:30:00Z"
     },
     {
       "id": 6,
       "type": "message",
       "message": "You've got a new message from Emily. Check it out now!",
       "timestamp": "2023-11-10T21:20:00Z"
     },
     {
       "id": 7,
       "type": "interest",
       "message": "Someone is interested in getting to know you better. Respond to their interest.",
       "timestamp": "2023-11-09T08:45:00Z"
     },
     {
       "id": 8,
       "type": "reminder",
       "message": "Complete your profile by adding more details. Profiles with more information get more attention!",
       "timestamp": "2023-11-08T14:10:00Z"
     },
     {
       "id": 9,
       "type": "match",
       "message": "Exciting news! You and Alex are a perfect match. Click to connect.",
       "timestamp": "2023-11-07T11:55:00Z"
     },
     {
       "id": 10,
       "type": "message",
       "message": "A new message is waiting for you. Open now to read.",
       "timestamp": "2023-11-06T17:30:00Z"
     }
 ];

 useEffect(() => {
    setNotifications(notificationsData);
  }, []);

  useEffect(() => {
    const notificationLoop = setInterval(() => {
      notifications.forEach((notification, index) => {
        setTimeout(() => {
          toast(notification.message, { duration: 5000 });
        }, index * 10000);
      });
    }, (notifications.length + 1) * 1000);

    return () => clearInterval(notificationLoop);
  }, [notifications]);

  return (
    <div>
      {/* <Toaster position="bottom-right" /> */}
      <style>{`
        @media (max-width: 768px) {
          .Toastify__toast-container {
            top: 0;
            bottom: auto;
          }
        }
      `}</style>
    </div>

  );
};

export default NotificationPage;



