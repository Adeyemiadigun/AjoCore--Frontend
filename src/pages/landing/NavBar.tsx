import { useState, useEffect } from 'react'
import { motion, useScroll } from 'motion/react'
import { Link } from 'react-router-dom'
import { PiggyBank, ArrowRight, CaretRight, List, X } from '@phosphor-icons/react'
import { useAuth } from '@/context/AuthContext'

export function NavBar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isAuthenticated, isLoading } = useAuth()
  const { scrollY } = useScroll()

  useEffect(() => {
    return scrollY.on('change', (v) => setScrolled(v > 20))
  }, [scrollY])

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all ${
        scrolled ? 'bg-neutral-900/95 backdrop-blur-xl shadow-card text-white' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-nomba-yellow to-nomba-yellow-dark flex items-center justify-center shadow-card-hover shadow-nomba-yellow/30">
              <PiggyBank className="w-5 h-5 text-white" />
            </div>
            <span
              className={`text-xl font-bold tracking-tight ${scrolled ? 'text-white' : 'text-nomba-text'}`}
            >
              AjoCore
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a
              href="#how-it-works"
              className={`text-sm font-medium transition-colors ${scrolled ? 'text-white/70 hover:text-white' : 'text-nomba-text-secondary hover:text-nomba-yellow-dark'}`}
            >
              How It Works
            </a>
            <a
              href="#benefits"
              className={`text-sm font-medium transition-colors ${scrolled ? 'text-white/70 hover:text-white' : 'text-nomba-text-secondary hover:text-nomba-yellow-dark'}`}
            >
              Benefits
            </a>
            <a
              href="#faq"
              className={`text-sm font-medium transition-colors ${scrolled ? 'text-white/70 hover:text-white' : 'text-nomba-text-secondary hover:text-nomba-yellow-dark'}`}
            >
              FAQ
            </a>
            {isLoading ? (
              <div className="h-10 w-32 animate-pulse rounded-xl bg-neutral-200/50" />
            ) : isAuthenticated ? (
              <Link
                to="/dashboard"
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${scrolled ? 'bg-white text-neutral-900 hover:opacity-90' : 'bg-nomba-text text-white hover:opacity-80'}`}
              >
                Dashboard <CaretRight className="w-4 h-4" />
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className={`px-5 py-2.5 text-sm font-semibold transition-colors ${scrolled ? 'text-white/80 hover:text-white' : 'text-nomba-text hover:text-nomba-yellow-dark'}`}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-nomba-yellow text-nomba-text text-sm font-semibold hover:bg-nomba-yellow-dark shadow-card-hover shadow-nomba-yellow/30 transition-all"
                >
                  Start Saving Free <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 ${scrolled ? 'text-white/70' : 'text-nomba-text-secondary'}`}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <List className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <motion.div
        initial={false}
        animate={{ height: mobileOpen ? 'auto' : 0, opacity: mobileOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="md:hidden overflow-hidden bg-nomba-surface border-t border-nomba-border"
      >
        <div className="px-4 py-4 space-y-3">
          <a
            href="#how-it-works"
            onClick={() => setMobileOpen(false)}
            className="block px-4 py-3 text-sm font-medium text-nomba-text-secondary hover:bg-nomba-yellow-light/20 rounded-xl transition-colors"
          >
            How It Works
          </a>
          <a
            href="#benefits"
            onClick={() => setMobileOpen(false)}
            className="block px-4 py-3 text-sm font-medium text-nomba-text-secondary hover:bg-nomba-yellow-light/20 rounded-xl transition-colors"
          >
            Benefits
          </a>
          <a
            href="#faq"
            onClick={() => setMobileOpen(false)}
            className="block px-4 py-3 text-sm font-medium text-nomba-text-secondary hover:bg-nomba-yellow-light/20 rounded-xl transition-colors"
          >
            FAQ
          </a>
          {isLoading ? (
            <div className="h-10 w-full animate-pulse rounded-xl bg-neutral-200/50 mt-2" />
          ) : isAuthenticated ? (
            <Link
              to="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-sm font-semibold text-center bg-nomba-text text-white rounded-xl mt-2"
            >
              Dashboard
            </Link>
          ) : (
            <div className="space-y-2 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-sm font-semibold text-center text-nomba-text border border-nomba-border rounded-xl"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-sm font-semibold text-center bg-nomba-yellow text-nomba-text rounded-xl"
              >
                Start Saving Free
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </motion.nav>
  )
}
