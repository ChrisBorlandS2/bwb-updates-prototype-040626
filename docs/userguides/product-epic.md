# SecondSight — Product Epic

## Vision

SecondSight is a broker-facing cyber insurance platform that streamlines the full submission lifecycle — from creating a new insurance request to comparing carrier quotes and binding a policy. The platform centralizes customer management, carrier communication, and quote analysis in a single workspace built for speed and clarity.

---

## Epic 1: Authentication & User Management

**Goal:** Allow brokers to securely access the platform with their own identity and personalized settings.

| # | User Story | Acceptance Criteria |
|---|---|---|
| 1.1 | As a broker, I want to log in with my email and password so I can access my book of business securely. | Login form with email/password, session token issued, redirect to Customers on success |
| 1.2 | As a broker, I want to stay logged in between sessions so I don't have to log in every time. | Persistent session via cookie or token refresh |
| 1.3 | As a broker, I want to log out so I can protect my account on shared devices. | Logout clears session and redirects to login |
| 1.4 | As an admin, I want to invite colleagues to the platform so my team can collaborate. | Invite via email, invite link expires after 48 hours |
| 1.5 | As a broker, I want my profile (name, email, brokerage) to auto-fill submission forms so I don't re-enter it each time. | Broker info stored in user profile and used as defaults in modal |
| 1.6 | As a broker, I want to reset my password if I forget it. | Forgot password flow via email with secure reset link |

---

## Epic 2: Customer Management

**Goal:** Give brokers a complete view of their customer book with the ability to create, search, and manage accounts.

| # | User Story | Acceptance Criteria |
|---|---|---|
| 2.1 | As a broker, I want to see a list of all my customers so I can quickly navigate to any account. | Customer list loads from backend, shows company, contact, and current status |
| 2.2 | As a broker, I want to search my customer list by company name or contact name so I can find accounts quickly. | Real-time search filtering, clears on X or empty input |
| 2.3 | As a broker, I want to filter customers by status so I can focus on accounts that need attention. | Status filter dropdown with multi-select, updates list in real time |
| 2.4 | As a broker, I want to add a new customer so I can onboard new accounts. | "Add Customer" opens a form, saves to backend, appears in list immediately |
| 2.5 | As a broker, I want to edit a customer's company profile (address, website, NAICS, revenue, employees) so the record stays up to date. | Inline or modal edit, saves to backend, reflects in panel |
| 2.6 | As a broker, I want to view a customer's primary and secondary NAICS codes so I can verify their industry classification. | NAICS displayed in company profile section in "code — name" format |
| 2.7 | As a broker, I want to add contributors to a customer record so my teammates can collaborate on the account. | Contributor added by email search, saved to backend, appears in Contributors section |
| 2.8 | As a broker, I want to remove a contributor from a customer record. | Remove button on each contributor card, confirmation required, saves to backend |
| 2.9 | As a broker, I want the customer list status badge to always reflect the most recent submission status so I have an at-a-glance view of where each account stands. | Badge updates immediately when new submission is added |
| 2.10 | As a broker, I want to invite an insured contact to the platform so they can provide information directly. | "Needs Invite" status triggers invite email to insured contact |

---

## Epic 3: Submission Creation

**Goal:** Allow brokers to create detailed, structured submissions with multiple coverage options and send them to selected carriers.

| # | User Story | Acceptance Criteria |
|---|---|---|
| 3.1 | As a broker, I want to start a new submission for a customer from the submissions table so I can request quotes. | "Add Submission" button opens the multi-step modal |
| 3.2 | As a broker, I want to select an insurance type (e.g. Cyber) for the submission. | Dropdown with available insurance types |
| 3.3 | As a broker, I want to enter an effective date and have the end date auto-calculate to one year minus one day so I don't have to compute it manually. | Effective date input triggers end date calculation; end date is editable |
| 3.4 | As a broker, I want to select which carriers to submit to so I can target the right markets. | Multi-select checkboxes for available carriers; all pre-selected by default |
| 3.5 | As a broker, I want to enter a coverage limit, deductible, waiting period, prior acts date, and target premium per option so I can specify the terms I'm requesting. | All fields captured per option; currency fields auto-format |
| 3.6 | As a broker, I want to select coverages from a standard list so I can define the scope of the policy being requested. | Coverage checklist appears once at least one carrier is selected |
| 3.7 | As a broker, I want to add up to two additional alternative options (Options 2 and 3) so I can request multiple coverage structures in a single submission. | Each option has its own carriers, limit, deductible, waiting period, prior acts date, target premium, and coverages; options display side by side |
| 3.8 | As a broker, I want company information (name, address, contact, NAICS, revenue) to pre-fill from the customer profile so I can avoid re-entering data. | Step 2 fields initialize from customer data; editable by broker |
| 3.9 | As a broker, I want to search and select NAICS codes by code number or industry name so I can accurately classify the insured. | Typeahead filters by code prefix or name; same code cannot be selected for both primary and secondary |
| 3.10 | As a broker, I want to answer security and risk questions about the insured so carriers have the information they need to evaluate the risk. | 5 yes/no questions, all required before proceeding |
| 3.11 | As a broker, I want to review everything before submitting so I can catch errors before sending to carriers. | Read-only review screen with all steps summarized; broker info editable on this step |
| 3.12 | As a broker, I want to add a message or notes for carriers so I can provide context beyond the structured form. | Free-text message field on review step; included in submission payload |
| 3.13 | As a broker, I want the submission to be saved to the customer's record and sent to carriers when I click Submit so the workflow is completed in one action. | Submission created in backend, carriers notified, new row appears in submissions table with "Requested" status |
| 3.14 | As a broker, I want each step of the form to validate required fields before I can proceed so I don't submit incomplete submissions. | Next button disabled until all required fields on current step are complete |

---

## Epic 4: Submission Management

**Goal:** Give brokers visibility into the status and details of every submission, with a communication thread per submission.

| # | User Story | Acceptance Criteria |
|---|---|---|
| 4.1 | As a broker, I want to see all submissions for a customer in a table so I can track progress across years and policy types. | Submissions listed with year, type, limit, and status; sorted by most recent first |
| 4.2 | As a broker, I want to click a submission to see its full details so I can review what was sent to carriers. | Submission detail modal shows all fields from the original form |
| 4.3 | As a broker, I want to see the date a submission was requested so I can track turnaround times. | Requested date shown in submission detail modal header |
| 4.4 | As a broker, I want to send and receive messages within a submission so I can communicate with the insured without leaving the platform. | Message thread in submission detail modal; messages persist per submission; auto-scrolls to latest |
| 4.5 | As a broker, I want submissions to update their status automatically as carriers respond so I always know where things stand. | Status transitions: Requested → Submission → Quote → Binding → In Force |
| 4.6 | As a broker, I want to see which submission has quotes ready so I can navigate to the compare view quickly. | "Quote" status row is clickable and opens Compare Quotes |

---

## Epic 5: Quote Comparison

**Goal:** Let brokers compare all returned carrier quotes side by side to make informed recommendations to their clients.

| # | User Story | Acceptance Criteria |
|---|---|---|
| 5.1 | As a broker, I want to see all returned quotes displayed side by side so I can compare coverage and pricing at a glance. | Compare Quotes view shows one card per returned quote; cards scroll horizontally if needed |
| 5.2 | As a broker, I want quotes sorted by premium (lowest to highest) so the most competitive options are shown first. | Default sort is ascending by premium; bind-requested quotes pinned to front |
| 5.3 | As a broker, I want to see each quote's carrier, market type, A.M. Best rating, premium, coverage limit, deductible, and quote type so I have all key information in one view. | All fields displayed on quote card; no truncation |
| 5.4 | As a broker, I want to see sub-limits for each quote so I can evaluate the details of coverage. | Sub-limits section expands per quote card with all relevant values |
| 5.5 | As a broker, I want to see a summary of all markets approached — including declined and in-progress — so I know the full picture of market activity. | All Markets table below quote cards with carrier, market type, status, and declination reason |
| 5.6 | As a broker, I want to open a full quote detail view so I can review the complete terms before recommending it to the client. | "View Quote" button opens QuoteDetailModal with full details and sub-limits |
| 5.7 | As a broker, I want to view policy forms for a quote so I can review the actual carrier documents. | "View Policy Forms" link opens carrier document (PDF or external link) |
| 5.8 | As a broker, I want to message the carrier directly from within a quote so I can ask questions or negotiate terms without switching tools. | Message thread in QuoteDetailModal; messages associated with specific quote and carrier |
| 5.9 | As a broker, I want to keep the customer profile panel visible while comparing quotes so I can reference company information without navigating away. | CustomerPanel visible on left side of Compare Quotes view in collapsed state |

---

## Epic 6: Bind Request Workflow

**Goal:** Allow brokers to initiate a bind request on a selected quote and track the status through to policy issuance.

| # | User Story | Acceptance Criteria |
|---|---|---|
| 6.1 | As a broker, I want to initiate a bind request on a quote so I can move the selected policy forward. | "Ready to Bind" button in QuoteDetailModal; on click transitions to "Bind Request Sent" |
| 6.2 | As a broker, I want the bound quote card to be visually distinct on the compare screen so I can clearly see which quote is in the bind process. | Bound quote card shows dark banner, distinct border, and moves to front of list |
| 6.3 | As a broker, I want the bind request state to persist when I close and reopen the quote so I don't lose context. | "Bind Request Sent" state maintained when reopening the same quote in the same session |
| 6.4 | As a broker, I want the submission status to update to "Binding" once a bind request is submitted so the customer list reflects the correct stage. | Status updates across submissions table and customer list badge |
| 6.5 | As a broker, I want to view the bind request details after submission so I can confirm what was sent. | "View Bind Request" button opens a bind request summary |
| 6.6 | As a broker, I want the policy status to update to "In Force" once the carrier confirms binding so I know the policy is active. | Status transitions automatically when carrier confirms; customer list badge updates |

---

## Epic 7: Navigation & Routing

**Goal:** Give the platform a coherent navigation structure that allows brokers to move between views without losing context.

| # | User Story | Acceptance Criteria |
|---|---|---|
| 7.1 | As a broker, I want the sidebar navigation to link to real pages so I can move around the platform. | All nav items route to their respective views |
| 7.2 | As a broker, I want deep linking so I can share a URL to a specific customer or submission with a colleague. | Each customer, submission, and quote has a unique URL |
| 7.3 | As a broker, I want the browser back button to work correctly so I can navigate naturally. | Router history managed correctly |
| 7.4 | As a broker, I want to navigate to a Team management page so I can see and manage my colleagues. | Team management page shows list of team members with roles |
| 7.5 | As a broker, I want to access Carrier Settings so I can manage carrier relationships and preferences. | Carrier Settings page available from sidebar |

---

## Epic 8: Notifications & Alerts

**Goal:** Keep brokers informed when something requires their attention without requiring them to check the platform constantly.

| # | User Story | Acceptance Criteria |
|---|---|---|
| 8.1 | As a broker, I want to receive an email notification when a quote is returned for a submission so I know to review it. | Email sent when carrier returns quote; includes link to compare view |
| 8.2 | As a broker, I want to receive an in-app notification when a submission status changes so I can take action promptly. | Notification badge in sidebar; notification list shows recent activity |
| 8.3 | As a broker, I want to be notified when a carrier declines a submission so I can inform the client and explore other options. | Declination appears in All Markets table and triggers notification |
| 8.4 | As a broker, I want to receive a notification when a bind request is confirmed so I know the policy is in force. | Email and in-app notification when carrier confirms binding |

---

## Epic 9: Backend & Data Persistence

**Goal:** Replace all mocked data and client-side state with a real backend so data is saved, shared, and consistent across sessions.

| # | User Story | Acceptance Criteria |
|---|---|---|
| 9.1 | As the system, I want all customer records to be stored in a database so data persists across sessions. | API endpoints for CRUD on customers; data loads from backend on page load |
| 9.2 | As the system, I want all submissions to be stored and associated with the correct customer. | Submissions persist to backend on creation; retrieved per customer |
| 9.3 | As the system, I want quotes returned by carriers to be stored and associated with the correct submission. | Quotes stored per submission; API returns all quotes for a given submission |
| 9.4 | As the system, I want message threads to be stored per submission and per quote so they persist across sessions. | Messages stored with sender, timestamp, and association to submission or quote |
| 9.5 | As the system, I want bind request status to be stored and trigger downstream status changes. | Bind request stored with timestamp; triggers status update on submission |
| 9.6 | As the system, I want carrier responses (quotes, declines, in-progress) to update submission status automatically. | Carrier webhook or polling updates submission status in real time |

---

## Epic 10: Carrier Integration

**Goal:** Connect the platform to carriers so submissions are sent electronically and quotes are received automatically.

| # | User Story | Acceptance Criteria |
|---|---|---|
| 10.1 | As the system, I want to send submission data to carriers electronically when a broker submits a request. | Submission payload sent to each selected carrier via API or ACORD format |
| 10.2 | As the system, I want to receive and parse quotes returned by carriers and display them in the compare view. | Carrier quotes ingested, mapped to data model, and displayed in CompareQuotes |
| 10.3 | As the system, I want to send bind requests to the selected carrier electronically. | Bind request triggers carrier API call or structured email |
| 10.4 | As a broker, I want to configure which carriers are available for each insurance type so only relevant markets are shown. | Carrier Settings page allows enabling/disabling carriers per product line |

---

## Epic 11: Reporting & Analytics

**Goal:** Give brokers and managers insight into their book of business and submission activity.

| # | User Story | Acceptance Criteria |
|---|---|---|
| 11.1 | As a broker, I want to see a dashboard summarizing my book — total customers, open submissions, quotes pending, and policies in force — so I can understand my pipeline at a glance. | Dashboard view with KPI cards and counts |
| 11.2 | As a broker, I want to export quotes from the comparison view so I can share them with the client outside the platform. | "Export All Quotes" generates a PDF or CSV of the compare view |
| 11.3 | As a manager, I want to see submission and bind activity across my team so I can track productivity. | Team reporting page with submission volume, quote conversion rate, and bind rate |
| 11.4 | As a broker, I want to view historical submissions and policies for a customer so I can understand their coverage history. | Submissions table shows all years; historical policies accessible |

---

## Out of Scope for v1

The following features were identified in the prototype but are deferred:

- **Co-Pilot / Advisory Dashboard** — AI-driven risk advisory tab shown in customer panel; full feature deferred
- **Customer Portal** — Insured-facing view for completing questionnaires; broker-facing workflow takes priority
- **Policy Document Management** — Full document upload, storage, and versioning
- **Multi-line submissions** — Currently Cyber only; E&O and other lines deferred
- **Custom Carrier Templates** — Carrier-specific form variations and ACORD form generation

---

## Story Point Summary (Rough Estimates)

| Epic | Stories | Estimated Effort |
|---|---|---|
| 1. Authentication & User Management | 6 | Medium |
| 2. Customer Management | 10 | Large |
| 3. Submission Creation | 14 | Large |
| 4. Submission Management | 6 | Medium |
| 5. Quote Comparison | 9 | Large |
| 6. Bind Request Workflow | 6 | Medium |
| 7. Navigation & Routing | 5 | Small |
| 8. Notifications & Alerts | 4 | Medium |
| 9. Backend & Data Persistence | 6 | Large |
| 10. Carrier Integration | 4 | X-Large |
| 11. Reporting & Analytics | 4 | Medium |
| **Total** | **74** | |
