import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { OperationalSide } from "@/components/sections/OperationalSide";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <OperationalSide />
      </main>
    </>
  );
}
