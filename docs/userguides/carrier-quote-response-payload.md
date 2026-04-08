# Carrier Quote Response Payload

## Overview

When a carrier returns a quote, the platform expects one JSON object per quote. A single carrier may return multiple quotes (e.g. one per option, or multiple structures). Each quote object is added to the `returnedQuotes` array on the submission and displayed as a card in the Compare Quotes view.

---

## Example Payload (Single Quote)

```json
{
  "quoteId": "q_abc123",
  "submissionId": "sub_a1b2c3d4",
  "carrier": "Berkley",
  "market": "Admitted | A.M. Best Rating: A+ (Superior)",
  "quoteType": "Full Quote",
  "quoteRanOn": "04/08/26",

  "premium": 10350,

  "coverageDetails": {
    "coverageLimit": 10000000,
    "deductible": 20000,
    "claimLimit": 2000000,
    "eachOccurrenceLimit": 2000000,
    "aggregateLimit": 2000000
  },

  "subLimits": {
    "computer": 2000000,
    "fundsTransferFraud": 2000000,
    "hardwareReplacement": 250000,
    "postBreachRemediation": 250000,
    "socialEngineering": 250000,
    "telecomFraud": 250000,
    "websiteMediaContentLiability": 1000000,
    "serviceFraudAndCryptojacking": 50000,
    "dedicatedBreachCosts": 500000,
    "notificationOutsideLimit": 500000,
    "socialEngineeringDeductible": 10000
  }
}
```

---

## Field Reference

### Top-Level

| Field | Type | Required | Description |
|---|---|---|---|
| `quoteId` | string | Yes | Carrier-assigned unique ID for this quote |
| `submissionId` | string | Yes | The platform submission ID this quote is responding to |
| `carrier` | string | Yes | Carrier name displayed on the quote card and detail modal |
| `market` | string | Yes | Market type and A.M. Best rating displayed under carrier name (e.g. `"Admitted | A.M. Best Rating: A+ (Superior)"`) |
| `quoteType` | string | Yes | Type of quote — `"Full Quote"` or `"Broad Form Quote"` |
| `quoteRanOn` | string | Yes | Date the quote was generated, formatted `MM/DD/YY` |
| `premium` | number | Yes | Annual premium in dollars (no formatting — plain integer or decimal) |

---

### `coverageDetails`

| Field | Type | Required | Description |
|---|---|---|---|
| `coverageLimit` | number | Yes | Total policy coverage limit in dollars |
| `deductible` | number | Yes | Policy deductible in dollars |
| `claimLimit` | number | Yes | Per-claim limit in dollars |
| `eachOccurrenceLimit` | number | Yes | Per-occurrence limit in dollars |
| `aggregateLimit` | number | Yes | Annual aggregate limit in dollars |

---

### `subLimits`

All sub-limit values are in dollars as plain numbers. All fields are optional — omit any that do not apply to the quote.

| Field | Display Label |
|---|---|
| `computer` | Computer |
| `fundsTransferFraud` | Funds Transfer Fraud |
| `hardwareReplacement` | Hardware Replacement |
| `postBreachRemediation` | Post Breach Remediation |
| `socialEngineering` | Social Engineering |
| `telecomFraud` | Telecommunications Fraud |
| `websiteMediaContentLiability` | Website Media Content Liability |
| `serviceFraudAndCryptojacking` | Service Fraud and Cryptojacking |
| `dedicatedBreachCosts` | Dedicated Breach Costs |
| `notificationOutsideLimit` | Notification Outside the Limit |
| `socialEngineeringDeductible` | Social Engineering Deductible |

---

## Where Each Field Appears in the UI

### Compare Quotes Card (summary view)

| UI Element | Field |
|---|---|
| Carrier name (bold header) | `carrier` |
| Market type / rating (below name) | `market` |
| Quote Ran on | `quoteRanOn` |
| Premium | `premium` |
| Coverage Limit | `coverageDetails.coverageLimit` |
| Deductible | `coverageDetails.deductible` |
| Claim Limit | `coverageDetails.claimLimit` |
| Each Occurrence Limit | `coverageDetails.eachOccurrenceLimit` |
| Aggregate Limit | `coverageDetails.aggregateLimit` |
| Sub Limits section | `subLimits.*` |

### Quote Detail Modal (expanded view)

| UI Section | Field |
|---|---|
| Modal header — carrier name | `carrier` |
| Modal header — market badge | `market` |
| Modal header — date subtitle | `quoteRanOn` |
| Key Figures — Premium | `premium` |
| Key Figures — Coverage Limit | `coverageDetails.coverageLimit` |
| Key Figures — Deductible | `coverageDetails.deductible` |
| Coverage Details — Claim Limit | `coverageDetails.claimLimit` |
| Coverage Details — Each Occurrence Limit | `coverageDetails.eachOccurrenceLimit` |
| Coverage Details — Aggregate Limit | `coverageDetails.aggregateLimit` |
| Sub Limits | `subLimits.*` (all keys) |

---

## Notes

- **All monetary values** should be plain numbers (integers or decimals). The UI handles formatting for display.
- **`market`** is a single formatted string combining admitted status and A.M. Best rating. Suggested format: `"Admitted | A.M. Best Rating: A+ (Superior)"` or `"Non-Admitted | A.M. Best Rating: A (Excellent)"`.
- **`quoteType`** is stored on the quote and available in data but not currently displayed on the compare card — it is intended for future use in filtering or labeling.
- **Sub-limits are optional per field** — only include the keys that apply. The UI will render whatever keys are present.
- **Sort order** on the compare page is: bind-requested quotes first, then ascending by `premium`.
- A carrier may also respond with a **declination** rather than a quote. That response should go to the `allMarkets` array (not `returnedQuotes`) with a `status` of `"Declined"` and an optional `declinationReason` string.
