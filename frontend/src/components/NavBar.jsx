import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

const Navbar = () => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-20">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to={token ? "/feed" : "/login"} className="text-xl font-bold">
          DevMatch
        </Link>

        {token ? (
          <div className="flex items-center gap-4">
            <Link to="/feed" className="text-sm hover:underline">
              Feed
            </Link>
            <Link to="/connections" className="text-sm hover:underline">
              Connections
            </Link>
            <Link to="/requests" className="text-sm hover:underline">
              Requests
            </Link>
            <Link to="/profile" className="text-sm hover:underline">
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm bg-red-500 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-3">
            <Link
              to="/login"
              className="text-sm px-3 py-1 border rounded hover:bg-gray-100"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm px-3 py-1 bg-blue-600 text-white rounded"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
