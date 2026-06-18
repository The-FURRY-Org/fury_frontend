const HowItWorks = () => (
  <main className="container py-5">
    <h1>How It Works</h1>
    <div className="row g-3 mt-2">
      {[
        ["1", "Create an account", "Sign up as a customer or collector with your name, email, phone, and location."],
        ["2", "Customer requests pickup", "The customer logs in, selects waste type, enters the pickup location, and submits a request."],
        ["3", "Collector accepts job", "The collector logs in, views available jobs, accepts a nearby request, and the status changes to accepted."],
        ["4", "Collector heads to pickup", "The collector uses maps to locate the customer, arrives at the pickup point, and collects the waste."],
        ["5", "Complete collection", "The collector takes the waste to the disposal site, marks the job completed, and records the details."],
        ["6", "Customer pays", "The customer receives a payment request and pays via mobile money such as MTN MoMo or Airtel Money."],
        ["7", "System splits payment", "The platform fee is deducted, and the remaining amount is sent to the collector's mobile money account."],
        ["8", "Feedback and rating", "The customer rates the collector, the collector rates the customer, and both leave comments for community trust."],
        ["9", "Admin oversight", "Admins monitor jobs, verify collectors, approve feedback, and resolve complaints."],
        ["10", "Continuous improvement", "The system helps customers and collectors learn proper waste habits and uses data to improve service."],
      ].map(([number, title, text]) => (
        <div className="col-md-6 col-lg-4" key={number}>
          <div className="content-card h-100">
            <div className="badge text-bg-success mb-3">{number}</div>
            <h2 className="h5">{title}</h2>
            <p className="mb-0 text-muted">{text}</p>
          </div>
        </div>
      ))}
    </div>

    <section className="mt-4">
      <h2>Flow Summary</h2>
      <p className="text-muted">
        Customer signs up → requests pickup → collector accepts → collector collects waste → customer pays → collector gets paid → both give feedback → admin oversees.
      </p>
    </section>
  </main>
);

export default HowItWorks;
