import React, { useState, useRef, useEffect } from 'react'

const subLimitLabels = {
  computer: 'Computer',
  fundsTransferFraud: 'Funds Transfer Fraud',
  hardwareReplacement: 'Hardware Replacement',
  postBreachRemediation: 'Post Breach Remediation',
  socialEngineering: 'Social Engineering',
  telecomFraud: 'Telecommunications Fraud',
  websiteMediaContentLiability: 'Website Media Content Liability',
  serviceFraudAndCryptojacking: 'Service Fraud and Cryptojacking',
  dedicatedBreachCosts: 'Dedicated Breach Costs',
  notificationOutsideLimit: 'Notification Outside the Limit',
  socialEngineeringDeductible: 'Social Engineering Deductible',
}

const MOCK_MESSAGES = [
  {
    id: 'm1',
    sender: 'Berkley Underwriting',
    role: 'carrier',
    text: 'Please find the attached quote for your review. Let us know if you have any questions or need adjustments.',
    timestamp: '04/02/26 9:00 AM',
  },
  {
    id: 'm2',
    sender: 'Bill Smithers',
    role: 'broker',
    text: 'Thank you, we are reviewing with the insured and will follow up shortly.',
    timestamp: '04/02/26 10:15 AM',
  },
]

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value || '—'}</span>
    </div>
  )
}

function Avatar({ name }) {
  const initials = name ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '?'
  return (
    <div className="w-7 h-7 rounded-full bg-gray-700 text-white flex items-center justify-center text-xs font-medium flex-shrink-0">
      {initials}
    </div>
  )
}

export default function QuoteDetailModal({ quote, onClose, onBindRequested, bindRequested = false }) {
  const [messages, setMessages] = useState(MOCK_MESSAGES.map(m => ({
    ...m,
    sender: m.role === 'carrier' ? quote.carrier : m.sender,
  })))
  const [newMessage, setNewMessage] = useState('')
  const [readyToBind, setReadyToBind] = useState(bindRequested)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function sendMessage() {
    if (!newMessage.trim()) return
    setMessages(prev => [...prev, {
      id: `m${Date.now()}`,
      sender: 'Bill Smithers',
      role: 'broker',
      text: newMessage.trim(),
      timestamp: new Date().toLocaleString('en-US', { month: 'numeric', day: 'numeric', year: '2-digit', hour: 'numeric', minute: '2-digit' }),
    }])
    setNewMessage('')
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-gray-900">{quote.carrier}</h2>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{quote.market}</span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">Quote Ran on {quote.quoteRanOn}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setReadyToBind(true); onBindRequested?.() }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                readyToBind
                  ? 'bg-gray-900 text-white cursor-default'
                  : 'border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'
              }`}
            >
              {readyToBind ? 'Bind Request Sent' : 'Ready to Bind'}
            </button>
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 divide-x divide-gray-100">

            {/* Left: Quote Details */}
            <div className="px-6 py-5 space-y-6">

              {/* Key Figures */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Key Figures</p>
                <div className="bg-gray-50 rounded-lg px-4 py-1">
                  <DetailRow label="Premium" value={quote.premium} />
                  <DetailRow label="Coverage Limit" value={quote.coverageLimit} />
                  <DetailRow label="Deductible" value={quote.retention} />
                </div>
              </div>

              {/* Coverage Details */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Coverage Details</p>
                <div className="bg-gray-50 rounded-lg px-4 py-1">
                  <DetailRow label="Claim Limit" value="$2,000,000" />
                  <DetailRow label="Each Occurrence Limit" value="$2,000,000" />
                  <DetailRow label="Aggregate Limit" value="$2,000,000" />
                </div>
              </div>

              {/* Sub Limits */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Sub Limits</p>
                <div className="bg-gray-50 rounded-lg px-4 py-1">
                  {Object.entries(quote.subLimits).map(([key, value]) => (
                    <DetailRow key={key} label={subLimitLabels[key] || key} value={value} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Messages */}
            <div className="px-6 py-5 flex flex-col">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Messages</p>

              <div className="flex-1 space-y-4 mb-4 overflow-y-auto">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex gap-2.5 ${msg.role === 'broker' ? 'flex-row-reverse' : ''}`}>
                    <Avatar name={msg.sender} />
                    <div className={`flex flex-col ${msg.role === 'broker' ? 'items-end' : 'items-start'} max-w-[75%]`}>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-xs font-medium text-gray-700">{msg.sender}</span>
                        <span className="text-xs text-gray-400">{msg.timestamp}</span>
                      </div>
                      <div className={`px-3 py-2 rounded-lg text-sm ${
                        msg.role === 'broker' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="flex gap-2 items-end border border-gray-200 rounded-lg p-2 mt-auto">
                <textarea
                  rows={2}
                  placeholder={`Message ${quote.carrier}...`}
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="flex-shrink-0 p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">Enter to send · Shift+Enter for new line</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
