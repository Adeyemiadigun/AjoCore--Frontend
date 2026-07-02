import { motion } from 'motion/react'
import { stats } from './data'
import { AnimatedCounter, SectionFade } from './components'

export function StatsBar() {
  return (
    <section className="relative -mt-16 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionFade>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-nomba-border/60 rounded-2xl overflow-hidden shadow-card-hover shadow-nomba-yellow/10">
          {stats.map((stat, i) => (
            <div key={i} className="bg-nomba-surface py-8 px-6 text-center">
              <p className="text-3xl md:text-4xl font-bold text-nomba-text">
                <AnimatedCounter stat={stat} />
              </p>
              <p className="text-sm text-nomba-text-secondary mt-1.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </SectionFade>
    </section>
  )
}
