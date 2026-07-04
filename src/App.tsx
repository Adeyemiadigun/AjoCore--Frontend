import { lazy, Suspense, useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { WifiSlash } from '@phosphor-icons/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import AppLayout from '@/components/layout/AppLayout'
import LoginPage from '@/pages/auth/LoginPage'
import NotFoundPage from '@/pages/NotFoundPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import VerifyEmailPage from '@/pages/auth/VerifyEmailPage'
import RegisterSuccessPage from '@/pages/auth/RegisterSuccessPage'
import LandingPage from '@/pages/landing'
import { UserRole } from '@/types/enums'

const TraderDashboard = lazy(() => import('@/pages/trader/DashboardPage'))
const CyclesPage = lazy(() => import('@/pages/trader/CyclesPage'))
const CycleDetailPage = lazy(() => import('@/pages/trader/CycleDetailPage'))
const GroupsPage = lazy(() => import('@/pages/trader/GroupsPage'))
const ProfilePage = lazy(() => import('@/pages/trader/ProfilePage'))
const AdminDashboard = lazy(() => import('@/pages/admin/DashboardPage'))
const AdminCyclesPage = lazy(() => import('@/pages/admin/AdminCyclesPage'))
const GroupManagementPage = lazy(() => import('@/pages/admin/GroupManagementPage'))
const GroupDetailPage = lazy(() => import('@/pages/admin/GroupDetailPage'))
const MembersPage = lazy(() => import('@/pages/admin/MembersPage'))
const SystemOverviewPage = lazy(() => import('@/pages/admin/SystemOverviewPage'))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function HomeRoute() {
  const { user, isLoading } = useAuth()
  if (isLoading) return null
  if (user) return <Navigate to="/dashboard" replace />
  return <LandingPage />
}

function DashboardIndex() {
  const { user } = useAuth()
  if (user?.role === UserRole.CooperativeAdmin) {
    return <AdminDashboard />
  }
  return <TraderDashboard />
}

function GroupsRoute() {
  const { user } = useAuth()
  if (user?.role === UserRole.CooperativeAdmin) {
    return <GroupManagementPage />
  }
  return <GroupsPage />
}

function CyclesRoute() {
  const { user } = useAuth()
  if (user?.role === UserRole.CooperativeAdmin) {
    return <AdminCyclesPage />
  }
  return <CyclesPage />
}

function OfflineBanner() {
  const [online, setOnline] = useState(navigator.onLine)
  useEffect(() => {
    const goOffline = () => setOnline(false)
    const goOnline = () => setOnline(true)
    window.addEventListener('offline', goOffline)
    window.addEventListener('online', goOnline)
    return () => {
      window.removeEventListener('offline', goOffline)
      window.removeEventListener('online', goOnline)
    }
  }, [])
  if (online) return null
  return (
    <div className="fixed top-0 left-0 right-0 z-[var(--z-toast)] flex items-center justify-center gap-2 bg-nomba-error px-4 py-2 text-sm font-medium text-white">
      <WifiSlash size={16} />
      You're offline. Some features may be unavailable.
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <OfflineBanner />
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />
              <Route path="/register/success" element={<RegisterSuccessPage />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                {/* Trader routes */}
                <Route
                  index
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <DashboardIndex />
                    </Suspense>
                  }
                />
                <Route
                  path="cycles"
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <CyclesRoute />
                    </Suspense>
                  }
                />
                <Route
                  path="cycles/:cycleId"
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <CycleDetailPage />
                    </Suspense>
                  }
                />
                <Route
                  path="groups"
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <GroupsRoute />
                    </Suspense>
                  }
                />
                <Route
                  path="groups/:groupId"
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <GroupDetailPage />
                    </Suspense>
                  }
                />
                <Route
                  path="profile"
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <ProfilePage />
                    </Suspense>
                  }
                />

                {/* Admin routes */}
                <Route
                  path="members"
                  element={
                    <ProtectedRoute roles={[UserRole.CooperativeAdmin, UserRole.SystemAdmin]}>
                      <Suspense fallback={<RouteFallback />}>
                        <MembersPage />
                      </Suspense>
                    </ProtectedRoute>
                  }
                />

                {/* System Admin routes */}
                <Route
                  path="users"
                  element={
                    <ProtectedRoute roles={[UserRole.SystemAdmin]}>
                      <Suspense fallback={<RouteFallback />}>
                        <SystemOverviewPage />
                      </Suspense>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="settings"
                  element={
                    <ProtectedRoute roles={[UserRole.SystemAdmin]}>
                      <Suspense fallback={<RouteFallback />}>
                        <SystemOverviewPage />
                      </Suspense>
                    </ProtectedRoute>
                  }
                />
              </Route>

              <Route path="/" element={<HomeRoute />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

function RouteFallback() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-nomba-bg">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-nomba-border border-t-nomba-yellow" />
    </div>
  )
}
