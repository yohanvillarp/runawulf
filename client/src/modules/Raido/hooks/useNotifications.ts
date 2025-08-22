import { useState } from "react";
import { useCallback } from "react";

type NotificationType = "info" | "success" | "error";

type Notification = {
  id: number;
  type: NotificationType;
  message: string;
};

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toast, setToast] = useState<Notification | null>(null);

  const addNotification = useCallback(
    (notif: Omit<Notification, "id">) => {
      const newNotif = { id: Date.now(), ...notif };
      setNotifications((prev) => [newNotif, ...prev]);
      setToast(newNotif);
      setTimeout(() => setToast(null), 4000);
    }, []); 
  return { notifications, toast, addNotification };
};