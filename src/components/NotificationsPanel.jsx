import { useState } from "react";
import { notificationService } from "../services/notificationService";
import { formatDate } from "../utils/formatDate";

const NotificationsPanel = ({ notifications, setNotifications, loading }) => {
  if (loading) {
    return <div className="text-muted">Loading notifications...</div>;
  }

  const markAsRead = async (id, currentStatus) => {
    if (currentStatus === "read") return;
    try {
      await notificationService.markAsRead(id);
      setNotifications((cur) =>
        cur.map((n) => (n.id === id ? { ...n, status: "read", read_at: new Date().toISOString() } : n))
      );
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  if (notifications.length === 0) {
    return <div className="text-muted">No notifications</div>;
  }

  return (
    <div className="list-group">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`list-group-item d-flex justify-content-between align-items-start gap-3 ${
            n.status === "unread" ? "bg-light" : ""
          }`}
          onClick={() => markAsRead(n.id, n.status)}
          style={{ cursor: "pointer" }}
        >
          <div style={{ flex: 1 }}>
            <div className="fw-bold">{n.title}</div>
            <div className="small text-muted">{formatDate(n.created_at)}</div>
            <div className="mt-1">{n.message}</div>
          </div>
          {n.status === "unread" && <span className="badge bg-primary">New</span>}
        </div>
      ))}
    </div>
  );
};

export default NotificationsPanel;
