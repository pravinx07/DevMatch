import { Outlet, useNavigate } from "react-router";
// import { Navbar } from "./Navbar";
import { NavBar } from "./NavBar";
import { Footer } from "./Footer";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useEffect } from "react";
import { addUser } from "../../utils/userSlice";





export const Body = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const fetchUser = async() => {

      try {
        const API = import.meta.env.VITE_API_URL;
        const res = await axios.get(`${API}/profile/view`,
            {
                withCredentials:true
            }
        )

        dispatch(addUser(res.data))

      } catch (err) {
        if (err.response && err.response.status === 401) {
          // Optionally clear state, show a message, etc.
          navigate("/login");
        } else {
          // Handle other errors
          console.error(err);
        }
      }
    }

    useEffect(()=>{
        
    
  
  fetchUser();
    },[])
    return (
        <div>
            <NavBar/>
            
            <Outlet/>
            <Footer/>
        </div>
    )
}