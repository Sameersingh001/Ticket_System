import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {


    const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      // Store token
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Login successful");

      navigate("/dashboard");
    } catch {
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
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
            Login
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-4">
          Don’t have an account?{" "}
          <span className="text-[#1488A5] cursor-pointer font-medium">
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
