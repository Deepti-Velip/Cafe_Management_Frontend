import { useForm } from "react-hook-form";
import { object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import TextInput from "../components/TextInput";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import useAxios from "../lib/axios";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const validationSchema = object({
    email: string().email().required(),
    password: string()
      .required("Password is required.")
      .min(8, "Password must be at least 8 characters.")
      .max(16, "Password cannot exceed 16 characters."),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await useAxios.post(`/auth/login`, data);
      if (response.status === 200) {
        toast.success("Login successful 🎉");
        const token = response.data.token;
        localStorage.setItem("token", token);
        localStorage.getItem("token");

        const { role } = jwtDecode(token);

        if (role === "staff") navigate("/staff/dashboard");
        else if (role === "admin") navigate("/admin/dashboard");
      }
    } catch (error) {
      console.log(error);
      toast.error("Invalid email or password ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <ToastContainer />

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <p className="text-center text-gray-500 mb-8">
          Sign in to continue to Cafe Management
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 text-center"
        >
          {/* Email */}
          <TextInput
            type="email"
            label="Email"
            error={errors.email?.message}
            {...register("email")}
          />

          {/* Password */}
          <TextInput
            type="password"
            label="Password"
            error={errors.password?.message}
            {...register("password")}
          />

          {/* Button */}
          <button
            type="submit"
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
