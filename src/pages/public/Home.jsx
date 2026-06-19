import { Link } from "react-router-dom";
import { Building2, MapPinned, Truck } from "lucide-react";

const Home = () => (
  <>
    <section className="hero">
      <div className="container">
        <div className="col-lg-7">
          <h1 className="display-4 fw-bold">EcoCollect</h1>
          <p className="lead mt-3">
            EcoCollect is a web-based platform connecting clients (residents) who need rubbish disposal with garbage collectors who provide collection services. The system helps reduce improper waste disposal habits in the community.
          </p>
          <div className="d-flex flex-wrap gap-2 mt-4">
            <Link to="/register" className="btn btn-ecocollect btn-lg">Request Collection</Link>
            <Link to="/how-it-works" className="btn btn-outline-light btn-lg">How It Works</Link>
          </div>
        </div>
      </div>
    </section>
    <section className="container py-5">
      <div className="row g-3">
        {[
          [MapPinned, "Clients request collection", "Residents register their location and send pickup requests with waste type, urgency, and optional photos."],
          [Truck, "Collectors accept and complete jobs", "Collectors view available requests near them, accept jobs, collect the waste, and mark completion."],
          [Building2, "Admins oversee operations", "Admins verify collectors, monitor jobs, process payments, resolve complaints, and view system statistics."]
        ].map(([Icon, title, text]) => (
          <div className="col-md-4" key={title}>
            <div className="content-card h-100">
              <Icon className="text-success mb-3" size={32} />
              <h2 className="h5">{title}</h2>
              <p className="mb-0 text-muted">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  </>
);

export default Home;

