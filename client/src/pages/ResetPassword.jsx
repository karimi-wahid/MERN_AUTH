import React from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useRef } from "react";
import { useEffect } from "react";

const ResetPassword = () => {
  const { backEndUrl } = useContext(AppContext);
  axios.defaults.withCredentials = true;
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState(0);
  const [isOtpSubmited, setIsOtpSubmited] = useState(false);

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

  const onSubmitEmail = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${backEndUrl}/api/auth/send-reset-otp`,
        {
          email,
        },
      );
      response.data.success
        ? toast.success(response.data.message)
        : toast.error(response.data.message);
      response.data.success && setIsEmailSent(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    const otpArrary = inputRefs.current.map((e) => e.value).join("");
    setOtp(otpArrary);
    setIsOtpSubmited(true);
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${backEndUrl}/api/auth/reset-password`,
        { email, otp, newPassword },
      );
      response.data.success
        ? toast.success(response.data.message)
        : toast.error(response.data.message);
      response.data.success && navigate("/login");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <img
        src={assets.logo}
        onClick={() => navigate("/")}
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />
      {/* Enter email address for reset password */}
      {!isEmailSent && (
        <form
          onSubmit={onSubmitEmail}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter your registered email address
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="mail icon" className="w-3 h-3" />
            <input
              type="email"
              placeholder="Email id"
              className="bg-transparent outline-none text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button className="w-full py-2.5 bg-linear-to-r from-indigo-600 to-indigo-900 text-white rounded-full mt-3">
            Submit
          </button>
        </form>
      )}
      {/* Reset password OTP */}
      {!isOtpSubmited && isEmailSent && (
        <form
          onSubmit={onSubmitOtp}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset password OTP
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
          <button className="w-full text-white py-2.5 bg-linear-to-r from-indigo-600 to-indigo-800 rounded-full">
            Submit
          </button>
          <Link to="/login" className="mt-5 text-blue-600 text-sm">
            Back to login page
          </Link>
        </form>
      )}
      {/* enter new password */}
      {isOtpSubmited && isEmailSent && (
        <form
          onSubmit={onSubmitNewPassword}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Enter new password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter the new password below
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="mail icon" className="w-3 h-3" />
            <input
              type="password"
              placeholder="New password"
              className="bg-transparent outline-none text-white"
              value={newPassword}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="w-full py-2.5 bg-linear-to-r from-indigo-600 to-indigo-900 text-white rounded-full mt-3">
            Submit
          </button>
          <Link to="/login" className="mt-5 text-blue-600 text-sm">
            Back to login page
          </Link>
        </form>
      )}
      <p></p>
    </div>
  );
};

export default ResetPassword;
