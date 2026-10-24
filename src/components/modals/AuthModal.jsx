import React, {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import * as api from "../../../api.js";

const AUTH_MODES = new Set(["login", "signup"]);
const FOCUSABLE_SELECTOR = [
	"button:not([disabled])",
	"input:not([disabled])",
	"[href]",
	'[tabindex]:not([tabindex="-1"])',
].join(",");

function normalizeMode(mode) {
	return AUTH_MODES.has(mode) ? mode : "login";
}

function getFocusableElements(container) {
	if (!container) return [];
	return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
		(element) =>
			!element.hidden && element.getAttribute("aria-hidden") !== "true",
	);
}

/**
 * React-owned account entry flow. A small global bridge keeps legacy callers
 * working while all dialog state, requests, and accessibility behavior stay
 * inside the component.
 */
export function AuthModal() {
	const [isOpen, setIsOpen] = useState(false);
	const [mode, setMode] = useState("login");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const [pendingAction, setPendingAction] = useState(null);
	const [status, setStatus] = useState(null);
	const [canResendVerification, setCanResendVerification] = useState(false);
	const dialogRef = useRef(null);
	const emailInputRef = useRef(null);
	const triggerRef = useRef(null);

	const closeDialog = useCallback(() => {
		setIsOpen(false);
		setPassword("");
		setIsPasswordVisible(false);
		setPendingAction(null);

		const trigger = triggerRef.current;
		triggerRef.current = null;
		if (trigger?.isConnected) {
			window.requestAnimationFrame(() => trigger.focus());
		}
	}, []);

	const openDialog = useCallback((requestedMode = "login") => {
		const nextMode = normalizeMode(requestedMode);
		triggerRef.current =
			document.activeElement instanceof HTMLElement
				? document.activeElement
				: null;
		setMode(nextMode);
		setEmail("");
		setPassword("");
		setIsPasswordVisible(false);
		setPendingAction(null);
		setStatus(null);
		setCanResendVerification(false);
		setIsOpen(true);
	}, []);

	useLayoutEffect(() => {
		window.PPGC = window.PPGC || {};
		window.PPGC.openAuthDialog = openDialog;
		window.PPGC.closeAuthDialog = closeDialog;

		return () => {
			if (window.PPGC?.openAuthDialog === openDialog)
				delete window.PPGC.openAuthDialog;
			if (window.PPGC?.closeAuthDialog === closeDialog)
				delete window.PPGC.closeAuthDialog;
		};
	}, [closeDialog, openDialog]);

	useEffect(() => {
		if (!isOpen) return undefined;

		document.body.classList.add("ppgc-auth-open");
		const focusFrame = window.requestAnimationFrame(() =>
			emailInputRef.current?.focus(),
		);
		const handleKeyDown = (event) => {
			if (event.key === "Escape") {
				event.preventDefault();
				closeDialog();
				return;
			}

			if (event.key !== "Tab") return;
			const focusableElements = getFocusableElements(dialogRef.current);
			if (!focusableElements.length) {
				event.preventDefault();
				dialogRef.current?.focus();
				return;
			}

			const firstElement = focusableElements[0];
			const lastElement = focusableElements[focusableElements.length - 1];
			if (!dialogRef.current?.contains(document.activeElement)) {
				event.preventDefault();
				firstElement.focus();
			} else if (
				event.shiftKey &&
				document.activeElement === firstElement
			) {
				event.preventDefault();
				lastElement.focus();
			} else if (
				!event.shiftKey &&
				document.activeElement === lastElement
			) {
				event.preventDefault();
				firstElement.focus();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => {
			window.cancelAnimationFrame(focusFrame);
			document.removeEventListener("keydown", handleKeyDown);
			document.body.classList.remove("ppgc-auth-open");
		};
	}, [closeDialog, isOpen]);

	const switchMode = (nextMode) => {
		if (pendingAction) return;
		setMode(normalizeMode(nextMode));
		setPassword("");
		setIsPasswordVisible(false);
		setStatus(null);
		setCanResendVerification(false);
	};

	const handleTabKeyDown = (event) => {
		if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))
			return;
		event.preventDefault();
		const nextMode =
			event.key === "ArrowLeft" || event.key === "Home"
				? "login"
				: "signup";
		switchMode(nextMode);
		dialogRef.current
			?.querySelector(`[data-auth-mode="${nextMode}"]`)
			?.focus();
	};

	const runEmailAction = async (action) => {
		if (!emailInputRef.current?.checkValidity()) {
			emailInputRef.current?.reportValidity();
			return;
		}

		const normalizedEmail = email.trim();
		if (!normalizedEmail) {
			setStatus({
				kind: "error",
				message: "Enter your email address first.",
			});
			emailInputRef.current?.focus();
			return;
		}

		setPendingAction(action);
		setStatus({
			kind: "progress",
			message:
				action === "forgot"
					? "Requesting a password reset link..."
					: "Requesting a new verification link...",
		});

		try {
			const response =
				action === "forgot"
					? await api.requestPasswordReset(normalizedEmail)
					: await api.resendVerificationEmail(normalizedEmail);
			setStatus({
				kind: response?.error ? "error" : "success",
				message:
					response?.error ||
					response?.message ||
					"Check your email for the next step.",
			});
		} catch (error) {
			console.error("[auth] email action failed:", error);
			setStatus({
				kind: "error",
				message: "The request could not be completed. Try again.",
			});
		} finally {
			setPendingAction(null);
		}
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		const normalizedEmail = email.trim();
		const action = mode === "login" ? "login" : "signup";
		setPendingAction(action);
		setStatus({
			kind: "progress",
			message:
				mode === "login"
					? "Checking your account..."
					: "Creating your account...",
		});
		setCanResendVerification(false);

		try {
			const response =
				mode === "login"
					? await api.login(normalizedEmail, password)
					: await api.signup(normalizedEmail, password);

			if (response?.error) {
				setStatus({ kind: "error", message: response.error });
				setCanResendVerification(
					response.code === "EMAIL_NOT_VERIFIED",
				);
				return;
			}

			if (response?.verificationRequired) {
				setMode("login");
				setPassword("");
				setCanResendVerification(true);
				setStatus({
					kind: "success",
					message:
						response.message ||
						"Check your email to verify the account, then log in.",
				});
				return;
			}

			if (response?.email) {
				if (typeof window.PPGC?.completeAuthLogin !== "function") {
					throw new Error("Auth session bridge is unavailable.");
				}
				await window.PPGC.completeAuthLogin(response);
				closeDialog();
				return;
			}

			setStatus({
				kind: "error",
				message: "The account response was incomplete. Try again.",
			});
		} catch (error) {
			console.error("[auth] submit failed:", error);
			setStatus({
				kind: "error",
				message: "Something went wrong. Try again.",
			});
		} finally {
			setPendingAction(null);
		}
	};

	const isBusy = pendingAction !== null;
	const isLogin = mode === "login";
	const title = isLogin ? "Welcome back" : "Create your trainer account";
	const submitLabel =
		pendingAction === "login"
			? "Logging in..."
			: pendingAction === "signup"
				? "Creating account..."
				: isLogin
					? "Log in"
					: "Create account";

	return (
		<div
			id="ppgc-auth-overlay"
			className="ppgc-auth-overlay"
			hidden={!isOpen}
			onMouseDown={(event) => {
				if (event.target === event.currentTarget) closeDialog();
			}}
		>
			<section
				ref={dialogRef}
				className="ppgc-auth-modal"
				role="dialog"
				aria-modal="true"
				aria-labelledby="ppgc-auth-title"
				aria-describedby="ppgc-auth-copy"
				tabIndex={-1}
			>
				<button
					className="ppgc-auth-close"
					type="button"
					aria-label="Close account dialog"
					onClick={closeDialog}
				>
					<svg viewBox="0 0 24 24" aria-hidden="true">
						<path d="M6.5 6.5l11 11m0-11-11 11" />
					</svg>
				</button>

				<div className="ppgc-auth-intro" aria-hidden="true">
					<div className="ppgc-auth-brand">
						<img
							src="/cloud-ball-48.webp"
							srcSet="/cloud-ball-48.webp 1x, /cloud-ball-96.webp 2x"
							alt=""
							width="30"
							height="30"
						/>
						<span>PokemonPGC</span>
					</div>
					<div className="ppgc-auth-intro-copy">
						<p className="ppgc-auth-eyebrow">
							Your progress, ready anywhere
						</p>
						<h2>Keep every checklist in sync.</h2>
						<p>
							Pick up on another device without losing the details
							you have already tracked.
						</p>
					</div>
					<ul className="ppgc-auth-benefits">
						<li>Sync progress across devices</li>
						<li>Back up detailed collection data</li>
						<li>Resume from your latest save</li>
					</ul>
				</div>

				<div className="ppgc-auth-main">
					<div className="ppgc-auth-heading">
						<p className="ppgc-auth-kicker">Account</p>
						<h2 id="ppgc-auth-title">{title}</h2>
						<p id="ppgc-auth-copy" className="ppgc-auth-copy">
							{isLogin
								? "Log in to sync and protect your checklist progress."
								: "Use an email you can access. You will verify it before your first login."}
						</p>
					</div>

					<div
						className="ppgc-auth-tabs"
						role="tablist"
						aria-label="Account action"
						onKeyDown={handleTabKeyDown}
					>
						<button
							type="button"
							id="ppgc-auth-login-tab"
							data-auth-mode="login"
							role="tab"
							aria-selected={isLogin}
							aria-controls="ppgc-auth-panel"
							tabIndex={isLogin ? 0 : -1}
							disabled={isBusy}
							onClick={() => switchMode("login")}
						>
							Log in
						</button>
						<button
							type="button"
							id="ppgc-auth-signup-tab"
							data-auth-mode="signup"
							role="tab"
							aria-selected={!isLogin}
							aria-controls="ppgc-auth-panel"
							tabIndex={!isLogin ? 0 : -1}
							disabled={isBusy}
							onClick={() => switchMode("signup")}
						>
							Sign up
						</button>
					</div>

					<div
						id="ppgc-auth-panel"
						role="tabpanel"
						aria-labelledby={
							isLogin
								? "ppgc-auth-login-tab"
								: "ppgc-auth-signup-tab"
						}
					>
						<form id="ppgc-auth-form" onSubmit={handleSubmit}>
							<label
								className="ppgc-auth-field"
								htmlFor="ppgc-auth-email"
							>
								<span>Email address</span>
								<input
									ref={emailInputRef}
									id="ppgc-auth-email"
									type="email"
									name="email"
									autoComplete="email"
									inputMode="email"
									maxLength={254}
									value={email}
									disabled={isBusy}
									onChange={(event) =>
										setEmail(event.target.value)
									}
									required
								/>
							</label>

							<div className="ppgc-auth-field">
								<label htmlFor="ppgc-auth-password">
									Password
								</label>
								<div className="ppgc-auth-password-control">
									<input
										id="ppgc-auth-password"
										type={
											isPasswordVisible
												? "text"
												: "password"
										}
										name="password"
										autoComplete={
											isLogin
												? "current-password"
												: "new-password"
										}
										minLength={8}
										maxLength={128}
										value={password}
										disabled={isBusy}
										onChange={(event) =>
											setPassword(event.target.value)
										}
										aria-describedby={
											!isLogin
												? "ppgc-auth-password-hint"
												: undefined
										}
										required
									/>
									<button
										type="button"
										className="ppgc-auth-password-toggle"
										aria-label={
											isPasswordVisible
												? "Hide password"
												: "Show password"
										}
										aria-pressed={isPasswordVisible}
										disabled={isBusy}
										onClick={() =>
											setIsPasswordVisible(
												(visible) => !visible,
											)
										}
									>
										{isPasswordVisible ? "Hide" : "Show"}
									</button>
								</div>
							</div>

							{!isLogin && (
								<p
									id="ppgc-auth-password-hint"
									className="ppgc-auth-field-hint"
								>
									Use 8 to 128 characters. Spaces are
									preserved.
								</p>
							)}

							<button
								type="submit"
								className="ppgc-auth-primary"
								disabled={isBusy}
							>
								{isBusy &&
									["login", "signup"].includes(
										pendingAction,
									) && (
										<span
											className="ppgc-auth-spinner"
											aria-hidden="true"
										/>
									)}
								{submitLabel}
							</button>
						</form>
					</div>

					<div className="ppgc-auth-support">
						{isLogin && (
							<button
								type="button"
								disabled={isBusy}
								onClick={() => runEmailAction("forgot")}
							>
								{pendingAction === "forgot"
									? "Requesting reset..."
									: "Forgot password?"}
							</button>
						)}
						{canResendVerification && (
							<button
								type="button"
								disabled={isBusy}
								onClick={() => runEmailAction("resend")}
							>
								{pendingAction === "resend"
									? "Sending..."
									: "Resend verification email"}
							</button>
						)}
					</div>

					{status && (
						<div
							className={`ppgc-auth-status is-${status.kind}`}
							role={status.kind === "error" ? "alert" : "status"}
							aria-live={
								status.kind === "error" ? "assertive" : "polite"
							}
						>
							{status.message}
						</div>
					)}

					<p className="ppgc-auth-privacy">
						Account access is used to sync your saved progress.
					</p>
				</div>
			</section>
		</div>
	);
}
