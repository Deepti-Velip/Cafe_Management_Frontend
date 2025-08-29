"use client";
import React, { useEffect, useState } from "react";
import AddStaffForm from "./AddStaff";
import { toast, ToastContainer } from "react-toastify";
import useAxios from "../../lib/axios";

const ManageStaff = () => {
  const [staffList, setStaffList] = useState([]);

  // Fetch staff list
  const fetchStaff = async () => {
    try {
      const res = await useAxios.get("/auth/");
      if (res.status !== 200) throw new Error("Failed to fetch staff");
      setStaffList(res.data);
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // Toggle Access
  const handleToggleAccess = async (id, currentAccess) => {
    try {
      await useAxios.patch(`/auth/${id}/access`, { access: !currentAccess });
      toast.success(`Access ${currentAccess ? "disabled" : "enabled"}`);
      fetchStaff();
    } catch (err) {
      console.log(err);
      toast.error("Failed to update access");
    }
  };

  //  Update Role
  const handleUpdateRole = async (id, newRole) => {
    try {
      await useAxios.patch(`/auth/${id}/role`, { role: newRole });
      toast.success("Role updated");
      fetchStaff();
    } catch (err) {
      console.log(err);
      toast.error("Failed to update role");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Manage Staff</h2>

      <AddStaffForm onStaffAdded={fetchStaff} />

      {/* Staff Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">#</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Role</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffList.length > 0 ? (
              staffList.map((staff, index) => (
                <tr key={staff._id || index} className="hover:bg-gray-50">
                  <td className="border px-4 py-2 text-center">{index + 1}</td>
                  <td className="border px-4 py-2">{staff.name}</td>
                  <td className="border px-4 py-2">{staff.email}</td>
                  <td className="border px-4 py-2">
                    <select
                      value={staff.role}
                      onChange={(e) =>
                        handleUpdateRole(staff._id, e.target.value)
                      }
                      className="border rounded px-2 py-1"
                    >
                      <option value="staff">Staff</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>

                  <td className="border px-4 py-2 flex gap-2 justify-center">
                    {/* Toggle Access */}
                    <button
                      onClick={() =>
                        handleToggleAccess(staff._id, staff.access)
                      }
                      className={`px-3 py-1 rounded text-white ${
                        staff.access
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {staff.access ? "Disable" : "Enable"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center text-gray-500 py-4 border"
                >
                  No staff found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ToastContainer />
    </div>
  );
};

export default ManageStaff;
