import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedRoute from "./components/RoleBasedRoute";
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import HowItWorks from "./pages/public/HowItWorks";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import MyLocations from "./pages/customer/MyLocations";
import AddLocation from "./pages/customer/AddLocation";
import ReportFullBin from "./pages/customer/ReportFullBin";
import MyPickupRequests from "./pages/customer/MyPickupRequests";
import PickupDetails from "./pages/customer/PickupDetails";
import CollectorDashboard from "./pages/driver/CollectorDashboard";
import MyAssignedPickups from "./pages/driver/MyAssignedPickups";
import PickupJobDetails from "./pages/driver/PickupJobDetails";
import CompletedPickups from "./pages/driver/CompletedPickups";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManagePickups from "./pages/admin/ManagePickups";
import ManageCategories from "./pages/admin/ManageCategories";
import ManageCollectors from "./pages/admin/ManageCollectors";
import Payments from "./pages/admin/Payments";
import EduCollect from "./pages/EduCollect";
import Assistant from "./pages/Assistant";
import ModerationLogs from "./pages/admin/ModerationLogs";
import ModerationSettings from "./pages/admin/ModerationSettings";

const App = () => (
  <BrowserRouter>
    {/* React Router maps URLs to page components. Nested routes share layouts. */}
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<RoleBasedRoute roles={["client"]} />}>
          <Route path="/customer" element={<DashboardLayout />}>
            <Route index element={<CustomerDashboard />} />
            <Route path="locations" element={<MyLocations />} />
            <Route path="locations/new" element={<AddLocation />} />
            <Route path="report-bin" element={<ReportFullBin />} />
            <Route path="pickups" element={<MyPickupRequests />} />
            <Route path="pickups/:id" element={<PickupDetails />} />
          </Route>
        </Route>

        <Route element={<RoleBasedRoute roles={["collector"]} />}>
          <Route path="/driver" element={<DashboardLayout />}>
            <Route index element={<CollectorDashboard />} />
            <Route path="jobs" element={<MyAssignedPickups />} />
            <Route path="jobs/:id" element={<PickupJobDetails />} />
            <Route path="completed" element={<CompletedPickups />} />
          </Route>
        </Route>

        <Route element={<RoleBasedRoute roles={["admin"]} />}>
          <Route path="/admin" element={<DashboardLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="collectors" element={<ManageCollectors />} />
            <Route path="payments" element={<Payments />} />
            <Route path="pickups" element={<ManagePickups />} />
            {/* Companies section removed */}
            <Route path="categories" element={<ManageCategories />} />
            <Route path="moderation" element={<ModerationLogs />} />
            <Route path="moderation/settings" element={<ModerationSettings />} />
          </Route>
        </Route>

        <Route element={<RoleBasedRoute roles={["admin", "client", "collector"]} />}>
          <Route path="/educollect" element={<DashboardLayout />}>
            <Route index element={<EduCollect />} />
          </Route>
        </Route>

        <Route element={<RoleBasedRoute roles={["admin", "client", "collector"]} />}>
          <Route path="/assistant" element={<DashboardLayout />}>
            <Route index element={<Assistant />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default App;

