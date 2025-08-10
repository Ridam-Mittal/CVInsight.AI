import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

function Signup() {
  const [form, setForm] = useState({
    fullname: '',
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const { data } = await axios.post('https://resolve-ai-ug21.onrender.com/api/auth/signup', {
        fullname: form.fullname.trim(),
        email: form.email.trim(),
        password: form.password.trim()
        },{
            withCredentials: true
        });

        localStorage.setItem("token", data.token); 
        localStorage.setItem("user", JSON.stringify(data.user));
        const expiryTime = Date.now() + 86400000; // 1 day from now
        localStorage.setItem("expiry", expiryTime);
        toast.success("Signup successful!");
        navigate("/");
    } catch (error) {
        console.error("Signup error:", error.response?.data || error.message);
        toast.error(error.response?.data?.error || "Signup failed");
    } finally {
        setLoading(false);
    }
};

  


  return (
    <>
      <main className="flex flex-col py-10 px-6 max-w-5xl mx-auto my-40 mb-50 bg-[#756d6d27] border border-[#383942] w-[25%] rounded-2xl">
        <form
          onSubmit={handleSignup}
          autoComplete="off"
          className="flex flex-col items-center gap-5 w-[100%]"
        >
          <h2 className="text-2xl font-semibold text-gray-100">SIGN UP</h2>

          <input
            type="text"
            name="fullname"
            placeholder="Full Name"
            autoComplete="off"
            className="w-full bg-[#bab6b627] border border-gray-200 text-white placeholder-gray-400 px-4 py-2 rounded-md focus:outline-none focus:ring-1 transition-all duration-150"
            value={form.fullname}
            onChange={handleChange}
          />

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

          <div className="form-control flex flex-col items-center mt-2 w-full">
            <button
              type="submit"
              className="bg-green-400 hover:bg-green-500 text-black w-3/4 py-2 rounded-md font-medium transition duration-200 flex items-center justify-center cursor-pointer"
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Sign Up"
              )}
            </button>
          </div>

          <h4 className="text-lg text-gray-300 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-green-600 hover:underline font-medium">
              Login
            </Link>
          </h4>
        </form>
      </main>
    </>
  );
}

export default Signup;
