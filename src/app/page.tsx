import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { OperationalSide } from "@/components/sections/OperationalSide";
import { Vision } from "@/components/sections/Vision";
import { Integrations } from "@/components/sections/Integrations";
import { BuiltForIsrael } from "@/components/sections/BuiltForIsrael";
import { BookDemo } from "@/components/sections/BookDemo";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <OperationalSide />
        <Vision />
        <Integrations />
        <BuiltForIsrael />
        <BookDemo />
      </main>
    </>
  );
}
