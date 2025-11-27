import Image from "next/image";
import Image1 from "@/app/assets/images/image-1.jpg";

const HeroSection = () => {
  return (
    <section className="h-dvh ">
      <Image src={Image1} alt="Hero Image" className="w-full h-full" />
    </section>
  );
};

export default HeroSection;
