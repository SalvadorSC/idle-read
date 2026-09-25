import React, { useContext } from "react";
import NotificationContext from "../../context/NotificationContext";
import "./Notification.css";

const iconMap = {
  info: "i",
  success: "+",
  warning: "!",
};

export const NotificationStack = () => {
  const { notifications } = useContext(NotificationContext);

  if (notifications.length === 0) return null;

  return (
    <div className="notification-container">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`notification-item notification-${notif.type}`}
        >
          <span className="notification-icon">{iconMap[notif.type] || "i"}</span>
          <div className="notification-body">
            {notif.title && <p className="notification-title">{notif.title}</p>}
            {notif.message && <p className="notification-message">{notif.message}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};
