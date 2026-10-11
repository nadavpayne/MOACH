import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { DataOwnership } from "@/components/sections/DataOwnership";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Problem } from "@/components/sections/Problem";
import { Process } from "@/components/sections/Process";
import { Requirements } from "@/components/sections/Requirements";
import { Roadmap } from "@/components/sections/Roadmap";
import { Sources } from "@/components/sections/Sources";

// הסדר לפי סעיף 4 בבריף.
export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <Sources />
        <Process />
        <DataOwnership />
        <Roadmap />
        <Requirements />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
