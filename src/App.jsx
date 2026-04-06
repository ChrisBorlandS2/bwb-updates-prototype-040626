import React, { useState } from 'react'
import SideNav from './components/SideNav'
import CustomersList from './components/CustomersList'
import CustomerPanel from './components/CustomerPanel'
import { customers as initialCustomers } from './data/mockData'

export default function App() {
  const [customerList, setCustomerList] = useState(initialCustomers)
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  function handleSubmissionAdded(customerId, newSubmission) {
    setCustomerList(prev => prev.map(c =>
      c.id === customerId ? { ...c, submissions: [newSubmission, ...c.submissions] } : c
    ))
    setSelectedCustomer(prev =>
      prev?.id === customerId ? { ...prev, submissions: [newSubmission, ...prev.submissions] } : prev
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <SideNav />
      <div className="flex flex-1 overflow-hidden">
        <CustomersList
          customers={customerList}
          selectedId={selectedCustomer?.id}
          onSelect={setSelectedCustomer}
        />
        {selectedCustomer && (
          <CustomerPanel
            key={selectedCustomer.id}
            customer={selectedCustomer}
            onClose={() => setSelectedCustomer(null)}
            onSubmissionAdded={(submission) => handleSubmissionAdded(selectedCustomer.id, submission)}
          />
        )}
      </div>
    </div>
  )
}
