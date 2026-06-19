import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import StatusBadge from "../../components/StatusBadge";
import { assignmentService } from "../../services/assignmentService";
import { feedbackService } from "../../services/feedbackService";
import { notificationService } from "../../services/notificationService";
import NotificationsPanel from "../../components/NotificationsPanel";

const CollectorDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  useEffect(() => {
    assignmentService.driverJobs().then((response) => setJobs(response.data)).finally(() => setLoading(false));
    setNotificationsLoading(true);
    notificationService.getNotifications().then((res) => setNotifications(res.data)).catch(() => {}).finally(() => setNotificationsLoading(false));
  }, []);

  const counts = {
    assigned: jobs.filter((job) => job.status === "assigned").length,
    on_the_way: jobs.filter((job) => job.status === "on_the_way").length,
    collected: jobs.filter((job) => job.status === "collected").length,
    failed: jobs.filter((job) => job.status === "failed").length
  };

  return (
    <>
      <h1 className="h3">Collector Dashboard</h1>
      {loading ? <LoadingSpinner /> : (
        <>
          <div className="row g-3 mb-4">
            {Object.entries(counts).map(([label, value]) => (
              <div className="col-6 col-lg-3" key={label}>
                <div className="stat-card">
                  <div className="text-muted text-capitalize">{label.replaceAll("_", " ")}</div>
                  <div className="h3 mb-0">{value}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead><tr><th>Location</th><th>Urgency</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {jobs.slice(0, 6).map((job) => (
                  <tr key={job.id}>
                    <td>{job.location_name}</td>
                    <td>{job.urgency}</td>
                    <td><StatusBadge status={job.status} /></td>
                    <td><Link className="btn btn-outline-success btn-sm" to={`/driver/jobs/${job.id}`}>Open</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="content-card mt-4">
            <h2 className="h5">Send Feedback / Report an Issue</h2>
            <p className="text-muted">Report service problems or app issues — admins will be notified.</p>
            <form onSubmit={async (e) => { e.preventDefault(); await feedbackService.createGeneral({ subject, message: messageBody }); setFeedbackMsg("Feedback submitted. Thank you."); setSubject(""); setMessageBody(""); }}>
              <div className="row g-2">
                <div className="col-md-4">
                  <input className="form-control" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
                </div>
                <div className="col-md-6">
                  <input className="form-control" placeholder="Message" value={messageBody} onChange={(e) => setMessageBody(e.target.value)} />
                </div>
                <div className="col-md-2">
                  <button className="btn btn-cleantrack w-100">Send</button>
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

export default CollectorDashboard;
