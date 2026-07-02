import { NavLink } from 'react-router-dom'
import {
  ChartLineUp,
  User,
  PiggyBank,
  UsersThree,
  GearSix,
  SignOut,
  Coins,
  Handshake,
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { UserRole } from '@/types/enums'

const traderLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: ChartLineUp },
  { to: '/dashboard/cycles', label: 'My Cycles', icon: PiggyBank },
  { to: '/dashboard/groups', label: 'Groups', icon: UsersThree },
  { to: '/dashboard/profile', label: 'Profile', icon: User },
]

const adminLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: ChartLineUp },
  { to: '/dashboard/groups', label: 'Groups', icon: Handshake },
  { to: '/dashboard/cycles', label: 'Cycles', icon: Coins },
  { to: '/dashboard/members', label: 'Members', icon: UsersThree },
  { to: '/dashboard/profile', label: 'Profile', icon: User },
]

const systemLinks = [
  { to: '/dashboard', label: 'Overview', icon: ChartLineUp },
  { to: '/dashboard/users', label: 'Users', icon: UsersThree },
  { to: '/dashboard/cycles', label: 'All Cycles', icon: Coins },
  { to: '/dashboard/profile', label: 'Profile', icon: User },
  { to: '/dashboard/settings', label: 'Settings', icon: GearSix },
]

export function Sidebar() {
  const { user, logout } = useAuth()

  const links =
    user?.role === UserRole.SystemAdmin
      ? systemLinks
      : user?.role === UserRole.CooperativeAdmin
        ? adminLinks
        : traderLinks

  return (
    <aside className="flex h-dvh w-64 flex-col border-r border-nomba-border bg-nomba-surface">
      <div className="flex items-center gap-2 border-b border-nomba-border px-6 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] bg-nomba-yellow text-sm font-extrabold text-nomba-text">
          A
        </div>
        <span className="text-lg font-bold font-display text-nomba-text">AjoCore</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/dashboard'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-nomba-yellow focus-visible:outline-none',
                isActive
                  ? 'bg-nomba-yellow/10 text-nomba-text'
                  : 'text-nomba-text-secondary hover:bg-nomba-bg hover:text-nomba-text',
              )
            }
          >
            <link.icon size={20} weight={link.to === '/dashboard' ? 'fill' : 'regular'} />
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-nomba-border p-3">
        <div className="mb-2 px-3 py-2">
          <p className="text-sm font-medium text-nomba-text">{user?.fullName}</p>
          <p className="text-xs text-nomba-text-secondary capitalize">
            {user?.role === UserRole.CooperativeAdmin
              ? 'Cooperative Admin'
              : user?.role === UserRole.SystemAdmin
                ? 'System Admin'
                : 'Trader'}
          </p>
        </div>
        <button
          onClick={logout}
          aria-label="Sign out"
          className="flex w-full cursor-pointer items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-medium text-nomba-text-secondary transition-colors hover:bg-nomba-error-bg hover:text-nomba-error focus-visible:ring-2 focus-visible:ring-nomba-yellow focus-visible:outline-none"
        >
          <SignOut size={20} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
