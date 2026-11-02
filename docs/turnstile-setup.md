# Cloudflare Turnstile Setup

PokemonPGC uses Cloudflare Turnstile on login and signup in addition to application rate limits. The browser widget creates a short-lived token; the API validates that token with Cloudflare before querying or creating an account.

## Create the production widget

1. Open the Cloudflare dashboard and select **Turnstile**.
2. Select **Add widget**.
3. Name it `PokemonPGC Auth`.
4. Add the hostname `pokemonpgc.com`. Cloudflare automatically permits its subdomains, including `www.pokemonpgc.com`.
5. Choose the managed widget mode.
6. Create the widget and copy its sitekey and secret key.

Do not add `localhost` to the production widget. The application automatically uses Cloudflare's official test keys on `localhost`, `127.0.0.1`, and `0.0.0.0` when real keys are absent.

## Configure environments

Set these values locally only when testing real keys against an allowed hostname:

```dotenv
VITE_TURNSTILE_SITE_KEY="public-site-key"
TURNSTILE_SECRET_KEY="server-secret-key"
```

In Vercel, add both variables to Production. `VITE_TURNSTILE_SITE_KEY` is intentionally public and is compiled into the browser bundle. `TURNSTILE_SECRET_KEY` must remain a secret and must never use the `VITE_` prefix.

For Preview, create a separate Turnstile widget and use a stable preview hostname that you explicitly authorize. Cloudflare hostname management does not support wildcard entries. Dynamic Vercel deployment hostnames therefore cannot all be authorized through a wildcard.

## Acceptance checks

1. Run the app locally without Turnstile variables and confirm both login and signup complete with Cloudflare's test widget.
2. Confirm a login token cannot be reused for signup and vice versa.
3. Confirm every failed or successful submission resets the widget before another attempt.
4. Deploy with production keys and confirm the widget succeeds on `www.pokemonpgc.com`.
5. Temporarily use an invalid token in a controlled test and confirm the API returns HTTP 403 without querying the password or creating an account.
6. Temporarily remove or invalidate the production secret in a controlled preview and confirm authentication fails closed with HTTP 503.
7. Review Turnstile Analytics for unexpected hostnames, low solve rates, or sharp traffic changes.

Tokens are single-use and expire after five minutes. The application checks the returned action and, in production, validates the returned hostname against `APP_ORIGIN` and Vercel's deployment host variables.
