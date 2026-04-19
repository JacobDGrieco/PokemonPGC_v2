import React from 'react';

export function AuthModal() {
  return (
    <div id="ppgc-auth-overlay" className="ppgc-auth-overlay" hidden>
      <div className="ppgc-auth-modal" role="dialog" aria-modal="true" aria-labelledby="ppgc-auth-title">
        <button className="ppgc-auth-close" type="button" aria-label="Close account dialog">×</button>
        <h2 id="ppgc-auth-title">Account</h2>
        <div className="ppgc-auth-tabs">
          <button type="button" data-mode="login" className="active">Log in</button>
          <button type="button" data-mode="signup">Sign up</button>
        </div>
        <form id="ppgc-auth-form">
          <label className="field">
            <span>Email</span>
            <input type="email" name="email" autoComplete="email" required />
          </label>
          <label className="field">
            <span>Password</span>
            <input type="password" name="password" autoComplete="current-password" required />
          </label>
          <button type="submit" className="primary" id="ppgc-auth-submit">Log in</button>
        </form>
        <div id="ppgc-auth-status" className="ppgc-auth-status" aria-live="polite" />
      </div>
    </div>
  );
}
