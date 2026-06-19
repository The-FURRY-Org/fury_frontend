import { useEffect, useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import { adminService } from "../../services/adminService";
import { formatDate } from "../../utils/formatDate";

const labels = {
  total_pickup_requests: "Total pickups",
  pending_pickups: "Pending",
  completed_pickups: "Completed",
  failed_pickups: "Failed",
  active_trucks: "Active trucks",
  active_drivers: "Active drivers",
  waste_collected_this_month: "Waste this month"
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [replyTargets, setReplyTargets] = useState({});

  useEffect(() => {
    adminService.stats().then((response) => setStats(response.data));
    adminService.notifications().then((res) => setNotifications(res.data)).catch(() => {});
  }, []);

  if (!stats) return <LoadingSpinner />;

  return (
    <>
      <h1 className="h3">Admin Dashboard</h1>
      <div className="row g-3">
        {Object.entries(labels).map(([key, label]) => (
          <div className="col-6 col-lg-3" key={key}>
            <div className="stat-card">
              <div className="text-muted">{label}</div>
              <div className="h3 mb-0">{stats[key] || 0}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="content-card mt-4">
        <h2 className="h5">Notifications</h2>
        {notifications.length === 0 ? (
          <div className="text-muted">No notifications</div>
        ) : (
          <div className="list-group">
            {notifications.map((n) => (
              <div key={n.id} className={`list-group-item d-flex justify-content-between align-items-start ${n.status === 'unread' ? 'bg-light' : ''}`}>
                <div>
                  <div className="fw-bold">{n.title}</div>
                  <div className="small text-muted">{formatDate(n.created_at)}{n.sender_name ? ` · From: ${n.sender_name}` : ""}</div>
                  <div className="mt-1">{n.message}</div>
                  {n.sender_id && (
                    replyTargets[n.id] ? (
                      <div className="mt-2">
                        <input className="form-control mb-2" placeholder="Reply message" value={replyTargets[n.id].text || ""} onChange={(e) => setReplyTargets((s) => ({ ...s, [n.id]: { ...s[n.id], text: e.target.value } }))} />
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-cleantrack" onClick={async () => {
                            const content = replyTargets[n.id]?.text || "";
                            if (!content) return;
                            await adminService.sendNotification({ user_id: n.sender_id, title: `Reply: ${n.title}`, message: content });
                            setReplyTargets((s) => ({ ...s, [n.id]: { text: "", open: false } }));
                          }}>Send Reply</button>
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => setReplyTargets((s) => ({ ...s, [n.id]: { text: "", open: false } }))}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2">
                        <button className="btn btn-sm btn-outline-success" onClick={() => setReplyTargets((s) => ({ ...s, [n.id]: { text: "", open: true } }))}>Reply</button>
                      </div>
                    )
                  )}
                </div>
                <div>
                  {n.status === 'unread' && (
                    <button className="btn btn-sm btn-outline-primary" onClick={async () => { const updated = await adminService.markNotificationRead(n.id); setNotifications((cur) => cur.map(c => c.id === n.id ? { ...c, status: 'read', read_at: updated.data?.read_at } : c)); }}>
                      Mark read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
