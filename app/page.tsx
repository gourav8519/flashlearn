import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { LiveDemo } from '@/components/landing/LiveDemo';
import { FeaturesBento } from '@/components/landing/FeaturesBento';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { UseCases } from '@/components/landing/UseCases';
import { Science } from '@/components/landing/Science';
import { FAQ } from '@/components/landing/FAQ';
import { FinalCTA } from '@/components/landing/FinalCTA';
import { Footer } from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="relative bg-white min-h-screen overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <LiveDemo />
        <FeaturesBento />
        <HowItWorks />
        <UseCases />
        <Science />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
