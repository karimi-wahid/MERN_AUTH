import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();

  const { backEndUrl, setIsLoggedIn, getUserData } = useContext(AppContext);

  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();

      axios.defaults.withCredentials = true;

      if (state === "Sign Up") {
        const response = await axios.post(
          `${backEndUrl}/api/auth/register`,
          formData,
        );

        if (response.data.success) {
          setIsLoggedIn(true);
          toast.success(response.data.message);
          await getUserData();
          navigate("/");
        } else {
          console.log(response.data.message);
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(
          `${backEndUrl}/api/auth/login`,
          formData,
        );
        if (response.data.success) {
          setIsLoggedIn(true);
          toast.success(response.data.message);
          await getUserData();
          navigate("/");
        }
      }
    } catch (error) {
      console.log(error.response?.data || error.message);
      const msg = error.response?.data?.message || error.message;
      toast.error(msg);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0">
      <img
        src={assets.logo}
        alt="logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
        onClick={() => navigate("/")}
      />
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </h2>
        <p className="text-center text-sm mb-6">
          {state === "Sign Up"
            ? "Create your account"
            : "Login to your account"}
        </p>

        <form onSubmit={onSubmitHandler}>
          {state === "Sign Up" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c]">
              <img src={assets.person_icon} alt="person icon" />
              <input
                type="text"
                placeholder="Full Name"
                required
                className="bg-transparent outline-none"
                onChange={handleInputChange}
                name="name"
              />
            </div>
          )}
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c]">
            <img src={assets.mail_icon} alt="mail icon" />
            <input
              type="email"
              placeholder="Email Address"
              required
              className="bg-transparent outline-none"
              onChange={handleInputChange}
              name="email"
            />
          </div>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c]">
            <img src={assets.lock_icon} alt="lock icon" />
            <input
              type="password"
              placeholder="Password"
              required
              className="bg-transparent outline-none"
              onChange={handleInputChange}
              name="password"
            />
          </div>

          <p
            className="mb-4 text-indigo-500 cursor-pointer"
            onClick={() => navigate("/reset-password")}
          >
            Forgot password?
          </p>
          <button className="w-full py-2.5 rounded-full bg-linear-to-r from-indigo-500 to-indigo-900 text-white font-medium">
            {state}
          </button>
        </form>
        {state === "Sign Up" ? (
          <p className="text-gray-400 text-center text-xs mt-4">
            Already have an account
            <span
              className="text-blue-400 cursor-pointer underline"
              onClick={() => setState("Login")}
            >
              {" "}
              Login here
            </span>
          </p>
        ) : (
          <p className="text-gray-400 text-center text-xs mt-4">
            Don't have an account
            <span
              className="text-blue-400 cursor-pointer underline"
              onClick={() => setState("Sign Up")}
            >
              {" "}
              Sign Up
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
