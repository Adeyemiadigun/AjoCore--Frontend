import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'motion/react'
import { CaretDown } from '@phosphor-icons/react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import type { stats } from './data'

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

export const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

export const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

export function Blob({ className }: { className: string }) {
  return <div className={`absolute rounded-full pointer-events-none opacity-20 ${className}`} />
}

export function AnimatedCounter({ stat }: { stat: (typeof stats)[0] }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const prefersReduced = useReducedMotion()
  const num = parseFloat(stat.value.replace(/[^0-9.]/g, ''))
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (isNaN(num)) return
    if (prefersReduced) {
      setCount(num)
      return
    }
    if (!isInView) return
    let start = 0
    const duration = 2000
    const isShort = num < 100000
    const isBillions = num >= 1000000000
    const divisor = isBillions ? 1000000000 : isShort ? 1 : 1000000
    const target = num / divisor
    const step = Math.ceil(target / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, 16)
    return () => clearInterval(timer)
  }, [isInView, num, prefersReduced])

  if (isNaN(num)) {
    return (
      <span ref={ref} aria-label={`${stat.label}: ${stat.display}`}>
        {isInView ? stat.display : '0'}
      </span>
    )
  }

  const isShort = num < 100000
  const isBillions = num >= 1000000000
  const formatted = isShort ? Math.round(count).toLocaleString() : count.toFixed(1)

  const prefix = stat.prefix || ''
  const suffix = stat.suffix || ''

  const display = `${prefix}${formatted}${suffix}`

  return (
    <span ref={ref} aria-label={`${stat.label}: ${stat.display}`}>
      <span className="sr-only">{stat.display}</span>
      <span aria-hidden="true">{display}</span>
    </span>
  )
}

function useScrollAnimation(threshold = 0.15) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  return { ref, isInView }
}

export function SectionFade({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const { ref, isInView } = useScrollAnimation()
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={fadeUp}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="space-y-3">
      {items.map((faq, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between p-5 rounded-2xl bg-nomba-surface border border-nomba-yellow-light/40 hover:border-nomba-yellow/60 transition-all text-left group"
          >
            <span className="font-semibold text-nomba-text group-hover:text-nomba-yellow-dark transition-colors">
              {faq.q}
            </span>
            <motion.div
              animate={{ rotate: openIndex === i ? 180 : 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <CaretDown className="w-5 h-5 text-nomba-yellow shrink-0" />
            </motion.div>
          </button>
          <motion.div
            initial={false}
            animate={{
              gridTemplateRows: openIndex === i ? '1fr' : '0fr',
              opacity: openIndex === i ? 1 : 0,
            }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="grid"
            style={{ minHeight: 0 }}
          >
            <div className="overflow-hidden">
              <div className="px-5 pb-5 pt-2 text-nomba-text-secondary leading-relaxed text-sm">
                {faq.a}
              </div>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
}
