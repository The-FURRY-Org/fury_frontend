import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AlertMessage from "../../components/AlertMessage";

const roleHome = {
  admin: "/admin",
  client: "/customer",
  collector: "/driver"
};

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      // The submit handler calls AuthContext, which stores the JWT and user details.
      const user = await login(form);
      navigate(roleHome[user.role]);
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container py-5 login-page">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-5">
          <div className="content-card">
            <h1 className="h3">Login</h1>
            <AlertMessage type="danger" message={message} />
            <form onSubmit={handleSubmit}>
              <label className="form-label mt-3">Email</label>
              <input className="form-control" type="email" name="email" value={form.email} onChange={handleChange} required />
              <label className="form-label mt-3">Password</label>
              <input className="form-control" type="password" name="password" value={form.password} onChange={handleChange} required />
              <button className="btn btn-ecocollect w-100 mt-4" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
            <p className="small text-muted mt-3 mb-0">
              Try admin@ecocollect.ug (admin), david@ecocollect.ug (collector), or sarah@ecocollect.ug (client) with password123.
            </p>
            <p className="mt-3 mb-0">No account? <Link to="/register">Register</Link></p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;

