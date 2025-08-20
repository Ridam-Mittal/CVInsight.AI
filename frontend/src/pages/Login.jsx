import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

function Login() {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        email: form.email.trim(),
        password: form.password.trim()
        }, { withCredentials: true });
        
        localStorage.setItem("token", data.token); 
        localStorage.setItem("user", JSON.stringify(data.user));
        const expiryTime = Date.now() + 86400000; // 1 day from now
        localStorage.setItem("expiry", expiryTime);
        toast.success("Login successful!");
        navigate("/");
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      toast.error(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="flex flex-grow flex-col py-10 px-6 max-w-5xl mx-auto bg-[#756d6d27] border border-[#383942] w-[25%] rounded-2xl my-20">
        <form
          onSubmit={handleLogin}
          autoComplete="off"
          className="flex flex-col items-center gap-5 w-[100%]"
        >
          <h2 className="text-xl font-semibold text-gray-100 ">LOG IN</h2>

          <input
            type="email"
            name="email"
            placeholder="Email"
            autoComplete="off"
            className="w-full bg-[#bab6b627] border border-gray-200 text-white placeholder-gray-400 px-4 py-2 rounded-md focus:outline-none focus:ring-1 transition-all duration-150"
            value={form.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="new-password"
            className="w-full bg-[#bab6b627] border border-gray-200 text-white placeholder-gray-400 px-4 py-2 rounded-md focus:outline-none focus:ring-1 transition-all duration-150"
            value={form.password}
            onChange={handleChange}
          />

          <div className="form-control flex flex-col items-center mt-2 w-full ">
            <button
              type="submit"
              className="bg-green-400 hover:bg-green-500 text-black w-3/4 py-2 rounded-md font-medium transition duration-200 flex items-center justify-center cursor-pointer"
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>
        <h4 className="text-md text-gray-300 text-center mt-2">
        Don't have an account?{" "}
        <Link to="/signup" className="text-green-600 hover:underline font-medium">
            Signup
        </Link>
        </h4>
        <h4 className="text-md text-gray-300 text-center mt-2">
        Forgot Password ?{" "}
        <Link to="/forgot-password" className="text-green-600 hover:underline font-medium">
            Click Here
        </Link>
        </h4>
      </main>
    </>
  )
}

export default Login;
