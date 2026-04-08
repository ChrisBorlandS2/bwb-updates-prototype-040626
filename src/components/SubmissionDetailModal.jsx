import React, { useState, useRef, useEffect } from 'react'

function ReviewRow({ label, value }) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm text-gray-900 font-medium text-right max-w-xs">{value || '—'}</span>
    </div>
  )
}

function Avatar({ name, size = 'sm' }) {
  const initials = name ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '?'
  const sz = size === 'sm' ? 'w-7 h-7 text-xs' : 'w-8 h-8 text-sm'
  return (
    <div className={`${sz} rounded-full bg-gray-700 text-white flex items-center justify-center font-medium flex-shrink-0`}>
      {initials}
    </div>
  )
}

const MOCK_MESSAGES = [
  {
    id: 'm1',
    sender: 'Sarah Mitchell',
    role: 'insured',
    text: 'Hi, just wanted to confirm you received our submission. Please let us know if you need any additional information.',
    timestamp: '2025-03-10 9:14 AM',
  },
  {
    id: 'm2',
    sender: 'Bill Smithers',
    role: 'broker',
    text: 'Received, thank you. We have submitted to the selected carriers and will follow up once we have responses.',
    timestamp: '2025-03-10 10:32 AM',
  },
  {
    id: 'm3',
    sender: 'Sarah Mitchell',
    role: 'insured',
    text: 'Great, thank you! Looking forward to hearing back.',
    timestamp: '2025-03-10 11:05 AM',
  },
]

export default function SubmissionDetailModal({ submission, customer, onClose }) {
  const [messages, setMessages] = useState(submission.messages || MOCK_MESSAGES)
  const [newMessage, setNewMessage] = useState('')
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [withdrawCarriers, setWithdrawCarriers] = useState(submission.carriers || [])
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function now() {
    return new Date().toLocaleString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
  }

  function pushEvent(text) {
    setMessages(prev => [...prev, { id: `e${Date.now()}`, role: 'event', text, timestamp: now() }])
  }

  function sendMessage() {
    if (!newMessage.trim()) return
    setMessages(prev => [...prev, {
      id: `m${Date.now()}`,
      sender: 'Bill Smithers',
      role: 'broker',
      text: newMessage.trim(),
      timestamp: now(),
    }])
    setNewMessage('')
  }

  function toggleWithdrawCarrier(carrier) {
    setWithdrawCarriers(prev =>
      prev.includes(carrier) ? prev.filter(c => c !== carrier) : [...prev, carrier]
    )
  }

  function confirmWithdraw() {
    const label = withdrawCarriers.length === (submission.carriers || []).length
      ? 'all carriers'
      : withdrawCarriers.join(', ')
    pushEvent(`Submission withdrawn from ${label} by broker.`)
    setShowWithdrawModal(false)
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

      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900">{submission.type} Submission</h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                {submission.status}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              {customer.company} · {submission.year}
              {submission.requestedDate && <span> · Requested {submission.requestedDate}</span>}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {submission.status === 'Requested' && (
              <button
                onClick={() => setShowWithdrawModal(true)}
                className="text-sm text-gray-400 hover:text-red-600 transition-colors"
              >
                Withdraw Request
              </button>
            )}
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">

          {/* Submission Details */}
          <div className="px-6 py-4 space-y-4 border-b border-gray-100">

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Submission Details</p>
              <div className="bg-gray-50 rounded-lg px-4 py-1">
                <ReviewRow label="Insurance Type" value={submission.type} />
                <ReviewRow label="Effective Date" value={submission.effectiveDate || submission.year} />
                <ReviewRow label="Limit" value={submission.limit} />
                <ReviewRow label="Deductible" value={submission.retention || '—'} />
                <ReviewRow label="Target Premium" value={submission.targetPremium || '—'} />
                <ReviewRow label="Carriers" value={submission.carriers?.join(', ') || '—'} />
                <ReviewRow label="Coverages" value={submission.coverages?.join(', ') || '—'} />
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Insured Information</p>
              <div className="bg-gray-50 rounded-lg px-4 py-1">
                <ReviewRow label="Contact" value={submission.insuredContact || customer.contact?.name} />
                <ReviewRow label="Email" value={submission.insuredEmail || customer.contact?.email} />
                <ReviewRow label="Revenue (TTM)" value={submission.revenue || customer.companyProfile?.revenueTTM} />
                <ReviewRow label="Employees" value={submission.employeeCount || customer.companyProfile?.fullTimeEmployees} />
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Security & Risk</p>
              <div className="bg-gray-50 rounded-lg px-4 py-1">
                {[
                  ['MFA enforced for email and remote access', submission.mfaEnforced],
                  ['Offline, cloud-based or immutable backups in place', submission.offlineBackups],
                  ['IT managed by an external third party provider', submission.itManagedExternal],
                  ['Dual authorization required for fund transfers > $10,000', submission.dualAuthFunds],
                  ['Cyber incidents in last 3 years with losses > $25,000', submission.cyberIncidents],
                ].map(([label, val]) => (
                  <ReviewRow key={label} label={label} value={val || '—'} />
                ))}
              </div>
            </div>
          </div>

          {/* Message Thread */}
          <div className="px-6 py-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Messages</p>

            <div className="space-y-4 mb-4">
              {messages.map(msg => msg.role === 'event' ? (
                <div key={msg.id} className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400 whitespace-nowrap">{msg.text}</span>
                  <span className="text-xs text-gray-300 whitespace-nowrap">{msg.timestamp}</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
              ) : (
                <div key={msg.id} className={`flex gap-3 ${msg.role === 'broker' ? 'flex-row-reverse' : ''}`}>
                  <Avatar name={msg.sender} />
                  <div className={`max-w-sm ${msg.role === 'broker' ? 'items-end' : 'items-start'} flex flex-col`}>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-700">{msg.sender}</span>
                      <span className="text-xs text-gray-400">{msg.timestamp}</span>
                    </div>
                    <div className={`px-3 py-2 rounded-lg text-sm ${
                      msg.role === 'broker'
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message input */}
            <div className="flex gap-2 items-end border border-gray-200 rounded-lg p-2">
              <textarea
                rows={2}
                placeholder="Type a message..."
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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">Press Enter to send · Shift+Enter for new line</p>
          </div>
        </div>

      </div>

      {/* Withdraw Request sub-modal */}
      {showWithdrawModal && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 rounded-xl" onClick={() => setShowWithdrawModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-80 mx-4 p-5 space-y-4">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Withdraw Request</h3>
              <p className="text-xs text-gray-500 mt-1">Select the carriers to withdraw this request from.</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-1">
              {(submission.carriers || []).map(carrier => (
                <label key={carrier} className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 cursor-pointer rounded">
                  <input
                    type="checkbox"
                    checked={withdrawCarriers.includes(carrier)}
                    onChange={() => toggleWithdrawCarrier(carrier)}
                    className="w-4 h-4 accent-gray-800 rounded"
                  />
                  <span className="text-sm text-gray-700">{carrier}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmWithdraw}
                disabled={withdrawCarriers.length === 0}
                className="flex-1 px-3 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Withdraw Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
