import { useEffect, useState } from "react";
import api from "../../lib/axios";
import { useNavigate } from "react-router-dom";

export default function MenuPage() {
  const [menu, setMenu] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();

  // fetch menu whenever search/category changes
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await api.get("/menu", {
          params: {
            search: search || undefined,
            category: category || undefined,
          },
        });
        console.log(res.data);

        setMenu(res.data);
      } catch (err) {
        console.error("Error fetching menu:", err);
      }
    };

    fetchMenu();
  }, [search, category]);

  const handleQuantityChange = (itemId, qty) => {
    if (qty < 1) return;
    setQuantities((prev) => ({ ...prev, [itemId]: qty }));
  };

  const handleAddToCart = async (item) => {
    const quantity = quantities[item._id] || 1;
    let cartId = localStorage.getItem("cartId");

    try {
      if (!cartId) {
        // create new cart
        const res = await api.post("/carts", {
          items: [{ menuItem: item._id, quantity }],
        });
        localStorage.setItem("cartId", res.data._id);
      } else {
        // update existing cart (send plain JSON, backend will handle update/merge)
        await api.put(`/carts/${cartId}`, {
          items: [{ menuItem: item._id, quantity }],
        });
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to add item to cart.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Menu</h1>

      {/* Search + Category filter */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search menu..."
          className="border p-2 rounded-lg flex-1"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded-lg"
        >
          <option value="">All Categories</option>
          <option value="Food">Food</option>
          <option value="Dessert">Dessert</option>
          <option value="Beverage">Beverage</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {menu.map((item) => (
          <div
            key={item._id}
            className="border rounded-lg p-4 shadow-md flex flex-col"
          >
            <img
              src={`${import.meta.env.VITE_API_URL}/menu/${item._id}/image`}
              alt={item.name}
              onError={(e) => (e.target.src = "/placeholder.png")}
              className="w-full h-40 object-cover rounded-md mb-3"
            />

            <h2 className="text-lg font-semibold">{item.name}</h2>
            <p className="text-gray-600">{item.category}</p>
            <p className="mt-2 font-bold">₹{item.price}</p>
            {/* Quantity controls */}
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={() =>
                  handleQuantityChange(
                    item._id,
                    (quantities[item._id] || 1) - 1
                  )
                }
                className="px-2 py-1 bg-gray-200 rounded"
              >
                -
              </button>
              <input
                type="number"
                value={quantities[item._id] || 1}
                onChange={(e) =>
                  handleQuantityChange(item._id, Number(e.target.value))
                }
                className="w-12 text-center border rounded"
                min={1}
              />
              <button
                onClick={() =>
                  handleQuantityChange(
                    item._id,
                    (quantities[item._id] || 1) + 1
                  )
                }
                className="px-2 py-1 bg-gray-200 rounded"
              >
                +
              </button>
            </div>
            <button
              onClick={() => handleAddToCart(item)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate("/cart")}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-xl"
      >
        View Cart
      </button>
      <button
        onClick={() => navigate("/order")}
        className="fixed bottom-24 right-6 bg-blue-600 text-white p-4 rounded-full shadow-xl"
      >
        My Orders
      </button>
    </div>
  );
}
