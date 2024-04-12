// TopBar.js
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useUserStore from "../store/userStore";

const TopBar = () => {
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleUserClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 py-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold">
          Stack Overflow Clone
        </Link>
        {user && (
          <div className="relative">
            <button onClick={handleUserClick}>
              <img
                src={user.avatar}
                alt="User Avatar"
                className="w-10 h-10 rounded-full"
              />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
                <ul>
                  <li>
                    <Link
                      to="/profile"
                      className="block py-2 px-4 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Visit Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      className="block w-full text-left py-2 px-4 hover:bg-gray-100"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default TopBar;
