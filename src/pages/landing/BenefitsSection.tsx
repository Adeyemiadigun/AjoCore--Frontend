import { motion } from 'motion/react'
import { benefits } from './data'
import { SectionFade } from './components'

export function BenefitsSection() {
  return (
    <section id="benefits" className="py-24 md:py-32 bg-nomba-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionFade className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-nomba-yellow-light/40 bg-nomba-yellow-light/20 px-4 py-1.5 text-xs font-semibold text-nomba-yellow-dark mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-nomba-yellow" />
            Why AjoCore
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-display text-nomba-text tracking-tight">
            Everything You Need to Save Smarter
          </h2>
          <p className="mt-4 text-nomba-text-secondary max-w-xl mx-auto">
            Built for modern Nigerians who want their savings to work.
          </p>
        </SectionFade>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, i) => {
            const layouts = [
              'p-6 rounded-2xl hover:shadow-card-hover transition-all bg-gradient-to-br from-nomba-surface to-nomba-yellow-light/5',
              'p-6 rounded-2xl hover:shadow-card-hover transition-all bg-nomba-surface border border-nomba-border/50',
              'p-6 rounded-2xl hover:shadow-card-hover transition-all bg-nomba-surface relative overflow-hidden',
            ]
            const isWide = i === 0 || i === 3
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className={layouts[i % layouts.length]}
              >
                {i === 2 && (
                  <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-nomba-yellow/5" />
                )}
                <div className="w-11 h-11 rounded-xl bg-nomba-yellow-light flex items-center justify-center mb-4 group-hover:bg-nomba-yellow transition-colors">
                  <benefit.icon className="w-5.5 h-5.5 text-nomba-yellow-dark" />
                </div>
                <h3 className="font-bold text-nomba-text mb-2">{benefit.title}</h3>
                <p className="text-sm text-nomba-text-secondary leading-relaxed">{benefit.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
