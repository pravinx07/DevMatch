import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { getConnections } from "../../utils/connectionSlice";
import {Link} from "react-router-dom"
import { motion } from "framer-motion";

export const Connections = () => {
    const connections = useSelector(store => store.connections)
  const dispatch = useDispatch();
  const fetchConnections = async () => {


    try {
      const API = import.meta.env.VITE_API_URL;
      const res = await axios.get(
        `${API}/user/connections`,
        { withCredentials: true }
      );
      dispatch(getConnections(res?.data?.data));
    } catch (error) {
      console.error("Error while fetching connections", error);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return  <span className="loading loading-spinner loading-xl "></span>;
  if (connections.length === 0) return <h1 className="text-center text-2xl font-bold  m-2">No Connections </h1>;
  return (
    <motion.div 
    initial={{opacity:0, y:60}}
     animate={{opacity:1, y:0}}
     transition={{duration:0.8}}
    className="flex flex-col justify-center items-center text-center m-6">
  <h1 className="text-2xl font-bold mb-4">Connections</h1>
  {connections.map((users) => {
    const {_id, firstName, lastName, photoUrl, about, age, gender } = users;
    return (
      <div
        key={users._id}
        className="flex flex-col sm:flex-row items-center bg-white dark:bg-base-300 shadow-xl rounded-xl border border-gray-200 hover:ring-2 hover:ring-primary transition-all w-full max-w-lg mb-6 p-6"
      >
        <img
          src={photoUrl}
          className="w-24 h-24 sm:w-20 sm:h-20 rounded-full border-4 border-primary object-cover shadow-md mb-4 sm:mb-0 sm:mr-6"
          alt="profile"
        />
        <div className="flex-1 text-left">
          <div className="font-semibold text-lg text-gray-200 ">{firstName} {lastName}</div>
          <div className="text-sm text-gray-300 mb-2">{about}</div>
          <div className="flex gap-4 mb-4 text-xs text-gray-400">
            <span className="font-medium text-gray-300">Age: <span className="font-medium text-gray-300">{age}</span></span>
            <span>|</span>
            <span className="font-medium text-gray-300">Gender: <span className="font-medium text-gray-300">{gender}</span></span>
          </div>
          
        </div>
        <Link to={`/chat/${_id}`}><button className="bg-blue-500 px-3 py-2 rounded-lg text-xl font-bold cursor-pointer hover:bg-blue-600 transition duration-150">Chat</button></Link>
      </div>
    );
  })}
</motion.div>
  );
};
