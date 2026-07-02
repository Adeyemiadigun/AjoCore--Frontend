import { faqs } from './data'
import { SectionFade, AnimatedAccordion } from './components'

export function FAQSection() {
  return (
    <section
      id="faq"
      className="py-24 md:py-32 bg-gradient-to-b from-nomba-surface to-nomba-yellow-light/10"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionFade className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold font-display text-nomba-text tracking-tight">
            Got Questions?{' '}
            <span className="text-nomba-text-secondary text-2xl md:text-4xl">FAQ</span>
          </h2>
          <p className="mt-4 text-nomba-text-secondary">
            Everything you need to know about AjoCore.
          </p>
        </SectionFade>
        <AnimatedAccordion items={faqs} />
      </div>
    </section>
  )
}
