import { useState } from "react";
import {Link, useNavigate} from "react-router"
import axios from "axios"
import {motion} from "framer-motion"
import { useDispatch } from "react-redux";
import { addUser } from "../../utils/userSlice";
export const SignUp = () => {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [emailId, setEmailId] = useState("")
  const [password, setPassword] = useState("")

  const disPatch = useDispatch()
  const navigate = useNavigate()

  const handleSignUp = async(e) => {
    e.preventDefault()

    try {
      const API = "https://devmatch-57k2.onrender.com";
      console.log(API);
      
      const res = await axios.post(`${API}/signup`,{
        firstName,
        lastName,
        emailId,
        password,
        
      },
      {
        withCredentials:true
      }
    )
     console.log(res.data.savedUser);
    disPatch(addUser(res.data.savedUser))
    navigate("/profile")
      
    } catch (error) {
      console.log("Error while Sign up", error);
      
    }
  }

  return (
    <motion.div 
    initial={{opacity:0, y:60}}
     animate={{opacity:1, y:0}}
     transition={{duration:0.7}}
     viewport={{once:true}}
    className="flex  justify-center m-6">
      <div className="card card-dash bg-base-300 w-96 ">
        <div className="card-body  ">
          <h2 className="card-title justify-center mb-4">Sign Up</h2>

           <label className="floating-label m-2">
            <input
             value={firstName}
             onChange={(e) => setFirstName(e.target.value)}
              type="text"
              placeholder="First Name"
              className="input input-md"
            />
            <span>First Name</span>
          </label>
          <label className="floating-label m-2">
            <input
             value={lastName}
             onChange={(e) => setLastName(e.target.value)}
              type="text"
              placeholder="Last Name"
              className="input input-md"
            />
            <span>Last Name</span>
          </label>
          <label className="floating-label m-2">
            <input
            value={emailId}
             onChange={(e) => setEmailId(e.target.value)}
              type="text"
              placeholder="Email"
              className="input input-md"
            />
            <span>Email</span>
          </label>
          <label className="floating-label m-2">
            <input
            value={password}
             onChange={(e) => setPassword(e.target.value)}
              type="text"
              placeholder="password"
              className="input input-md"
            />
            <span>Password</span>
          </label>
          

          <div className=" card-actions justify-center m-2">
            <button className="btn btn-primary  w-full items-center" onClick={handleSignUp}>Sign Up</button>
            <p className="font-semibold text-center mt-2" >Already have an account ?  <Link  className="hover:underline text-blue-300" to="/login">Sign In</Link></p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
