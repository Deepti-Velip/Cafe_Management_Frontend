import { useEffect, useState } from "react";
import useAxios from "../../lib/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function MenuList() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const res = await useAxios.get("/menu");
      setMenu(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch menu");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await useAxios.delete(`/menu/${id}`);
      toast.success("Item deleted");
      fetchMenu();
    } catch (err) {
      console.log(err);
      toast.error("Delete failed");
    }
  };

  const handleUpdateSubmit = async () => {
    try {
      await useAxios.put(`/menu/${selectedItem._id}`, selectedItem);
      toast.success("Item updated");
      setOpenDialog(false);
      fetchMenu();
    } catch (err) {
      console.log(err);
      toast.error("Update failed");
    }
  };

  if (loading) return <p className="text-center py-4">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Menu List</h2>
      <button
        onClick={() => navigate("/menu/addMenu")}
        className="bg-teal-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-teal-700 transition duration-200"
      >
        Add Menu
      </button>
      <table className="table-auto w-full border-collapse border border-gray-400 mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Description</th>
            <th className="border px-4 py-2">Category</th>
            <th className="border px-4 py-2">Price</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {menu.map((item) => (
            <tr key={item._id} className="hover:bg-gray-100">
              <td className="border px-4 py-2">{item.name}</td>
              <td className="border px-4 py-2">{item.description}</td>
              <td className="border px-4 py-2">{item.category}</td>
              <td className="border px-4 py-2">₹{item.price}</td>
              <td className="border px-4 py-2 flex gap-2">
                <button
                  onClick={() => {
                    setSelectedItem(item);
                    setOpenDialog(true);
                  }}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {menu.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center text-gray-500 py-4 border">
                No items found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Dialog / Modal */}
      {openDialog && selectedItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-96 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold mb-4">Update Item</h3>

            <input
              type="text"
              value={selectedItem.name}
              onChange={(e) =>
                setSelectedItem({ ...selectedItem, name: e.target.value })
              }
              className="w-full border px-3 py-2 rounded mb-2"
              placeholder="Name"
            />
            <textarea
              value={selectedItem.description}
              onChange={(e) =>
                setSelectedItem({
                  ...selectedItem,
                  description: e.target.value,
                })
              }
              className="w-full border px-3 py-2 rounded mb-2"
              placeholder="Description"
            />
            <input
              type="text"
              value={selectedItem.category}
              onChange={(e) =>
                setSelectedItem({ ...selectedItem, category: e.target.value })
              }
              className="w-full border px-3 py-2 rounded mb-2"
              placeholder="Category"
            />
            <input
              type="number"
              value={selectedItem.price}
              onChange={(e) =>
                setSelectedItem({
                  ...selectedItem,
                  price: parseFloat(e.target.value),
                })
              }
              className="w-full border px-3 py-2 rounded mb-2"
              placeholder="Price"
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setOpenDialog(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSubmit}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
