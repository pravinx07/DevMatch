import axios from "axios";
import { useDispatch } from "react-redux";
import { removeFeed } from "../../utils/feedSlice";
import {motion } from "framer-motion"

export const FeedCard = ({ user }) => {
  const dispatch = useDispatch()
  if (!user) {
    return (
      <span className="loading loading-spinner loading-xl "></span>
    );
  }
  const { _id, firstName, about, lastName, photoUrl, age, gender } = user || "";
  console.log(user);

  const handleRequest = async (status, _id) => {
    try {
      const API = import.meta.env.VITE_API_URL;
      const res = await axios.post(
        `${API}/request/send/${status}/${_id}`,
        {},
        { withCredentials: true }
      );
      console.log(res.data.data);
      dispatch(removeFeed(_id))
    } catch (error) {
      console.error("Error while sending request", error);
    }
  };
  return (
    <motion.div
     initial={{opacity:0, y:60}}
     animate={{opacity:1, y:0}}
     transition={{duration:0.8}}
     className="card bg-base-300 w-87 shadow-sm">
      <figure className="w-full">
        <img className="object-fit w-full" src={photoUrl} alt="img" />
      </figure>
      <div className="card-body">
        <h2 className="card-title  justify-center">
          {firstName + " " + lastName}{" "}
        </h2>
        {age && gender && <p className="text-center"> {gender + " " + age}</p>}
        <p className="text-center p-2">{about}</p>
        <div className="card-actions justify-center">
          <button className="btn btn-accent " onClick={()=>handleRequest("interested", _id)}>Interested</button>
          <button className="btn btn-primary" onClick={()=>handleRequest("ignored", _id)}>Ignored</button>
        </div>
      </div>
    </motion.div>
  );
};
