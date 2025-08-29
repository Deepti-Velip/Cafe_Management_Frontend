import { useState } from "react";
import { toast } from "react-toastify";
import TextInput from "../../components/TextInput";
import useAxios from "../../lib/axios";
import { useNavigate } from "react-router-dom";

const MenuForm = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
  });
  const [image, setImage] = useState(null); // file state

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("price", form.price);
      if (image) {
        formData.append("image", image);
      }
      await useAxios.post("/menu", formData);
      toast.success("Menu item added!");
      setForm({ name: "", description: "", category: "", price: "" });
      setImage(null);
      toast.success("New Item added successfully!");
      navigate("/menu/manageMenu");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add item");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-blue-50 p-6 rounded-2xl shadow-md space-y-6 "
    >
      <h2 className="text-xl font-semibold text-gray-800">Add New Menu Item</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          label="Name"
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full"
        />

        <TextInput
          label="Category"
          type="text"
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full"
        />

        <TextInput
          label="Price"
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          className="w-full"
        />

        <TextInput
          label="Description"
          type="text"
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full"
        />

        {/* File input */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-1">Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            className="border border-gray-300 rounded-lg p-2"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-28 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
      >
        Add Item
      </button>
    </form>
  );
};

export default MenuForm;
