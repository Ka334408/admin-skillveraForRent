"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import {
    Loader2, ChevronLeft, Star, Calendar,
    Info, Image as ImageIcon, Clock, Tag,
    CreditCard, User, MessageCircle, Languages,
    LayoutDashboard, ShieldCheck, MapPin
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import moment from "moment";
import 'moment/locale/ar';

export default function FacilityDetailsPage() {
    const { id } = useParams();
    const router = useRouter();

    // تفعيل الترجمة باستخدام next-intl
    const t = useTranslations("FacilityDetails");
    const locale = useLocale();
    const isRTL = locale === "ar";

    moment.locale(locale);

    const [facility, setFacility] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const { data } = await axiosInstance.get(`/guest-facility/${id}`);
                setFacility(data?.data);
            } catch (error) {
                console.error("Error fetching facility details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    // دالة مساعدة لعرض النصوص المترجمة القادمة من السيرفر كـ Object
    const renderServerText = (field: any, targetLang: string) => {
        if (!field) return "—";
        if (typeof field === 'string') return field;
        return field[targetLang] || field['en'] || "—";
    };

    if (loading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-white">
                <div className="relative">
                    <Loader2 className="w-16 h-16 animate-spin text-[#0E766E]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-orange-500 rounded-full" />
                    </div>
                </div>
                <p className="mt-4 text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">
                    {t("fetching")}
                </p>
            </div>
        );
    }

    if (!facility) return <div className="p-20 text-center font-black">{t("notFound")}</div>;

    return (
        <div className={`min-h-screen bg-[#F4F7F6] pb-20 ${isRTL ? 'font-cairo' : ''}`} dir={isRTL ? "rtl" : "ltr"}>

            {/* Top Navigation Bar */}
            <div className=" top-0 z-0 bg-white/80 backdrop-blur-xl border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
                    <button onClick={() => router.back()} className="flex items-center gap-2 font-black text-slate-900 group">
                        <ChevronLeft className={`transition-transform group-hover:-translate-x-1 ${isRTL ? 'rotate-180' : ''}`} />
                        <span>{t("back")}</span>
                    </button>

                    <div className="flex items-center gap-4 z-0">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{t("status")}</span>
                            <span className={`mt-1 text-xs font-black uppercase px-3 py-1 rounded-full ${facility.status === 'APPROVED'
                                    ? 'text-emerald-600 bg-emerald-50 border border-emerald-100'
                                    : facility.status === 'PENDING'
                                        ? 'text-amber-600 bg-amber-50 border border-amber-100'
                                        : 'text-slate-500 bg-slate-50'
                                }`}>
                                {facility.status}
                            </span>
                        </div>
                        <div className="h-8 w-[1px] bg-slate-200 hidden md:block" />
                        <span className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-black">ID: #{facility.id}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
                <div className="grid grid-cols-12 gap-6 md:gap-8">

                    {/* Main Content Area */}
                    <div className="col-span-12 lg:col-span-8 space-y-8">

                        {/* Hero Section */}
                        <div className="relative group overflow-hidden rounded-[2.5rem] bg-slate-900 h-[300px] sm:h-[380px] md:h-[450px] shadow-2xl">
                            <img
                                src={`/api/media?media=${facility.cover}`}
                                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                                alt="cover"
                                loading="eager"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                            <div className="absolute bottom-6 left-4 right-4 md:bottom-10 md:left-10 md:right-10">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="bg-orange-500 text-white px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter">
                                        {renderServerText(facility.category?.name, locale)}
                                    </span>
                                </div>
                                <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-white mb-4 tracking-tighter">
                                    {renderServerText(facility.name, locale)}
                                </h1>
                                <div className="flex items-center gap-6 text-white/70">
                                    <div className="flex items-center gap-2"><Star size={18} className="text-orange-500 fill-orange-500" /> <span className="font-black">{facility.rate}</span></div>
                                    <div className="flex items-center gap-2"><MapPin size={18} /> <span className="text-xs font-bold">{facility.address || t("locationPending")}</span></div>
                                </div>
                            </div>
                        </div>

                        {/* Dual Language Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Arabic Card */}
                            <div className="bg-white p-6 sm:p-8 rounded-[2rem] border-t-4 border-[#0E766E] shadow-sm">
                                <div className="flex items-center gap-2 mb-6 opacity-40 uppercase tracking-[0.2em] font-black text-[10px]">
                                    <Languages size={14} /> <span>{t("arabicContent")}</span>
                                </div>
                                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-4" dir="rtl">{renderServerText(facility.name, 'ar')}</h2>
                                <p className="text-slate-500 leading-relaxed text-sm sm:text-base font-medium" dir="rtl">
                                    {renderServerText(facility.description, 'ar')}
                                </p>
                            </div>

                            {/* English Card */}
                            <div className="bg-white p-6 sm:p-8 rounded-[2rem] border-t-4 border-orange-500 shadow-sm">
                                <div className="flex items-center gap-2 mb-6 opacity-40 uppercase tracking-[0.2em] font-black text-[10px]">
                                    <Languages size={14} /> <span>{t("englishContent")}</span>
                                </div>
                                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-4" dir="ltr">{renderServerText(facility.name, 'en')}</h2>
                                <p className="text-slate-500 leading-relaxed text-sm sm:text-base font-medium" dir="ltr">
                                    {renderServerText(facility.description, 'en')}
                                </p>
                            </div>
                        </div>

                        {/* Gallery */}
                        <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] shadow-sm">
                            <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                                <ImageIcon size={24} className="text-[#0E766E]" />
                                {t("gallery")}
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {facility.images?.map((img: string, i: number) => (
                                    <div key={i} className="rounded-2xl overflow-hidden border border-slate-100 hover:ring-2 ring-[#0E766E] transition-all cursor-zoom-in group relative h-40">
                                        <img loading="eager" src={`/api/media?media=${img}`} alt="gallery" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Reviews */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-black flex items-center gap-3">
                                <MessageCircle size={24} className="text-[#0E766E]" />
                                {t("reviews")}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {facility.rates?.map((review: any) => (
                                    <div key={review.id} className="bg-white p-4 sm:p-6 rounded-[1.5rem] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                                        <div>
                                            <div className="flex items-center gap-3 mb-4">
                                                <img loading="eager" src={`/api/media?media=${review.user.image}`} className="w-10 h-10 rounded-full object-cover border border-slate-100" />
                                                <div>
                                                    <h4 className="font-black text-slate-900 text-xs">{review.user.name}</h4>
                                                    <p className="text-[10px] text-slate-400 font-bold">{moment(review.createdAt).fromNow()}</p>
                                                </div>
                                            </div>
                                            <p className="text-slate-600 text-sm sm:text-base italic font-medium leading-relaxed">&ldquo;{review.comment}&ldquo;</p>
                                        </div>
                                        <div className="flex gap-1 mt-4">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={12} fill={i < review.rate ? "#f59e0b" : "none"} className={i < review.rate ? "text-orange-500" : "text-slate-100"} />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="col-span-12 lg:col-span-4 space-y-8">

                        {/* Pricing Card */}
                        <div className="bg-slate-900 rounded-[2.5rem] p-6 sm:p-10 text-white relative overflow-hidden shadow-2xl shadow-slate-900/20">
                            <div className={`absolute top-0 ${isRTL ? 'left-0' : 'right-0'} p-8 opacity-10`}>
                                <CreditCard size={120} />
                            </div>

                            <p className={`text-[10px] font-black uppercase tracking-[0.4em] text-orange-500 mb-2 text-start`}>
                                {t("pricing")}
                            </p>

                            <div className={`flex items-baseline gap-2 mb-8 ${isRTL ? 'flex-row-reverse justify-end' : 'flex-row'}`}>
                                <span className="text-4xl font-black tracking-tighter tabular-nums">
                                    {facility.price}
                                </span>
                                <span className="text-sm font-bold opacity-50 uppercase">
                                    {t("perDay")}
                                </span>
                            </div>

                            <div className="space-y-4 relative z-10">
                                <div className="flex justify-between items-center text-sm py-3 border-b border-white/10">
                                    <span className="opacity-60 font-medium">
                                        {t("category")}
                                    </span>
                                    <span className="font-black text-end">
                                        {renderServerText(facility.category?.name, locale)}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center text-sm py-3 border-b border-white/10">
                                    <span className="opacity-60 font-medium">
                                        {t("agePolicy")}
                                    </span>
                                    <span className={`font-black text-end flex gap-1 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <span>{facility.ageMin || 0} - {facility.ageMax || "+"}</span>
                                        <span>{t("years")}</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Records Card */}
                        <div className="bg-white rounded-[2.5rem] p-4 sm:p-8 shadow-sm border border-slate-100">
                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                                <LayoutDashboard size={14} /> {t("systemRecords")}
                            </h4>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="p-3 bg-slate-50 rounded-xl"><Clock size={18} className="text-slate-400" /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase">{t("registered")}</p>
                                        <p className="text-sm font-black text-slate-900">{moment(facility.createdAt).format('LL')}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="p-3 bg-slate-50 rounded-xl"><ShieldCheck size={18} className="text-slate-400" /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase">{t("activeStatus")}</p>
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded ${facility.isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                            {facility.isActive ? t("online") : t("offline")}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Info Summary */}
                        <div className="bg-[#0E766E] rounded-[2.5rem] p-1 shadow-xl shadow-teal-900/10">
                            <div className="bg-white/10 backdrop-blur-md rounded-[2.3rem] p-4 sm:p-8 text-white">
                                <p className="text-sm sm:text-base font-bold leading-relaxed opacity-90">
                                    {t("summary")}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}