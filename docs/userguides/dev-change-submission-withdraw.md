# Developer Change Notes — Submission Withdraw Flow

## Overview

This document describes the changes made to allow a broker to withdraw a submission request from one or more carriers, directly from the Submission Detail Modal. The feature includes a carrier-selection sub-modal and a system event logged to the message feed on confirmation.

---

## File Changed

- `src/components/SubmissionDetailModal.jsx`

---

## What Changed

### New State

Two new state variables were added to the component:

```js
const [showWithdrawModal, setShowWithdrawModal] = useState(false)
const [withdrawCarriers, setWithdrawCarriers] = useState(submission.carriers || [])
```

| Variable | Purpose |
|---|---|
| `showWithdrawModal` | Controls visibility of the withdraw carrier-selection sub-modal |
| `withdrawCarriers` | Tracks which carriers are currently checked in the sub-modal. Initializes with all carriers from the submission. |

---

### New Helper Functions

**`now()`**
Extracted timestamp generation into a shared helper (same pattern as `QuoteDetailModal`).

```js
function now() {
  return new Date().toLocaleString('en-US', {
    month: 'numeric', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit'
  })
}
```

**`pushEvent(text)`**
Appends a system event to the message thread with `role: 'event'`. Consistent with the event model in `QuoteDetailModal`.

```js
function pushEvent(text) {
  setMessages(prev => [
    ...prev,
    { id: `e${Date.now()}`, role: 'event', text, timestamp: now() }
  ])
}
```

**`toggleWithdrawCarrier(carrier)`**
Adds or removes a carrier from the `withdrawCarriers` selection array.

```js
function toggleWithdrawCarrier(carrier) {
  setWithdrawCarriers(prev =>
    prev.includes(carrier)
      ? prev.filter(c => c !== carrier)
      : [...prev, carrier]
  )
}
```

**`confirmWithdraw()`**
Called when the broker confirms the withdrawal. Builds a human-readable label based on how many carriers are selected — "all carriers" if all are selected, otherwise a comma-joined list. Pushes a system event to the feed and closes the sub-modal.

```js
function confirmWithdraw() {
  const label = withdrawCarriers.length === (submission.carriers || []).length
    ? 'all carriers'
    : withdrawCarriers.join(', ')
  pushEvent(`Submission withdrawn from ${label} by broker.`)
  setShowWithdrawModal(false)
}
```

---

### "Withdraw Request" Link in Modal Header

A "Withdraw Request" text link is rendered in the modal header, to the left of the close button. It is conditionally shown only when `submission.status === 'Requested'`, so it does not appear on submissions that are already quoted, bound, or in force.

```jsx
{submission.status === 'Requested' && (
  <button
    onClick={() => setShowWithdrawModal(true)}
    className="text-sm text-gray-400 hover:text-red-600 transition-colors"
  >
    Withdraw Request
  </button>
)}
```

The close button was wrapped in a `<div className="flex items-center gap-3">` to accommodate the new link alongside it.

---

### Withdraw Sub-Modal

The sub-modal renders as an absolute overlay on top of the existing modal (not a new full-screen overlay), keeping the user in context. It uses `z-10` and a semi-transparent backdrop scoped to the parent modal's bounds.

```jsx
{showWithdrawModal && (
  <div className="absolute inset-0 z-10 flex items-center justify-center">
    <div className="absolute inset-0 bg-black/30 rounded-xl"
         onClick={() => setShowWithdrawModal(false)} />
    <div className="relative bg-white rounded-xl shadow-xl w-80 mx-4 p-5 space-y-4">
      ...
    </div>
  </div>
)}
```

**Contents:**
- Title: "Withdraw Request"
- Subtitle: "Select the carriers to withdraw this request from."
- Carrier checklist: renders one checkbox per carrier in `submission.carriers`, bound to `withdrawCarriers` state. All are checked by default.
- Cancel button: closes the sub-modal without action
- "Withdraw Request" confirm button: disabled when no carriers are selected; calls `confirmWithdraw()` on click

---

### Event Role Added to Message Renderer

The message thread now renders `role: 'event'` entries as a centered divider with action text and timestamp, consistent with `QuoteDetailModal`. Regular broker/insured messages are unaffected.

```jsx
{messages.map(msg => msg.role === 'event' ? (
  <div key={msg.id} className="flex items-center gap-2">
    <div className="flex-1 h-px bg-gray-200" />
    <span className="text-xs text-gray-400 whitespace-nowrap">{msg.text}</span>
    <span className="text-xs text-gray-300 whitespace-nowrap">{msg.timestamp}</span>
    <div className="flex-1 h-px bg-gray-200" />
  </div>
) : (
  // existing broker/insured message render
))}
```

---

## Message Role Types

`SubmissionDetailModal` now supports three `role` values, matching the pattern established in `QuoteDetailModal`:

| Role | Rendered As | Triggered By |
|---|---|---|
| `insured` | Left-aligned bubble, gray background | Mock data / insured messages |
| `broker` | Right-aligned bubble, dark background | Broker typing in the input |
| `event` | Centered divider with label and timestamp | System actions (withdrawal) |

---

## State Flow Summary

```
Broker clicks "Withdraw Request" link
  → setShowWithdrawModal(true)
  → Sub-modal opens with all carriers pre-checked

Broker unchecks one or more carriers (optional)

Broker clicks "Withdraw Request" (confirm)
  → confirmWithdraw()
  → Builds label: "all carriers" or specific carrier names
  → pushEvent("Submission withdrawn from [label] by broker.")
  → setShowWithdrawModal(false)

Broker clicks "Cancel" or backdrop
  → setShowWithdrawModal(false)
  → No event pushed, no state changed
```

---

## Known Limitations (Prototype Scope)

- Withdrawing does not change the submission `status` in the data model. In production, withdrawing from all carriers should transition the submission status to "Withdrawn".
- Withdrawing from a subset of carriers does not remove those carriers from the submission record. In production, the per-carrier status should be tracked individually.
- The broker identity in the event message is hardcoded. In production this should come from the authenticated user's profile.
- `withdrawCarriers` always re-initializes to the full carrier list on modal open. If partial withdrawals are tracked in the backend, the initial state should reflect which carriers are still active.
