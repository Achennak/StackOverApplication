import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="bg-gray-200 w-64 p-4">
      <ul>
        <li>
          <Link to="/" className="block py-2 px-4 hover:bg-gray-300">
            Questions
          </Link>
        </li>
        <li>
          <Link to="/tags" className="block py-2 px-4 hover:bg-gray-300">
            Tags
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
