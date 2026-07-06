import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { balances, banks } from '@/api/endpoints'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export function WithdrawFundsModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}) {
  const [amount, setAmount] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [bankCode, setBankCode] = useState('')
  const [accountName, setAccountName] = useState('')

  const { data: bankList } = useQuery({
    queryKey: ['banks', 'list'],
    queryFn: () => banks.list(),
  })

  // Auto-verify account name when account number and bank code are present
  useEffect(() => {
    const verifyAccount = async () => {
      if (accountNumber.length >= 10 && bankCode) {
        try {
          const selectedBank = bankList?.find((b) => b.bankCode === bankCode)
          if (selectedBank) {
            const data = await banks.verifyAccount(accountNumber, selectedBank.bankName)
            if (data?.accountName) {
              setAccountName(data.accountName)
            }
          }
        } catch (error) {
          console.error('Account verification failed', error)
          setAccountName('')
        }
      } else {
        setAccountName('')
      }
    }
    verifyAccount()
  }, [accountNumber, bankCode, bankList])

  const withdrawMutation = useMutation({
    mutationFn: (data: Parameters<typeof balances.withdrawNombaFunds>[0]) =>
      balances.withdrawNombaFunds(data),
    onSuccess: () => {
      onSuccess()
      onClose()
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !accountNumber || !bankCode || !accountName) return

    withdrawMutation.mutate({
      amount: Number(amount),
      accountNumber,
      bankCode,
      accountName,
      senderName: 'AjoCore Admin',
      merchantTxRef: `WTD-${Date.now()}`,
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-[var(--radius-lg)] bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold text-nomba-text">
          Withdraw Funds (Nomba Subaccount)
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="amount" className="mb-1 block text-sm font-medium text-nomba-text">
              Amount (NGN)
            </label>
            <Input
              id="amount"
              type="number"
              min="100"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 5000"
            />
          </div>

          <div>
            <label htmlFor="bank" className="mb-1 block text-sm font-medium text-nomba-text">
              Select Bank
            </label>
            <select
              id="bank"
              required
              className="w-full rounded-[var(--radius-md)] border-2 border-nomba-border bg-white px-4 py-2 text-sm focus:border-nomba-yellow focus:outline-none"
              value={bankCode}
              onChange={(e) => setBankCode(e.target.value)}
            >
              <option value="">Select a bank</option>
              {bankList?.map((bank) => (
                <option key={bank.bankCode} value={bank.bankCode}>
                  {bank.bankName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="accountNumber"
              className="mb-1 block text-sm font-medium text-nomba-text"
            >
              Account Number
            </label>
            <Input
              id="accountNumber"
              type="text"
              required
              maxLength={10}
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="10-digit account number"
            />
          </div>

          {accountName && (
            <div className="rounded-[var(--radius-md)] bg-nomba-success-bg p-3 text-sm font-medium text-nomba-success-dark">
              Verified: {accountName}
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={withdrawMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={withdrawMutation.isPending || !accountName}
              className="bg-nomba-yellow text-nomba-text"
            >
              {withdrawMutation.isPending ? 'Processing...' : 'Withdraw'}
            </Button>
          </div>

          {withdrawMutation.isError && (
            <p className="mt-2 text-sm text-red-500">
              Error processing withdrawal. Please try again.
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
