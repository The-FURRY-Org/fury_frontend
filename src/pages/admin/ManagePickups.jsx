import { useEffect, useMemo, useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import StatusBadge from "../../components/StatusBadge";
import { adminService } from "../../services/adminService";
import { formatDate } from "../../utils/formatDate";

const ManagePickups = () => {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [collectors, setCollectors] = useState([]);
  const [selectedCollectors, setSelectedCollectors] = useState({});
  const [filters, setFilters] = useState({ status: "", urgency: "", district: "", waste: "", date: "" });

  useEffect(() => {
    adminService.pickups().then((response) => setPickups(response.data)).finally(() => setLoading(false));
    adminService.collectorProfiles().then((response) => setCollectors(response.data)).catch((error) => console.error("Failed to load collectors", error));
  }, []);

  const filtered = useMemo(() => pickups.filter((pickup) => (
    (!filters.status || pickup.status === filters.status)
    && (!filters.urgency || pickup.urgency === filters.urgency)
    && (!filters.district || pickup.district?.toLowerCase().includes(filters.district.toLowerCase()))
    && (!filters.waste || pickup.waste_type?.toLowerCase().includes(filters.waste.toLowerCase()))
    && (!filters.date || String(pickup.requested_at).startsWith(filters.date))
  )), [pickups, filters]);

  const handleCollectorChange = (pickupId, collectorId) => {
    setSelectedCollectors((prev) => ({ ...prev, [pickupId]: collectorId }));
  };

  const handleReassign = async (pickupId) => {
    const collectorId = selectedCollectors[pickupId];
    if (!collectorId) {
      return alert("Please select a collector before reassigning.");
    }
    try {
      await adminService.reassignPickup(pickupId, collectorId);
      setLoading(true);
      const response = await adminService.pickups();
      setPickups(response.data);
      setSelectedCollectors((prev) => {
        const copy = { ...prev };
        delete copy[pickupId];
        return copy;
      });
    } catch (error) {
      console.error("Failed to reassign pickup", error);
      alert(error.response?.data?.message || "Reassignment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="h3">Manage Pickups</h1>
      <div className="content-card mb-3">
        <div className="row g-2">
          <div className="col-md"><input className="form-control" placeholder="District" onChange={(e) => setFilters({ ...filters, district: e.target.value })} /></div>
          <div className="col-md"><input className="form-control" placeholder="Waste" onChange={(e) => setFilters({ ...filters, waste: e.target.value })} /></div>
          <div className="col-md"><input className="form-control" type="date" onChange={(e) => setFilters({ ...filters, date: e.target.value })} /></div>
          <div className="col-md"><select className="form-select" onChange={(e) => setFilters({ ...filters, urgency: e.target.value })}><option value="">Urgency</option><option value="normal">Normal</option><option value="urgent">Urgent</option></select></div>
          <div className="col-md"><select className="form-select" onChange={(e) => setFilters({ ...filters, status: e.target.value })}><option value="">Status</option><option value="pending">Pending</option><option value="assigned">Assigned</option><option value="on_the_way">On the way</option><option value="collected">Collected</option><option value="failed">Failed</option></select></div>
        </div>
      </div>
      {loading ? <LoadingSpinner /> : (
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead><tr><th>Customer</th><th>Location</th><th>Waste</th><th>Status</th><th>Collector</th><th>Requested</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.map((pickup) => (
                <tr key={pickup.id}>
                  <td>{pickup.customer_name}</td>
                  <td>{pickup.location_name}, {pickup.district}</td>
                  <td>{pickup.waste_type}</td>
                  <td><StatusBadge status={pickup.status} /></td>
                  <td>{pickup.collector_name || "Unassigned"}</td>
                  <td>
                    <div>{formatDate(pickup.requested_at)}</div>
                    <div className="small text-muted">
                      {pickup.tracking?.filter((step) => step.completed).length || 0}/5 steps complete
                    </div>
                  </td>
                  <td>
                    {(pickup.status !== "completed" && pickup.status !== "cancelled") ? (
                      <div className="d-flex gap-2 align-items-center">
                        <select
                          className="form-select form-select-sm"
                          value={selectedCollectors[pickup.id] || pickup.collector_id || ""}
                          onChange={(e) => handleCollectorChange(pickup.id, e.target.value)}
                        >
                          <option value="">Select collector</option>
                          {collectors.map((collector) => (
                            <option key={collector.user_id} value={collector.user_id}>
                              {collector.full_name}
                            </option>
                          ))}
                        </select>
                        <button
                          className="btn btn-sm btn-ecocollect"
                          type="button"
                          onClick={() => handleReassign(pickup.id)}
                        >
                          Reassign
                        </button>
                      </div>
                    ) : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default ManagePickups;

