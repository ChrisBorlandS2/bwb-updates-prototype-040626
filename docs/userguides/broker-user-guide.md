# SecondSight Broker User Guide

## Overview

SecondSight is a broker-facing cyber insurance platform that helps you manage clients, submit insurance requests to carriers, and compare returned quotes — all in one place.

---

## Navigation

The left sidebar provides access to the main sections of the platform. The primary workspace is divided into two panels:

- **Left panel** — the customer list, showing all your accounts and their current status
- **Right panel** — the customer detail view, which opens when you select an account

---

## Customer List

The customer list displays all of your accounts. Each row shows:

- **Company name**
- **Status badge** — reflects the most recent submission's status (e.g. Quote, In Force, Binding, Not Started, Needs Invite)

Click any row to open the customer detail panel on the right.

### Status Types

| Status | Meaning |
|---|---|
| Not Started | No submissions have been created yet |
| Needs Invite | The insured has not yet been invited to the platform |
| Submission | A submission has been created and sent |
| Quote | Quotes have been returned from carriers |
| Binding | A bind request has been initiated |
| In Force | The policy is active |

---

## Customer Detail Panel

When you select a customer, the detail panel opens on the right and shows:

### Company Profile
Key information about the insured including:
- Address, website, and NAICS industry codes
- Revenue (TTM) and employee count
- Broker contact and brokerage name

### Submissions Table
A list of all submissions for this customer, showing year, type, limit, and status. Click any row to open the submission detail.

### Collapsing the Panel
Click the **>>** button at the top right of the customer panel to collapse it and give more room to the main workspace. Click again to expand.

---

## Adding a New Submission

Click **Add Submission** in the Submissions section to open the new submission modal. The modal walks you through 4 steps.

---

### Step 1 — Submission Details

**Insurance Type**
Select the type of insurance (currently Cyber).

**Effective Date / End Date**
Enter the policy effective date. The end date auto-calculates to one year minus one day. You can override the end date manually.

#### Option 1 (Required)

Each submission requires at least one option. Fill in the following for Option 1:

- **Carriers** — Select one or more carriers to submit to. All carriers are pre-selected by default: RLI, Berkley, Mosaic, Ryan.
- **Limit** — The coverage limit (e.g. $5,000,000)
- **Deductible** — The policy deductible (e.g. $10,000)
- **Waiting Period (hours)** — Business interruption waiting period in hours (e.g. 8)
- **Prior Acts Date** — The retroactive/prior acts date for the policy
- **Target Premium** — Your target premium for this option
- **Coverages** — Select the coverages to request. The coverage list appears once at least one carrier is selected.

#### Adding Optional Requests (Options 2 and 3)

Click **+ Add Optional Request** to add a second option to the right of Option 1. You can add up to two additional options (3 total). Each option has its own carriers, limit, deductible, waiting period, prior acts date, target premium, and coverages.

When multiple options are present, each is labeled **Option 1**, **Option 2**, **Option 3** and displayed side by side. Click **Remove** on any optional to delete it.

---

### Step 2 — Company Information

Fill in or verify the insured company's information:

- Company Name and Year Established
- Address and Website URL
- Insured Contact name and email
- Revenue (TTM) and Employee Count
- Primary NAICS and Secondary NAICS

**NAICS Typeahead**
Start typing a NAICS code or industry name to search. Select the correct entry from the dropdown. The same code cannot be selected in both Primary and Secondary fields.

Fields pre-fill automatically from the customer's profile where data is available.

---

### Step 3 — Security & Risk

Answer five yes/no questions about the insured's security posture:

1. Is MFA enforced for email and remote access?
2. Are offline, cloud-based or immutable backups in place?
3. Is IT managed by an external third party provider?
4. Is dual authorization required for fund transfers greater than $10,000?
5. Have there been any cyber incidents in the last three years that resulted in losses greater than $25,000?

All five questions must be answered before proceeding.

---

### Step 4 — Review

Review a summary of everything entered across all steps. You can also:

- Edit **Broker Information** (pre-filled with your name, email, and brokerage)
- Add a **Message** for the carriers with any notes or special instructions

Click **Submit** to send the submission.

---

## Viewing a Submission

Click any row in the Submissions table to open the Submission Detail modal. This shows:

- Insurance type, limit, deductible, target premium
- Carriers selected and coverages requested
- Insured contact information
- The date the submission was requested

---

## Comparing Quotes

When a submission has a **Quote** status, clicking it opens the **Compare Quotes** view — a full-screen side-by-side comparison of all returned quotes.

### Quote Cards

Each carrier's quote is shown as a card displaying:
- Carrier name and market type (Admitted / Non-Admitted)
- A.M. Best rating
- Coverage limit, deductible, and premium
- Quote type (Full Quote or Broad Form Quote)

Quotes are sorted from lowest to highest premium.

### Viewing Quote Details

Click **View Quote** on any card to open the full quote detail, including all sub-limits and policy specifics. Click **View Policy Forms** to access carrier policy documents.

### Requesting a Bind

Inside the quote detail modal, click **Ready to Bind** to send a bind request to the carrier. The button changes to **Bind Request Sent** to confirm the request was submitted.

Back on the Compare Quotes screen, quotes with a bind request:
- Are moved to the front of the list
- Display a **Bind Requested** banner
- Show a **View Bind Request** button instead of **View Quote**

### All Markets Table

Below the quote cards, a summary table shows the status of all markets approached, including those that declined, are in progress, or are incomplete.

---

## Tips

- The customer list status badge always reflects the **most recent submission**. Adding a new submission will update the badge automatically.
- NAICS codes pre-fill from the customer profile when you open a new submission.
- Broker information (name, contact, brokerage) pre-fills from your account and can be edited on the Review step.
- The submission modal expands wider when optional requests are added to accommodate the side-by-side layout.
