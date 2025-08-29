"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import TextInput from "../../components/TextInput";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAxios from "../../lib/axios";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Min 6 characters")
    .required("Password required"),
  role: yup
    .string()
    .oneOf(["admin", "staff"], "Invalid role")
    .required("Role required"),
});

const AddStaffForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      // API request with Axios
      await useAxios.post("/auth/register", data);

      toast.success("Staff added successfully!");
      reset();
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || "Error adding staff";
      toast.error(errorMsg);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border p-6 rounded-lg shadow-md bg-white"
    >
      <h2 className="text-xl font-bold mb-4">Add New Staff</h2>

      <TextInput
        label="Name"
        type="text"
        {...register("name")}
        error={errors.name?.message}
      />
      <TextInput
        label="Email"
        type="email"
        {...register("email")}
        error={errors.email?.message}
      />
      <TextInput
        label="Password"
        type="password"
        {...register("password")}
        error={errors.password?.message}
      />

      <div className="mb-4">
        <label className="font-bold">Role : </label>
        <select
          {...register("role")}
          className="border-black border-2 px-2 py-1"
        >
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="staff">Staff</option>
        </select>
        {errors.role && <p className="text-red-500">{errors.role.message}</p>}
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add Staff
      </button>
    </form>
  );
};

export default AddStaffForm;
