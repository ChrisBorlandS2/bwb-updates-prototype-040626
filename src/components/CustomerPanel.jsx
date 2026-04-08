import React, { useState } from 'react'
import StatusBadge from './StatusBadge'
import CompareQuotes from './CompareQuotes'
import AddSubmissionModal from './AddSubmissionModal'
import SubmissionDetailModal from './SubmissionDetailModal'

const submissionStatusConfig = {
  'Requested':  { bg: '#f3f4f6', text: '#6b7280' },
  'Submission': { bg: '#f3f4f6', text: '#6b7280' },
  'Quote':      { bg: '#9ca3af', text: '#ffffff' },
  'Quotes':     { bg: '#9ca3af', text: '#ffffff' },
  'Bind':       { bg: '#d1d5db', text: '#1f2937' },
  'Binding':    { bg: '#4b5563', text: '#f9fafb' },
  'In Force':   { bg: '#1f2937', text: '#f9fafb' },
}

function SubmissionStatusBadge({ status }) {
  const cfg = submissionStatusConfig[status] || { bg: '#f3f4f6', text: '#6b7280' }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: cfg.bg, color: cfg.text }}>
      {status || '—'}
    </span>
  )
}

function Section({ title, children, defaultOpen = true, action }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-gray-100">
      <div className="flex items-center px-5 py-3.5 hover:bg-gray-50 transition-colors">
        <button onClick={() => setOpen(!open)} className="flex-1 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-800">{title}</span>
        </button>
        {action && <div className="mr-2" onClick={e => e.stopPropagation()}>{action}</div>}
        <button onClick={() => setOpen(!open)}>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
        </button>
      </div>
      {open && <div className="px-5 pb-4">{children}</div>}
    </div>
  )
}

function InfoGrid({ items }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
      {items.map(({ label, value }) => (
        <div key={label}>
          <p className="text-xs text-gray-500 mb-0.5">{label}</p>
          <p className="text-sm text-gray-800">{value || 'Not Provided'}</p>
        </div>
      ))}
    </div>
  )
}

function Avatar({ name, size = 'md' }) {
  const initials = name ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '?'
  const sz = size === 'sm' ? 'w-7 h-7 text-xs' : 'w-9 h-9 text-sm'
  return (
    <div className={`${sz} rounded-full bg-gray-700 text-white flex items-center justify-center font-medium flex-shrink-0`}>
      {initials}
    </div>
  )
}

function MarketStatusBadge({ status }) {
  const colors = {
    'Declined':    'text-gray-400',
    'In Progress': 'text-gray-500',
    'Incomplete':  'text-gray-400',
    'Quoted':      'text-gray-700',
    'Bound':       'text-gray-900',
  }
  return (
    <span className={`text-sm font-medium ${colors[status] || 'text-gray-600'}`}>{status}</span>
  )
}

export default function CustomerPanel({ customer, onClose, hideHeader, hideSubmissions, onSubmissionAdded }) {
  const [quotesTab, setQuotesTab] = useState('returned')
  const [compareView, setCompareView] = useState(false)
  const [showAddSubmission, setShowAddSubmission] = useState(false)
  const [submissions, setSubmissions] = useState(customer.submissions || [])
  const [selectedSubmission, setSelectedSubmission] = useState(null)

  function handleAddSubmission(data) {
    const year = data.effectiveDate ? new Date(data.effectiveDate).getFullYear().toString() : new Date().getFullYear().toString()
    const newEntry = {
      id: `s${Date.now()}`,
      year,
      type: data.insuranceType,
      limit: data.limit || '—',
      status: 'Requested',
      requestedDate: new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }),
      carriers: data.carriers || [],
      retention: data.retention || '',
      targetPremium: data.targetPremium || '',
      coverages: data.coverages || [],
      insuredContact: data.insuredContact || '',
      insuredEmail: data.insuredEmail || '',
      revenue: data.revenue || '',
      employeeCount: data.employeeCount || '',
      mfaEnforced: data.mfaEnforced,
      offlineBackups: data.offlineBackups,
      itManagedExternal: data.itManagedExternal,
      dualAuthFunds: data.dualAuthFunds,
      cyberIncidents: data.cyberIncidents,
    }
    setSubmissions(prev => [newEntry, ...prev])
    onSubmissionAdded?.(newEntry)
  }

  const { companyProfile, contributors, quotes } = customer
  const returnedCount = quotes.returnedQuotes.length

  if (compareView) {
    return (
      <CompareQuotes
        customer={customer}
        onBack={() => setCompareView(false)}
        onClose={onClose}
      />
    )
  }

  return (
    <div className="w-[552px] flex-shrink-0 flex flex-col border-l border-gray-200 bg-white overflow-hidden">
      {/* Top status bar */}
      {!hideHeader && <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-gray-50">
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-200 rounded transition-colors"
          title="Collapse"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
            <polyline points="15 18 21 12 15 6" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Status:</span>
          <StatusBadge status={customer.submissions?.[0]?.status || customer.status} small />
        </div>
      </div>}

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">

        {/* Company header */}
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-800 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                {customer.company[0]}
              </div>
              <h2 className="text-xl font-semibold text-gray-900">{customer.company}</h2>
            </div>
          </div>

          {/* Co-Pilot button */}
          <button className="w-full flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors">
            <span className="text-gray-500 text-xs">Co-Pilot</span>
            <div className="flex items-center gap-1.5 text-gray-800 font-medium">
              View Advisory Dashboard
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </button>
        </div>

        {/* Customer contact */}
        <div className="px-5 py-3 border-b border-gray-100">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Customer</p>
          {customer.contact ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Avatar name={customer.contact.name} size="sm" />
                <div>
                  <p className="text-sm font-medium text-gray-800">{customer.contact.name}</p>
                  <p className="text-xs text-gray-500">{customer.contact.email}</p>
                </div>
              </div>
              <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-400">No contact provided</p>
          )}
        </div>

        {/* Company Profile */}
        <Section title="Company Profile">
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Customer Address</p>
              <div className="flex items-center gap-1.5">
                <p className="text-sm text-gray-800">{companyProfile.address}</p>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                  </svg>
                </button>
              </div>
            </div>
            <InfoGrid items={[
              { label: 'Website', value: companyProfile.website },
              { label: 'NAICS', value: <><div>{companyProfile.naicsInfo}</div><div>{companyProfile.naicsInfoSecondary || '—'}</div></> },
              { label: 'Revenue', value: <><div>TTM: {companyProfile.revenueTTM}</div><div>2025: {companyProfile.revenue2025}</div></> },
              { label: 'Full-Time Employees', value: companyProfile.fullTimeEmployees },
            ]} />
          </div>
        </Section>

        {/* Contributors */}
        <Section title="Contributors">
          <div className="space-y-2">
            {contributors.length === 0 && (
              <p className="text-sm text-gray-400">No contributors yet</p>
            )}
            <div className="grid grid-cols-2 gap-2">
              {contributors.map(c => (
                <div key={c.id} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                  <Avatar name={c.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 truncate">{c.name}</p>
                    <p className="text-xs text-gray-500 truncate">{c.email}</p>
                  </div>
                  <button className="text-gray-400 hover:text-gray-700 transition-colors flex-shrink-0">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
                    </svg>
                  </button>
                </div>
              ))}
              <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors py-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add a contributor
              </button>
            </div>
          </div>
        </Section>

        {/* Submissions */}
        {!hideSubmissions && <Section title="Submissions" action={
          <button
            onClick={() => setShowAddSubmission(true)}
            className="px-2.5 py-1 bg-gray-900 text-white rounded text-xs font-medium hover:bg-gray-700 transition-colors"
          >
            Add Submission
          </button>
        }>
          {submissions.length === 0 ? (
            <p className="text-sm text-gray-400">No submissions yet.</p>
          ) : (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="grid grid-cols-4 px-4 py-2 bg-gray-50 border-b border-gray-200">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Year</p>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Type</p>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Limit</p>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</p>
              </div>
              {submissions.map(s => (
                <div key={s.id} onClick={() => setSelectedSubmission(s)} className="grid grid-cols-4 px-4 py-2.5 border-b border-gray-100 last:border-0 items-center cursor-pointer hover:bg-gray-50 transition-colors">
                  <p className="text-sm text-gray-800">{s.year}</p>
                  <p className="text-sm text-gray-800">{s.type}</p>
                  <p className="text-sm text-gray-800">{s.limit || '—'}</p>
                  <div><SubmissionStatusBadge status={s.status} /></div>
                </div>
              ))}
            </div>
          )}
        </Section>}

        {/* Quotes — hidden for now */}
        {false && <Section title="Quotes">
          {/* Selected carrier row */}
          {quotes.selectedCarrier && (
            <div className="mb-4">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex items-center px-3 py-2.5 bg-gray-50 border-b border-gray-200">
                  <div className="flex-1 text-xs font-medium text-gray-500 uppercase tracking-wide">Carrier</div>
                  <div className="flex-1 text-xs font-medium text-gray-500 uppercase tracking-wide">Market</div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</div>
                </div>
                <div className="flex items-center px-3 py-3 gap-2">
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-gray-800">{quotes.selectedCarrier.name}</span>
                  </div>
                  <div className="flex-1 text-xs text-gray-500 leading-snug">{quotes.selectedCarrier.market}</div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={quotes.selectedCarrier.status} small />
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex gap-2 px-3 pb-3">
                  <button className="flex-1 py-1.5 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    View Application
                  </button>
                  <button className="flex-1 py-1.5 bg-gray-900 text-white rounded text-sm font-medium hover:bg-gray-700 transition-colors">
                    Bind Quote
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quote Parameters */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-gray-600">Quote Parameters</p>
              <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 transition-colors">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit Quote Parameters
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3 bg-gray-50 rounded-lg px-3 py-2.5">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Coverage Limit</p>
                <p className="text-sm text-gray-800">{quotes.quoteParams.coverageLimit || '$'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Deductible</p>
                <p className="text-sm text-gray-800">{quotes.quoteParams.retention || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Effective Date</p>
                <p className="text-sm text-gray-800">{quotes.quoteParams.effectiveDate || '—'}</p>
              </div>
            </div>
          </div>

          {/* Returned / All Markets tabs */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setQuotesTab('returned')}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  quotesTab === 'returned'
                    ? 'bg-white text-gray-900 border-b-2 border-gray-900'
                    : 'bg-gray-50 text-gray-500 hover:text-gray-700'
                }`}
              >
                Returned Quotes
              </button>
              <button
                onClick={() => setQuotesTab('all')}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  quotesTab === 'all'
                    ? 'bg-white text-gray-900 border-b-2 border-gray-900'
                    : 'bg-gray-50 text-gray-500 hover:text-gray-700'
                }`}
              >
                All Markets
              </button>
            </div>

            {/* Returned Quotes tab */}
            {quotesTab === 'returned' && (
              <div>
                {quotes.returnedQuotes.length === 0 ? (
                  <div className="px-4 py-6 text-center">
                    <p className="text-sm text-gray-500">No Quotes. Waiting on this company to complete their application.</p>
                  </div>
                ) : (
                  <div>
                    <div className="grid grid-cols-4 gap-2 px-3 py-2 bg-gray-50 border-b border-gray-100">
                      <p className="text-xs font-medium text-gray-500">Carrier</p>
                      <p className="text-xs font-medium text-gray-500">Coverage Limit</p>
                      <p className="text-xs font-medium text-gray-500">Deductible</p>
                      <p className="text-xs font-medium text-gray-500">Base Premium</p>
                    </div>
                    {quotes.returnedQuotes.map(q => (
                      <div key={q.id} className="grid grid-cols-4 gap-2 px-3 py-2.5 border-b border-gray-100 last:border-0">
                        <p className="text-xs font-semibold text-gray-800">{q.carrier}</p>
                        <p className="text-xs text-gray-700">{q.coverageLimit}</p>
                        <p className="text-xs text-gray-700">{q.retention}</p>
                        <p className="text-xs text-gray-700">{q.premium}</p>
                      </div>
                    ))}
                    <div className="px-3 py-2 border-t border-gray-100">
                      <button className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
                        Show Quote History
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* All Markets tab */}
            {quotesTab === 'all' && (
              <div>
                {quotes.allMarkets.length === 0 ? (
                  <div className="px-4 py-6 text-center">
                    <p className="text-sm text-gray-500">No markets available yet.</p>
                  </div>
                ) : (
                  quotes.allMarkets.map(m => (
                    <div key={m.id} className="px-3 py-3 border-b border-gray-100 last:border-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-800">{m.carrier}</span>
                            <span className="text-xs text-gray-400">{m.market}</span>
                          </div>
                          {m.declinationReason && (
                            <p className="text-xs text-gray-500 mt-0.5 italic">
                              Declination Reason: {m.declinationReason}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MarketStatusBadge status={m.status} />
                          <button className="p-0.5 text-gray-400 hover:text-gray-600">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Bottom actions */}
          {(quotesTab === 'all' || quotes.returnedQuotes.length > 0) && (
            <div className="flex gap-2 mt-3">
              <button className="flex-1 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                Export All Quotes
              </button>
              {returnedCount > 0 && (
                <button
                  onClick={() => setCompareView(true)}
                  className="flex-1 py-2 bg-gray-900 text-white rounded text-sm font-medium hover:bg-gray-700 transition-colors"
                >
                  Compare All Quotes
                </button>
              )}
            </div>
          )}
        </Section>}

      </div>

      {showAddSubmission && (
        <AddSubmissionModal
          customer={customer}
          onClose={() => setShowAddSubmission(false)}
          onSubmit={handleAddSubmission}
        />
      )}

      {selectedSubmission && selectedSubmission.status === 'Requested' && (
        <SubmissionDetailModal
          submission={selectedSubmission}
          customer={customer}
          onClose={() => setSelectedSubmission(null)}
        />
      )}

      {selectedSubmission && selectedSubmission.status === 'Quote' && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          <CompareQuotes
            customer={customer}
            onBack={() => setSelectedSubmission(null)}
            onClose={() => setSelectedSubmission(null)}
          />
        </div>
      )}
    </div>
  )
}
