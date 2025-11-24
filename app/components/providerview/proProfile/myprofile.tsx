"use client";

import { useEffect, useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Select from "../../mainComponents/noSSRSelect"; // ← أهم تعديل هنا
import countryList from "react-select-country-list";
import { useRouter } from "next/navigation";
import moment from "moment-timezone";
import axiosInstance from "@/lib/axiosInstance";

// Types
interface ProfileFormData {
  fullName: string;
  nickName: string;
  gender: string;
  country: string;
  language: string;
  timeZone: string;
}

type OptionType = {
  value: string;
  label: string;
};

// Validation schema
const schema = yup.object().shape({
  fullName: yup.string().required("Full Name is required"),
  nickName: yup.string().required("Nick Name is required"),
  gender: yup.string().required("Gender is required"),
  country: yup.string().required("Country is required"),
  language: yup.string().required("Language is required"),
  timeZone: yup.string().required("Time Zone is required"),
});

export default function MyProfile() {
  const router = useRouter();

  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: yupResolver(schema),
  });

  const countries = useMemo(() => countryList().getData(), []);
  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ];
  const languageOptions = [
    { value: "en", label: "English" },
    { value: "ar", label: "Arabic" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "es", label: "Spanish" },
  ];

  const timeZones = useMemo(
    () =>
      moment.tz.names().map((tz) => ({
        value: tz,
        label: tz,
      })),
    []
  );

  // Fetch real user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/authentication/current-user");
        const user = res.data?.data;

        setUserName(user?.name || "User");
        setUserEmail(user?.email || "");

        setUserPhoto(
          user?.image ? `/api/media?media=${user.image}` : null
        );

        setValue("fullName", user?.fullName || "");
        setValue("nickName", user?.nickName || "");
        setValue("gender", user?.gender || "");
        setValue("country", user?.country || "");
        setValue("language", user?.language || "");

        const detectedTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setValue("timeZone", user?.timeZone || detectedTZ);
      } catch (err) {
        console.log("FETCH USER ERROR:", err);
      }
    };

    fetchUser();
  }, [setValue]);

  const onSubmit = (data: ProfileFormData) => {
    console.log("Submitted Profile:", data);
    router.push("/providerview/dashBoardHome/pendingApprove");
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gray-100 rounded-xl shadow">
      <h2 className="text-[#0E766E] font-semibold text-xl mb-6">My profile</h2>

      {/* Top section */}
      <div className="flex items-center gap-4 mb-8">
        {userPhoto ? (
          <img
            src={userPhoto}
            alt="User Avatar"
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-2xl">
            👤
          </div>
        )}

        <div>
          <h3 className="font-bold text-lg">{userName}</h3>
          <p className="text-gray-500">{userEmail}</p>
        </div>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6">
        {/* Full Name */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Full Name
          </label>
          <input
            type="text"
            {...register("fullName")}
            className="w-full border rounded-lg px-3 py-2"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm">{errors.fullName.message}</p>
          )}
        </div>

        {/* Nick Name */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Nick Name
          </label>
          <input
            type="text"
            {...register("nickName")}
            className="w-full border rounded-lg px-3 py-2"
          />
          {errors.nickName && (
            <p className="text-red-500 text-sm">{errors.nickName.message}</p>
          )}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Gender</label>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Select
                options={genderOptions}
                value={genderOptions.find((g) => g.value === field.value) || null}
                onChange={(val) => field.onChange((val as OptionType)?.value)}
                placeholder="Select gender"
              />
            )}
          />
        </div>

        {/* Country */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Country</label>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <Select
                options={countries}
                value={countries.find((c) => c.value === field.value) || null}
                onChange={(val) => field.onChange((val as OptionType)?.value)}
                placeholder="Select country"
              />
            )}
          />
        </div>

        {/* Language */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Language</label>
          <Controller
            name="language"
            control={control}
            render={({ field }) => (
              <Select
                options={languageOptions}
                value={
                  languageOptions.find((l) => l.value === field.value) || null
                }
                onChange={(val) => field.onChange((val as OptionType)?.value)}
                placeholder="Select language"
              />
            )}
          />
        </div>

        {/* Timezone */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Time Zone</label>
          <Controller
            name="timeZone"
            control={control}
            render={({ field }) => (
              <Select
                options={timeZones}
                value={timeZones.find((t) => t.value === field.value) || null}
                onChange={(val) => field.onChange((val as OptionType)?.value)}
                placeholder="Select Timezone"
              />
            )}
          />
        </div>

        <div className="col-span-2 flex justify-end">
          <button
            type="submit"
            className="bg-[#0E766E] text-white px-6 py-2 rounded-lg"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}