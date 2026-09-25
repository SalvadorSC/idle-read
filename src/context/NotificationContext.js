import React, { createContext, useCallback, useMemo, useState } from "react";

const NotificationContext = createContext();

let notificationId = 0;

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback(({ type = "info", title, message, duration = 3000 }) => {
    const id = ++notificationId;
    setNotifications((prev) => [...prev, { id, type, title, message, duration }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, duration);
    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const value = useMemo(() => ({
    notifications,
    addNotification,
    removeNotification,
  }), [notifications, addNotification, removeNotification]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
