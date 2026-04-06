import React from 'react'

const statusConfig = {
  'Submission':  { bg: '#f3f4f6', text: '#6b7280' },
  'Quote':       { bg: '#9ca3af', text: '#ffffff' },
  'Binding':     { bg: '#4b5563', text: '#f9fafb' },
  'In Force':    { bg: '#1f2937', text: '#f9fafb' },
  'Needs Invite':{ bg: '#d1d5db', text: '#374151' },
  'Not Started': { bg: '#f3f4f6', text: '#9ca3af' },
  // market-level statuses
  'Declined':    { bg: '#6b7280', text: '#f9fafb' },
  'Quoted':      { bg: '#374151', text: '#f9fafb' },
  'Bound':       { bg: '#1f2937', text: '#f9fafb' },
  'Incomplete':  { bg: '#e5e7eb', text: '#374151' },
  'Selected':    { bg: '#1f2937', text: '#f9fafb' },
}

export default function StatusBadge({ status, small = false }) {
  const config = statusConfig[status] || { bg: '#9ca3af', text: 'white' }
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${small ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs'}`}
      style={{ backgroundColor: config.bg, color: config.text }}
    >
      {status}
    </span>
  )
}
