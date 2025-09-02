import React, { useEffect, useState } from "react";
import useAxios from "../../lib/axios";
import { io } from "socket.io-client";
const socket = io("https://thecafe.onrender.com");
const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [search, setSearch] = useState("");

  const fetchOrders = async () => {
    try {
      const res = await useAxios.get("/orders", {
        params: { status: statusFilter, sortBy, search },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, sortBy, search]);

  const updateStatus = async (id, newStatus) => {
    try {
      await useAxios.put(`orders/${id}/status`, {
        status: newStatus,
      });
      socket.emit("updateOrderStatus", {
        orderId: id,
        status: newStatus,
      });
      fetchOrders();
    } catch (err) {
      console.error("Error updating status", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Orders Management</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="createdAt">Date</option>
          <option value="order_status">Status</option>
        </select>

        <input
          type="text"
          placeholder="Search orders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {/* Orders Table */}
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Order ID</th>
            <th className="p-2 border">Table No.</th>
            <th className="p-2 border">Items</th>
            <th className="p-2 border">Total</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="text-center border-b">
              <td className="p-2">{order._id}</td>
              <td className="p-2">{order.table_id.table_no}</td>
              <td className="p-2">
                {order.items.map((item) => (
                  <div key={item._id}>
                    {item.menuItem?.name} x {item.quantity}
                  </div>
                ))}
              </td>
              <td className="p-2 font-semibold">
                ₹
                {order.items.reduce(
                  (sum, item) =>
                    sum + item.quantity * (item.menuItem?.price || 0),
                  0
                )}
              </td>
              <td className="p-2">
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  className="border p-1 rounded"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersPage;
