import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/forgotpassword`,
        { email: email.trim() },
        { withCredentials: true }
      );

      toast.success(data.message || "OTP sent to email");
      setOtpSent(true);
    } catch (error) {
      console.error("Forgot Password Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/reset-password`,
        {
          email: email.trim(),
          otp: otp.trim(),
          newPassword: newPassword.trim(),
        },
        { withCredentials: true }
      );

      toast.success(data.message || "Password reset successful");
      setOtpSent(false);
      setEmail("");
      setOtp("");
      setNewPassword("");
      navigate('/login');
    } catch (error) {
      console.error("Reset Password Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.error || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-grow flex-col py-10 px-6 max-w-5xl mx-auto bg-[#756d6d27] border border-[#383942] w-[25%] rounded-2xl my-40">
      <form
        onSubmit={otpSent ? handleResetPassword : handleForgotPassword}
        className="flex flex-col items-center gap-5 w-full"
      >
        <h2 className="text-xl font-semibold text-gray-100">
          {otpSent ? "Reset Password" : "Forgot Password"}
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Enter your registered email"
          autoComplete="off"
          className="w-full bg-[#bab6b627] border border-gray-200 text-white placeholder-gray-400 px-4 py-2 rounded-md focus:outline-none focus:ring-1"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {otpSent && (
          <>
            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              autoComplete="off"
              className="w-full bg-[#bab6b627] border border-gray-200 text-white placeholder-gray-400 px-4 py-2 rounded-md focus:outline-none focus:ring-1"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <input
              type="password"
              name="newPassword"
              placeholder="Enter New Password"
              autoComplete="new-password"
              className="w-full bg-[#bab6b627] border border-gray-200 text-white placeholder-gray-400 px-4 py-2 rounded-md focus:outline-none focus:ring-1"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </>
        )}

        <button
          type="submit"
          className="bg-blue-400 hover:bg-blue-500 text-black w-3/4 py-2 rounded-md font-medium transition duration-200 flex items-center justify-center cursor-pointer"
          disabled={loading}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : otpSent ? (
            "Reset Password"
          ) : (
            "Send OTP"
          )}
        </button>
      </form>
         <h4 className="text-md text-gray-300 text-center mt-2">
            Retry ? {" "}
            <button to="/forgot-password" className="text-green-600 hover:underline font-medium"
            onClick={() => setOtpSent(false)}>
                Request OTP
            </button>
        </h4>
    </main>
  );
}

export default ForgotPassword;
