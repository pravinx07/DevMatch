import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { removeUser } from "../../utils/userSlice";

export const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      const API = import.meta.env.VITE_API_URL;
      await axios.post(
        `${API}/logout`,
        {},
        { withCredentials: true }
      );
      dispatch(removeUser());
      navigate("/login");
    } catch (error) {
      console.error("Error while logout", error);
    }
  };
  return (
    <div className="navbar bg-base-300 shadow-sm">
      <div className="flex-1">
        <Link
          to={"/feed"}
          className="btn btn-ghost text-xl hover:bg-gray-800 transition duration-150 ease-in-out "
        >
          💻 DevMatch
        </Link>
      </div>
      {user && user.firstName && (
        <div className="flex gap-2">
          <span className="p-2 pr-0 text-lg font-semibold  text-white">
            Welcome! {user.firstName}
          </span>

          <div className="dropdown dropdown-end mx-5">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full ">
                <img
                  alt="Tailwind CSS Navbar component"
                  src={
                    user.photoUrl ||
                    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  }
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to={"/profile"} className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </Link>
              </li>
              <li>
                <Link to="/connections">Connections</Link>
              </li>
               <li>
                <Link to="/requests">Requests</Link>
              </li>
              <li>
                <button onClick={handleLogOut} className="btn btn-link p-0 m-0 text-left">Logout</button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
