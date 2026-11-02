# Authentication Bot Protection and Age-Screening Plan

## Decision

Use Cloudflare Turnstile for signup and login instead of copying HaloMed's Google reCAPTCHA v3 integration.

Turnstile is a better fit here because PokemonPGC already uses Cloudflare services, it supports a managed challenge without a score-threshold tuning period, and it can be integrated without a new production dependency. The widget will load only when the account modal opens.

## Bot-protection scope

1. Add a small React-owned Turnstile widget that uses Cloudflare's explicit-rendering API for the dynamic authentication modal.
2. Require a fresh, action-bound token for both `auth_login` and `auth_signup`.
3. Validate every token through Cloudflare's Siteverify endpoint on the server. Client success alone is never trusted.
4. Keep the existing IP and account-identity rate limits. Perform cheap validation and rate-limit checks before the external verification request where practical.
5. Fail closed in production when Turnstile is unavailable or misconfigured, with a generic retry message and no secret or provider response details in the public response.
6. Reset the widget after each authentication attempt because Turnstile tokens are single-use and expire.
7. Use Cloudflare's published test keys for local development when real keys are absent. Production requires a real hostname-restricted widget.
8. Document `VITE_TURNSTILE_SITE_KEY` as public browser configuration and `TURNSTILE_SECRET_KEY` as a server-only secret.
9. Update the Privacy Policy to identify Cloudflare Turnstile as an abuse-prevention provider that receives ordinary device and network information.

## Age-screening scope

Add a neutral age screen as a separate first step of public signup:

1. Request birth month and year without a default selection and without stating which answer unlocks signup.
2. Evaluate eligibility before showing or collecting email and password fields.
3. Re-evaluate the submitted month and year in the signup API before any account lookup or creation so the browser cannot bypass the screen.
4. Use a shared, deterministic month-based calculation. Because a month/year answer cannot establish the exact birthday within the birth month, treat that month as ineligible and allow signup beginning the following month.
5. Keep the birth month and year only in transient React/request memory. Do not add database fields or write the values to cookies, browser storage, analytics, or application logs.
6. Return a neutral ineligibility message and stop the signup flow without collecting credentials.
7. Update the Privacy Policy and internal authentication documentation to describe the limited, non-retained processing.

This screen enforces the current 13+ product rule but does not determine whether the service is general-audience, mixed-audience, or child-directed. Counsel must still make that classification before launch. If the service is child-directed, screening users out may not be sufficient and a verifiable-parental-consent flow or a different audience/content model may be required.

## Verification

- Add unit tests for production configuration, action matching, success, provider failure, and malformed responses.
- Add source-contract coverage for signup/login enforcement and client reset behavior.
- Add unit coverage for valid inputs, boundary months, future/implausible dates, and server-side enforcement.
- Run formatting, JavaScript/CSS lint, documentation checks, the complete test suite, and the production build/performance budgets.
- Do not deploy, mutate production configuration, commit, or push.
