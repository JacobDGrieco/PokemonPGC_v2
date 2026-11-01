# Subscription Payments Setup

PokemonPGC uses Stripe Checkout as the default boundary for new subscriptions. Stripe hosts the payment form, stores payment credentials, manages recurring charges, and pays out to the connected bank account. PokemonPGC receives only provider identifiers, subscription state, and signed webhook confirmations.

The standalone PayPal integration remains available for existing bindings and can be re-enabled later, but new PayPal checkout defaults off.

## Provider decision

Stripe Checkout is the lowest-risk launch path because PokemonPGC already has signed Stripe webhooks, subscription ownership checks, Price-to-tier validation, and Customer Portal support. It keeps card and wallet credentials out of PokemonPGC, but PokemonPGC remains the merchant responsible for matters such as tax configuration, refunds, disputes, and customer billing support.

[Paddle](https://developer.paddle.com/get-started/how-paddle-works/) is the operationally simpler alternative when the requirement is a true merchant of record. Paddle documents that it handles payment collection, sales tax, refunds, and chargebacks and supports cards, Apple Pay, Google Pay, PayPal, and local methods. Moving to Paddle is not a configuration change: it would require a planned replacement of the checkout, product and Price identifiers, portal, webhook validation, subscription binding, and production migration strategy. Make that decision before accepting live subscriptions if merchant-of-record coverage is a launch requirement.

## Required Stripe environment

```dotenv
VITE_STRIPE_ENABLED="true"
VITE_PAYPAL_ENABLED="false"
STRIPE_SECRET_KEY="sk_test_or_live_value"
STRIPE_WEBHOOK_SECRET="whsec_value"
STRIPE_PORTAL_CONFIGURATION_ID="bpc_optional_value"
STRIPE_PRICE_GREAT="price_value"
STRIPE_PRICE_ULTRA="price_value"
# Optional: retained only for existing/future Master reconciliation
STRIPE_PRICE_MASTER="price_value"
```

`VITE_*` values are public build-time switches. They do not authorize purchases. Secret keys and webhook secrets must remain server-only.

## Create the Stripe objects

1. Create or activate the Stripe account and connect the bank account that should receive payouts.
2. Complete Stripe's business, identity, tax, and statement-descriptor requirements.
3. In **Product catalog**, create a $5 monthly Great Ball recurring Price and a $50 yearly Ultra Ball recurring Price. Both grant the same supporter access.
4. Copy those recurring `price_...` IDs into their matching environment variables. Master Ball is displayed as unavailable and cannot start checkout; do not treat a one-time Master Price as implemented lifetime access.
5. In **Developers / API keys**, copy the test secret key first. Move to the live secret key only after sandbox acceptance.
6. Configure the Stripe Customer Portal for payment methods, invoices, and cancellation. Copy its `bpc_...` configuration ID if a specific configuration should be forced; otherwise leave `STRIPE_PORTAL_CONFIGURATION_ID` blank. PokemonPGC handles Great/Ultra plan selection itself.

Stripe's Price update API does not accept a new base amount or recurring interval for an existing Price. Create replacement test Prices, update the two environment IDs, and optionally archive the old Prices after confirming nothing still references them. See [Stripe's Price update parameters](https://docs.stripe.com/api/prices/update).

## Configure payment methods

The Checkout Session intentionally leaves `payment_method_types` unset. Stripe dynamically shows methods that are enabled for the account, eligible for the customer, and compatible with recurring billing.

In **Settings -> Payment methods**:

- Enable cards.
- Enable Link.
- Enable Apple Pay and Google Pay/card wallets when Stripe offers them for the account and customer device.
- Enable PayPal inside Stripe if it appears for this account and Stripe confirms it is compatible with these recurring Prices. This keeps PayPal under the Stripe subscription/webhook path and avoids the separate PayPal integration.
- Enable other local methods only after confirming recurring-payment, currency, and refund behavior.

Do not promise a particular wallet on the pricing page. Stripe decides what is eligible by account country, currency, customer location, device/browser, and subscription compatibility.

Crypto or stablecoin payment should remain disabled for these subscriptions unless Stripe explicitly lists the method as recurring-compatible for the account. A separate one-time crypto checkout would require a different product and entitlement contract.

## Configure the webhook

Create a Stripe webhook/event destination pointing to:

```text
https://YOUR_ORIGIN/api/subscriptions/stripe/webhook
```

Subscribe to:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

Copy the endpoint signing secret into `STRIPE_WEBHOOK_SECRET`. Test and live endpoints have different secrets.

The application verifies Stripe signatures and re-fetches current subscription state. The applied `20261101190000_add_provider_event_ledger` migration adds durable event receipts without retaining raw webhook payloads or customer details. Provider monitoring and retry visibility remain required.

## Sandbox acceptance matrix

- Successful checkout for Great monthly and Ultra yearly.
- Direct Master checkout attempts fail with 409 while the option is reserved.
- Ownership rejection when a Checkout Session belongs to another user.
- Tier rejection when the configured Price does not match the requested tier.
- Active and trialing subscriptions grant the expected tier.
- Failed, incomplete, past-due, paused, and canceled states fail closed.
- Duplicate and reverse-order webhook delivery converge to current Stripe state.
- Customer Portal opens only for the authenticated Stripe customer.
- Great-to-Ultra changes immediately and only grants Ultra after Stripe accepts the paid update.
- An upgrade requiring authentication or a replacement payment method opens the Stripe-hosted invoice, with Customer Portal as a fallback when no invoice URL is available.
- Ultra-to-Great retains Ultra through the paid period, displays the effective date, and changes through a tagged Stripe subscription schedule.
- Great-to-Free and Ultra-to-Free retain paid access through the current period by setting Stripe cancellation at period end.
- Selecting the current plan cancels a PokemonPGC-managed pending downgrade without canceling the subscription.
- The current-plan control opens Stripe Customer Portal for cancellation and billing management.
- Uploaded/custom account icons survive plan changes; a default or tier-managed icon follows the effective tier.
- Renewal and period-start dates match Stripe's subscription-item period fields.
- Cancellation and renewal update access through signed webhook delivery.
- Checkout displays only methods Stripe confirms are eligible for recurring billing.

## Public billing-date display

The Account page presents renewal and scheduled-plan dates as calendar dates.
It intentionally omits the provider's current-period start timestamp from the
customer-facing billing panel; the API may still retain that value for provider
reconciliation and diagnostics.

## Optional standalone PayPal

Keep `VITE_PAYPAL_ENABLED=false` unless every required `PAYPAL_*` variable is configured, Great and Ultra Plans exist in the same sandbox/live environment, the webhook is registered, and the complete PayPal acceptance matrix passes. Existing PayPal-bound users can still manage their subscription while new checkout is hidden.
