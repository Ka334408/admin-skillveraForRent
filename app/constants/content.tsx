import { Compass, Cpu, Wrench, Rocket } from "lucide-react";
export const features = [
    { key: "planning", icon: Compass, side: "left", top: "top-[15%]" },
    { key: "prototype", icon: Cpu, side: "left", top: "bottom-[15%]" },
    { key: "refinement", icon: Wrench, side: "right", top: "top-[15%]" },
    { key: "scale", icon: Rocket, side: "right", top: "bottom-[15%]" },
];

export const faqs = [
    {
        question: "How Many Steps To Get A Rent Done?",
        answer:
            "Et lectus viverra aenean malesuada praesent. Egestas praesent quam auctor amet ac, ac vel. Euismod proin massa feugiat gravida tellus auctor ac, vitae justo.",
    },
    {
        question: "Do We Get Electronic Invoice?",
        answer:
            "Yes, you will receive an electronic invoice immediately after completing the rent process.",
    },
    {
        question: "Can We Reschedule The Rent Date?",
        answer:
            "Yes, you can reschedule your rent date by contacting our support team in advance.",
    },
    {
        question: "Can We Rent More Than One Facility?",
        answer:
            "Of course, you can rent multiple facilities at the same time depending on availability.",
    },
    {
        question: "What Do We Need To Rent A Facility?",
        answer:
            "You only need valid identification and payment details to rent a facility.",
    },
];

export const logos = [
  "/logo1.png",
  "/logo2.png",
  "/logo3.png",
  "/logo4.png",
  "/logo5.png",
];

const categoryImages: Record<
  string,
  { name: string; description: string; src: string , price : number}
> = {
  FootBall: {
    name: "Football Pitch",
    description:
      "Five-a-side Football Pitch Enjoy premium football pitches equipped with artificial turf, lights, and comfortable seating areas for spectators and price includes tax .",
    src: "/stadium.jpg",
    price: 400,
  },
  Education: {
    name: "Modern Educational ",
    description:
      "A fully equipped learning space designed for workshops, lectures, and educational activities and price includes tax.",
    src: "/hotal.jpg",
    price: 800,
  },
  HandBall: {
    name: "Hand ball court",
    description:
      "Experience top-tier fitness and relaxation facilities including a gym, spa, and swimming pool and price includs tax.",
    src: "/school.jpg",
    price: 400,
  },
};

export const facilitiesData = Array.from({ length: 100 }, (_, i) => {
  const category =
    i % 3 === 0 ? "FootBall" : i % 3 === 1 ? "Education" : "HandBall";
  const cat = categoryImages[category];

  return {
    id: i + 1,
    name: cat.name,
    description: cat.description,
    location: i % 2 === 0 ? "Riyadh" : "Jeddah",
    price: cat.price,
    category,
    image: cat.src,
    lat: 24.7136 + i * 0.01,
    lng: 46.6753 + i * 0.01,
  };
});