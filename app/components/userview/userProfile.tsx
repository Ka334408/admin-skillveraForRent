"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/app/store/userStore";

export default function ProfilePage() {
  const t = useTranslations("userprofile");
  const router = useRouter();
  const { user, token, isHydrated } = useUserStore();

  const [username, setUsername] = useState("User");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [location, setLocation] = useState("");
  const [errors, setErrors] = useState<{ phone?: string; dob?: string }>({});
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({
    open: false,
    title: "",
    message: ""
  });

  // -----------------------------
  //  FIXED useEffect
  // -----------------------------
  useEffect(() => {
    if (!isHydrated || !user) return;

    setUsername(user.name || "User");
    setPhone(user.phone || "");
    setDob(user.dob || "");
    setGender(user.gender || "");

    if (user.image) {
      if (user.image.startsWith("uploads/")) {
        setProfileImg(`/api/media?media=${user.image}`);
      } else {
        setProfileImg(user.image);
      }
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const long = pos.coords.longitude;
        setLocation(`${lat},${long}`);
      },
      (err) => console.error(err)
    );
  }, [isHydrated, user]);

  // -----------------------------
  // Loading screens
  // -----------------------------
  if (!isHydrated) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-black animate-bounce">
          Skillvera
        </h1>
      </div>
    );
  }

  if (!user) {
    return (
      <section className="flex items-center justify-center min-h-screen">
        <h1 className="text-xl font-semibold text-red-500">
          No user loaded ❌
        </h1>
      </section>
    );
  }


  const validate = () => {
    const errs: { phone?: string; dob?: string } = {};
    const phoneRegex = /^\+\d{10,15}$/;
    if (!phoneRegex.test(phone)) errs.phone = "Invalid phone number";
    if (!dob) errs.dob = "Date of birth is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true); // ✅ يبدأ اللودينج

    try {
      const formData = new FormData();
      formData.append("name", username);
      formData.append("email", user?.email || "");
      formData.append("dob", dob);
      formData.append("gender", gender);
      formData.append("phone", phone);
      formData.append("addressLatLong", location);

      if (profileImg) {
        if (!profileImg.startsWith("/api/media")) {
          const res = await fetch(profileImg);
          const blob = await res.blob();
          formData.append("image", blob, "profile.png");
        }
      }

      formData.append(
        "facility",
        JSON.stringify({
          name: "string",
          addressLatLong: location,
          taxNumber: "string",
          email: "string",
          website: "string",
          phone: "+20 1159675941",
          image: "string",
        })
      );

      const response = await fetch(`/api/user/update-profile`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setModal({
          open: true,
          title: "Error ❌",
          message: errorData.message || "Failed to update profile"
        });
        return;
      }

      const result = await response.json();

      setModal({
        open: true,
        title: "Success 🎉",
        message: "Profile updated successfully!"
      });
    } catch (err) {
      setModal({
        open: true,
        title: "Error ❌",
        message: "Failed to update profile"
      });
    } finally {
      setLoading(false); // ✅ يوقف اللودينج
    }
  };


  return (
    <div>
      {/* Modal */}
      {
        modal.open && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white w-80 p-6 rounded-xl shadow-xl text-center">
              <h2 className="text-xl font-bold mb-3 text-[#0E766E]">
                {modal.title}
              </h2>
              <p className="text-gray-600 mb-4">{modal.message}</p>

              <button
                onClick={() => {
                  setModal({ open: false, title: "", message: "" });
                  if (modal.title.includes("Success")){
                  router.push("/userview/Home");}
                }
                }
                className="bg-[#0E766E] text-white px-6 py-2 rounded-lg hover:bg-[#06423d]"
              >
                {modal.title.includes("Error")&&(<>Try Again</>)}
                {modal.title.includes("Success")&&(<>Let&apos; go</>)}
                
              </button>
            </div>
          </div>
        )
      }

      <section className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-md p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8">
          {/* الكارت الأزرق */}
          <div className="bg-[#0E766E] text-white rounded-xl p-4 w-full md:w-48 flex flex-col items-center justify-center gap-2 self-start">
            <div className="w-20 h-20 rounded-full border-2 border-white flex items-center justify-center overflow-hidden bg-white">
              {profileImg ? (
                <img
                  src={profileImg}
                  alt="Profile"
                  className="w-full h-full object-cover object-[50%_25%]"
                />
              ) : (
                <span className="text-2xl">👤</span>
              )}
            </div>
            <h3 className="text-sm font-semibold text-center mt-2">{username}</h3>
          </div>

          {/* الفورم */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">{t("title")}</h2>
            <p className="text-gray-500 text-sm mb-6">{t("desc")}</p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold mb-1">
                  {t("fullName")}
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full border-2 text-black rounded-lg p-3 focus:outline-none focus:text-black"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold mb-1">
                  {t("phone")}
                </label>
                <PhoneInput
                  country={"eg"}
                  value={phone}
                  onChange={(value) => setPhone("+" + value)}
                  inputProps={{ name: "phone", required: true }}
                  containerClass="w-full"
                  inputClass="!w-full !rounded-lg !p-3 !pl-12 !border-2 !text-black !focus:outline-none !focus:text-black"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              {/* DOB */}
              <div>
                <label className="block text-sm font-semibold mb-1">
                  {t("dob")}
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full border-2 text-black rounded-lg p-3 focus:outline-none focus:text-black"
                />
                {errors.dob && (
                  <p className="text-red-500 text-sm mt-1">{errors.dob}</p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-semibold mb-1">
                  {t("gender")}
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full border-2 text-black rounded-lg p-3 focus:outline-none focus:text-black"
                >
                  <option value="">Select gender</option>
                  <option value="male">{t("genderMale")}</option>
                  <option value="female">{t("genderFemale")}</option>
                  <option value="other">{t("genderOther")}</option>
                </select>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading} // ✅ يمنع الضغط وقت اللودينج
                  className={`px-6 py-2 rounded-lg text-white transition ${loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#0E766E] hover:bg-[#033b37]"
                    }`}
                >
                  {loading ? "Uploading..." : t("save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}