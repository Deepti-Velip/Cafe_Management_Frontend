import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Header from "./components/Header";
import Login from "./Pages/Login";
import Menu from "./Pages/customer/Menu";
import ADashboard from "./Pages/admin/dashboard";
import Dashboard from "./Pages/staff/dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./Pages/notFound";
import SalesReport from "./Pages/Sales";
import AddStaffForm from "./Pages/admin/AddStaff";
import ManageStaff from "./Pages/admin/ManageStaff";
import MenuForm from "./Pages/menu/AddMenu";
import MenuList from "./Pages/menu/ManageMenu";
import Cart from "./Pages/customer/cart";
import TableManager from "./Pages/Table";
import Order from "./Pages/customer/order";
import OrdersPage from "./Pages/staff/Orders";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <Router>
        <Header />
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />}></Route>
          <Route path="/menu" element={<Menu />}></Route>
          <Route path="/cart" element={<Cart />}></Route>
          <Route path="/order" element={<Order />}></Route>
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ADashboard />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/admin/addStaff"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AddStaffForm />
              </ProtectedRoute>
            }
          ></Route>{" "}
          <Route
            path="/admin/manageStaff"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ManageStaff />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/staff/dashboard"
            element={
              <ProtectedRoute allowedRoles={["staff"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/staff/orders"
            element={
              <ProtectedRoute allowedRoles={["staff"]}>
                <OrdersPage />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/sales"
            element={
              <ProtectedRoute allowedRoles={["staff", "admin"]}>
                <SalesReport />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/table"
            element={
              <ProtectedRoute allowedRoles={["staff", "admin"]}>
                <TableManager />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/menu/addMenu"
            element={
              <ProtectedRoute allowedRoles={["admin", "staff"]}>
                <MenuForm />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/menu/ManageMenu"
            element={
              <ProtectedRoute allowedRoles={["staff", "admin"]}>
                <MenuList />
              </ProtectedRoute>
            }
          ></Route>
          <Route path="*" element={<NotFound />} />{" "}
        </Routes>
      </Router>
    </>
  );
}

export default App;
