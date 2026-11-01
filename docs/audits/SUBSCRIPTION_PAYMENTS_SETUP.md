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
STRIPE_PRICE_MASTER="price_value"
```

`VITE_*` values are public build-time switches. They do not authorize purchases. Secret keys and webhook secrets must remain server-only.

## Create the Stripe objects

1. Create or activate the Stripe account and connect the bank account that should receive payouts.
2. Complete Stripe's business, identity, tax, and statement-descriptor requirements.
3. In **Product catalog**, create Great, Ultra, and Master products or recurring Prices.
4. Copy each recurring `price_...` ID into its matching environment variable.
5. In **Developers / API keys**, copy the test secret key first. Move to the live secret key only after sandbox acceptance.
6. Configure the Stripe Customer Portal. Copy its `bpc_...` configuration ID if a specific configuration should be forced; otherwise leave `STRIPE_PORTAL_CONFIGURATION_ID` blank.

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

The application verifies Stripe signatures and re-fetches current subscription state. It does not yet store provider event IDs in a durable billing-event ledger, so production monitoring and provider retries remain important.

## Sandbox acceptance matrix

- Successful checkout for each tier.
- Ownership rejection when a Checkout Session belongs to another user.
- Tier rejection when the configured Price does not match the requested tier.
- Active and trialing subscriptions grant the expected tier.
- Failed, incomplete, past-due, paused, and canceled states fail closed.
- Duplicate and reverse-order webhook delivery converge to current Stripe state.
- Customer Portal opens only for the authenticated Stripe customer.
- Cancellation and renewal update access through signed webhook delivery.
- Checkout displays only methods Stripe confirms are eligible for recurring billing.

## Optional standalone PayPal

Keep `VITE_PAYPAL_ENABLED=false` unless every `PAYPAL_*` variable is configured, three Plans exist in the same sandbox/live environment, the webhook is registered, and the complete PayPal acceptance matrix passes. Existing PayPal-bound users can still manage their subscription while new checkout is hidden.
