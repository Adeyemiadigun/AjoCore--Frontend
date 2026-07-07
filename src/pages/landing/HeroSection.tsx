import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import {
  Sparkle,
  PiggyBank,
  TrendUp,
  Check,
  CaretRight,
  ArrowRight,
  Lock,
  Lightning,
} from '@phosphor-icons/react'
import { useAuth } from '@/context/AuthContext'
import { blobPositions } from './data'
import { Blob, containerVariants, itemVariants } from './components'

export function HeroSection() {
  const { isAuthenticated, isLoading } = useAuth()

  return (
    <section className="relative min-h-dvh flex items-center overflow-hidden bg-gradient-to-b from-nomba-yellow-light/10 via-nomba-yellow-light/20 to-nomba-surface">
      {blobPositions.map((pos, i) => (
        <Blob key={i} className={pos} />
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-nomba-yellow-light/30 text-nomba-yellow-dark text-sm font-medium mb-6 border border-nomba-yellow-light/40"
            >
              <Sparkle className="w-4 h-4" />
              Smart savings for everyone
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-display text-nomba-text tracking-tight leading-[1.1] text-balance"
            >
              Save Together,
              <br />
              <span className="text-nomba-yellow-dark">Grow Together</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-6 text-lg md:text-xl text-nomba-text-secondary max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              AjoCore brings the power of community savings to your fingertips. Join structured
              cycles, track your progress, and achieve your financial goals together.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              {isLoading ? (
                <div className="h-14 w-48 animate-pulse rounded-2xl bg-neutral-200/50" />
              ) : isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-nomba-yellow text-nomba-text font-bold text-lg hover:bg-nomba-yellow-dark shadow-card-hover shadow-nomba-yellow/40 hover:shadow-nomba-yellow-dark/30 transition-all"
                >
                  Go to Dashboard <CaretRight className="w-5 h-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-nomba-yellow text-nomba-text font-bold text-lg hover:bg-nomba-yellow-dark shadow-card-hover shadow-nomba-yellow/40 hover:shadow-nomba-yellow-dark/30 transition-all"
                  >
                    Start Saving Free <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-nomba-surface text-nomba-text font-semibold text-lg border border-nomba-border hover:border-nomba-yellow shadow-card hover:shadow-card-hover transition-all"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-nomba-yellow-light/30 to-nomba-yellow-dark/20 rounded-[2.5rem]" />
              <div className="relative bg-nomba-surface rounded-[2rem] p-8 shadow-modal border border-nomba-yellow-light w-[28rem]">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-nomba-yellow to-nomba-yellow-dark flex items-center justify-center">
                    <PiggyBank className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-nomba-text">AjoCore</p>
                    <p className="text-xs text-nomba-text-secondary">Savings Dashboard</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 rounded-xl bg-nomba-bg border border-nomba-border">
                    <div>
                      <p className="text-sm text-nomba-text-secondary">Current Cycle</p>
                      <p className="font-bold text-nomba-text text-lg">₦125,000</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-nomba-yellow-light flex items-center justify-center">
                      <TrendUp className="w-6 h-6 text-nomba-yellow-dark" />
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-nomba-bg border border-nomba-border">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm text-nomba-text-secondary">Progress</p>
                      <p className="text-sm font-semibold text-nomba-yellow-dark">78%</p>
                    </div>
                    <div className="h-3 rounded-full bg-nomba-border overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '78%' }}
                        transition={{ duration: 1.5, delay: 0.8 }}
                        className="h-full rounded-full bg-gradient-to-r from-nomba-yellow to-nomba-yellow-dark"
                      />
                    </div>
                    <div className="flex justify-between text-xs text-nomba-text-secondary mt-1">
                      <span>₦0</span>
                      <span>₦160,000</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-4 rounded-xl bg-nomba-success-bg border border-nomba-success/20">
                    <Check className="w-5 h-5 text-nomba-success shrink-0" />
                    <p className="text-sm text-nomba-success font-medium">Next payout in 12 days</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
