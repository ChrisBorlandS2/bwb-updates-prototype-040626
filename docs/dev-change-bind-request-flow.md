# Developer Change Notes — Bind Request & Withdraw Flow

## Overview

This document describes the changes made to implement the bind request submission and withdrawal flow, including the addition of system event messages to the quote message feed.

---

## Files Changed

- `src/components/CompareQuotes.jsx`
- `src/components/QuoteDetailModal.jsx`

---

## CompareQuotes.jsx

### What Changed

**Added `handleWithdrawBind` function**

A new function was added alongside the existing `handleBindRequested` to handle the withdrawal of a previously submitted bind request.

```js
function handleWithdrawBind(quoteId) {
  setBindRequestedIds(prev => {
    const next = new Set(prev)
    next.delete(quoteId)
    return next
  })
}
```

Bind request state is tracked in a `Set` called `bindRequestedIds`. Adding a quote ID marks it as bind-requested; deleting it withdraws the request. The `Set` is immutable-safe — a new `Set` is always returned rather than mutating the existing one.

**Passed `onWithdrawBind` prop to `QuoteDetailModal`**

```jsx
<QuoteDetailModal
  quote={selectedQuote}
  onClose={() => setSelectedQuote(null)}
  onBindRequested={() => handleBindRequested(selectedQuote.id)}
  onWithdrawBind={() => handleWithdrawBind(selectedQuote.id)}
  bindRequested={bindRequestedIds.has(selectedQuote.id)}
/>
```

The quote ID is captured via closure at the time the modal is opened, so `handleWithdrawBind` always operates on the correct quote.

**Existing bind behavior (unchanged)**

- Bind-requested quotes are visually distinct on the card: dark border (`border-gray-700`), "Bind Requested" banner, and the action button changes to "View Bind Request"
- Quotes with a bind request are sorted to the front of the compare list
- When a bind is withdrawn, the quote loses the banner and border and returns to its premium-sorted position

---

## QuoteDetailModal.jsx

### What Changed

**Added `onWithdrawBind` prop**

```js
export default function QuoteDetailModal({
  quote,
  onClose,
  onBindRequested,
  onWithdrawBind,   // new
  bindRequested = false
})
```

**Added `now()` helper**

Extracted timestamp generation into a reusable helper to avoid duplication across `sendMessage` and `pushEvent`.

```js
function now() {
  return new Date().toLocaleString('en-US', {
    month: 'numeric', day: 'numeric', year: '2-digit',
    hour: 'numeric', minute: '2-digit'
  })
}
```

**Added `pushEvent()` helper**

Appends a system-level event to the message thread with `role: 'event'`. Events are not user messages — they record actions that happened on the quote.

```js
function pushEvent(text) {
  setMessages(prev => [
    ...prev,
    { id: `e${Date.now()}`, role: 'event', text, timestamp: now() }
  ])
}
```

**Bind button fires an event on click**

```jsx
onClick={() => {
  setReadyToBind(true)
  onBindRequested?.()
  pushEvent('Bind request submitted by broker.')
}}
```

**Withdraw button added to modal header**

The Withdraw button only renders when `readyToBind` is true (i.e. a bind request has already been sent). It sits to the left of the "Bind Request Sent" button and turns red on hover to signal a destructive action.

```jsx
{readyToBind && (
  <button
    onClick={() => {
      setReadyToBind(false)
      onWithdrawBind?.()
      pushEvent('Bind request withdrawn by broker.')
    }}
    className="text-sm text-gray-400 hover:text-red-600 transition-colors"
  >
    Withdraw
  </button>
)}
```

**`event` role added to message renderer**

Events render as a centered inline divider with the action text and timestamp — visually separate from broker and carrier messages. Regular messages are unaffected.

```jsx
{messages.map(msg => msg.role === 'event' ? (
  <div key={msg.id} className="flex items-center gap-2">
    <div className="flex-1 h-px bg-gray-200" />
    <span className="text-xs text-gray-400 whitespace-nowrap">{msg.text}</span>
    <span className="text-xs text-gray-300 whitespace-nowrap">{msg.timestamp}</span>
    <div className="flex-1 h-px bg-gray-200" />
  </div>
) : (
  // existing broker/carrier message render
))}
```

---

## Message Role Types

The message thread now supports three `role` values:

| Role | Rendered As | Triggered By |
|---|---|---|
| `carrier` | Left-aligned bubble, gray background | Mock data / carrier response |
| `broker` | Right-aligned bubble, dark background | Broker typing in the input |
| `event` | Centered divider with label and timestamp | System actions (bind, withdraw) |

---

## State Flow Summary

```
User clicks "Ready to Bind"
  → setReadyToBind(true)
  → onBindRequested() → CompareQuotes adds quoteId to bindRequestedIds Set
  → pushEvent("Bind request submitted by broker.")

User clicks "Withdraw"
  → setReadyToBind(false)
  → onWithdrawBind() → CompareQuotes removes quoteId from bindRequestedIds Set
  → pushEvent("Bind request withdrawn by broker.")
```

State lives in two places:
- `readyToBind` (local to `QuoteDetailModal`) — controls button label and Withdraw visibility
- `bindRequestedIds` (local to `CompareQuotes`) — controls card visual state and sort order

Both are kept in sync via the `onBindRequested` / `onWithdrawBind` callbacks. Neither is currently persisted to a backend.

---

## Known Limitations (Prototype Scope)

- Bind request state is held in component memory only. Refreshing the page resets all bind state.
- The `readyToBind` state initializes from the `bindRequested` prop, so reopening a bound quote correctly shows "Bind Request Sent" — but event messages (bind/withdraw history) in the feed are not restored on reopen.
- The broker identity in event messages is currently hardcoded. In production this should come from the authenticated user's profile.
