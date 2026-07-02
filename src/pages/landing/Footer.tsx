import { Link } from 'react-router-dom'
import { PiggyBank } from '@phosphor-icons/react'

export function Footer() {
  return (
    <footer className="bg-nomba-text text-white/60 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-nomba-yellow to-nomba-yellow-dark flex items-center justify-center">
                <PiggyBank className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">AjoCore</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm">
              AjoCore brings the power of community savings to your fingertips. Save together, grow
              together.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">Product</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#how-it-works" className="hover:text-nomba-yellow transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#benefits" className="hover:text-nomba-yellow transition-colors">
                  Benefits
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-nomba-yellow transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span className="hover:text-nomba-yellow transition-colors cursor-pointer">
                  About
                </span>
              </li>
              <li>
                <span className="hover:text-nomba-yellow transition-colors cursor-pointer">
                  Privacy
                </span>
              </li>
              <li>
                <span className="hover:text-nomba-yellow transition-colors cursor-pointer">
                  Terms
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-nomba-text/20 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p>&copy; {new Date().getFullYear()} AjoCore. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-nomba-yellow transition-colors cursor-pointer">
              Twitter
            </span>
            <span className="hover:text-nomba-yellow transition-colors cursor-pointer">
              LinkedIn
            </span>
            <span className="hover:text-nomba-yellow transition-colors cursor-pointer">
              Instagram
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
