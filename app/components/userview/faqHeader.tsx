"use client";

interface FaqHeaderProps {
  title: string;
  subtitle: string;
}

export default function FaqHeader({ title, subtitle }: FaqHeaderProps) {
  return (
    <div className="bg-[#0E766E] text-white text-center py-12 rounded-b-[3rem]">
      <p className="text-sm uppercase tracking-widest text-gray-200">FAQ</p>
      <h1 className="text-3xl sm:text-4xl font-bold mt-2">{title}</h1>
      <p className="text-sm sm:text-base text-gray-100 mt-2">{subtitle}</p>
    </div>
  );
}