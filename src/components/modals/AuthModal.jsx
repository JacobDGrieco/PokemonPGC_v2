import React, {
	lazy,
	Suspense,
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { Link } from "react-router-dom";
import * as api from "../../../api.js";
import {
	EARLIEST_SUPPORTED_BIRTH_YEAR,
	evaluateAccountAge,
} from "../../../shared/ageEligibility.js";
import { LEGAL_VERSION } from "../../../shared/legal.js";

const TurnstileWidget = lazy(() =>
	import("../auth/TurnstileWidget.jsx").then((module) => ({
		default: module.TurnstileWidget,
	})),
);

const AUTH_MODES = new Set(["login", "signup"]);
const SIGNUP_STEPS = Object.freeze({
	AGE: "age",
	ACCOUNT: "account",
	INELIGIBLE: "ineligible",
});
const BIRTH_MONTHS = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];
const CURRENT_UTC_YEAR = new Date().getUTCFullYear();
const BIRTH_YEARS = Array.from(
	{ length: CURRENT_UTC_YEAR - EARLIEST_SUPPORTED_BIRTH_YEAR + 1 },
	(_, index) => CURRENT_UTC_YEAR - index,
);
const FOCUSABLE_SELECTOR = [
	"button:not([disabled])",
	"input:not([disabled])",
	"select:not([disabled])",
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
	const [hasAcceptedLegalTerms, setHasAcceptedLegalTerms] = useState(false);
	const [signupStep, setSignupStep] = useState(SIGNUP_STEPS.AGE);
	const [birthMonth, setBirthMonth] = useState("");
	const [birthYear, setBirthYear] = useState("");
	const [turnstileToken, setTurnstileToken] = useState("");
	const [turnstileResetKey, setTurnstileResetKey] = useState(0);
	const dialogRef = useRef(null);
	const emailInputRef = useRef(null);
	const birthMonthInputRef = useRef(null);
	const triggerRef = useRef(null);

	const closeDialog = useCallback(() => {
		setIsOpen(false);
		setPassword("");
		setIsPasswordVisible(false);
		setPendingAction(null);
		setHasAcceptedLegalTerms(false);
		setSignupStep(SIGNUP_STEPS.AGE);
		setBirthMonth("");
		setBirthYear("");
		setTurnstileToken("");

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
		setHasAcceptedLegalTerms(false);
		setSignupStep(SIGNUP_STEPS.AGE);
		setBirthMonth("");
		setBirthYear("");
		setTurnstileToken("");
		setTurnstileResetKey((currentKey) => currentKey + 1);
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
		const focusFrame = window.requestAnimationFrame(() => {
			if (mode === "signup" && signupStep === SIGNUP_STEPS.AGE) {
				birthMonthInputRef.current?.focus();
				return;
			}
			emailInputRef.current?.focus();
		});
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
	}, [closeDialog, isOpen, mode, signupStep]);

	const switchMode = (nextMode) => {
		if (pendingAction) return;
		const normalizedMode = normalizeMode(nextMode);
		if (normalizedMode === mode) return;
		setMode(normalizedMode);
		setPassword("");
		setIsPasswordVisible(false);
		setStatus(null);
		setCanResendVerification(false);
		setHasAcceptedLegalTerms(false);
		setSignupStep(SIGNUP_STEPS.AGE);
		setBirthMonth("");
		setBirthYear("");
		setTurnstileToken("");
		setTurnstileResetKey((currentKey) => currentKey + 1);
	};

	const handleAgeSubmit = (event) => {
		event.preventDefault();
		const ageDecision = evaluateAccountAge({ birthMonth, birthYear });
		if (!ageDecision.valid) {
			setStatus({
				kind: "error",
				message: "Enter a valid birth month and year.",
			});
			return;
		}
		if (!ageDecision.eligible) {
			setSignupStep(SIGNUP_STEPS.INELIGIBLE);
			setStatus({
				kind: "error",
				message:
					"You are not eligible to create an account at this time.",
			});
			return;
		}

		setSignupStep(SIGNUP_STEPS.ACCOUNT);
		setStatus(null);
	};

	const returnToAgeStep = () => {
		if (pendingAction) return;
		setSignupStep(SIGNUP_STEPS.AGE);
		setEmail("");
		setPassword("");
		setHasAcceptedLegalTerms(false);
		setStatus(null);
		setTurnstileToken("");
		setTurnstileResetKey((currentKey) => currentKey + 1);
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
		if (!turnstileToken) {
			setStatus({
				kind: "error",
				message: "Complete bot verification before continuing.",
			});
			return;
		}
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
					? await api.login(normalizedEmail, password, turnstileToken)
					: await api.signup(
							normalizedEmail,
							password,
							{
								legalAccepted: hasAcceptedLegalTerms,
								legalVersion: LEGAL_VERSION,
							},
							turnstileToken,
							{ birthMonth, birthYear },
						);

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
			setTurnstileToken("");
			setTurnstileResetKey((currentKey) => currentKey + 1);
		}
	};

	const isBusy = pendingAction !== null;
	const isLogin = mode === "login";
	const isSignupAccountStep = !isLogin && signupStep === SIGNUP_STEPS.ACCOUNT;
	const shouldShowCredentialForm = isLogin || isSignupAccountStep;
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
								: isSignupAccountStep
									? "Use an email you can access. You will verify it before your first login."
									: "First, enter your birth month and year to check whether account creation is available."}
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
						{!isLogin && signupStep === SIGNUP_STEPS.AGE ? (
							<form
								id="ppgc-auth-age-form"
								onSubmit={handleAgeSubmit}
							>
								<fieldset className="ppgc-auth-age-fieldset">
									<legend>Birth month and year</legend>
									<div className="ppgc-auth-age-fields">
										<label
											className="ppgc-auth-field"
											htmlFor="ppgc-auth-birth-month"
										>
											<span>Month</span>
											<select
												ref={birthMonthInputRef}
												id="ppgc-auth-birth-month"
												name="birthMonth"
												value={birthMonth}
												onChange={(event) =>
													setBirthMonth(
														event.target.value,
													)
												}
												required
											>
												<option value="">
													Select month
												</option>
												{BIRTH_MONTHS.map(
													(monthName, monthIndex) => (
														<option
															key={monthName}
															value={
																monthIndex + 1
															}
														>
															{monthName}
														</option>
													),
												)}
											</select>
										</label>
										<label
											className="ppgc-auth-field"
											htmlFor="ppgc-auth-birth-year"
										>
											<span>Year</span>
											<select
												id="ppgc-auth-birth-year"
												name="birthYear"
												value={birthYear}
												onChange={(event) =>
													setBirthYear(
														event.target.value,
													)
												}
												required
											>
												<option value="">
													Select year
												</option>
												{BIRTH_YEARS.map((year) => (
													<option
														key={year}
														value={year}
													>
														{year}
													</option>
												))}
											</select>
										</label>
									</div>
								</fieldset>
								<p className="ppgc-auth-age-note">
									We use this only to decide whether signup is
									available. PokemonPGC does not save your
									birth month or year.
								</p>
								<button
									type="submit"
									className="ppgc-auth-primary"
								>
									Continue
								</button>
							</form>
						) : shouldShowCredentialForm ? (
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
											{isPasswordVisible
												? "Hide"
												: "Show"}
										</button>
									</div>
								</div>

								{!isLogin && (
									<>
										<p
											id="ppgc-auth-password-hint"
											className="ppgc-auth-field-hint"
										>
											Use 8 to 128 characters. Spaces are
											preserved.
										</p>
										<label className="ppgc-auth-consent">
											<input
												type="checkbox"
												checked={hasAcceptedLegalTerms}
												disabled={isBusy}
												onChange={(event) =>
													setHasAcceptedLegalTerms(
														event.target.checked,
													)
												}
												required
											/>
											<span>
												I agree to the{" "}
												<Link to="/terms">Terms</Link>{" "}
												and{" "}
												<Link to="/privacy">
													Privacy Policy
												</Link>
												, including the account
												eligibility requirements.
											</span>
										</label>
									</>
								)}

								{isOpen ? (
									<Suspense
										fallback={
											<p className="ppgc-turnstile-status">
												Loading bot verification…
											</p>
										}
									>
										<TurnstileWidget
											action={
												isLogin
													? "auth_login"
													: "auth_signup"
											}
											onTokenChange={setTurnstileToken}
											resetKey={turnstileResetKey}
										/>
									</Suspense>
								) : null}

								<button
									type="submit"
									className="ppgc-auth-primary"
									disabled={isBusy || !turnstileToken}
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
						) : null}
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
						{isSignupAccountStep && (
							<button
								type="button"
								disabled={isBusy}
								onClick={returnToAgeStep}
							>
								Change birth month or year
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
						PokemonPGC is an unofficial fan project and is not
						affiliated with or operated in partnership with Nintendo
						or The Pokemon Company.
					</p>
				</div>
			</section>
		</div>
	);
}
