import { Navbar } from '@/components/navbar';
import { Hero } from '@/components/sections/hero';
import { Discover } from '@/components/sections/discover';
import { Services } from '@/components/sections/services';
import { Roadtrip } from '@/components/sections/roadtrip';
import { Artists } from '@/components/sections/artists';
import { Portfolio } from '@/components/sections/portfolio';
import { Contest } from '@/components/sections/contest';
import { Newsletter } from '@/components/sections/newsletter';
import { Testimonials } from '@/components/sections/testimonials';
import { FAQ } from '@/components/sections/faq';
import { Contact } from '@/components/sections/contact';
import { Footer } from '@/components/sections/footer';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#050505]">
      <Navbar />
      <Hero />
      <Discover />
      <Roadtrip />
      <Services />
      <Artists />
      <Portfolio />
      <Contest />
      <Newsletter />
      <Testimonials />
      <FAQ />
      <Contact />
      <Footer />
    </main>
  );
}
