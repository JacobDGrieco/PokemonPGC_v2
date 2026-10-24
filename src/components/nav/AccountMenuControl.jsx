/**
 * Shared account entry point for application and marketing headers.
 *
 * The IDs and data attributes are legacy integration contracts consumed by
 * global account-menu wiring. Both shells render them through this component
 * while retaining their route-specific authenticated behavior.
 */
export function AccountMenuControl({ onAuthenticatedClick }) {
	const handleAccountClick = async () => {
		if (!window.__PPGC_FRONTEND_LOADED__) {
			await import("../../index.js");
			await window.PPGC?.authBootstrapPromise;
		}

		if (!window.PPGC?.currentUser) {
			window.PPGC?.openAuthModal?.("login");
			return;
		}

		onAuthenticatedClick();
	};

	return (
		<div className="header-account">
			<button
				id="ppgc-account-button"
				type="button"
				data-react-account-button="true"
				aria-haspopup="dialog"
				aria-controls="ppgc-auth-overlay"
				title="Log in / Sign up"
				onClick={handleAccountClick}
			>
				<svg viewBox="0 0 24 24" aria-hidden="true">
					<path d="M12 11.5c1.93 0 3.5-1.79 3.5-4s-1.57-4-3.5-4-3.5 1.79-3.5 4 1.57 4 3.5 4zm0 2c-2.76 0-5.5 1.57-5.5 3.5V19h11v-2c0-1.93-2.74-3.5-5.5-3.5z" />
				</svg>
			</button>
			<div id="ppgc-account-menu" className="ppgc-account-menu" hidden>
				<button type="button" data-action="settings">
					Account settings
				</button>
				<button type="button" data-action="logout">
					Log out
				</button>
			</div>
		</div>
	);
}
