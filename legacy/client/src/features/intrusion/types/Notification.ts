type NotificationType = "info" | "success" | "error";

export type Notification = {
  id: number;
  type: NotificationType;
  message: string;
};