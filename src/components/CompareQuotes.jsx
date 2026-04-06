import React, { useState } from 'react'
import CustomerPanel from './CustomerPanel'
import QuoteDetailModal from './QuoteDetailModal'

const subLimitLabels = {
  computer: 'Computer',
  fundsTransferFraud: 'Funds Transfer Fraud',
  hardwareReplacement: 'Hardware Replacement',
  postBreachRemediation: 'Post Breach Remediation',
  socialEngineering: 'Social Engineering',
  telecomFraud: 'Telecommunications Fraud',
  websiteMediaContentLiability: 'Website Media Content Liability',
  serviceFraudAndCryptojacking: 'Service Fraud and Cryptojacking',
  dedicatedBreachCosts: 'Dedicated breach costs',
  notificationOutsideLimit: 'Notification outside the Limit',
  socialEngineeringDeductible: 'Social Engineering Deductible',
}

export default function CompareQuotes({ customer, onBack, onClose }) {
  const { quotes } = customer
  const [selectedQuote, setSelectedQuote] = useState(null)
  const [bindRequestedIds, setBindRequestedIds] = useState(new Set())

  const selected = [...quotes.returnedQuotes].sort((a, b) => {
    const aReq = bindRequestedIds.has(a.id) ? 0 : 1
    const bReq = bindRequestedIds.has(b.id) ? 0 : 1
    return aReq - bReq
  })

  function handleBindRequested(quoteId) {
    setBindRequestedIds(prev => new Set([...prev, quoteId]))
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-white border-l border-gray-200">
      {/* Header bar */}
      <div className="flex items-center px-6 py-3 border-b border-gray-200 bg-gray-50">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: company panel */}
        <CustomerPanel customer={customer} onClose={onBack} hideHeader hideSubmissions />

        {/* Right: compare columns — placeholder kept for structure */}
        {false && <div className="w-80 flex-shrink-0 border-r border-gray-200 overflow-y-auto">
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center text-sm font-semibold">
                {customer.company[0]}
              </div>
              <h2 className="text-base font-semibold text-gray-900">{customer.company}</h2>
            </div>
          </div>

          {/* Contact info */}
          {customer.contact && (
            <div className="px-5 py-3 border-b border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Company Contact</p>
              <p className="text-sm font-medium text-gray-800">{customer.contact.name}</p>
              <p className="text-xs text-gray-500">{customer.contact.email}</p>
              {customer.brokerContact && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Broker Contact</p>
                    <p className="text-sm text-gray-800">{customer.brokerContact.name}</p>
                    <p className="text-xs text-gray-500">{customer.brokerContact.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Brokerage</p>
                    <p className="text-sm text-gray-800">{customer.brokerage || '—'}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Company overview */}
          <div className="px-5 py-3 border-b border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-800">Company Overview</p>
              <button className="text-xs text-gray-500 hover:text-gray-800 border border-gray-300 rounded px-2 py-0.5">Edit</button>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-500">Company Address</p>
                <div className="flex items-center gap-1">
                  <p className="text-sm text-gray-800">{customer.companyProfile.address}</p>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <p className="text-xs text-gray-500">Primary Website</p>
                  <div className="flex items-center gap-1">
                    <p className="text-sm text-gray-800">{customer.companyProfile.website}</p>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">NAICS Info</p>
                  <p className="text-sm text-gray-800">{customer.companyProfile.naicsInfo}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Revenue</p>
                  <p className="text-sm text-gray-800">TTM: {customer.companyProfile.revenueTTM}</p>
                  <p className="text-sm text-gray-800">2025: {customer.companyProfile.revenue2025}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Gross Revenue</p>
                  <p className="text-sm text-gray-800">{customer.companyProfile.revenueTTM}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quotes summary */}
          <div className="px-5 py-3">
            <p className="text-sm font-semibold text-gray-800 mb-2">Quotes</p>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="grid grid-cols-4 gap-1 px-3 py-2 bg-gray-50 border-b border-gray-200">
                {['', 'Carrier', 'Cov. Limit', 'Retention', 'Premium'].slice(0,4).map(h => (
                  <p key={h} className="text-xs font-medium text-gray-500">{h}</p>
                ))}
              </div>
              {selected.map(q => (
                <div key={q.id} className="grid grid-cols-4 gap-1 px-3 py-2 border-b border-gray-100 last:border-0 items-center">
                  <input type="checkbox" defaultChecked className="w-3.5 h-3.5 accent-gray-800" />
                  <p className="text-xs font-medium text-gray-800">{q.carrier}</p>
                  <p className="text-xs text-gray-700">{q.coverageLimit}</p>
                  <p className="text-xs text-gray-700">{q.retention}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-3">
              <button className="flex-1 py-1.5 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50 transition-colors">
                Update {selected.length} Quotes
              </button>
              <button className="flex-1 py-1.5 bg-gray-900 text-white rounded text-xs font-medium hover:bg-gray-700 transition-colors">
                Compare {selected.length} Quotes
              </button>
            </div>
          </div>
        </div>}

        {/* Right: compare columns */}
        <div className="flex-1 overflow-auto">
          <div className="min-w-max">
            {/* Title */}
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900">Quotes</h2>
              <p className="text-sm text-gray-500 mt-1">
                The following tables provide a detailed breakdown of the quote details from multiple carriers, allowing for a comprehensive comparison of policy limits, retentions, and associated fees.
              </p>
            </div>

            <div className="px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Compare Quotes</h3>

              {/* Carrier cards header row */}
              <div className="flex gap-4">
                {selected.map(q => {
                  const isBindRequested = bindRequestedIds.has(q.id)
                  return (
                  <div key={q.id} className={`w-64 flex-shrink-0 border-2 rounded-lg overflow-hidden ${isBindRequested ? 'border-gray-700' : 'border-gray-200'}`}>
                    {isBindRequested && (
                      <div className="bg-gray-800 text-white text-xs font-semibold text-center py-1 tracking-wide uppercase">
                        Bind Requested
                      </div>
                    )}
                    {/* Carrier header */}
                    <div className={`px-4 py-3 border-b border-gray-100 ${isBindRequested ? 'bg-gray-100' : 'bg-gray-50'}`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-base font-semibold text-gray-900">{q.carrier}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{q.market}</p>
                          <div className="flex flex-col gap-1 mt-2">
                            <a href="#" className="text-xs text-gray-600 underline">View Quote</a>
                            <a href="#" className="text-xs text-gray-600 underline">View Policy Forms</a>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => setSelectedQuote(q)} className="mt-3 w-full flex items-center justify-center gap-1.5 py-1.5 bg-gray-900 text-white rounded text-xs font-medium hover:bg-gray-700 transition-colors">
                        {isBindRequested ? 'View Bind Request' : 'View Quote'}
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                        </svg>
                      </button>
                    </div>

                    {/* Quote details */}
                    <div className="px-4 py-3 space-y-3">
                      <div>
                        <p className="text-xs text-gray-500">Quote Ran on</p>
                        <p className="text-sm text-gray-800">{q.quoteRanOn}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Premium</p>
                        <p className="text-sm text-gray-800">{q.premium}</p>
                      </div>

                      {/* Coverage Details */}
                      <div>
                        <p className="text-sm font-semibold text-gray-800 mb-2 mt-4">Coverage Details</p>
                        <div className="space-y-1.5">
                          {[
                            { label: 'Coverage Limit', value: q.coverageLimit },
                            { label: 'Retention', value: q.retention },
                            { label: 'Claim Limit', value: '$2,000,000' },
                            { label: 'Each occurrence limit', value: '$2,000,000' },
                            { label: 'Aggregate Limit', value: '$2,000,000' },
                          ].map(({ label, value }) => (
                            <div key={label}>
                              <p className="text-xs text-gray-500">{label}</p>
                              <p className="text-sm text-gray-800">{value}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Sub Limits */}
                      <div>
                        <p className="text-sm font-semibold text-gray-800 mb-2 mt-4">Sub Limits</p>
                        <div className="space-y-1.5">
                          {Object.entries(q.subLimits).map(([key, value]) => (
                            <div key={key}>
                              <p className="text-xs text-gray-500">{subLimitLabels[key] || key}</p>
                              <p className="text-sm text-gray-800">{value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedQuote && (
        <QuoteDetailModal
          quote={selectedQuote}
          onClose={() => setSelectedQuote(null)}
          onBindRequested={() => handleBindRequested(selectedQuote.id)}
          bindRequested={bindRequestedIds.has(selectedQuote.id)}
        />
      )}
    </div>
  )
}
