import React, { useState, useRef, useEffect } from 'react'

const NAICS_LIST = [
  { code: '236117', name: 'New Housing Operative Builders' },
  { code: '311111', name: 'Dog and Cat Food Manufacturing' },
  { code: '322211', name: 'Corrugated and Solid Fiber Box Manufacturing' },
  { code: '423430', name: 'Computer and Peripheral Equipment Merchant Wholesalers' },
  { code: '441110', name: 'New Car Dealers' },
  { code: '445110', name: 'Supermarkets and Other Grocery Retailers' },
  { code: '452210', name: 'Department Stores' },
  { code: '481111', name: 'Scheduled Passenger Air Transportation' },
  { code: '484110', name: 'General Freight Trucking, Local' },
  { code: '511110', name: 'Newspaper Publishers' },
  { code: '511120', name: 'Periodical Publishers' },
  { code: '511210', name: 'Software Publishers' },
  { code: '512110', name: 'Motion Picture and Video Production' },
  { code: '515120', name: 'Television Broadcasting' },
  { code: '517311', name: 'Wired Telecommunications Carriers' },
  { code: '517312', name: 'Wireless Telecommunications Carriers' },
  { code: '518210', name: 'Data Processing, Hosting, and Related Services' },
  { code: '519130', name: 'Internet Publishing and Broadcasting' },
  { code: '521110', name: 'Monetary Authorities — Central Bank' },
  { code: '522110', name: 'Commercial Banking' },
  { code: '522120', name: 'Savings Institutions' },
  { code: '522210', name: 'Credit Card Issuing' },
  { code: '522291', name: 'Consumer Lending' },
  { code: '522310', name: 'Mortgage and Nonmortgage Loan Brokers' },
  { code: '523110', name: 'Investment Banking and Securities Dealing' },
  { code: '523120', name: 'Securities Brokerage' },
  { code: '523130', name: 'Commodity Contracts Dealing' },
  { code: '523910', name: 'Miscellaneous Intermediation' },
  { code: '524113', name: 'Direct Life Insurance Carriers' },
  { code: '524114', name: 'Direct Health and Medical Insurance Carriers' },
  { code: '524126', name: 'Direct Property and Casualty Insurance Carriers' },
  { code: '524210', name: 'Insurance Agencies and Brokerages' },
  { code: '531110', name: 'Lessors of Residential Buildings and Dwellings' },
  { code: '531210', name: 'Offices of Real Estate Agents and Brokers' },
  { code: '541110', name: 'Offices of Lawyers' },
  { code: '541211', name: 'Offices of Certified Public Accountants' },
  { code: '541310', name: 'Architectural Services' },
  { code: '541330', name: 'Engineering Services' },
  { code: '541511', name: 'Custom Computer Programming Services' },
  { code: '541512', name: 'Computer Systems Design Services' },
  { code: '541513', name: 'Computer Facilities Management Services' },
  { code: '541519', name: 'Other Computer Related Services' },
  { code: '541611', name: 'Administrative Management and General Management Consulting' },
  { code: '541612', name: 'Human Resources Consulting Services' },
  { code: '541613', name: 'Marketing Consulting Services' },
  { code: '541690', name: 'Other Scientific and Technical Consulting Services' },
  { code: '541715', name: 'Research and Development in the Physical Sciences' },
  { code: '541810', name: 'Advertising Agencies' },
  { code: '541990', name: 'All Other Professional, Scientific, and Technical Services' },
  { code: '551114', name: 'Corporate, Subsidiary, and Regional Managing Offices' },
  { code: '561110', name: 'Office Administrative Services' },
  { code: '561320', name: 'Temporary Staffing Services' },
  { code: '561499', name: 'All Other Business Support Services' },
  { code: '611110', name: 'Elementary and Secondary Schools' },
  { code: '611310', name: 'Colleges, Universities, and Professional Schools' },
  { code: '611420', name: 'Computer Training' },
  { code: '621111', name: 'Offices of Physicians' },
  { code: '621210', name: 'Offices of Dentists' },
  { code: '621511', name: 'Medical Laboratories' },
  { code: '621610', name: 'Home Health Care Services' },
  { code: '622110', name: 'General Medical and Surgical Hospitals' },
  { code: '623110', name: 'Nursing Care Facilities' },
  { code: '711211', name: 'Sports Teams and Clubs' },
  { code: '721110', name: 'Hotels and Motels' },
  { code: '722511', name: 'Full-Service Restaurants' },
  { code: '811212', name: 'Computer and Office Machine Repair and Maintenance' },
  { code: '921110', name: 'Executive Offices' },
  { code: '922120', name: 'Police Protection' },
  { code: '923120', name: 'Administration of Public Health Programs' },
]

function NaicsTypeahead({ value, onChange, placeholder, excludeValue }) {
  const [query, setQuery] = useState(value || '')
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const excludeCode = excludeValue ? excludeValue.split(' — ')[0].trim() : null

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const filtered = query.length < 1 ? [] : NAICS_LIST.filter(n =>
    n.code !== excludeCode &&
    (n.code.startsWith(query) || n.name.toLowerCase().includes(query.toLowerCase()))
  ).slice(0, 8)

  function select(item) {
    const display = `${item.code} — ${item.name}`
    setQuery(display)
    onChange(display)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <input
        type="text"
        value={query}
        placeholder={placeholder}
        onChange={e => { setQuery(e.target.value); onChange(e.target.value); setOpen(true) }}
        onFocus={() => query.length >= 1 && setOpen(true)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
      />
      {open && filtered.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {filtered.map(item => (
            <button
              key={item.code}
              type="button"
              onMouseDown={() => select(item)}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 border-b border-gray-100 last:border-0"
            >
              <span className="font-medium text-gray-800">{item.code}</span>
              <span className="text-gray-500 ml-2">{item.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function formatCurrency(raw) {
  const digits = raw.replace(/[^0-9]/g, '')
  if (!digits) return ''
  return '$' + Number(digits).toLocaleString()
}

function CurrencyInput({ value, onChange, placeholder, className }) {
  return (
    <input
      type="text"
      inputMode="numeric"
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(formatCurrency(e.target.value))}
      className={className}
    />
  )
}

const COVERAGES = [
  'First Party Coverage',
  'Third Party Liability',
  'Business Interruption',
  'Data Recovery',
  'Ransomware / Extortion',
  'Social Engineering',
  'Funds Transfer Fraud',
  'Regulatory Defense & Penalties',
  'Media Liability',
  'Network Security Liability',
]

const CARRIERS = [
  'RLI',
  'Berkley',
  'Mosaic',
  'Ryan',
]

const INSURANCE_TYPES = ['Cyber']

const YES_NO_QUESTIONS = [
  'Is MFA enforced for email and remote access?',
  'Are offline, cloud-based or immutable backups in place?',
  'Is IT managed by an external third party provider?',
  'Is dual authorization required for fund transfers greater than $10,000?',
  'Have there been any cyber incidents in the last three years that resulted in losses greater than $25,000?',
]

const yesNoFields = ['mfaEnforced', 'offlineBackups', 'itManagedExternal', 'dualAuthFunds', 'cyberIncidents']

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

function ReviewRow({ label, value }) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm text-gray-900 font-medium text-right max-w-xs">{value || '—'}</span>
    </div>
  )
}

export default function AddSubmissionModal({ customer, onClose, onSubmit }) {
  const [step, setStep] = useState(1)

  const [form, setForm] = useState({
    insuranceType: '',
    effectiveDate: '',
    endDate: '',
    carriers: [...CARRIERS],
    limit: '',
    retention: '',
    waitingPeriod: '',
    priorActsDate: '',
    coverages: [],
    optionals: [],
    companyName: customer?.company || '',
    yearEstablished: '',
    address: customer?.companyProfile?.address || '',
    websiteUrl: customer?.companyProfile?.website || '',
    insuredContact: customer?.contact?.name || '',
    insuredEmail: customer?.contact?.email || '',
    revenue: customer?.companyProfile?.revenueTTM || '',
    employeeCount: customer?.companyProfile?.fullTimeEmployees || '',
    primaryNaics: customer?.companyProfile?.naicsInfo || '',
    secondaryNaics: customer?.companyProfile?.naicsInfoSecondary || '',
    mfaEnforced: null,
    offlineBackups: null,
    itManagedExternal: null,
    dualAuthFunds: null,
    cyberIncidents: null,
    brokerName: customer?.brokerContact?.name || 'Thomas Baker',
    brokerContact: customer?.brokerContact?.email || 'thomasb@marsh.com',
    brokerageName: customer?.brokerage || 'Marsh',
    message: '',
    targetPremium: '',
  })

  function toggleCheck(field, value) {
    setForm(f => ({
      ...f,
      [field]: f[field].includes(value)
        ? f[field].filter(v => v !== value)
        : [...f[field], value],
    }))
  }

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function addOptional() {
    setForm(f => ({ ...f, optionals: [...f.optionals, { carriers: [...CARRIERS], limit: '', retention: '', waitingPeriod: '', priorActsDate: '', targetPremium: '', coverages: [] }] }))
  }

  function removeOptional(index) {
    setForm(f => ({ ...f, optionals: f.optionals.filter((_, i) => i !== index) }))
  }

  function setOptional(index, field, value) {
    setForm(f => ({ ...f, optionals: f.optionals.map((o, i) => i === index ? { ...o, [field]: value } : o) }))
  }

  function toggleOptionalCheck(index, field, value) {
    setForm(f => ({
      ...f,
      optionals: f.optionals.map((o, i) => i === index
        ? { ...o, [field]: o[field].includes(value) ? o[field].filter(v => v !== value) : [...o[field], value] }
        : o
      )
    }))
  }

  // Step 1 validation
  const step1Valid =
    !!form.insuranceType &&
    !!form.effectiveDate &&
    form.carriers.length > 0 &&
    !!form.limit &&
    !!form.retention &&
    form.coverages.length > 0

  // Step 2 validation
  const step2Valid =
    !!form.insuredContact &&
    !!form.insuredEmail &&
    !!form.revenue &&
    !!form.employeeCount

  // Step 3 validation
  const step3Valid = yesNoFields.every(f => form[f] !== null)

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 placeholder:text-gray-400"

  const stepLabels = ['Submission Details', 'Company Information', 'Security & Risk', 'Review']

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className={`relative bg-white rounded-xl shadow-2xl w-full mx-4 max-h-[90vh] flex flex-col transition-all duration-200 ${form.optionals.length > 0 && step === 1 ? (form.optionals.length >= 2 ? 'max-w-5xl' : 'max-w-4xl') : 'max-w-2xl'}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">New Submission</h2>
            <p className="text-xs text-gray-400 mt-0.5">{stepLabels[step - 1]} — Step {step} of 4</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex px-6 pt-4 gap-2">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${step >= s ? 'bg-gray-900' : 'bg-gray-200'}`} />
          ))}
        </div>

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Insurance Type">
                <select
                  value={form.insuranceType}
                  onChange={e => set('insuranceType', e.target.value)}
                  className={inputClass + ' bg-white'}
                >
                  <option value="" disabled>Pick type</option>
                  {INSURANCE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
            </div>

            {form.insuranceType && <>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Effective Date">
                  <input
                    type="date"
                    value={form.effectiveDate}
                    onChange={e => {
                      const val = e.target.value
                      set('effectiveDate', val)
                      if (val) {
                        const d = new Date(val)
                        d.setFullYear(d.getFullYear() + 1)
                        d.setDate(d.getDate() - 1)
                        set('endDate', d.toISOString().split('T')[0])
                      } else {
                        set('endDate', '')
                      }
                    }}
                    className={inputClass}
                  />
                </Field>
                <Field label="End Date">
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={e => set('endDate', e.target.value)}
                    className={inputClass}
                  />
                </Field>
              </div>

              <div className="flex gap-5 items-start">
                {/* Option 1 — main */}
                <div className={`flex-1 space-y-4 ${form.optionals.length > 0 ? 'border border-dashed border-gray-300 rounded-lg p-4' : ''}`}>
                  {form.optionals.length > 0 && <p className="text-sm font-medium text-gray-700">Option 1</p>}
                  <Field label="Carriers">
                    <div className="border border-gray-200 rounded-lg p-1">
                      {CARRIERS.map((c) => (
                        <label key={c} className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 cursor-pointer rounded">
                          <input type="checkbox" checked={form.carriers.includes(c)} onChange={() => toggleCheck('carriers', c)} className="w-4 h-4 accent-gray-800 rounded" />
                          <span className="text-sm text-gray-700">{c}</span>
                        </label>
                      ))}
                    </div>
                  </Field>
                  <div className="space-y-4">
                    <div className="w-1/2 pr-2">
                      <Field label="Limit">
                        <CurrencyInput value={form.limit} onChange={v => set('limit', v)} placeholder="$5,000,000" className={inputClass} />
                      </Field>
                    </div>
                    <div className="w-1/2 pr-2">
                      <Field label="Deductible">
                        <CurrencyInput value={form.retention} onChange={v => set('retention', v)} placeholder="$10,000" className={inputClass} />
                      </Field>
                    </div>
                    <div className="w-1/2 pr-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5 whitespace-nowrap">Waiting Period (hours)</label>
                        <input type="number" min="0" value={form.waitingPeriod} onChange={e => set('waitingPeriod', e.target.value)} placeholder="8" className={inputClass} />
                      </div>
                    </div>
                    <div className="w-1/2 pr-2">
                      <Field label="Prior Acts Date">
                        <input type="date" value={form.priorActsDate} onChange={e => set('priorActsDate', e.target.value)} className={inputClass} />
                      </Field>
                    </div>
                    <div className="w-1/2 pr-2">
                      <Field label="Target Premium">
                        <CurrencyInput value={form.targetPremium} onChange={v => set('targetPremium', v)} placeholder="$12,000" className={inputClass} />
                      </Field>
                    </div>
                  </div>
                  {form.carriers.length > 0 && (
                    <Field label="Coverages">
                      <div className="border border-gray-200 rounded-lg p-1">
                        {COVERAGES.map((c) => (
                          <label key={c} className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 cursor-pointer rounded">
                            <input type="checkbox" checked={form.coverages.includes(c)} onChange={() => toggleCheck('coverages', c)} className="w-4 h-4 accent-gray-800 rounded" />
                            <span className="text-sm text-gray-700">{c}</span>
                          </label>
                        ))}
                      </div>
                    </Field>
                  )}
                </div>

                {/* Option 2 and Option 3 */}
                {form.optionals.map((opt, i) => (
                  <div key={i} className="flex-1 border border-dashed border-gray-300 rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-700">Option {i + 2}</p>
                      <button type="button" onClick={() => removeOptional(i)} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Remove</button>
                    </div>
                    <Field label="Carriers">
                      <div className="border border-gray-200 rounded-lg p-1">
                        {CARRIERS.map((c) => (
                          <label key={c} className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 cursor-pointer rounded">
                            <input type="checkbox" checked={opt.carriers.includes(c)} onChange={() => toggleOptionalCheck(i, 'carriers', c)} className="w-4 h-4 accent-gray-800 rounded" />
                            <span className="text-sm text-gray-700">{c}</span>
                          </label>
                        ))}
                      </div>
                    </Field>
                    <div className="space-y-4">
                      <div className="w-1/2 pr-2">
                        <Field label="Limit">
                          <CurrencyInput value={opt.limit} onChange={v => setOptional(i, 'limit', v)} placeholder="$5,000,000" className={inputClass} />
                        </Field>
                      </div>
                      <div className="w-1/2 pr-2">
                        <Field label="Deductible">
                          <CurrencyInput value={opt.retention} onChange={v => setOptional(i, 'retention', v)} placeholder="$10,000" className={inputClass} />
                        </Field>
                      </div>
                      <div className="w-1/2 pr-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5 whitespace-nowrap">Waiting Period (hours)</label>
                          <input type="number" min="0" value={opt.waitingPeriod} onChange={e => setOptional(i, 'waitingPeriod', e.target.value)} placeholder="8" className={inputClass} />
                        </div>
                      </div>
                      <div className="w-1/2 pr-2">
                        <Field label="Prior Acts Date">
                          <input type="date" value={opt.priorActsDate} onChange={e => setOptional(i, 'priorActsDate', e.target.value)} className={inputClass} />
                        </Field>
                      </div>
                      <div className="w-1/2 pr-2">
                        <Field label="Target Premium">
                          <CurrencyInput value={opt.targetPremium} onChange={v => setOptional(i, 'targetPremium', v)} placeholder="$12,000" className={inputClass} />
                        </Field>
                      </div>
                    </div>
                    {opt.carriers.length > 0 && (
                      <Field label="Coverages">
                        <div className="border border-gray-200 rounded-lg p-1">
                          {COVERAGES.map((c) => (
                            <label key={c} className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 cursor-pointer rounded">
                              <input type="checkbox" checked={opt.coverages.includes(c)} onChange={() => toggleOptionalCheck(i, 'coverages', c)} className="w-4 h-4 accent-gray-800 rounded" />
                              <span className="text-sm text-gray-700">{c}</span>
                            </label>
                          ))}
                        </div>
                      </Field>
                    )}
                  </div>
                ))}
              </div>

              {form.optionals.length < 2 && (
                <button
                  type="button"
                  onClick={addOptional}
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Add Optional Request
                </button>
              )}
            </>}
          </div>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Company Name">
                <input type="text" value={form.companyName} onChange={e => set('companyName', e.target.value)} className={inputClass} />
              </Field>
              <Field label="Year Established">
                <input type="text" value={form.yearEstablished} onChange={e => set('yearEstablished', e.target.value)} placeholder="2005" className={inputClass} />
              </Field>
            </div>

            <Field label="Address">
              <input type="text" value={form.address} onChange={e => set('address', e.target.value)} placeholder="123 Main St, City, ST 00000" className={inputClass} />
            </Field>

            <Field label="Website URL">
              <input type="text" value={form.websiteUrl} onChange={e => set('websiteUrl', e.target.value)} placeholder="www.company.com" className={inputClass} />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Insured Contact">
                <input type="text" value={form.insuredContact} onChange={e => set('insuredContact', e.target.value)} className={inputClass} />
              </Field>
              <Field label="Contact Email">
                <input type="email" value={form.insuredEmail} onChange={e => set('insuredEmail', e.target.value)} className={inputClass} />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Revenue (TTM)">
                <CurrencyInput value={form.revenue} onChange={v => set('revenue', v)} placeholder="$10,000,000" className={inputClass} />
              </Field>
              <Field label="Employee Count">
                <input type="text" value={form.employeeCount} onChange={e => set('employeeCount', e.target.value)} className={inputClass} />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Primary NAICS">
                <NaicsTypeahead value={form.primaryNaics} onChange={v => set('primaryNaics', v)} placeholder="Search by code or industry…" excludeValue={form.secondaryNaics} />
              </Field>
              <Field label="Secondary NAICS">
                <NaicsTypeahead value={form.secondaryNaics} onChange={v => set('secondaryNaics', v)} placeholder="Search by code or industry…" excludeValue={form.primaryNaics} />
              </Field>
            </div>

          </div>
        )}

        {/* ── STEP 3: SECURITY & RISK ── */}
        {step === 3 && (
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
            {YES_NO_QUESTIONS.map((q, i) => (
              <div key={i} className="flex items-center justify-between gap-4 border border-gray-200 rounded-lg px-4 py-3">
                <p className="text-sm text-gray-800">{q}</p>
                <div className="flex-shrink-0 flex rounded-full overflow-hidden border border-gray-300 bg-gray-100">
                  {['Yes', 'No'].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => set(yesNoFields[i], opt)}
                      className={`px-4 py-1.5 text-sm font-medium transition-colors rounded-full ${
                        form[yesNoFields[i]] === opt
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── STEP 4: REVIEW ── */}
        {step === 4 && (
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Submission Details</p>
              <div className="bg-gray-50 rounded-lg px-4 py-1">
                <ReviewRow label="Insurance Type" value={form.insuranceType} />
                <ReviewRow label="Effective Date" value={form.effectiveDate} />
                <ReviewRow label={form.optionals.length > 0 ? 'Option 1 — Limit' : 'Limit'} value={form.limit} />
                <ReviewRow label={form.optionals.length > 0 ? 'Option 1 — Deductible' : 'Deductible'} value={form.retention} />
                <ReviewRow label={form.optionals.length > 0 ? 'Option 1 — Waiting Period' : 'Waiting Period (hours)'} value={form.waitingPeriod} />
                <ReviewRow label={form.optionals.length > 0 ? 'Option 1 — Prior Acts Date' : 'Prior Acts Date'} value={form.priorActsDate} />
                <ReviewRow label={form.optionals.length > 0 ? 'Option 1 — Target Premium' : 'Target Premium'} value={form.targetPremium} />
                <ReviewRow label={form.optionals.length > 0 ? 'Option 1 — Carriers' : 'Carriers'} value={form.carriers.join(', ')} />
                <ReviewRow label={form.optionals.length > 0 ? 'Option 1 — Coverages' : 'Coverages'} value={form.coverages.join(', ')} />
                {form.optionals.map((opt, i) => <>
                  <ReviewRow key={`opt${i}limit`} label={`Option ${i + 2} — Limit`} value={opt.limit} />
                  <ReviewRow key={`opt${i}ret`} label={`Option ${i + 2} — Deductible`} value={opt.retention} />
                  <ReviewRow key={`opt${i}wp`} label={`Option ${i + 2} — Waiting Period`} value={opt.waitingPeriod} />
                  <ReviewRow key={`opt${i}pad`} label={`Option ${i + 2} — Prior Acts Date`} value={opt.priorActsDate} />
                  <ReviewRow key={`opt${i}tp`} label={`Option ${i + 2} — Target Premium`} value={opt.targetPremium} />
                  <ReviewRow key={`opt${i}car`} label={`Option ${i + 2} — Carriers`} value={opt.carriers.join(', ')} />
                  <ReviewRow key={`opt${i}cov`} label={`Option ${i + 2} — Coverages`} value={opt.coverages.join(', ')} />
                </>)}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Insured Information</p>
              <div className="bg-gray-50 rounded-lg px-4 py-1">
                <ReviewRow label="Contact" value={form.insuredContact} />
                <ReviewRow label="Email" value={form.insuredEmail} />
                <ReviewRow label="Revenue (TTM)" value={form.revenue} />
                <ReviewRow label="Employees" value={form.employeeCount} />
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Security & Risk</p>
              <div className="bg-gray-50 rounded-lg px-4 py-1">
                {YES_NO_QUESTIONS.map((q, i) => (
                  <ReviewRow key={i} label={q} value={form[yesNoFields[i]]} />
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Broker Information</p>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Broker Name">
                    <input type="text" value={form.brokerName} onChange={e => set('brokerName', e.target.value)} className={inputClass} />
                  </Field>
                  <Field label="Broker Contact">
                    <input type="email" value={form.brokerContact} onChange={e => set('brokerContact', e.target.value)} className={inputClass} />
                  </Field>
                </div>
                <Field label="Brokerage Name">
                  <input type="text" value={form.brokerageName} onChange={e => set('brokerageName', e.target.value)} className={inputClass} />
                </Field>
              </div>
            </div>

            <Field label="Message">
              <textarea
                rows={4}
                placeholder="Add any notes or instructions for the carriers..."
                value={form.message}
                onChange={e => set('message', e.target.value)}
                className={inputClass + ' resize-none'}
              />
            </Field>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <button
            type="button"
            onClick={step === 1 ? onClose : () => setStep(s => s - 1)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {step === 1 ? 'Cancel' : 'Previous'}
          </button>
          <button
            type="button"
            disabled={step === 1 ? !step1Valid : step === 2 ? !step2Valid : step === 3 ? !step3Valid : false}
            onClick={step < 4 ? () => setStep(s => s + 1) : () => { onSubmit(form); onClose() }}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {step < 4 ? 'Next' : 'Submit'}
          </button>
        </div>

      </div>
    </div>
  )
}
