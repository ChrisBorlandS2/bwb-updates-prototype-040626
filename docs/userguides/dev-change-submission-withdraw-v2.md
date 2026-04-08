# Developer Change Notes — Submission Withdraw & Archive Flow

## Overview

This document covers all changes made to the submission withdraw flow, building on the initial implementation. Changes span carrier tracking across multiple withdrawals, automatic status archiving, and the Archived status badge.

---

## Files Changed

- `src/components/SubmissionDetailModal.jsx`
- `src/components/CustomerPanel.jsx`

---

## SubmissionDetailModal.jsx

### Problem: Carriers Not Visible in Withdraw Modal

**Root cause:** Mock data submissions do not have a `carriers` field. The withdraw modal was initializing with `submission.carriers || []`, which resolved to an empty array for any submission not created through the new submission form.

**Fix:** A `DEFAULT_CARRIERS` constant was added as a fallback. A `submissionCarriers` variable is computed once at the top of the component and used everywhere carriers are needed.

```js
const DEFAULT_CARRIERS = ['RLI', 'Berkley', 'Mosaic', 'Ryan']

const submissionCarriers = submission.carriers?.length
  ? submission.carriers
  : DEFAULT_CARRIERS
```

---

### Tracking Previously Withdrawn Carriers

A new `withdrawnCarriers` state array was added to track which carriers have already had the request withdrawn in previous confirm actions.

```js
const [withdrawnCarriers, setWithdrawnCarriers] = useState([])
```

`remainingCarriers` is derived from `submissionCarriers` minus `withdrawnCarriers` and is recomputed on every render:

```js
const remainingCarriers = submissionCarriers.filter(c => !withdrawnCarriers.includes(c))
```

The sub-modal now maps over `remainingCarriers` instead of the full carrier list, so previously withdrawn carriers do not appear again.

---

### Modal Open Behavior

`openWithdrawModal()` replaces the inline `onClick` on the Withdraw Request button. It resets `withdrawCarriers` to all remaining carriers (pre-checked) each time the modal opens, so the state is always fresh relative to what is still active.

```js
function openWithdrawModal() {
  setWithdrawCarriers([...remainingCarriers])
  setShowWithdrawModal(true)
}
```

The "Withdraw Request" link in the header is hidden once all carriers have been withdrawn (`remainingCarriers.length === 0`).

---

### Archive on Full Withdrawal

`confirmWithdraw()` now checks whether all carriers have been withdrawn after the current action completes. If so, it calls `onStatusChange('Archived')` to update the submission status in the parent.

```js
function confirmWithdraw() {
  const allWithdrawnAfter = [...withdrawnCarriers, ...withdrawCarriers]
  setWithdrawnCarriers(allWithdrawnAfter)

  const label = withdrawCarriers.length === remainingCarriers.length
    ? 'all carriers'
    : withdrawCarriers.join(', ')
  pushEvent(`Submission withdrawn from ${label} by broker.`)

  if (allWithdrawnAfter.length >= submissionCarriers.length) {
    onStatusChange?.('Archived')
  }

  setShowWithdrawModal(false)
}
```

The check compares the cumulative withdrawn count against the total carrier count. Partial withdrawals do not trigger archiving.

---

### `onStatusChange` Prop

A new optional prop `onStatusChange` was added to `SubmissionDetailModal`:

```js
export default function SubmissionDetailModal({ submission, customer, onClose, onStatusChange })
```

It is called with the new status string (`'Archived'`) and is handled by the parent (`CustomerPanel`).

---

### Sub-Modal Width

The withdraw carrier-selection sub-modal was widened from `w-80` (320px) to `w-96` (384px) to prevent the "Withdraw Request" button label from wrapping to a second line.

---

## CustomerPanel.jsx

### Archived Status Badge

`'Archived'` was added to `submissionStatusConfig` with a light gray styling to visually distinguish it from active statuses:

```js
'Archived': { bg: '#e5e7eb', text: '#6b7280' },
```

---

### `onStatusChange` Handler

The `onStatusChange` callback passed to `SubmissionDetailModal` updates the submission in two places simultaneously:

1. **`submissions` state** — updates the status in the full list so the submissions table reflects the change immediately
2. **`selectedSubmission` state** — updates the currently open modal's submission object so the header badge updates in place without a close/reopen cycle

```js
onStatusChange={(newStatus) => {
  setSubmissions(prev =>
    prev.map(s => s.id === selectedSubmission.id ? { ...s, status: newStatus } : s)
  )
  setSelectedSubmission(prev => ({ ...prev, status: newStatus }))
}}
```

---

### Archived Submissions Remain Viewable

The condition controlling when `SubmissionDetailModal` renders was extended to include `'Archived'` status, so brokers can still open a withdrawn submission to review its history and message thread:

```js
{selectedSubmission &&
  (selectedSubmission.status === 'Requested' || selectedSubmission.status === 'Archived') && (
  <SubmissionDetailModal ... />
)}
```

When a submission is Archived, the "Withdraw Request" link is hidden (because `remainingCarriers.length === 0`), making the modal read-only with respect to the withdraw flow.

---

## State Flow Summary

```
Broker opens Withdraw modal (first time)
  → remainingCarriers = all submissionCarriers
  → withdrawCarriers initialized to all (all checked)

Broker withdraws from Berkley only
  → withdrawnCarriers = ['Berkley']
  → remainingCarriers = ['RLI', 'Mosaic', 'Ryan']
  → event logged: "Submission withdrawn from Berkley by broker."
  → status unchanged (not all withdrawn)

Broker opens Withdraw modal (second time)
  → only ['RLI', 'Mosaic', 'Ryan'] shown, all checked

Broker withdraws all remaining
  → withdrawnCarriers = ['Berkley', 'RLI', 'Mosaic', 'Ryan']
  → allWithdrawnAfter.length >= submissionCarriers.length → true
  → onStatusChange('Archived') called
  → event logged: "Submission withdrawn from all carriers by broker."
  → submission status → 'Archived' in CustomerPanel state
  → "Withdraw Request" link disappears
```

---

## Known Limitations (Prototype Scope)

- `withdrawnCarriers` and `withdrawCarriers` state lives inside `SubmissionDetailModal`. Closing and reopening the modal resets all withdrawal tracking — only the status change persists.
- Partial withdrawals (some but not all carriers) do not affect the submission status. In production, per-carrier status should be tracked on the submission record.
- The "Archived" status does not propagate to the customer list badge. In production, the customer list badge should reflect the most recent non-archived submission's status.
- The broker identity in event messages is hardcoded to "broker". In production this should come from the authenticated user's profile.
