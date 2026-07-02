import { NavBar } from './NavBar'
import { HeroSection } from './HeroSection'
import { TrustStrip } from './TrustStrip'
import { MetricsBar } from './MetricsBar'
import { ProblemSection } from './ProblemSection'
import { HowItWorksSection } from './HowItWorksSection'
import { BenefitsSection } from './BenefitsSection'
import { DualCTASection } from './DualCTASection'
import { TestimonialsSection } from './TestimonialsSection'
import { FAQSection } from './FAQSection'
import { FinalCTASection } from './FinalCTASection'
import { Footer } from './Footer'

export default function LandingPage() {
  return (
    <>
      <NavBar />
      <main>
        <HeroSection />
        <TrustStrip />
        <MetricsBar />
        <ProblemSection />
        <HowItWorksSection />
        <BenefitsSection />
        <DualCTASection />
        <TestimonialsSection />
        <FAQSection />
        <FinalCTASection />
      </main>
      <Footer />
    </>
  )
}
