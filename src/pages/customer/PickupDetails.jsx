import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AlertMessage from "../../components/AlertMessage";
import LoadingSpinner from "../../components/LoadingSpinner";
import StatusBadge from "../../components/StatusBadge";
import { feedbackService } from "../../services/feedbackService";
import { pickupService } from "../../services/pickupService";
import { paymentService } from "../../services/paymentService";
import { formatDate } from "../../utils/formatDate";

const PickupDetails = () => {
  const { id } = useParams();
  const [pickup, setPickup] = useState(null);
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState({ rating: 5, comment: "" });
  const [payment, setPayment] = useState({ provider: "mtn_momo", phone: "", amount: "10000" });

  const loadPickup = () => pickupService.getById(id).then((response) => setPickup(response.data));

  useEffect(() => {
    loadPickup();
  }, [id]);

  const cancelPickup = async () => {
    if (!window.confirm("Cancel this pending pickup request?")) return;
    await pickupService.cancel(id);
    setMessage("Pickup request cancelled.");
    loadPickup();
  };

  const submitFeedback = async (event) => {
    event.preventDefault();
    await feedbackService.create({ pickup_request_id: id, ...feedback });
    setMessage("Feedback saved. Thank you.");
  };

  const submitPayment = async (event) => {
    event.preventDefault();
    try {
      await paymentService.create({ collection_request_id: id, ...payment, amount: Number(payment.amount) });
      setMessage("Mobile money payment recorded successfully.");
    } catch (error) {
      setMessage(error?.response?.data?.message || "Payment could not be recorded.");
    }
  };

  if (!pickup) return <LoadingSpinner />;

  return (
    <div className="content-card">
      <div className="d-flex justify-content-between align-items-start gap-3">
        <div>
          <h1 className="h3">{pickup.location_name}</h1>
          <p className="text-muted">{pickup.district} · {pickup.waste_type}</p>
        </div>
        <StatusBadge status={pickup.status} />
      </div>
      <AlertMessage type="success" message={message} />
      <p>{pickup.description || "No description provided."}</p>
      <dl className="row">
        <dt className="col-sm-4">Urgency</dt><dd className="col-sm-8">{pickup.urgency}</dd>
        <dt className="col-sm-4">Bin level</dt><dd className="col-sm-8">{pickup.estimated_bin_level}%</dd>
        <dt className="col-sm-4">Requested</dt><dd className="col-sm-8">{formatDate(pickup.requested_at)}</dd>
        <dt className="col-sm-4">Address</dt><dd className="col-sm-8">{pickup.address_details || "Not provided"}</dd>
      </dl>
      <div className="border rounded p-3 mt-4">
        <h2 className="h5">Tracking progress</h2>
        <div className="d-flex flex-column gap-2 mt-3">
          {(pickup.tracking || []).map((step) => (
            <div key={step.key} className={`d-flex align-items-center gap-2 ${step.current ? "fw-semibold" : "text-muted"}`}>
              <span className={`badge ${step.completed ? "bg-success" : "bg-light text-dark"}`}>
                {step.completed ? "✓" : "○"}
              </span>
              <span>{step.label}</span>
            </div>
          ))}
        </div>
      </div>
      {pickup.status === "pending" && <button className="btn btn-outline-danger" onClick={cancelPickup}>Cancel Request</button>}
      {pickup.status === "completed" && (
        <>
          <form className="mt-4 border-top pt-3" onSubmit={submitPayment}>
            <h2 className="h5">Pay with Mobile Money</h2>
            <p className="text-muted">Choose MTN MoMo or Airtel Money to complete payment for this collection.</p>
            <div className="row g-2">
              <div className="col-md-3">
                <select className="form-select" value={payment.provider} onChange={(event) => setPayment({ ...payment, provider: event.target.value })}>
                  <option value="mtn_momo">MTN MoMo</option>
                  <option value="airtel_money">Airtel Money</option>
                </select>
              </div>
              <div className="col-md-4">
                <input className="form-control" placeholder="Phone number" value={payment.phone} onChange={(event) => setPayment({ ...payment, phone: event.target.value })} />
              </div>
              <div className="col-md-3">
                <input className="form-control" placeholder="Amount" type="number" value={payment.amount} onChange={(event) => setPayment({ ...payment, amount: event.target.value })} />
              </div>
              <div className="col-md-2">
                <button className="btn btn-ecocollect w-100">Pay</button>
              </div>
            </div>
          </form>
          <form className="mt-4 border-top pt-3" onSubmit={submitFeedback}>
            <h2 className="h5">Rate this pickup</h2>
            <div className="row g-2">
              <div className="col-md-3">
                <select className="form-select" value={feedback.rating} onChange={(event) => setFeedback({ ...feedback, rating: event.target.value })}>
                  {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value}</option>)}
                </select>
              </div>
              <div className="col-md-7">
                <input className="form-control" placeholder="Comment" value={feedback.comment} onChange={(event) => setFeedback({ ...feedback, comment: event.target.value })} />
              </div>
              <div className="col-md-2">
                <button className="btn btn-outline-secondary w-100">Send</button>
              </div>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default PickupDetails;

