import { motion } from 'motion/react'
import { Quotes, Star } from '@phosphor-icons/react'
import { testimonialData } from './data'
import { SectionFade } from './components'

function TestimonialCard({ testimonial }: { testimonial: (typeof testimonialData)[0] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative bg-nomba-surface rounded-3xl p-8 md:p-10 shadow-card-hover shadow-nomba-yellow/10"
    >
      <Quotes className="w-10 h-10 text-nomba-yellow-light mb-4" />
      <p className="text-lg md:text-xl text-nomba-text leading-relaxed mb-6">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-nomba-yellow-light to-nomba-yellow-dark flex items-center justify-center text-white font-bold text-lg shrink-0">
          {testimonial.initial}
        </div>
        <div>
          <p className="font-semibold text-nomba-text">{testimonial.name}</p>
          <p className="text-sm text-nomba-text-secondary">{testimonial.location}</p>
        </div>
        <div className="ml-auto flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-nomba-yellow text-nomba-yellow" />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export function TestimonialsSection() {
  return (
    <section className="py-24 md:py-32 bg-nomba-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionFade className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold font-display text-nomba-text tracking-tight">
            What Our Users Say
          </h2>
          <p className="mt-3 text-nomba-text-secondary text-sm">
            Trusted by thousands of Nigerians
          </p>
        </SectionFade>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonialData.map((t, i) => (
            <TestimonialCard key={i} testimonial={t} />
          ))}
        </div>
      </div>
    </section>
  )
}
