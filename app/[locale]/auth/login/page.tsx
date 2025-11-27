"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginSignupFlip() {
  const [isFlipped, setIsFlipped] = useState(false);
  const router = useRouter();

  const handleLogin = (e:any) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    // simple login logic
    if (email === "admin@gmail.com"  && password === "Admin@1234") {
      router.push("/admin/dashBoard");
      localStorage.setItem("email",email);
      localStorage.setItem("name","admin");
    } else if (email === "moderator@gmail.com" && password === "Moderator@1234") {
      router.push("/moderator/dashBoard");
      localStorage.setItem("email",email);
      localStorage.setItem("name","moderator");
    } else {
      alert("Invalid email or not authorized");
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl h-[460px]">
        <div
          className={`absolute inset-0 transition-transform duration-700 transform ${
            isFlipped ? "rotate-y-180" : ""
          }`}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* LOGIN CARD */}
          <div
            className="absolute inset-0 bg-white rounded-3xl shadow-md flex items-center justify-center backface-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            <form
              onSubmit={handleLogin}
              className="w-full max-w-md flex flex-col items-center gap-5 p-10"
            >
              <input
                type="text"
                name="email"
                placeholder="Mobile number or Email"
                className="w-full border border-[#0E766E] text-black p-3 rounded-full outline-none"
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full border border-[#0E766E] text-black p-3 rounded-full outline-none"
              />

              <p
                onClick={() => setIsFlipped(true)}
                className="w-full text-right text-sm text-gray-600 cursor-pointer hover:text-black"
              >
                Sign up?
              </p>

              <p className="text-gray-600 text-center text-sm cursor-pointer hover:text-black">
                Reset password
              </p>

              <button
                type="submit"
                className="bg-[#0E766E] text-white w-40 py-3 rounded-full shadow-md hover:bg-[#07534e] transition mt-6"
              >
                LOG IN
              </button>
            </form>
          </div>

          {/* SIGNUP CARD */}
          <div
            className="absolute inset-0 bg-white rounded-3xl shadow-md flex items-center justify-center rotate-y-180 backface-hidden"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <form className="w-full max-w-md flex flex-col items-center gap-5 p-10">
              <input
                type="text"
                placeholder="Full name"
                className="w-full border border-[#0E766E] text-black p-3 rounded-full outline-none"
              />

              <input
                type="text"
                placeholder="Mobile number"
                className="w-full border border-[#0E766E] text-black p-3 rounded-full outline-none"
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full border border-[#0E766E] text-black p-3 rounded-full outline-none"
              />

              <p
                onClick={() => setIsFlipped(false)}
                className="w-full text-right text-sm text-gray-600 cursor-pointer hover:text-black"
              >
                Log in?
              </p>

              <button
                type="submit"
                className="bg-[#0E766E] text-white w-40 py-3 rounded-full shadow-md hover:bg-[#07534e] transition"
              >
                SIGN UP
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}