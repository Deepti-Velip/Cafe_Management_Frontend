import React, { useEffect, useState } from "react";
import useAxios from "../lib/axios";
import { toast } from "react-toastify";

const TableManager = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newTable, setNewTable] = useState({ table_no: "", scapacity: "" });

  // Fetch all tables
  const fetchTables = async () => {
    try {
      setLoading(true);
      const res = await useAxios.get("/tables");
      setTables(res.data);
      setError("");
    } catch (err) {
      console.log(err);

      setError("Failed to load tables");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  // Add new table
  const addTable = async (e) => {
    e.preventDefault();
    try {
      await useAxios.post("/tables", newTable);
      setNewTable({ table_no: "", capacity: "" });
      toast.success("New Table added successfully!");

      fetchTables();
    } catch (err) {
      alert("Error adding table: " + err.response?.data?.message);
    }
  };

  // Update status
  const updateStatus = async (id, status) => {
    try {
      await useAxios.put(`tables/${id}`, { status });
      fetchTables();
    } catch (err) {
      console.log(err);

      alert("Error updating status");
    }
  };

  // Delete table
  const deleteTable = async (id) => {
    if (!window.confirm("Are you sure you want to delete this table?")) return;
    try {
      await useAxios.delete(`tables/${id}`);
      fetchTables();
    } catch (err) {
      console.log(err);

      alert("Error deleting table");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Table Management</h1>

      {/* Add Table Form */}
      <form
        onSubmit={addTable}
        className="mb-6 flex gap-4 items-center justify-center"
      >
        <input
          type="number"
          placeholder="Table No"
          value={newTable.table_no}
          onChange={(e) =>
            setNewTable({ ...newTable, table_no: e.target.value })
          }
          required
          className="border px-3 py-2 rounded w-32"
        />
        <input
          type="number"
          placeholder="Capacity"
          value={newTable.capacity}
          onChange={(e) =>
            setNewTable({ ...newTable, capacity: e.target.value })
          }
          required
          className="border px-3 py-2 rounded w-32"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Table
        </button>
      </form>

      {/* Table List */}
      {loading ? (
        <p className="text-center">Loading tables...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Table No</th>
              <th className="border p-2">Capacity</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tables.map((table) => (
              <tr key={table._id} className="text-center">
                <td className="border p-2">{table.table_no}</td>
                <td className="border p-2">{table.capacity}</td>
                <td className="border p-2 capitalize">{table.status}</td>
                <td className="border p-2 space-x-2">
                  {/* Update Status */}
                  <select
                    value={table.status}
                    onChange={(e) => updateStatus(table._id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="reserved">Reserved</option>
                  </select>

                  {/* Delete Button */}
                  <button
                    onClick={() => deleteTable(table._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {tables.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-gray-500">
                  No tables found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TableManager;
