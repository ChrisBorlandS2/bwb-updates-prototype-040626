import React, { useState } from 'react'
import StatusBadge from './StatusBadge'

export default function CustomersList({ customers, selectedId, onSelect }) {
  const [search, setSearch] = useState('')

  const filtered = customers.filter(c =>
    c.company.toLowerCase().includes(search.toLowerCase()) ||
    (c.contact?.name || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-white border-r border-gray-200">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-100">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Customers</h1>

        {/* Filters row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">Filters</span>
            <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-full text-sm text-gray-600 hover:bg-gray-50">
              Status
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-full text-sm text-gray-600 hover:bg-gray-50">
              Customer Books
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
            </button>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white rounded text-sm font-medium hover:bg-gray-700 transition-colors">
            + Add Customer
          </button>
        </div>
      </div>

      {/* List view toggle + search */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100">
        <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-600">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
          List View
        </button>
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-1.5 border border-gray-300 rounded text-sm w-64 focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                <button className="flex items-center gap-1">
                  Company
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                </button>
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Contact</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(customer => (
              <tr
                key={customer.id}
                onClick={() => onSelect(customer)}
                className={`border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${selectedId === customer.id ? 'bg-gray-50' : ''}`}
              >
                <td className="px-6 py-3.5 text-sm font-medium text-gray-900">{customer.company}</td>
                <td className="px-6 py-3.5">
                  {customer.contact ? (
                    <a className="text-sm text-gray-700 underline hover:text-gray-900" onClick={e => e.stopPropagation()}>
                      {customer.contact.name}
                    </a>
                  ) : (
                    <span className="text-sm text-gray-400">—</span>
                  )}
                </td>
                <td className="px-6 py-3.5 text-right">
                  <StatusBadge status={customer.submissions?.[0]?.status || customer.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
