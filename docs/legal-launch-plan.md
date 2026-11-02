# Legal Launch Implementation Plan

## Purpose

Prepare PokemonPGC's public legal disclosures before live payments while keeping the implementation reviewable, reversible, and accurate to the current application.

These documents are operational drafts for attorney review, not a substitute for legal advice.

## Confirmed operator decisions

- Operator: HeadInTheCloudsHaven LLC, Pennsylvania, United States.
- Public legal and privacy contact: `contact@headinthecloudshaven.com`.
- Do not publish the owner's city, residential address, or telephone number unless a later legal or provider requirement makes one necessary.
- Accounts are intended for people age 13 or older.
- Purchases require the customer to be age 18 or older or to have a parent or legal guardian complete or authorize the purchase.
- Subscriptions renew until canceled. Cancellation preserves access through the paid term. Refunds are not automatically prorated and are handled case by case or where required by law.
- Personal information is not sold, rented, used for cross-context behavioral advertising, or used for marketing email.
- Transactional account and billing communications remain permitted.

## Scope

1. Add shared legal configuration for the operator, contact, effective date, policy version, and unofficial-project notice.
2. Add public routes for Terms of Service, Privacy Policy, Refund and Cancellation Policy, and Copyright and Trademark Notice.
3. Add a shared marketing footer with the legal links, operator copyright, contact email, and a prominent unofficial-project notice.
4. Add links to the Terms and Privacy Policy in the account-creation surface.
5. Add clear recurring-billing, cancellation, refund, age, and legal-link disclosure immediately before a customer starts a new paid subscription.
6. Require explicit client and server confirmation of those purchase terms for new Stripe or PayPal subscription creation, and record the policy version in provider metadata where the provider contract permits it.
7. Add source-contract tests for the public routes, notice, legal links, and billing acknowledgement.
8. Update the local-only action list with attorney review, age-screening, IP provenance, DMCA, consent evidence, and privacy-operations follow-ups.

## Content boundaries

- State prominently that PokemonPGC is independent, unofficial, fan-created, and is not licensed, sponsored, endorsed, authorized, affiliated with, or operated in partnership with Nintendo, The Pokemon Company, Game Freak, Creatures Inc., or their affiliates.
- State that a disclaimer and attribution do not create a license or permission to use third-party intellectual property.
- Do not make a blanket fair-use claim.
- Do not represent HeadInTheCloudsHaven LLC as having a Pokemon license.
- Do not claim DMCA safe-harbor registration. The current service does not publish user-submitted content; a formal agent and public service address should be reconsidered before adding public user uploads or posts.
- Describe current data handling conservatively, including account data, cloud progress, custom icons, transient save imports, provider identifiers, local browser storage, operational logs, and third-party processors.
- Avoid absolute security, deletion, availability, or legal-compliance promises.

## Age-screening decision

The Terms establish a 13+ account rule. Public signup neutrally requests birth month/year before showing credential fields, re-checks the answer in the API, and does not retain it. The conservative month-only calculation enables signup in the month after the person turns 13. Before live launch, counsel must still decide whether the site's subject matter and character use make it general-audience, mixed-audience, or child-directed and whether screen-out is legally sufficient.

## Verification

- Run Prettier checks on changed files.
- Run JavaScript and CSS linting.
- Run documentation checks.
- Run the complete Node test suite.
- Run the production build and performance budgets.
- Inspect the diff for accidental secrets, private addresses, unsupported promises, and unrelated changes.

## Rollback

All application changes are source-only and can be reverted through normal source control. No database migration, production configuration change, provider mutation, deployment, commit, or push is included.
