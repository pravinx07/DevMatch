import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../../utils/feedSlice";
import { useEffect } from "react";
import { FeedCard } from "./FeedCard";

export const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();

  
  const getFeed = async () => {
    if (feed && feed.length > 0) return;

    try {
      const API = import.meta.env.VITE_API_URL;
      const res = await axios.get(`${API}/feed`, {
        withCredentials: true,
      });
      dispatch(addFeed(res?.data?.data));
      console.log(res.data.data);
      
    } catch (error) {
      console.error("Error while fetching feed", error);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  return (
  <div className="flex justify-center items-center mt-10">
    <FeedCard user={feed[0]} key={feed._id}/>
  </div>
);
};
