import { Link } from 'react-router-dom'
import { CaretRight, ArrowRight, Lock, ShieldCheck, ArrowsClockwise } from '@phosphor-icons/react'
import { useAuth } from '@/context/AuthContext'
import { Blob } from './components'
import { SectionFade } from './components'

export function FinalCTASection() {
  const { isAuthenticated } = useAuth()

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-nomba-text">
      <Blob className="absolute top-[-20%] right-[-10%] w-[40rem] h-[40rem] bg-nomba-yellow/10" />
      <Blob className="absolute bottom-[-20%] left-[-10%] w-[35rem] h-[35rem] bg-nomba-yellow-dark/10" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <SectionFade>
          <h2 className="text-3xl md:text-5xl font-bold font-display text-white tracking-tight mb-6 text-balance">
            Ready to Transform Your Savings?
          </h2>
          <p className="text-nomba-text-secondary text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Join thousands of Nigerians already saving smarter with AjoCore. Start your first cycle
            today.
          </p>
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-nomba-yellow text-nomba-text font-bold text-lg hover:bg-nomba-yellow-dark shadow-card-hover shadow-nomba-yellow-dark/30 transition-all"
            >
              Go to Dashboard <CaretRight className="w-5 h-5" />
            </Link>
          ) : (
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-nomba-yellow text-nomba-text font-bold text-lg hover:bg-nomba-yellow-dark shadow-card-hover shadow-nomba-yellow-dark/30 transition-all"
            >
              Start Saving Free <ArrowRight className="w-5 h-5" />
            </Link>
          )}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-nomba-text-secondary">
            <span className="flex items-center gap-1.5">
              <Lock size={14} className="text-nomba-success" /> Bank-grade encryption
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-nomba-success" /> NDIC insured
            </span>
            <span className="flex items-center gap-1.5">
              <ArrowsClockwise size={14} className="text-nomba-success" /> Free withdrawal anytime
            </span>
          </div>
        </SectionFade>
      </div>
    </section>
  )
}
