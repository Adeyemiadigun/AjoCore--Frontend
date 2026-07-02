import { motion } from 'motion/react'
import { steps } from './data'
import { SectionFade } from './components'

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="py-24 md:py-32 bg-gradient-to-b from-nomba-surface to-nomba-yellow-light/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionFade className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-display text-nomba-text tracking-tight">
            Your Savings Journey
          </h2>
          <p className="mt-4 text-nomba-text-secondary max-w-xl mx-auto">
            From signup to payout in four simple steps.
          </p>
        </SectionFade>

        <div className="relative">
          <div className="hidden lg:block absolute top-8 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-nomba-yellow-light via-nomba-yellow to-nomba-yellow-light" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-nomba-yellow to-nomba-yellow-dark flex items-center justify-center shadow-card-hover shadow-nomba-yellow/30">
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                </div>
                <h3 className="font-bold text-nomba-text text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-nomba-text-secondary leading-relaxed max-w-xs">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
