import { useRef, useContext, useEffect } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const EmailVerify = () => {
  axios.defaults.withCredentials = true;
  const { backEndUrl, isLoggedIn, userData, getUserData } =
    useContext(AppContext);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  // Focus on the next input field when the the input is fill
  const handleInput = (e, index) => {
    const value = e.target.value;
    if (value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Focus on the previous input field when Backspace is pressed and the input is empty
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };
  // Handle paste event to allow pasting the OTP in the input fields
  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text");
    const pasteValues = paste.split("").slice(0, 6);
    pasteValues.forEach((value, index) => {
      if (index < inputRefs.current.length) {
        inputRefs.current[index].value = value;
      }
    });
  };

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const otp = inputRefs.current.map((e) => e.value).join("");

      const response = await axios.post(
        `${backEndUrl}/api/auth/verify-account`,
        { otp },
      );

      if (response.data.success) {
        toast.success(response.data.message);
        getUserData();
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Redirect to home page if user is already authenticated and email is verified
  useEffect(() => {
    isLoggedIn && userData && userData.isAccountVerified && navigate("/");
  }, [isLoggedIn, userData]);

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0">
      <img
        src={assets.logo}
        alt="logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />
      <form
        onSubmit={onSubmitHandler}
        className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
      >
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Email Verification OTP
        </h1>
        <p className="text-center mb-6 text-indigo-300">
          Enter the 6-digit OTP sent to your email
        </p>
        <div className="flex justify-baseline mb-8" onPaste={handlePaste}>
          {Array(6)
            .fill(0)
            .map((_, index) => {
              return (
                <input
                  type="text"
                  maxLength={1}
                  key={index}
                  className="w-12 h-12 bg-[#333A5C] text-white text-center text-lg rounded-md mr-1 outline-none"
                  required
                  ref={(e) => (inputRefs.current[index] = e)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              );
            })}
        </div>
        <button className="w-full text-white py-3 bg-linear-to-r from-indigo-600 to-indigo-800 rounded-full">
          Verify email
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;
