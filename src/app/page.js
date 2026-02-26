import About from "@/components/About";
import Appointment from "@/components/Appointment";
import HomeBanner from "@/components/HomeBanner";
import HospitalStats from "@/components/HospitalStats";
import Newsletter from "@/components/Newsletter";
import OurCommunity from "@/components/OurCommunity";
import Review from "@/components/Review";
import Services from "@/components/Services";
import Updates from "@/components/Updates";

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
      <OurCommunity />
      <Newsletter />
    </div>
  );
}
