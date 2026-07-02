import { motion } from 'motion/react'
import { problemCards } from './data'
import { SectionFade } from './components'

export function ProblemSection() {
  return (
    <section className="py-24 md:py-32 bg-nomba-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionFade className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-display text-nomba-text tracking-tight">
            Why Most People <span className="text-nomba-yellow-dark">Struggle</span> to Save
          </h2>
          <p className="mt-4 text-nomba-text-secondary max-w-xl mx-auto">
            Traditional savings methods are broken. Here&apos;s what holds people back.
          </p>
        </SectionFade>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problemCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group p-6 rounded-2xl bg-nomba-bg hover:shadow-card-hover hover:shadow-nomba-yellow/15 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-nomba-yellow-light flex items-center justify-center mb-4 group-hover:bg-nomba-yellow transition-colors">
                <card.icon className="w-6 h-6 text-nomba-yellow-dark" />
              </div>
              <h3 className="font-bold text-nomba-text mb-2">{card.title}</h3>
              <p className="text-sm text-nomba-text-secondary leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
