import { FaUserCircle } from "react-icons/fa";
import TopBar from "../components/topbar";
import Sidebar from "../components/sidebar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useUserStore from "../store/userStore";

const ProfilePage = () => {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const fetchUser = useUserStore((state) => state.fetchUser);
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      fetchUser();
    }
  }, [isAuthenticated, navigate, fetchUser]);

  useEffect(() => {
    if (user) {
      setUserData(user);
    }
  }, [user]);

  const renderUserData = () => {
    if (userData) {
      return (
        <div className="flex flex-col items-center mb-8">
          <FaUserCircle className="text-6xl text-gray-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2">{userData.userName}</h1>
          <p className="text-gray-500 mb-1">{userData.email}</p>
          <p className="text-gray-500">
            Member since {new Date(userData.joinDate).toLocaleDateString()}
          </p>
        </div>
      );
    } else {
      return <p>Loading user data...</p>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <div className="flex flex-grow">
        <Sidebar />
        <div className="flex flex-col flex-grow p-8">
          {userData && (
            <div>
              {renderUserData()}
              <div>
                <h2 className="text-xl font-bold mb-4">Questions</h2>
                {/* Add horizontally scrollable questions here */}
              </div>
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Answers</h2>
                {/* Add horizontally scrollable answers here */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
