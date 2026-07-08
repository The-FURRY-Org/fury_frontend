import { useEffect, useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import { adminService } from "../../services/adminService";

const ManageCollectors = () => {
  const [collectors, setCollectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ verified: "" });

  const loadCollectors = () => {
    setLoading(true);
    adminService
      .collectorProfiles()
      .then((response) => setCollectors(response.data))
      .catch((error) => console.error("Failed to load collectors", error))
      .finally(() => setLoading(false));
  };

  useEffect(loadCollectors, []);

  const handleVerify = async (collectorId, isVerified) => {
    try {
      await adminService.verifyCollector(collectorId, !isVerified);
      loadCollectors();
    } catch (error) {
      console.error("Failed to update verification status", error);
    }
  };

  const filtered = collectors.filter(
    (collector) => filters.verified === "" || String(collector.is_verified) === filters.verified
  );

  return (
    <>
      <h1 className="h3">Manage Collectors</h1>
      <div className="content-card mb-3">
        <div className="row g-2">
          <div className="col-md-6">
            <select
              className="form-select"
              onChange={(e) => setFilters({ ...filters, verified: e.target.value })}
            >
              <option value="">All collectors</option>
              <option value="true">Verified</option>
              <option value="false">Unverified</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Verified</th>
                <th>Rating</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((collector) => (
                <tr key={collector.user_id}>
                  <td>{collector.full_name}</td>
                  <td>{collector.email}</td>
                  <td>{collector.phone || "-"}</td>
                  <td>
                    <span className={`badge bg-${collector.status === "active" ? "success" : "warning"}`}>
                      {collector.status}
                    </span>
                  </td>
                  <td>
                    <span className={`badge bg-${collector.is_verified ? "success" : "secondary"}`}>
                      {collector.is_verified ? "Verified" : "Unverified"}
                    </span>
                  </td>
                  <td>{(collector.rating || 0).toFixed(1)} ⭐</td>
                  <td>
                    <button
                      className={`btn btn-sm ${collector.is_verified ? "btn-outline-danger" : "btn-outline-success"}`}
                      onClick={() => handleVerify(collector.user_id, collector.is_verified)}
                    >
                      {collector.is_verified ? "Unverify" : "Verify"}
                    </button>
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

export default ManageCollectors;
