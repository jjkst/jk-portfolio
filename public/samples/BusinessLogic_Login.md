# Login — Business Logic Reference

## Purpose

Authenticate a Ruku Bookings user and establish the session that every booking,
availability and schedule screen depends on. This document is the review gate between
the requirement documents and the generated test cases.

## Evidence Basis

| | |
|---|---|
| Evidence mode | source + documents |
| Application source | `lib/ruku-bookings/src/lib/login` |
| Documents ingested | 2 |
| Generated | 2026-11-22 |
| Rules cited / inferred | 7 / 2 |
| Open conflicts | 2 |

> **Read the Conflicts and Open Questions sections before using this document.** Anything
> tagged `(inferred — …)` has not been verified against an artifact. This document is the
> review gate: a wrong rule costs minutes here and days downstream.

## Form Identity

| Key | Value |
|---|---|
| Form type code | `Login` |
| Entry page | `/login` |
| Database view | `vw_UserAccount` |
| Base table | `UserAccount` |
| Primary key | `UserAccountId` |
| Category | Authentication |
| Page title | Sign in to Ruku Bookings |

## Key Business Rules

| # | Rule | Source |
|---|---|---|
| 1 | Email is required. Empty submit shows "Email is required." | `login.component.ts` |
| 2 | Password is required. Empty submit shows "Password is required." | `login.component.ts` |
| 3 | Email must match RFC 5322 basic shape, else "Enter a valid email address." | `login.component.ts` |
| 4 | Invalid pair shows "Email or password is incorrect." and never says which. | Access_Matrix.xlsx p.3 |
| 5 | 5 consecutive failures lock the account for 15 minutes. | Booking_Spec.pdf p.14 |
| 6 | A locked account shows "Account locked. Try again in 15 minutes." | Booking_Spec.pdf p.14 |
| 7 | Successful login redirects to `/feature`. | `app.routes.ts` |
| 8 | Session token expires after 30 minutes idle. *(inferred — no artifact states the value)* | — |
| 9 | "Remember me" extends the session to 14 days. *(inferred — checkbox exists, behaviour undocumented)* | — |

## Documents vs. Implementation

Every row where the requirement documents and the shipped code do not say the same thing.
Nothing here is resolved by this document — each row is a question for a named human.

| # | Rule / field | Documented | Implemented | Source | Status |
|---|---|---|---|---|---|
| 1 | Lockout threshold | 5 attempts | 3 attempts | Booking_Spec.pdf p.14 vs `auth.service.ts` | ⚠ CONFLICT |
| 2 | Password minimum length | 12 characters | 8 characters | Access_Matrix.xlsx p.2 vs `login.component.ts` | ⚠ CONFLICT |
| 3 | "Remember me" | absent | present | `login.component.html` | UNDOCUMENTED |

Status vocabulary: `⚠ CONFLICT` (both sides state a value and they differ) ·
`NOT IMPLEMENTED` (documented, absent from source) ·
`UNDOCUMENTED` (in source, absent from the documents) · `AGREED` (both, matching).

## Security / Access Control

| Permission ID | Grants | Enforced when |
|---|---|---|
| `BOOKINGS_VIEW` | Reaches `/feature` after login | Always |
| `SCHEDULE_MANAGE` | Schedule Manager menu item | Always |

## Test Coverage

### Field → DataTable column map

| Field label | Column | Sample value |
|---|---|---|
| Email | Email | owner@ruku.test |
| Password | Password | Passw0rd!23 |
| Remember me | RememberMe | false |

### Behaviors to cover

| Behaviour | Depth |
|---|---|
| Valid sign-in reaches the booking feature list | smoke |
| Field validation blocks an empty or malformed submit | regression |
| Credential failure is reported without disclosing which field was wrong | regression |
| Repeated failure locks the account | regression |

### Proposed scenarios

| # | Scenario | Depth | Given | When | Then |
|---|---|---|---|---|---|
| 1 | Valid credentials sign the user in | smoke | the login page is open | Email `owner@ruku.test` is entered and Password `Passw0rd!23` is entered and Sign In is clicked | the booking feature list is displayed |
| 2 | Empty email is rejected | regression | the login page is open | Sign In is clicked with Email left blank | the message "Email is required." is shown |
| 3 | Malformed email is rejected | regression | the login page is open | Email `owner@` is entered and Sign In is clicked | the message "Enter a valid email address." is shown |
| 4 | Wrong password is reported without disclosure | regression | the login page is open | Email `owner@ruku.test` is entered and Password `wrong-pass` is entered and Sign In is clicked | the message "Email or password is incorrect." is shown |
| 5 | Repeated failure locks the account | regression | the login page is open | Sign In is clicked 5 times with Password `wrong-pass` | the message "Account locked. Try again in 15 minutes." is shown |

## Open Questions

| # | Question | Blocks |
|---|---|---|
| 1 | Is the lockout threshold 3 or 5? Code and spec disagree. | Scenario 5 |
| 2 | Is the documented 12-character minimum still intended? | Password validation coverage |
