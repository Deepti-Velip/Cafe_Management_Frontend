import { useEffect, useState } from "react";
import api from "../../lib/axios";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();
  const cartId = localStorage.getItem("cartId");

  // fetch cart
  const fetchCart = async () => {
    if (!cartId) return;
    try {
      const res = await api.get(`/carts/${cartId}`);
      setCart(res.data);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [cartId]);

  if (!cart || !cart.items || cart.items.length === 0)
    return <p className="p-6">Cart is empty</p>;

  // update quantity in backend
  const updateQuantity = async (itemId, newQty) => {
    if (newQty < 1) return; // prevent 0 or negative
    try {
      await api.put(`/carts/${cartId}/items/${itemId}`, { quantity: newQty });
      fetchCart(); // refresh after update
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  // remove item completely
  const removeItem = async (itemId) => {
    try {
      await api.delete(`/carts/${cartId}/items/${itemId}`);
      fetchCart();
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  const total = cart.items.reduce(
    (sum, i) => sum + i.menuItem.price * i.quantity,
    0
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      {cart.items.map((item) => (
        <div
          key={item._id}
          className="flex justify-between items-center border-b py-2"
        >
          <span className="flex-1">
            {item.menuItem.name} (${item.menuItem.price})
          </span>

          {/* Quantity controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(item._id, item.quantity - 1)}
              className="px-2 py-1 bg-gray-200 rounded"
            >
              -
            </button>
            <span>{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item._id, item.quantity + 1)}
              className="px-2 py-1 bg-gray-200 rounded"
            >
              +
            </button>
          </div>

          {/* Item subtotal */}
          <span className="w-20 text-right">
            ${item.menuItem.price * item.quantity}
          </span>

          {/* Remove button */}
          <button
            onClick={() => removeItem(item._id)}
            className="ml-4 text-red-500 hover:underline"
          >
            Remove
          </button>
        </div>
      ))}

      <div className="mt-4 font-bold text-lg">Total: ${total}</div>

      <button
        onClick={() => navigate("/order")}
        className="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg"
      >
        Place Order
      </button>
    </div>
  );
}
