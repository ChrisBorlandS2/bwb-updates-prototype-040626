# Carrier Submission Payload

## Overview

When a broker submits a new submission, the platform sends one JSON payload **per selected carrier**. Each payload contains the full submission context — broker info, insured company details, security & risk answers, and all coverage options requested.

The `options` array contains 1–3 coverage structures. If the broker added optional requests (Option 2 and/or Option 3), all options are included in the same payload to the carrier so they can quote any or all of them.

---

## Payload Structure

```json
{
  "submission": {
    "id": "sub_a1b2c3d4",
    "submittedAt": "2026-04-08T14:32:00Z",
    "insuranceType": "Cyber"
  },

  "broker": {
    "name": "Thomas Baker",
    "email": "thomasb@marsh.com",
    "brokerage": "Marsh"
  },

  "insured": {
    "companyName": "Hartwell Financial Group",
    "yearEstablished": "2003",
    "address": "333 Wall Street, SF, CA 33101",
    "website": "www.hartwellfinancial.com",
    "primaryNaics": {
      "code": "523110",
      "description": "Investment Banking and Securities Dealing"
    },
    "secondaryNaics": {
      "code": "522210",
      "description": "Credit Card Issuing"
    },
    "revenueTTM": 13000000,
    "employeeCount": 100,
    "contact": {
      "name": "Sarah Mitchell",
      "email": "s.mitchell@hartwellfinancial.com"
    }
  },

  "securityProfile": {
    "mfaEnforcedForEmailAndRemoteAccess": "Yes",
    "offlineOrImmutableBackupsInPlace": "Yes",
    "itManagedByExternalThirdParty": "No",
    "dualAuthorizationRequiredForFundTransfers": "Yes",
    "cyberIncidentsInLast3Years": "No"
  },

  "options": [
    {
      "optionNumber": 1,
      "effectiveDate": "2026-06-01",
      "endDate": "2027-05-31",
      "priorActsDate": "2021-06-01",
      "coverageLimit": 5000000,
      "deductible": 10000,
      "waitingPeriodHours": 8,
      "targetPremium": 12000,
      "coverages": [
        "First Party Coverage",
        "Third Party Liability",
        "Business Interruption",
        "Data Recovery",
        "Ransomware / Extortion",
        "Social Engineering",
        "Funds Transfer Fraud",
        "Regulatory Defense & Penalties",
        "Media Liability",
        "Network Security Liability"
      ]
    },
    {
      "optionNumber": 2,
      "effectiveDate": "2026-06-01",
      "endDate": "2027-05-31",
      "priorActsDate": "2024-06-01",
      "coverageLimit": 10000000,
      "deductible": 25000,
      "waitingPeriodHours": 12,
      "targetPremium": 18000,
      "coverages": [
        "First Party Coverage",
        "Third Party Liability",
        "Business Interruption",
        "Ransomware / Extortion",
        "Funds Transfer Fraud"
      ]
    }
  ],

  "message": "Please quote all options. Client is renewing and prefers admitted markets where possible.",

  "meta": {
    "platformVersion": "1.0",
    "submissionSource": "SecondSight"
  }
}
```

---

## Field Reference

### `submission`
| Field | Type | Description |
|---|---|---|
| `id` | string | Platform-generated unique submission ID |
| `submittedAt` | ISO 8601 datetime | UTC timestamp of when the broker clicked Submit |
| `insuranceType` | string | Always `"Cyber"` in v1 |

---

### `broker`
| Field | Type | Source |
|---|---|---|
| `name` | string | Broker's profile / Step 4 editable field |
| `email` | string | Broker's profile / Step 4 editable field |
| `brokerage` | string | Broker's profile / Step 4 editable field |

---

### `insured`
| Field | Type | Source |
|---|---|---|
| `companyName` | string | Step 2 — pre-filled from customer record |
| `yearEstablished` | string | Step 2 |
| `address` | string | Step 2 — pre-filled from customer record |
| `website` | string | Step 2 — pre-filled from customer record |
| `primaryNaics.code` | string | Step 2 — typeahead, pre-filled from customer record |
| `primaryNaics.description` | string | Step 2 — typeahead label |
| `secondaryNaics.code` | string | Step 2 — typeahead, pre-filled from customer record |
| `secondaryNaics.description` | string | Step 2 — typeahead label |
| `revenueTTM` | number | Step 2 — numeric value (strip `$` and commas) |
| `employeeCount` | number | Step 2 |
| `contact.name` | string | Step 2 — pre-filled from customer record |
| `contact.email` | string | Step 2 — pre-filled from customer record |

---

### `securityProfile`
| Field | Type | Source |
|---|---|---|
| `mfaEnforcedForEmailAndRemoteAccess` | `"Yes"` \| `"No"` | Step 3 — Question 1 |
| `offlineOrImmutableBackupsInPlace` | `"Yes"` \| `"No"` | Step 3 — Question 2 |
| `itManagedByExternalThirdParty` | `"Yes"` \| `"No"` | Step 3 — Question 3 |
| `dualAuthorizationRequiredForFundTransfers` | `"Yes"` \| `"No"` | Step 3 — Question 4 |
| `cyberIncidentsInLast3Years` | `"Yes"` \| `"No"` | Step 3 — Question 5 |

---

### `options[]`
One object per coverage option (1–3). Option 1 always present; Options 2 and 3 only included if the broker added them.

| Field | Type | Source |
|---|---|---|
| `optionNumber` | integer | 1, 2, or 3 |
| `effectiveDate` | ISO 8601 date | Step 1 — same for all options |
| `endDate` | ISO 8601 date | Step 1 — auto-calculated or overridden |
| `priorActsDate` | ISO 8601 date | Step 1 — per option |
| `coverageLimit` | number | Step 1 — numeric (strip `$` and commas) |
| `deductible` | number | Step 1 — numeric (strip `$` and commas) |
| `waitingPeriodHours` | number | Step 1 — integer hours |
| `targetPremium` | number | Step 1 — numeric (strip `$` and commas); omit if blank |
| `coverages` | string[] | Step 1 — array of selected coverage names |

---

### `message`
| Field | Type | Source |
|---|---|---|
| `message` | string | Step 4 — free text; omit key if blank |

---

### `meta`
| Field | Type | Description |
|---|---|---|
| `platformVersion` | string | Version of SecondSight that generated the submission |
| `submissionSource` | string | Always `"SecondSight"` |

---

## Notes

- **One payload per carrier.** The platform sends this JSON once for each carrier selected in an option. If a carrier appears in Option 1 only, they receive only Option 1. If the same carrier appears in multiple options, all applicable options are included.
- **Currency fields** are stored as formatted strings in the UI (e.g. `"$5,000,000"`). These must be parsed to plain numbers before sending.
- **NAICS fields** are stored as `"code — description"` strings in the UI and should be split into separate `code` and `description` fields in the payload.
- **`targetPremium`** is optional. If the broker left it blank, omit the field rather than sending `null` or `0`.
- **`message`** is optional. Omit the field if empty.
