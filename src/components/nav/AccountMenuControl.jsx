import { useSubscription } from "../../hooks/useSubscription.js";

/**
 * Shared account entry point for application and marketing headers.
 *
 * The IDs and data attributes are legacy integration contracts consumed by
 * global account-menu wiring. Both shells render them through this component
 * while retaining their route-specific authenticated behavior.
 */
export function AccountMenuControl({ onAuthenticatedClick }) {
	const { tierKey, tier, user } = useSubscription();
	const icon = user?.icon || "default";
	const isCustomIcon = String(icon).startsWith("data:image/");
	const accountLabel = user
		? `Open account settings. Logged in as ${user.email}. ${tier.label} tier.`
		: "Log in or sign up";
	const accountTitle = user
		? `Logged in as ${user.email} · ${tier.label} tier`
		: "Log in / Sign up";

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
				data-tier={user ? tierKey : undefined}
				data-icon={isCustomIcon ? "custom" : icon}
				className={`${user ? "logged-in" : ""}${isCustomIcon ? " has-custom-icon" : ""}`.trim()}
				style={
					isCustomIcon
						? { backgroundImage: `url("${icon}")` }
						: undefined
				}
				aria-haspopup={user ? undefined : "dialog"}
				aria-controls={user ? undefined : "ppgc-auth-overlay"}
				aria-label={accountLabel}
				title={accountTitle}
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
