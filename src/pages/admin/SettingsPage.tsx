import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Shield, GearSix, Money, UsersThree } from '@phosphor-icons/react'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false)
  const [penaltyFee, setPenaltyFee] = useState('5.0')
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveSettings = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast.success('System settings saved successfully')
    }, 1000)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold font-display text-nomba-text text-balance">
          System Settings
        </h1>
        <p className="text-sm text-nomba-text-secondary">Manage platform-wide configurations</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-nomba-bg text-nomba-text">
                <Money size={24} className="text-nomba-text" />
              </div>
              <CardTitle>Global Fees & Commissions</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Early Liquidation Penalty (%)"
              type="number"
              value={penaltyFee}
              onChange={(e) => setPenaltyFee(e.target.value)}
              placeholder="e.g. 5.0"
            />
            <p className="text-xs text-nomba-text-secondary">
              This percentage will be deducted from a user's total saved amount when they liquidate
              their cycle before maturity.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-nomba-error-bg text-nomba-error">
                <GearSix size={24} />
              </div>
              <CardTitle>System Maintenance</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-[var(--radius-md)] border border-nomba-border bg-nomba-bg/50">
              <div>
                <p className="font-medium text-nomba-text">Maintenance Mode</p>
                <p className="text-xs text-nomba-text-secondary mt-1">
                  Disables user logins and API transactions temporarily.
                </p>
              </div>
              <button
                onClick={() => setIsMaintenanceMode(!isMaintenanceMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-nomba-error focus:ring-offset-2 ${
                  isMaintenanceMode ? 'bg-nomba-error' : 'bg-nomba-border'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isMaintenanceMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-admin-accent-light text-admin-accent">
                <UsersThree size={24} />
              </div>
              <CardTitle>Admin Management</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-nomba-text-secondary">
              Invite new System Administrators to manage the platform.
            </p>
            <Button variant="outline" className="w-full justify-center">
              Invite System Admin
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-nomba-info-bg text-nomba-info">
                <Shield size={24} />
              </div>
              <CardTitle>Security</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-nomba-text">
                Require 2FA for Cooperative Admins
              </p>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-nomba-border transition-colors">
                <span className="inline-block h-4 w-4 translate-x-1 transform rounded-full bg-white transition-transform" />
              </button>
            </div>
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm font-medium text-nomba-text">Session Timeout (Minutes)</p>
              <Input value="30" className="w-20" readOnly />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={handleSaveSettings} loading={isSaving}>
          Save Settings
        </Button>
      </div>
    </div>
  )
}
