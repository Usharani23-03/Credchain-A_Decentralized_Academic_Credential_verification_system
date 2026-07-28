import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import About from "@/components/landing/About";
import Contact from "@/components/landing/Contact";

export default function Home() {
  return (
    <main className="bg-slate-950 text-white scroll-smooth">
      <Navbar />
      <Hero />
      <About />
      <Contact />
    </main>
  );
}