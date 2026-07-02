import { motion } from 'motion/react'
import { useInView } from 'motion/react'
import { useRef, type ReactNode } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function AnimatedSection({ children, className, delay = 0 }: AnimatedSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  const prefersReduced = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      animate={isInView || prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={
        prefersReduced ? { duration: 0 } : { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }
      }
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface StaggerContainerProps {
  children: ReactNode
  className?: string
}

export function StaggerContainer({ children, className }: StaggerContainerProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  const prefersReduced = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      initial={prefersReduced ? 'visible' : 'hidden'}
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: prefersReduced ? 0 : 0.12,
            delayChildren: prefersReduced ? 0 : 0.1,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface StaggerItemProps {
  children: ReactNode
  className?: string
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
