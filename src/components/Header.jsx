import { useState, useMemo } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { IconMenu2 } from "@tabler/icons-react";
import { jwtDecode } from "jwt-decode";

export default function Header() {
  const route = useLocation();
  const navigate = useNavigate();
  const [isHidden, setHidden] = useState(true);

  const token = localStorage.getItem("token");

  const role = useMemo(() => {
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded.role;
    } catch (e) {
      console.log(e);
      return null;
    }
  }, [token]);

  let menuLinks = [];

  if (!role) {
    menuLinks.push(
      { path: "/", name: "Home" },
      { path: "/menu", name: "Menu" }
    );
  } else if (role === "staff") {
    menuLinks.push({ path: "/staff/dashboard", name: "Dashboard" });
    menuLinks.push({ path: "/staff/orders", name: "Orders" });
    menuLinks.push({ path: "/sales", name: "Sales" });
    menuLinks.push({ path: "/menu/ManageMenu", name: "Menu" });
    menuLinks.push({ path: "/table", name: "Table" });
  } else if (role === "admin") {
    menuLinks.push({ path: "/admin/dashboard", name: "Dashboard" });
    menuLinks.push({ path: "/sales", name: "Sales" });
    menuLinks.push({ path: "/menu/ManageMenu", name: "Menu" });
    menuLinks.push({ path: "/admin/manageStaff", name: "Staff" });
    menuLinks.push({ path: "/table", name: "Table" });
  }

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  const toggleMenu = () => setHidden(!isHidden);

  return (
    <header className="relative">
      <div className="flex md:hidden text-yellow-300">
        <button
          onClick={toggleMenu}
          className="flex items-center px-3 py-2 font-normal bg-gray-600 rounded"
        >
          <IconMenu2 />
        </button>
      </div>

      {!isHidden && (
        <div className="absolute top-full left-0 mt-2 bg-opacity-75 w-full bg-gray-800">
          <ul className="space-y-1 my-2 mx-2 divide-y divide-solid font-semibold text-gray-200 flex flex-col">
            {menuLinks.map((link, index) => (
              <li key={index}>
                <NavLink
                  to={link.path}
                  className={`block px-4 py-2 transition-colors duration-200 ${
                    route.pathname === link.path
                      ? "bg-gray-600"
                      : "text-gray-200 hover:text-yellow-400"
                  }`}
                  onClick={toggleMenu}
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
            {role && (
              <li>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-400 hover:text-red-500"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      )}

      <div className="px-8 hidden md:flex bg-gray-800 p-4">
        <ul className="flex justify-end space-x-4 font-semibold">
          {menuLinks.map((link, index) => (
            <li key={index}>
              <NavLink
                to={link.path}
                className={`transition-colors duration-200 px-3 py-2 rounded ${
                  route.pathname === link.path
                    ? "bg-gray-600"
                    : "text-gray-200 hover:text-yellow-400"
                }`}
              >
                {link.name}
              </NavLink>
            </li>
          ))}
          {role && (
            <li>
              <NavLink
                to="#"
                onClick={handleLogout}
                className={`px-3 py-2 rounded ${
                  route.pathname === "/logout"
                    ? "bg-gray-600"
                    : "text-red-200 hover:text-red-400"
                }`}
              >
                Logout
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </header>
  );
}
