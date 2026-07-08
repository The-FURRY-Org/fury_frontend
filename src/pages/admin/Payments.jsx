import { useEffect, useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import { adminService } from "../../services/adminService";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .payments()
      .then((response) => setPayments(response.data))
      .catch(() => setPayments([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <h1 className="h3">Payments</h1>
      {loading ? <LoadingSpinner /> : (
        <div className="content-card">
          {payments.length === 0 ? (
            <div className="text-muted">No payments recorded yet.</div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Reference</th><th>Client</th><th>Collector</th><th>Provider</th><th>Amount</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td>{payment.transaction_ref}</td>
                      <td>{payment.client_name}</td>
                      <td>{payment.collector_name || "-"}</td>
                      <td>{payment.provider === "mtn_momo" ? "MTN MoMo" : "Airtel Money"}</td>
                      <td>{Number(payment.amount).toLocaleString()} {payment.currency}</td>
                      <td><span className={`badge bg-${payment.status === "paid" ? "success" : "warning"}`}>{payment.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Payments;
