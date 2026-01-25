import Image from "next/image";
import HomeBanner from "./components/HomeBanner";
import Updates from "./components/Updates";
import About from "@/components/About";
import HospitalStats from "@/components/HospitalStats";
import Services from "@/components/Services";
import Appointment from "./components/Appointment";
import SeeAll from "@/components/SeeAll";
import Community from "@/components/Community";
import Review from "@/components/Review";

export default function Home() {
  return (
    <div>
      <HomeBanner />
      <Updates />
      <About />
      <Appointment />
      <Services />
      <HospitalStats />
      <Review />
      <Community />
      <SeeAll />
    </div>
  );
}
