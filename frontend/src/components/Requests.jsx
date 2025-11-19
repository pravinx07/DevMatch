import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getConnections } from "../../utils/connectionSlice";
import { removeRequest } from "../../utils/requestSlice";
import { motion } from "framer-motion";

export const Requests = () => {
  const requests = useSelector((store) => store.connections);

  const dispatch = useDispatch();
  const fetchRequests = async () => {
    try {
      const API = import.meta.env.VITE_API_URL;
      const res = await axios.get(
        `${API}/user/request/recieved`,
        { withCredentials: true }
      );
      dispatch(getConnections(res?.data?.data));
    } catch (error) {
      console.error("Error while fetching connections", error);
    }
  };


  const reviewRequest = async(status, _id) => {
    try {
      
      const res = await axios.post(`http://localhost:7777/request/reviews/${status}/${_id}`, {},{withCredentials:true})

       dispatch(removeRequest(_id))
    } catch (error) {
      console.error("Error while request review ", error.message);
      
    }
  }
  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return   <span className="loading loading-spinner loading-xl "></span>;
  if (requests.length === 0) return <h1 className="text-center text-2xl font-bold  m-2">No Connections Request</h1>;
  return (
    <motion.div 
    initial={{opacity:0, y:60}}
     animate={{opacity:1, y:0}}
     transition={{duration:0.8}}
    className="flex flex-col justify-center items-center text-center m-6">
  <h1 className="text-2xl font-bold mb-4">Connections Requests</h1>
  {requests.map((users) => {
    const { firstName, lastName, photoUrl, about, age, gender , _id} = users.fromUserId  || ""
;
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
            <span>Age: <span className="font-medium text-gray-700">{age}</span></span>
            <span>|</span>
            <span>Gender: <span className="font-medium text-gray-700">{gender}</span></span>
          </div>
          <div className="flex gap-3">
            <button className="py-1 px-4 rounded-full bg-primary text-white shadow hover:bg-primary-focus transition cursor-pointer" onClick={()=>reviewRequest("accepted", users._id)}>Accept</button>
            <button className="py-1 px-4 rounded-full bg-red-500 text-white shadow hover:bg-red-600 transition cursor-pointer" onClick={()=>reviewRequest("rejected", users._id)}>Reject</button>
          </div>
        </div>
      </div>
    );
  })}
</motion.div>
  );
};
