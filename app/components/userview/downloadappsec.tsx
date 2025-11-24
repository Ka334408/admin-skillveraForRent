"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import qr from "../../../public/qr-code.png";
import googleIcon from "../../../public/google-play.png";
import appStoreIcon from "../../../public/app-store.png";
export default function DownloadSection() {
    const t = useTranslations("download");

    return (
        <section className="py-20 bg-[#f3f4f4] text-center dark:bg-[#0a0a0a] ">
            {/* Title */}
            <h2 className="text-xl md:text-2xl font-semibold max-w-2xl mx-auto mb-12 px-4 " data-aos="fade-up" data-aos-duration="3000">
                {t("title")} <span className="text-[#0E766E]">{t("appName")}</span>
            </h2>

            {/* Content */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-12">
                {/* App Icon */}
                {/* QR / Footer */}
                <div className="mt-16 flex flex-col items-center gap-4" data-aos="fade-up" data-aos-duration="3000">
                    <Image
                        src={qr}
                        alt="QR Code"
                        width={120}
                        height={120}
                        className="border border-gray-300 rounded-lg h-auto w-auto"
                    />
                    <p className="text-sm text-gray-700" data-aos="fade-up" data-aos-duration="3000">{t("scanNow")}</p>
                </div>

                {/* Download buttons */}
                <div className="flex flex-col items-start gap-6" data-aos="fade-up" data-aos-duration="3000">
                    <p className="text-lg font-medium">{t("downloadApp")}</p>

                    <a
                        href="#"
                        className="flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 transition"
                    >
                        <Image
                            src={googleIcon}
                            alt="Google Play"
                            width={28}
                            height={28}
                            data-aos="fade-up" data-aos-duration="3000"
                        />
                        <span className="text-sm font-medium" data-aos="fade-up" data-aos-duration="3000">
                            {t("googlePlay")}
                        </span>
                    </a>

                    <a
                        href="#"
                        className="flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 transition"
                    >
                        <Image
                            src={appStoreIcon}
                            alt="App Store"
                            width={28}
                            height={28}
                            data-aos="fade-up" data-aos-duration="2000"
                        />
                        <span className="text-sm font-medium" data-aos="fade-up" data-aos-duration="3000">
                            {t("appStore")}
                        </span>
                    </a>
                </div>
            </div>

            {/* QR / Footer */}
            <p className="mt-16 text-sm text-gray-700">{t("scanNow")}</p>
        </section>
    );
}