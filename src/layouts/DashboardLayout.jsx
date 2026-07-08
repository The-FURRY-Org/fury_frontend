import { NavLink, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import AssistantWidget from "../components/AssistantWidget";
import { useAuth } from "../context/AuthContext";

const menus = {
  client: [
    ["Dashboard", "/customer"],
    ["My Locations", "/customer/locations"],
    ["Add Location", "/customer/locations/new"],
    ["Report Full Bin", "/customer/report-bin"],
    ["Pickup Requests", "/customer/pickups"],
    ["EduCollect", "/educollect"]
  ],
  collector: [
    ["Dashboard", "/driver"],
    ["Assigned Pickups", "/driver/jobs"],
    ["Completed Pickups", "/driver/completed"],
    ["EduCollect", "/educollect"]
  ],
  admin: [
    ["Dashboard", "/admin"],
    ["Users", "/admin/users"],
    ["Payments", "/admin/payments"],
    ["Pickups", "/admin/pickups"],
    ["Categories", "/admin/categories"],
    ["Moderation Logs", "/admin/moderation"],
    ["Moderation Settings", "/admin/moderation/settings"],
    ["EduCollect", "/educollect"]
  ]
};

const DashboardLayout = () => {
  const { user } = useAuth();
  const links = menus[user?.role] || [];

  return (
    <>
      <Navbar />
      <div className="container-fluid dashboard-shell">
        <div className="row min-vh-100">
          <aside className="col-md-3 col-xl-2 sidebar p-3">
            <div className="nav flex-column gap-1">
              {links.map(([label, to]) => (
                <NavLink key={to} className="nav-link" to={to} end>
                  {label}
                </NavLink>
              ))}
            </div>
          </aside>
          <main className="col-md-9 col-xl-10 p-3 p-lg-4">
            <Outlet />
          </main>
        </div>
      </div>
      <AssistantWidget />
    </>
  );
};

export default DashboardLayout;

