import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mobile: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.mobile.length !== 10) {
      alert("Mobile number must be 10 digits");
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      alert(data.message);

      navigate("/login");

    } catch {
      alert("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            required
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1488A5] outline-none"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1488A5] outline-none"
          />

          <input
            type="tel"
            name="mobile"
            placeholder="Mobile Number"
            maxLength="10"
            required
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1488A5] outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1488A5] outline-none"
          />

          <button
            type="submit"
            className="w-full bg-[#1488A5] text-white py-2 rounded-lg font-semibold hover:bg-[#0f6f85] transition"
          >
            Register
          </button>
        </form>

        <div className="text-sm text-center text-gray-500 mt-4">
          Already have an account?{" "}
        <a href="/login" className="text-[#1488A5] cursor-pointer font-medium">
          Login
        </a>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
