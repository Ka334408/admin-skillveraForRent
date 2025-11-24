import Image from "next/image";

export function CardImage() {
  return (
    <Image
      src="/herosec.png"
      alt="card"
      width={300}
      height={200}
      className="rounded-xl border-2 border-transparent hover:border-[#0E766E] hover:scale-105 transition"
    />
  );
}