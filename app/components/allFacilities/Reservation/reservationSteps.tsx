"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaCcVisa, FaCcMastercard } from "react-icons/fa";

export default function ReservationSteps() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setIsLoggedIn(true);
      }, 1500);
    }
  }, []);

  const handleLoginRedirect = () => {
    router.push("/auth/signUp");
  };

  // =======================
  // 🧾 Payment Form State
  // =======================
  const [form, setForm] = useState({
    cardNumber: "",
    expiration: "",
    cvv: "",
    street: "",
    apt: "",
    city: "",
    state: "",
    zip: "",
    country: "Egypt",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // =======================
  // ✅ Validation Function
  // =======================
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!/^\d{16}$/.test(form.cardNumber.replace(/\s/g, "")))
      newErrors.cardNumber = "Please enter a valid 16-digit card number.";

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expiration))
      newErrors.expiration = "Expiration must be in MM/YY format.";

    if (!/^\d{3,4}$/.test(form.cvv))
      newErrors.cvv = "Please enter a valid 3- or 4-digit CVV.";

    if (!form.street.trim()) newErrors.street = "Street address is required.";
    if (!form.city.trim()) newErrors.city = "City is required.";
    if (!form.state.trim()) newErrors.state = "State is required.";
    if (!form.zip.trim()) newErrors.zip = "ZIP code is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // =======================
  // 🧩 Handle Submit
  // =======================
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setSuccessMsg("✅ Payment info saved successfully!");
      setTimeout(() => {
        setSuccessMsg("");
        setShowPaymentModal(false);
      }, 1500);
    } else {
      setSuccessMsg("");
    }
  };

  return (
    <div className="space-y-6">
      {/* العنوان */}
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
        Reservation
      </h1>

      {/* الخطوة 1 */}
      <div className="bg-[#0E766E] text-white rounded-lg p-4 flex justify-between items-center">
        <p>1. You need to log in or sign up first</p>

        {!isLoggedIn && !loading && (
          <button
            onClick={handleLoginRedirect}
            className="bg-white text-[#0E766E] px-4 py-1 rounded-md font-medium"
          >
            Continue
          </button>
        )}

        {loading && <span className="text-sm animate-pulse">Loading...</span>}

        {isLoggedIn && !loading && (
          <span className="text-sm font-medium">
            ✅ You’re logged in successfully
          </span>
        )}
      </div>

      {/* الخطوة 2 */}
      <div className="bg-[#0E766E] text-white rounded-lg p-4 flex justify-between items-center">
        <p>2. Add payment method</p>

        {isLoggedIn && !loading && (
          <button
            onClick={() => setShowPaymentModal(true)}
            className="bg-white text-[#0E766E] px-4 py-1 rounded-md font-medium"
          >
            Continue
          </button>
        )}
      </div>

      {/* الخطوة 3 */}
      <div className="bg-[#0E766E] text-white rounded-lg p-4">
        <p>3. Review your request</p>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex justify-center items-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[80vh] overflow-y-auto p-6 relative shadow-lg">
            {/* زر الإغلاق */}
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              ✕
            </button>

            {/* العنوان */}
            <div className=" items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Add a payment method
              </h2>
              <div className="flex gap-2 text-3xl text-[#0E766E]">
                <FaCcVisa />
                <FaCcMastercard />
              </div>
            </div>

            {/* فورم الدفع */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Card number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card number
                </label>
                <input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  value={form.cardNumber}
                  onChange={(e) =>
                    setForm({ ...form, cardNumber: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#0E766E]"
                />
                {errors.cardNumber && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.cardNumber}
                  </p>
                )}
              </div>

              {/* Expiration + CVV */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiration
                  </label>
                  <input
                    type="text"
                    placeholder="MM / YY"
                    value={form.expiration}
                    onChange={(e) =>
                      setForm({ ...form, expiration: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#0E766E]"
                  />
                  {errors.expiration && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.expiration}
                    </p>
                  )}
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="*"
                    value={form.cvv}
                    onChange={(e) => setForm({ ...form, cvv: e.target.value })}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#0E766E]"
                  />
                  {errors.cvv && (
                    <p className="text-red-600 text-sm mt-1">{errors.cvv}</p>
                  )}
                </div>
              </div>

              <h3 className="font-semibold mt-4 text-gray-800">
                Billing address
              </h3>

              {/* Street address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street address
                </label>
                <input
                  type="text"
                  value={form.street}
                  onChange={(e) =>
                    setForm({ ...form, street: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#0E766E]"
                />
                {errors.street && (
                  <p className="text-red-600 text-sm mt-1">{errors.street}</p>
                )}
              </div>

              {/* Apt or suite */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apt or suite number
                </label>
                <input
                  type="text"
                  value={form.apt}
                  onChange={(e) => setForm({ ...form, apt: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#0E766E]"
                />
              </div>

              {/* City + State */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#0E766E]"
                  />
                  {errors.city && (
                    <p className="text-red-600 text-sm mt-1">{errors.city}</p>
                  )}
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={form.state}
                    onChange={(e) =>
                      setForm({ ...form, state: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#0E766E]"
                  />
                  {errors.state && (
                    <p className="text-red-600 text-sm mt-1">{errors.state}</p>
                  )}
                </div>
              </div>

              {/* ZIP */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP code
                </label>
                <input
                  type="text"
                  value={form.zip}
                  onChange={(e) => setForm({ ...form, zip: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#0E766E]"
                />
                {errors.zip && (
                  <p className="text-red-600 text-sm mt-1">{errors.zip}</p>
                )}
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country/region
                </label>
                <select
                  value={form.country}
                  onChange={(e) =>
                    setForm({ ...form, country: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#0E766E]"
                >
                  <option>Egypt</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                </select>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full mt-4 bg-[#0E766E] text-white py-2 rounded-md font-medium hover:bg-[#095F59]"
              >
                Next
              </button>

              {successMsg && (
                <p className="text-green-600 text-center mt-3">{successMsg}</p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}