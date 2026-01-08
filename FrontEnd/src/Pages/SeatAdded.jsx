import { useState } from "react";

const AddSeat = () => {
  const [formData, setFormData] = useState({
    seatname: "",
    seatNumber: "",
    isBooked: false,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/seats/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("✅ Seat added successfully");
        setFormData({
          seatname: "",
          seatNumber: "",
          isBooked: false,
        });
      } else {
        setMessage("❌ Failed to add seat");
      }
    } catch (error) {
      setMessage("❌ Server error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Add New Seat
        </h2>

        {message && (
          <p className="text-center mb-3 text-sm font-medium">
            {message}
          </p>
        )}

        {/* Seat Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Seat Name
          </label>
          <input
            type="text"
            name="seatname"
            value={formData.seatname}
            onChange={handleChange}
            placeholder="VIP / Regular"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Seat Number */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Seat Number
          </label>
          <input
            type="text"
            name="seatNumber"
            value={formData.seatNumber}
            onChange={handleChange}
            placeholder="A1, B2, C3"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-60"
        >
          {loading ? "Adding..." : "Add Seat"}
        </button>
      </form>
    </div>
  );
};

export default AddSeat;
