import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-6">
      {/* Title */}
      <h1 className="text-4xl font-extrabold text-gray-800">The Cafe</h1>
      <p className="text-gray-600 mt-2">Welcome to our cozy space!</p>

      {/* Buttons */}
      <div className="flex gap-6 mt-8">
        {/* Admin Button */}
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition"
        >
          Admin
        </button>

        {/* Menu Button */}
        <button
          onClick={() => navigate("/menu")}
          className="px-6 py-3 bg-green-600 text-white rounded-xl shadow-md hover:bg-green-700 transition"
        >
          Menu
        </button>
      </div>
    </div>
  );
}

export default Home;
