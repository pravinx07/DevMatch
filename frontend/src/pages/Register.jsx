import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    about: "",
    skills: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (avatar) fd.append("avatar", avatar);

    dispatch(registerUser(fd)).then((res) => {
      if (res.type.endsWith("fulfilled")) navigate("/login");
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* LEFT PANEL */}
        <div className="hidden md:flex md:w-1/2 bg-purple-600 text-white flex-col justify-center p-10">
          <h1 className="text-3xl font-bold mb-4">Join DevMatch</h1>
          <p className="text-purple-100 text-sm">
            Create your profile and start connecting with developers.
          </p>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-full md:w-1/2 p-8 bg-white text-gray-900 max-h-[90vh] overflow-y-auto">
          
          <h2 className="text-2xl font-bold text-center mb-3">Register</h2>

          {error && (
            <div className="mb-4 text-sm text-red-700 bg-red-100 border border-red-300 px-3 py-2 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* AVATAR */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
                {preview ? (
                  <img src={preview} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500 text-xs">
                    Avatar
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800">
                  Upload Avatar
                </label>
                <input type="file" accept="image/*" onChange={handleAvatar} className="text-xs" />
                <p className="text-gray-500 text-[11px]">PNG/JPG preferred.</p>
              </div>
            </div>

            {/* NAME FIELDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-800 font-medium">First name</label>
                <input
                  name="firstname"
                  value={form.firstname}
                  onChange={handleChange}
                  className="w-full border border-gray-300 text-gray-900 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-gray-800 font-medium">Last name</label>
                <input
                  name="lastname"
                  value={form.lastname}
                  onChange={handleChange}
                  className="w-full border border-gray-300 text-gray-900 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm text-gray-800 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-300 text-gray-900 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            {/* PASSWORD + AGE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-800 font-medium">Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 text-gray-900 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-gray-800 font-medium">Age</label>
                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  className="w-full border border-gray-300 text-gray-900 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* GENDER + SKILLS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-800 font-medium">Gender</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full border border-gray-300 text-gray-900 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select…</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-800 font-medium">Skills (comma separated)</label>
                <input
                  name="skills"
                  value={form.skills}
                  onChange={handleChange}
                  placeholder="react, node"
                  className="w-full border border-gray-300 text-gray-900 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* ABOUT */}
            <div>
              <label className="text-sm text-gray-800 font-medium">About</label>
              <textarea
                name="about"
                value={form.about}
                onChange={handleChange}
                rows="3"
                className="w-full border border-gray-300 text-gray-900 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
              ></textarea>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-2.5 rounded-md text-sm font-medium hover:bg-purple-700 transition disabled:opacity-60"
            >
              {loading ? "Creating account…" : "Register"}
            </button>
          </form>

          <p className="mt-4 text-gray-700 text-xs text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
