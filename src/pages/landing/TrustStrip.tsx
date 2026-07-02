import { Check, Lock, Lightning } from '@phosphor-icons/react'

export function TrustStrip() {
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-8">
      <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-nomba-text-secondary">
        <span className="flex items-center gap-1.5">
          <Check className="w-4 h-4 text-nomba-success" /> No Hidden Fees
        </span>
        <span className="flex items-center gap-1.5">
          <Lock className="w-4 h-4 text-nomba-success" /> Bank-Grade Security
        </span>
        <span className="flex items-center gap-1.5">
          <Lightning className="w-4 h-4 text-nomba-success" /> Instant Payouts
        </span>
      </div>
    </section>
  )
}
