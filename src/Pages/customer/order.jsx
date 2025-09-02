import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../../lib/axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const socket = io("https://thecafe.onrender.com"); // backend URL

const schema = yup.object({
  table_no: yup.string().required("Table number is required"),
});

export default function OrderPage() {
  const [orderStatus, setOrderStatus] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const navigate = useNavigate();
  const cartId = localStorage.getItem("cartId");
  const savedOrderId = localStorage.getItem("orderId");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  // Fetch order details if already placed
  useEffect(() => {
    if (savedOrderId) {
      const fetchOrder = async () => {
        try {
          const res = await api.get(`/orders/${savedOrderId}`);
          setOrderDetails(res.data);
          setOrderStatus(res.data.status);
        } catch (err) {
          console.error("Error fetching order:", err);
        }
      };

      fetchOrder();

      //  Join the room for live updates
      socket.emit("joinOrderRoom", savedOrderId);

      //  Listen for status updates
      socket.on("orderStatusUpdated", ({ orderId, status }) => {
        if (orderId === savedOrderId) {
          setOrderStatus(status);
          toast.info(`Your order ${orderId} is now "${status}"`, {
            position: "top-right",
          });
        }
      });

      return () => {
        socket.off("orderStatusUpdated");
      };
    }
  }, [savedOrderId]);

  const onSubmit = async (data) => {
    try {
      const res = await api.post(`/orders/cart/${cartId}`, {
        table_no: data.table_no,
      });

      const newOrderId = res.data.orderId;
      localStorage.setItem("orderId", newOrderId);
      localStorage.removeItem("cartId");

      // fetch order right after placing
      const orderRes = await api.get(`/orders/${newOrderId}`);
      setOrderDetails(orderRes.data);
      setOrderStatus(orderRes.data.status);
      toast.success("Ordered successfully!");

      // join room immediately after placing order
      socket.emit("joinOrderRoom", newOrderId);
    } catch (err) {
      console.error("Error placing order:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Confirm Order</h1>

      {!orderDetails ? (
        // show form if no order placed
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input
            {...register("table_no")}
            placeholder="Enter Table Number"
            className="border p-2 rounded-lg"
          />
          {errors.table_no && (
            <p className="text-red-500">{errors.table_no.message}</p>
          )}

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Confirm Order
          </button>
        </form>
      ) : (
        // show order details if found
        <div>
          <p className="text-green-600 font-semibold">
            Order Status: {orderStatus}
          </p>

          <div className="mt-4 border rounded-lg p-4">
            <h2 className="font-bold text-lg mb-2">Order Details</h2>
            {orderDetails.items.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center border-b py-2"
              >
                <span>
                  {item.menuItem.name} x {item.quantity}
                </span>
                <span>${item.menuItem.price * item.quantity}</span>
              </div>
            ))}
            <div className="mt-3 font-bold text-lg">
              Total: $
              {orderDetails.items.reduce(
                (sum, i) => sum + i.menuItem.price * i.quantity,
                0
              )}
            </div>
          </div>

          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-gray-800 text-white px-4 py-2 rounded-lg"
          >
            Back to Menu
          </button>
        </div>
      )}
    </div>
  );
}
