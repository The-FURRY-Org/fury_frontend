import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { pickupService } from "../../services/pickupService";
import { feedbackService } from "../../services/feedbackService";
import { notificationService } from "../../services/notificationService";
import LoadingSpinner from "../../components/LoadingSpinner";
import StatusBadge from "../../components/StatusBadge";
import NotificationsPanel from "../../components/NotificationsPanel";

const CustomerDashboard = () => {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  useEffect(() => {
    pickupService.myRequests().then((response) => setPickups(response.data)).finally(() => setLoading(false));
    setNotificationsLoading(true);
    notificationService.getNotifications().then((res) => setNotifications(res.data)).catch(() => {}).finally(() => setNotificationsLoading(false));
  }, []);

  const counts = {
    total: pickups.length,
    pending: pickups.filter((item) => item.status === "pending").length,
    collected: pickups.filter((item) => item.status === "collected").length,
    failed: pickups.filter((item) => item.status === "failed").length
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <h1 className="h3 mb-0">Resident Dashboard</h1>
        <Link to="/customer/report-bin" className="btn btn-ecocollect">Report Full Bin</Link>
      </div>
      {loading ? <LoadingSpinner /> : (
        <>
          <div className="row g-3 mb-4">
            {Object.entries(counts).map(([label, value]) => (
              <div className="col-6 col-lg-3" key={label}>
                <div className="stat-card">
                  <div className="text-muted text-capitalize">{label}</div>
                  <div className="h3 mb-0">{value}</div>
                </div>
              </div>
            ))}
          </div>
          {counts.pending > 0 && (
            <div className="alert alert-info mb-4">
              A client has made {counts.pending} pending pickup {counts.pending === 1 ? "order" : "orders"}.
            </div>
          )}
          <div className="content-card">
            <h2 className="h5">Recent Pickup Requests</h2>
            <div className="table-responsive border-0">
              <table className="table align-middle mb-0">
                <thead><tr><th>Location</th><th>Waste</th><th>Urgency</th><th>Status</th></tr></thead>
                <tbody>
                  {pickups.slice(0, 5).map((pickup) => (
                    <tr key={pickup.id}>
                      <td>{pickup.location_name}</td>
                      <td>{pickup.waste_type}</td>
                      <td>{pickup.urgency}</td>
                      <td><StatusBadge status={pickup.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="content-card mt-4">
            <h2 className="h5">Send Feedback / Report an Issue</h2>
            <p className="text-muted">Share complaints or app issues — admins will be notified.</p>
            <form onSubmit={async (e) => { e.preventDefault(); await feedbackService.createGeneral({ subject: subject, message: messageBody }); setFeedbackMsg("Feedback submitted. Thank you."); setSubject(""); setMessageBody(""); }}>
              <div className="row g-2">
                <div className="col-md-4">
                  <input className="form-control" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
                </div>
                <div className="col-md-6">
                  <input className="form-control" placeholder="Message" value={messageBody} onChange={(e) => setMessageBody(e.target.value)} />
                </div>
                <div className="col-md-2">
                  <button className="btn btn-ecocollect w-100">Send</button>
                </div>
              </div>
            </form>
            <div className="mt-2 text-success">{feedbackMsg}</div>
          </div>
          <div className="content-card mt-4">
            <h2 className="h5">Messages from Admin</h2>
            <NotificationsPanel notifications={notifications} setNotifications={setNotifications} loading={notificationsLoading} />
          </div>
        </>
      )}
    </>
  );
};

export default CustomerDashboard;

