import { motion } from 'motion/react'
import { User, Users, Check } from '@phosphor-icons/react'
import { SectionFade } from './components'

export function DualCTASection() {
  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-nomba-surface to-nomba-yellow-light/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionFade className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-nomba-yellow-light/40 bg-nomba-yellow-light/20 px-4 py-1.5 text-xs font-semibold text-nomba-yellow-dark mb-4">
            For everyone
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-display text-nomba-text tracking-tight">
            Save Your Way
          </h2>
          <p className="mt-4 text-nomba-text-secondary max-w-xl mx-auto">
            Whether you save solo or with a group, AjoCore fits your lifestyle.
          </p>
        </SectionFade>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[
            {
              icon: User,
              title: 'For Individuals',
              desc: 'Set personal savings goals with automated contributions. Track your progress and earn when you complete your cycle.',
              features: [
                'Personal savings cycles',
                'Auto-debit from your bank',
                'Progress tracking & insights',
                'Early liquidation available',
              ],
            },
            {
              icon: Users,
              title: 'For Groups',
              desc: 'Create or join savings circles. Pool resources with people you trust and achieve collective financial goals.',
              features: [
                'Group savings cycles',
                'Admin-managed contributions',
                'Member dashboard & transparency',
                'Automated payouts',
              ],
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="p-8 rounded-3xl bg-nomba-surface shadow-card-hover hover:shadow-card-hover hover:shadow-nomba-yellow/10 transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-nomba-yellow to-nomba-yellow-dark flex items-center justify-center mb-6 shadow-card-hover shadow-yellow-200/30">
                <item.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-nomba-text mb-3">{item.title}</h3>
              <p className="text-nomba-text-secondary mb-6 leading-relaxed">{item.desc}</p>
              <ul className="space-y-3">
                {item.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm text-nomba-text">
                    <Check className="w-4 h-4 text-nomba-yellow shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
