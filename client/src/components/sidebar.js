import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="bg-gray-200 w-64 p-4">
      <ul>
        <li>
          <Link
            to="/"
            className={`block py-2 px-4  ${
              location.pathname === "/" ? "bg-blue-500 text-white" : ""
            }`}
            data-testid="sidebar-navigate-to-home"
          >
            Questions
          </Link>
        </li>
        <li>
          <Link
            to="/tags"
            className={`block py-2 px-4  ${
              location.pathname === "/tags" ? "bg-blue-500 text-white" : ""
            }`}
            data-testid="sidebar-navigate-to-tags"
          >
            Tags
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
