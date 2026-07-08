const labels = {
  pending: "Pending",
  assigned: "Assigned",
  accepted: "Accepted",
  in_progress: "On the way",
  completed: "Completed",
  on_the_way: "On the way",
  collected: "Collected",
  failed: "Failed",
  cancelled: "Cancelled"
};

const StatusBadge = ({ status }) => {
  const normalized = status || "pending";
  return <span className={`status-badge status-${normalized}`}>{labels[normalized] || normalized}</span>;
};

export default StatusBadge;

