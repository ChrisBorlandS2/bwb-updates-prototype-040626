

## Story : Submission Creation

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

## Story : Submission Management

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

## Story : Quote Comparison

**Goal:** Let brokers compare all returned carrier quotes side by side to make informed recommendations to their clients.

NOTE: this one hasn't changed much but just needs some slight adjustments.

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

## Story : Bind Request Workflow

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

