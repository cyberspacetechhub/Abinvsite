import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  GppGood, ArrowBack, InfoOutlined, DataUsageOutlined,
  ShareOutlined, LockOutlined, ManageAccountsOutlined,
  StorageOutlined, CookieOutlined, ChildCareOutlined,
  UpdateOutlined, MailOutlined, ArrowForward
} from '@mui/icons-material'

const EFFECTIVE_DATE = 'January 1, 2024'
const UPDATED_DATE   = 'June 1, 2025'

// Reusable bullet list item
const Li = ({ children }) => (
  <li className="flex items-start gap-3">
    <span className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0 mt-2" />
    <span className="font-sans text-sm text-neutral-700 dark:text-neutral-300">{children}</span>
  </li>
)

const sections = [
  {
    id: 'overview',
    number: '01',
    icon: InfoOutlined,
    title: 'Overview',
    content: (
      <>
        <p>
          Stock Exchange Mining ("we", "our", or "us") operates a financial trading and investment platform accessible at stockexchangemining.com. This Privacy Policy describes how we collect, use, store, share, and protect your personal information when you access or use our platform, products, and services.
        </p>
        <p className="mt-4">
          By creating an account or using our services, you acknowledge that you have read and understood this policy. If you do not agree with any part of this policy, please discontinue use of our platform.
        </p>
        <div className="mt-5 p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
          <p className="text-sm text-primary-800 dark:text-primary-200 font-medium">
            This policy applies to all users globally. Where local laws provide additional rights or impose additional obligations, those local requirements will apply in addition to this policy.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'information-we-collect',
    number: '02',
    icon: DataUsageOutlined,
    title: 'Information We Collect',
    content: (
      <>
        <h3 className="font-display font-semibold text-neutral-900 dark:text-white mb-3">2.1 Identity & Contact Information</h3>
        <ul className="list-none space-y-2 mb-6">
          {[
            'Full legal name and date of birth',
            'Government-issued identification (passport, national ID, driver\'s licence)',
            'Email address and phone number',
            'Residential address and country of residence',
            'Nationality and tax identification number (where required)',
          ].map((item, i) => <Li key={i}>{item}</Li>)}
        </ul>

        <h3 className="font-display font-semibold text-neutral-900 dark:text-white mb-3">2.2 Financial Information</h3>
        <ul className="list-none space-y-2 mb-6">
          {[
            'Bank account details and payment card information',
            'Cryptocurrency wallet addresses',
            'Transaction history, deposits, withdrawals, and investment records',
            'Source of funds documentation (for KYC/AML compliance)',
          ].map((item, i) => <Li key={i}>{item}</Li>)}
        </ul>

        <h3 className="font-display font-semibold text-neutral-900 dark:text-white mb-3">2.3 Technical & Usage Information</h3>
        <ul className="list-none space-y-2">
          {[
            'IP address, browser type, and operating system',
            'Device identifiers and hardware model',
            'Login timestamps, session duration, and activity logs',
            'Pages visited, features used, and interaction patterns',
            'Referral source and marketing attribution data',
          ].map((item, i) => <Li key={i}>{item}</Li>)}
        </ul>
      </>
    ),
  },
  {
    id: 'how-we-use',
    number: '03',
    icon: ManageAccountsOutlined,
    title: 'How We Use Your Information',
    content: (
      <>
        <p className="mb-5">We process your personal information only for legitimate purposes and on lawful legal bases, including contractual necessity, legal obligation, legitimate interests, and your consent where required.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { title: 'Service Delivery',       body: 'Create and manage your account, process transactions, and provide all platform features.' },
            { title: 'Regulatory Compliance',  body: 'Fulfil KYC, AML, and other financial regulatory obligations applicable in your jurisdiction.' },
            { title: 'Security & Fraud',       body: 'Detect, investigate, and prevent fraudulent activity, unauthorised access, and abuse.' },
            { title: 'Platform Improvement',   body: 'Analyse usage patterns to improve features, fix bugs, and optimise performance.' },
            { title: 'Communications',         body: 'Send account notifications, security alerts, and service updates. Marketing only with your consent.' },
            { title: 'Legal Proceedings',      body: 'Establish, exercise, or defend legal claims when necessary.' },
          ].map((card, i) => (
            <div key={i} className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-700">
              <p className="font-display font-semibold text-sm text-neutral-900 dark:text-white mb-1">{card.title}</p>
              <p className="font-sans text-sm text-neutral-600 dark:text-neutral-400">{card.body}</p>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    id: 'sharing',
    number: '04',
    icon: ShareOutlined,
    title: 'Information Sharing & Disclosure',
    content: (
      <>
        <p className="mb-5">
          <strong className="text-neutral-900 dark:text-white">We do not sell, rent, or trade your personal information.</strong> We may share your data only in the following limited circumstances:
        </p>
        <ul className="list-none space-y-3 mb-6">
          {[
            { label: 'Regulatory Authorities',   body: 'Financial regulators, tax authorities, and law enforcement agencies where legally required.' },
            { label: 'Service Providers',         body: 'Trusted third-party vendors (payment processors, KYC providers, cloud infrastructure) under strict data processing agreements.' },
            { label: 'Legal Process',             body: 'In response to valid court orders, subpoenas, or other legal processes.' },
            { label: 'Business Transfers',        body: 'In connection with a merger, acquisition, or sale of assets, with appropriate confidentiality protections.' },
            { label: 'Safety & Protection',       body: 'To protect the rights, property, or safety of Stock Exchange Mining, our clients, or the public.' },
          ].map((item, i) => (
            <li key={i} className="flex gap-3">
              <span className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0 mt-2" />
              <span className="font-sans text-sm text-neutral-700 dark:text-neutral-300">
                <strong className="text-neutral-900 dark:text-white">{item.label}:</strong> {item.body}
              </span>
            </li>
          ))}
        </ul>
        <p className="font-sans text-sm text-neutral-600 dark:text-neutral-400">
          All third-party service providers are contractually bound to process your data only as instructed and to maintain appropriate security standards.
        </p>
      </>
    ),
  },
  {
    id: 'security',
    number: '05',
    icon: LockOutlined,
    title: 'Data Security',
    content: (
      <>
        <p className="mb-5">We implement a multi-layered security framework to protect your personal and financial information against unauthorised access, disclosure, alteration, and destruction.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          {[
            '256-bit TLS/SSL encryption for all data in transit',
            'AES-256 encryption for data at rest',
            'Multi-factor authentication (MFA) on all accounts',
            'Cold-storage custody for digital assets',
            'Continuous real-time fraud detection and monitoring',
            'Regular third-party penetration testing and security audits',
            'Role-based access controls for internal staff',
            'Incident response plan with 72-hour breach notification',
          ].map((item, i) => <Li key={i}>{item}</Li>)}
        </div>
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <p className="font-sans text-sm text-amber-800 dark:text-amber-200">
            <strong>Important:</strong> No method of transmission over the internet is 100% secure. While we use industry-leading measures, we cannot guarantee absolute security. You are responsible for maintaining the confidentiality of your account credentials.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'your-rights',
    number: '06',
    icon: ManageAccountsOutlined,
    title: 'Your Rights',
    content: (
      <>
        <p className="mb-5">Depending on your jurisdiction, you may have the following rights regarding your personal information. To exercise any of these rights, contact us at <a href="mailto:privacy@stockexchangemining.com" className="text-primary-600 dark:text-primary-400 hover:underline">privacy@stockexchangemining.com</a>.</p>
        <div className="space-y-3">
          {[
            { right: 'Right of Access',        body: 'Request a copy of the personal information we hold about you.' },
            { right: 'Right to Rectification', body: 'Request correction of inaccurate or incomplete personal information.' },
            { right: 'Right to Erasure',       body: 'Request deletion of your personal information, subject to legal retention obligations.' },
            { right: 'Right to Portability',   body: 'Receive your data in a structured, machine-readable format and transfer it to another controller.' },
            { right: 'Right to Object',        body: 'Object to processing based on legitimate interests or for direct marketing purposes.' },
            { right: 'Right to Restrict',      body: 'Request that we limit the processing of your personal information in certain circumstances.' },
            { right: 'Right to Withdraw Consent', body: 'Where processing is based on consent, withdraw it at any time without affecting prior processing.' },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-700">
              <span className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0 mt-2" />
              <div>
                <p className="font-display font-semibold text-sm text-neutral-900 dark:text-white">{item.right}</p>
                <p className="font-sans text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 font-sans text-sm text-neutral-500 dark:text-neutral-400">
          We will respond to all verified requests within 30 days. We may need to verify your identity before processing your request.
        </p>
      </>
    ),
  },
  {
    id: 'retention',
    number: '07',
    icon: StorageOutlined,
    title: 'Data Retention',
    content: (
      <>
        <p className="mb-5">We retain your personal information only for as long as necessary to fulfil the purposes for which it was collected, including satisfying legal, regulatory, accounting, or reporting requirements.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-neutral-100 dark:bg-neutral-700">
                <th className="text-left px-4 py-3 font-display font-semibold text-neutral-900 dark:text-white rounded-tl-lg">Data Category</th>
                <th className="text-left px-4 py-3 font-display font-semibold text-neutral-900 dark:text-white rounded-tr-lg">Retention Period</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {[
                ['Account & identity information', '5 years after account closure'],
                ['Transaction & financial records', '7 years (regulatory requirement)'],
                ['KYC / AML documentation',         '5 years after business relationship ends'],
                ['Communication records',           '3 years'],
                ['Technical & usage logs',          '12 months'],
                ['Marketing preferences',           'Until consent is withdrawn'],
              ].map(([cat, period], i) => (
                <tr key={i} className="bg-white dark:bg-neutral-800">
                  <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">{cat}</td>
                  <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">{period}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    ),
  },
  {
    id: 'cookies',
    number: '08',
    icon: CookieOutlined,
    title: 'Cookies & Tracking',
    content: (
      <>
        <p className="mb-5">We use cookies and similar tracking technologies to enhance your experience, analyse platform usage, and support security functions.</p>
        <div className="space-y-3 mb-5">
          {[
            { type: 'Essential Cookies',     desc: 'Required for the platform to function. Cannot be disabled. Includes session management and security tokens.' },
            { type: 'Analytics Cookies',     desc: 'Help us understand how users interact with the platform so we can improve features and performance.' },
            { type: 'Preference Cookies',    desc: 'Remember your settings such as language, theme, and display preferences.' },
            { type: 'Marketing Cookies',     desc: 'Used to deliver relevant advertisements. Only set with your explicit consent.' },
          ].map((c, i) => (
            <div key={i} className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-700">
              <p className="font-display font-semibold text-sm text-neutral-900 dark:text-white mb-1">{c.type}</p>
              <p className="font-sans text-sm text-neutral-600 dark:text-neutral-400">{c.desc}</p>
            </div>
          ))}
        </div>
        <p className="font-sans text-sm text-neutral-600 dark:text-neutral-400">
          You can manage cookie preferences through your browser settings. Disabling essential cookies may affect platform functionality.
        </p>
      </>
    ),
  },
  {
    id: 'minors',
    number: '09',
    icon: ChildCareOutlined,
    title: 'Minors',
    content: (
      <p>
        Our platform is intended solely for individuals aged 18 years or older. We do not knowingly collect personal information from anyone under the age of 18. If we become aware that a minor has provided us with personal information, we will take immediate steps to delete that information and close the associated account. If you believe a minor has registered on our platform, please contact us immediately at <a href="mailto:support@stockexchangemining.com" className="text-primary-600 dark:text-primary-400 hover:underline">support@stockexchangemining.com</a>.
      </p>
    ),
  },
  {
    id: 'updates',
    number: '10',
    icon: UpdateOutlined,
    title: 'Policy Updates',
    content: (
      <>
        <p className="mb-4">
          We may update this Privacy Policy periodically to reflect changes in our practices, technology, legal requirements, or other factors. When we make material changes, we will:
        </p>
        <ul className="list-none space-y-2 mb-4">
          {[
            'Post the updated policy on this page with a revised "Last Updated" date',
            'Send an email notification to your registered email address',
            'Display a prominent notice on the platform for 30 days following the update',
          ].map((item, i) => <Li key={i}>{item}</Li>)}
        </ul>
        <p className="font-sans text-sm text-neutral-600 dark:text-neutral-400">
          Your continued use of the platform after the effective date of any update constitutes your acceptance of the revised policy.
        </p>
      </>
    ),
  },
  {
    id: 'contact',
    number: '11',
    icon: MailOutlined,
    title: 'Contact Us',
    content: (
      <>
        <p className="mb-5">
          For any questions, concerns, or requests relating to this Privacy Policy or your personal data, please contact our Data Protection team:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Privacy Enquiries',  value: 'privacy@stockexchangemining.com',  href: 'mailto:privacy@stockexchangemining.com' },
            { label: 'General Support',    value: 'support@stockexchangemining.com',  href: 'mailto:support@stockexchangemining.com' },
            { label: 'Response Time',      value: 'Within 30 calendar days', href: null },
            { label: 'Business Hours',     value: '24 / 7 — Global Support', href: null },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-700">
              <p className="font-sans text-xs text-neutral-400 uppercase tracking-wide mb-1">{item.label}</p>
              {item.href
                ? <a href={item.href} className="font-display font-semibold text-primary-600 dark:text-primary-400 hover:underline text-sm">{item.value}</a>
                : <p className="font-display font-semibold text-neutral-900 dark:text-white text-sm">{item.value}</p>
              }
            </div>
          ))}
        </div>
      </>
    ),
  },
]

const PrivacyPolicy = () => {
  const navigate = useNavigate()
  const [activeId, setActiveId] = useState(sections[0].id)
  const sectionRefs = useRef({})

  useEffect(() => { window.scrollTo(0, 0) }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: '-20% 0px -70% 0px' }
    )
    Object.values(sectionRefs.current).forEach(el => { if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [])

  const scrollTo = (id) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen bg-white dark:bg-darkBg pt-20">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-neutral-900 via-primary-950 to-neutral-900 py-20 px-6">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary-600/10 blur-3xl pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}
          className="relative z-10 max-w-3xl mx-auto text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary-500/20 border border-primary-500/30 flex items-center justify-center mx-auto mb-5">
            <GppGood className="text-primary-400" fontSize="large" />
          </div>
          <h1 className="mb-4 text-4xl md:text-5xl font-bold font-display text-white">Privacy Policy</h1>
          <p className="font-sans text-base text-neutral-400">
            Effective: {EFFECTIVE_DATE} &nbsp;·&nbsp; Last Updated: {UPDATED_DATE}
          </p>
        </motion.div>
      </div>

      {/* ── Breadcrumb ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
        <nav className="flex items-center gap-2 text-sm">
          <Link to="/" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">Home</Link>
          <span className="text-neutral-400">/</span>
          <span className="text-neutral-600 dark:text-neutral-300 font-medium">Privacy Policy</span>
        </nav>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          <ArrowBack fontSize="small" /> Back
        </button>
      </div>

      {/* ── Body ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-24">
        <div className="flex gap-10 items-start">

          {/* Sticky TOC — desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-24 self-start">
            <div className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl p-5">
              <p className="font-display font-bold text-xs uppercase tracking-widest text-neutral-400 mb-4">Contents</p>
              <nav className="space-y-1">
                {sections.map(s => (
                  <button
                    key={s.id}
                    onClick={() => scrollTo(s.id)}
                    className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                      activeId === s.id
                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-semibold'
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    <span className="font-mono text-xs text-neutral-400 w-5 flex-shrink-0">{s.number}</span>
                    <span className="font-display leading-tight">{s.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0 space-y-2">

            {/* Intro banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="p-5 rounded-2xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 mb-6"
            >
              <p className="font-sans text-sm text-primary-800 dark:text-primary-200 leading-relaxed">
                At <strong>Stock Exchange Mining</strong>, protecting your privacy is a core responsibility — not an afterthought. This policy is written in plain language so you understand exactly how your data is handled. If you have any questions, our team is available 24/7.
              </p>
            </motion.div>

            {sections.map((s, i) => {
              const Icon = s.icon
              return (
                <motion.section
                  key={s.id}
                  id={s.id}
                  ref={el => sectionRefs.current[s.id] = el}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: 0.05 }}
                  className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl p-6 md:p-8 scroll-mt-28"
                >
                  {/* Section header */}
                  <div className="flex items-center gap-4 mb-6 pb-5 border-b border-neutral-100 dark:border-neutral-700">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                      <Icon className="text-primary-600 dark:text-primary-400" fontSize="small" />
                    </div>
                    <div>
                      <span className="font-mono text-xs text-neutral-400">{s.number}</span>
                      <h2 className="font-display font-bold text-lg text-neutral-900 dark:text-white leading-tight">{s.title}</h2>
                    </div>
                  </div>

                  <div className="font-sans text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                    {s.content}
                  </div>
                </motion.section>
              )
            })}

            {/* Footer note */}
            <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-center">
              <p className="font-sans text-sm text-neutral-500 dark:text-neutral-400">
                Your privacy and security are our top priorities. Thank you for trusting Stock Exchange Mining with your financial journey.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-5">
                <Link to="/register" className="font-display inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors">
                  Create Account <ArrowForward fontSize="small" />
                </Link>
                <a href="mailto:privacy@stockexchangemining.com" className="font-display inline-flex items-center gap-2 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400 font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors">
                  Contact Privacy Team
                </a>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
