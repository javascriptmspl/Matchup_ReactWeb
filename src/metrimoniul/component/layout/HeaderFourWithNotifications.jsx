import React, { useState, useEffect } from "react";
import HeaderFour from "./HeaderFour";
import { BASE_URL } from "../../../base";

const HeaderFourWithNotifications = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const userData = localStorage.getItem("userData");
  const userDataObj = userData ? JSON.parse(userData) : null;
  const userId = userDataObj?.data?._id || null;

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (userId) {
        try {
          const response = await fetch(
            `${BASE_URL}/notifications/unread-count/${userId}`
          );
          const data = await response.json();
          setUnreadCount(data.count || 0);
        } catch (error) {
          console.error("Error fetching unread count:", error);
          setUnreadCount(0);
        }
      }
    };

    fetchUnreadCount();
    // Refresh unread count every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  return <HeaderFour unreadCount={unreadCount} />;
};

export default HeaderFourWithNotifications;
