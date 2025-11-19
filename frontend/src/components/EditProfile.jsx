import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { FeedCard } from "./FeedCard";
import axios from "axios";
import { addUser } from "../../utils/userSlice";

export const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [photoUrl, setPhotoUrl] = useState("");
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [showToast, setShowToast] = useState(false);
  const dispatch = useDispatch();

  // Fix controlled/uncontrolled input warning
  useEffect(() => {
    setFirstName(user.firstName || "");
    setLastName(user.lastName || "");
    setPhotoUrl(user.photoUrl || "");
    setAge(user.age || "");
    setGender(user.gender || "");
    setAbout(user.about || "");
  }, [user]);

  const handleUpdate = async () => {
    try {
      const API = import.meta.env.VITE_API_URL;
      const res = await axios.patch(
        `${API}/profile/edit`,
        {
          firstName,
          lastName,
          photoUrl,
          age,
          gender,
          about,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (error) {
      console.log("error while updating the profile", error.message);
    }
  };
  return (
    <>
      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Profile Saved successfully.</span>
          </div>
        </div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex justify-center my-10"
      >
        {user && (
          <div className="flex  justify-center mx-10">
            <div className="card card-dash bg-base-300 w-96 ">
              <div className="card-body  ">
                <h2 className="card-title justify-center mb-4">
                  Update Profile
                </h2>

                <label className="floating-label m-2">
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    type="text"
                    placeholder="firstname"
                    className="input input-md"
                  />
                  <span>First Name</span>
                </label>
                <label className="floating-label m-2">
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    type="text"
                    placeholder="lastname"
                    className="input input-md"
                  />
                  <span>Last Name</span>
                </label>
                <label className="floating-label m-2">
                  <input
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    type="text"
                    placeholder="photo url"
                    className="input input-md"
                  />
                  <span>PhotoUrl</span>
                </label>
                <label className="floating-label m-2">
                  <input
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    type="text"
                    placeholder="age"
                    className="input input-md"
                  />
                  <span>Age</span>
                </label>

                <select
                value={gender}
                onChange={(e)=>setGender(e.target.value)}
                 defaultValue="Pick a color" className="select m-2">
                  <option disabled={true}>Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>

                <label className="floating-label m-2">
                  {/* <input
                    
                    placeholder="about"
                    className="input input-md"
                  />
                  <span>About</span> */}
                  <textarea
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    type="text"
                    className=" flex flex-wrap  textarea"
                    placeholder="About"
                  ></textarea>
                </label>
                <div className=" card-actions justify-center m-2">
                  <button
                    onClick={handleUpdate}
                    className="btn btn-primary  w-full items-center"
                  >
                    Save Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <FeedCard user={user} />
      </motion.div>
    </>
  );
};
