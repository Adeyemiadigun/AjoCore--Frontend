import {
  Wallet,
  Users,
  HandCoins,
  TrendUp,
  UserPlus,
  PiggyBank,
  ArrowsClockwise,
  Gift,
  ShieldCheck,
  Lightning,
  ChartBar,
  DeviceMobile,
  Globe,
} from '@phosphor-icons/react'

export const stats = [
  { label: 'Active Savers', value: '12450+', display: '12,450+' },
  {
    label: 'Total Saved',
    value: '2400000000',
    display: '₦2.4B',
    prefix: '₦',
    suffix: 'B',
    short: '2.4',
  },
  { label: 'Cycles Completed', value: '5200+', display: '5,200+' },
  { label: 'Payout Rate', value: '100', display: '100%', suffix: '%' },
]

export const problemCards = [
  {
    icon: Wallet,
    title: 'No Discipline',
    desc: 'Traditional savings accounts offer little accountability or structured commitment.',
  },
  {
    icon: Users,
    title: 'Isolated Saving',
    desc: 'Saving alone lacks the community accountability that keeps you consistent.',
  },
  {
    icon: HandCoins,
    title: 'Hidden Fees',
    desc: 'Bank charges, ledger fees, and maintenance costs eat into your savings.',
  },
  {
    icon: TrendUp,
    title: 'No Growth',
    desc: 'Your money sits idle instead of working toward something meaningful.',
  },
]

export const steps = [
  {
    icon: UserPlus,
    title: 'Create Account',
    desc: 'Sign up in under 2 minutes with just your BVN and basic details.',
  },
  {
    icon: PiggyBank,
    title: 'Set Your Goal',
    desc: 'Choose individual or group savings with flexible cycle options.',
  },
  {
    icon: ArrowsClockwise,
    title: 'Save Automatically',
    desc: 'Auto-debit from your bank or wallet. Set and forget.',
  },
  {
    icon: Gift,
    title: 'Get Paid Out',
    desc: 'Receive your lump sum at cycle end with earned interest.',
  },
]

export const benefits = [
  {
    icon: ShieldCheck,
    title: 'Bank-Grade Security',
    desc: '256-bit encryption, BVN verification, and FDIC-insured partners.',
  },
  {
    icon: Lightning,
    title: 'Instant Transactions',
    desc: 'Real-time deposits and payouts via Nomba payment rails.',
  },
  {
    icon: Users,
    title: 'Group Savings',
    desc: 'Join or create savings circles with friends, family, or colleagues.',
  },
  {
    icon: ChartBar,
    title: 'Track Progress',
    desc: 'Beautiful dashboards with cycle tracking, charts, and insights.',
  },
  {
    icon: DeviceMobile,
    title: 'Mobile First',
    desc: 'Full-featured mobile experience. Save from anywhere.',
  },
  {
    icon: Globe,
    title: 'Available Nationwide',
    desc: 'All Nigerian banks supported. No location restrictions.',
  },
]

export const faqs = [
  {
    q: 'How does AjoCore work?',
    a: 'AjoCore lets you save individually or in groups through structured cycles. Set a target, choose duration, and contributions happen automatically via Nomba. At cycle end, you receive your full savings plus accrued interest.',
  },
  {
    q: 'Is my money safe?',
    a: 'Absolutely. We use bank-grade encryption, BVN-linked verification, and partner with licensed financial institutions. Funds are held in segregated accounts.',
  },
  {
    q: 'Can I join a group without knowing members?',
    a: 'Group admins approve all join requests. You can browse open groups or create your own with trusted members.',
  },
  {
    q: 'What happens if I miss a contribution?',
    a: 'We send reminders before each due date. Grace periods vary by cycle; missed payments may affect your cycle standing.',
  },
  {
    q: 'Can I withdraw early?',
    a: 'Individual cycles can be liquidated early with a small penalty. Group cycle early withdrawal requires admin approval.',
  },
  {
    q: 'What banks are supported?',
    a: 'All Nigerian banks with NIBSS integration. We support account transfers, USSD, and card payments.',
  },
]

export const blobPositions = [
  'top-[-10%] left-[-5%] w-[35rem] h-[35rem] bg-nomba-yellow/20',
  'top-[30%] right-[-10%] w-[28rem] h-[28rem] bg-nomba-yellow-dark/15',
  'bottom-[-8%] left-[20%] w-[30rem] h-[30rem] bg-nomba-yellow/10',
  'top-[60%] left-[-8%] w-[22rem] h-[22rem] bg-nomba-yellow-light/15',
]

export const testimonialData = [
  {
    initial: 'A',
    name: 'Amara O.',
    location: 'Lagos, Nigeria',
    quote:
      "AjoCore completely changed how I save. I joined a group cycle with my colleagues and we've all hit our targets every month.",
  },
  {
    initial: 'K',
    name: 'Kelechi E.',
    location: 'Abuja, Nigeria',
    quote:
      'I saved \u20A6240,000 in 6 months through AjoCore \u2014 something I could never do with a regular bank account. The automated deductions made it effortless.',
  },
  {
    initial: 'F',
    name: 'Fatima B.',
    location: 'Kano, Nigeria',
    quote:
      'As a cooperative admin, AjoCore has streamlined our group savings. Members can track their contributions in real-time, and payouts are instant.',
  },
]
