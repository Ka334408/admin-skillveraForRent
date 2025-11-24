"use client";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";


// dynamic imports 
const MapContainer = dynamic(
    () => import("react-leaflet").then((mod) => mod.MapContainer),
    { ssr: false }
);
const TileLayer = dynamic(
    () => import("react-leaflet").then((mod) => mod.TileLayer),
    { ssr: false }
);
const Marker = dynamic(
    () => import("react-leaflet").then((mod) => mod.Marker),
    { ssr: false }
);
const Popup = dynamic(
    () => import("react-leaflet").then((mod) => mod.Popup),
    { ssr: false }
);

export default function LiveMap() {
    const t = useTranslations("map");
    const [places, setPlaces] = useState<any[]>([]);
    const [userLocation, setUserLocation] = useState<[number, number]>([
        30.0444, 31.2357, // Default Cairo
    ]);
    const [icons, setIcons] = useState<{ user: any; place: any } | null>(null);

    useEffect(() => {
        import("leaflet").then((L) => {
            setIcons({
                user: new L.Icon({
                    iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149059.png", // diffirent icon for me
                    iconSize: [38, 38],
                    iconAnchor: [19, 38],
                }),
                place: new L.Icon({
                    iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png", // icon for nearest facility
                    iconSize: [38, 38],
                    iconAnchor: [19, 38],
                }),
            });
        });
    }, []);

    useEffect(() => {
        const cities = ["cairo", "alexandria", "giza", "mansoura", "luxor"];

        Promise.all(
            cities.map((city) =>
                fetch(
                    `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
                ).then((res) => res.json())
            )
        ).then((data) => {
            const results = data
                .map((d) => d.results?.[0])
                .filter(Boolean)
                .map((city: any) => ({
                    id: city.id,
                    name: city.name,
                    lat: city.latitude,
                    lng: city.longitude,
                }));

            setPlaces(results);
        });
    }, []);

    // Get user geolocation
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) =>
                    setUserLocation([pos.coords.latitude, pos.coords.longitude]),
                () => console.warn("Geolocation permission denied")
            );
        }
    }, []);

    if (!icons) return <p>Loading map...</p>;

    return (
        <div className="bg-[#f3f4f4]">
        <section className="px-6 py-12 max-w-7xl mx-auto text-center overflow-hidden ">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-black dark:text-white" data-aos="fade-up" data-aos-duration="2000">
                {t("title")}
            </h2>
            <p className="text-gray-600 mb-6  dark:text-gray-200" data-aos="fade-up" data-aos-duration="2000">
                {t("subtitle")}
            </p>

            <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg " data-aos="fade-up" data-aos-duration="2000">
                <MapContainer
                    center={userLocation}
                    zoom={6}
                    scrollWheelZoom={false}
                    className="h-full w-full"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* User Location */}
                    <Marker position={userLocation} icon={icons.user}>
                        <Popup>You are here!</Popup>
                    </Marker>

                    {/* Cities */}
                    {places.map((p) => (
                        <Marker key={p.id} position={[p.lat, p.lng]} icon={icons.place}>
                            <Popup>
                                <div className="text-center">
                                    <p className="font-semibold">{p.name}</p>
                                    <Link
                                        href={"/card/${p.id}"}
                                        className="text-[#0E766E] underline text-sm"
                                    >
                                        More details
                                    </Link>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </section>
        </div>
    );
}