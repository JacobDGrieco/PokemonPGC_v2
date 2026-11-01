import React from "react";
import { Link } from "react-router-dom";
import {
	LEGAL_CONTACT_EMAIL,
	LEGAL_EFFECTIVE_DATE,
	LEGAL_OPERATOR,
	UNOFFICIAL_PROJECT_NOTICE,
} from "../../shared/legal.js";
import "../../styles/legal.css";

const contactLink = (
	<a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</a>
);

function UnofficialProjectNotice() {
	return (
		<aside
			className="legal-unofficial-notice"
			aria-label="Unofficial project notice"
		>
			<strong>Independent and unofficial</strong>
			<p>{UNOFFICIAL_PROJECT_NOTICE}</p>
			<p>
				Pokémon and related names, characters, logos, artwork, game
				titles, and other intellectual property belong to their
				respective owners. This notice and any attribution do not grant
				PokemonPGC a license or permission to use third-party
				intellectual property.
			</p>
		</aside>
	);
}

function TermsContent() {
	return (
		<>
			<section>
				<h2>1. Who operates PokemonPGC</h2>
				<p>
					PokemonPGC (the “Service”) is operated by {LEGAL_OPERATOR},
					a Pennsylvania limited liability company in the United
					States. Contact us at {contactLink}.
				</p>
			</section>
			<section>
				<h2>2. Agreement to these Terms</h2>
				<p>
					By creating an account or using the Service, you agree to
					these Terms and our{" "}
					<Link to="/privacy">Privacy Policy</Link>. If you do not
					agree, do not create an account or use the Service. If you
					use the Service for an organization, you represent that you
					may bind that organization.
				</p>
			</section>
			<section>
				<h2>3. Age requirements</h2>
				<p>
					You must be at least 13 years old to create or use an
					account. You must be at least 18 years old to purchase a
					subscription, or a parent or legal guardian must complete or
					expressly authorize the purchase. Do not provide personal
					information if you are under 13. A parent or guardian who
					learns that a child under 13 provided information should
					contact us so we can review and delete it where required.
				</p>
			</section>
			<section>
				<h2>4. Unofficial project and third-party rights</h2>
				<UnofficialProjectNotice />
				<p>
					The Service may refer to third-party games, characters, and
					materials for identification, information, compatibility,
					and commentary. No ownership of third-party intellectual
					property is claimed. You may not use the Service in a way
					that implies an official relationship or violates another
					party’s rights.
				</p>
			</section>
			<section>
				<h2>5. Accounts and account security</h2>
				<p>
					Provide an email address you control and accurate account
					information. You are responsible for protecting your
					password and for activity under your account. Tell us
					promptly if you suspect unauthorized access. We may require
					email verification, invalidate sessions, or limit access to
					protect the Service and its users.
				</p>
			</section>
			<section>
				<h2>6. Service status and changes</h2>
				<p>
					PokemonPGC is actively developed. Features marked planned,
					in progress, beta, experimental, or similar may be
					incomplete, change, or never be released. We may add,
					modify, suspend, or discontinue features. We do not
					guarantee uninterrupted availability, compatibility with
					every game or device, or preservation of every item of
					progress. Keep any independent records you consider
					important.
				</p>
			</section>
			<section>
				<h2>7. Supporter subscriptions</h2>
				<p>
					Paid plans support development and provide the access
					described on the pricing page. Great is currently offered at
					$5 per month and Ultra at $50 per year. Each is an
					automatically renewing subscription until canceled. The
					price, billing period, included access, and any applicable
					taxes are shown before checkout. The disabled Master option
					is not for sale.
				</p>
				<p>
					Payments are processed by the payment provider shown at
					checkout. We do not receive or store full card or wallet
					credentials. Provider terms also apply. We may grant
					complimentary access; it has no cash value and may have an
					expiration or separate conditions disclosed when granted.
				</p>
			</section>
			<section>
				<h2>8. Plan changes, cancellation, and refunds</h2>
				<p>
					Upgrades may take effect immediately and may create a
					prorated charge or credit calculated by the payment
					provider. Downgrades and cancellations normally take effect
					at the end of the current paid period, with access
					continuing until then. We do not automatically issue
					prorated refunds. See the{" "}
					<Link to="/refunds">Refund and Cancellation Policy</Link>{" "}
					for details and exceptions required by law.
				</p>
			</section>
			<section>
				<h2>9. Your content and data</h2>
				<p>
					You retain any rights you have in progress data, custom
					account images, and other material you submit. You give us a
					limited, nonexclusive license to host, copy, process,
					transmit, and display that material only as needed to
					operate, secure, support, and improve the Service. You
					promise that you have the rights needed to submit it and
					that it does not violate law or another person’s rights.
				</p>
			</section>
			<section>
				<h2>10. Acceptable use</h2>
				<p>You may not:</p>
				<ul>
					<li>
						break the law or infringe intellectual property or
						privacy rights;
					</li>
					<li>
						access another person’s account or misrepresent your
						identity;
					</li>
					<li>
						probe, bypass, or interfere with security, rate limits,
						or access controls;
					</li>
					<li>
						introduce malware or overload, scrape, or automate the
						Service abusively;
					</li>
					<li>
						resell access or use the Service to build a competing
						dataset or service without permission; or
					</li>
					<li>
						use PokemonPGC to imply endorsement by a third-party
						rights holder.
					</li>
				</ul>
			</section>
			<section>
				<h2>11. Suspension and termination</h2>
				<p>
					You may stop using the Service at any time. We may suspend
					or terminate access when reasonably necessary for security,
					nonpayment, legal compliance, material breach, abuse, or
					protection of users or third parties. Termination does not
					eliminate amounts already owed or terms that by their nature
					should survive.
				</p>
			</section>
			<section>
				<h2>12. Disclaimers</h2>
				<p>
					To the maximum extent permitted by law, the Service is
					provided “as is” and “as available,” without warranties of
					merchantability, fitness for a particular purpose, title,
					noninfringement, or uninterrupted or error-free operation.
					Nothing here excludes a warranty or consumer right that
					cannot legally be excluded.
				</p>
			</section>
			<section>
				<h2>13. Limitation of liability</h2>
				<p>
					To the maximum extent permitted by law, {LEGAL_OPERATOR} and
					its members, contractors, and service providers will not be
					liable for indirect, incidental, special, consequential,
					exemplary, or punitive damages, or for lost data, profits,
					goodwill, or business interruption. Our aggregate liability
					arising from the Service will not exceed the greater of $100
					or the amount you paid us in the 12 months before the claim.
					These limits do not apply where prohibited by law.
				</p>
			</section>
			<section>
				<h2>14. Governing law</h2>
				<p>
					Pennsylvania law governs these Terms, without regard to
					conflict-of-law rules. Claims may be brought in applicable
					state or federal courts in Pennsylvania. This does not
					remove mandatory consumer rights or venues that apply where
					you live.
				</p>
			</section>
			<section>
				<h2>15. Changes and contact</h2>
				<p>
					We may update these Terms. We will post the new effective
					date and give additional notice when legally required.
					Questions may be sent to {contactLink}.
				</p>
			</section>
		</>
	);
}

function PrivacyContent() {
	return (
		<>
			<section>
				<h2>1. Scope and controller</h2>
				<p>
					This Policy explains how {LEGAL_OPERATOR}, Pennsylvania,
					United States, collects, uses, discloses, and retains
					personal information through PokemonPGC. Contact us at{" "}
					{contactLink}.
				</p>
			</section>
			<section>
				<h2>2. Information we collect</h2>
				<ul>
					<li>
						<strong>Account information:</strong> email address,
						password hash, verification and reset-token records,
						account icon, tier, and account timestamps.
					</li>
					<li>
						<strong>Progress and submitted data:</strong> cloud
						checklist/game progress, custom account images, and
						save-file content submitted for import. Save imports are
						processed to produce import results and are not
						intentionally retained as the original uploaded file by
						the import endpoint.
					</li>
					<li>
						<strong>Subscription records:</strong> plan, provider,
						customer and subscription identifiers, status,
						billing-period dates, provider-event receipts, and
						complimentary-access records. Payment providers, not
						PokemonPGC, collect full card or wallet credentials.
					</li>
					<li>
						<strong>Device and usage information:</strong> IP
						address, browser/device information, request and error
						logs, approximate location derived by providers, page
						and referrer information, and aggregated site usage.
					</li>
					<li>
						<strong>Communications:</strong> messages you send to
						the contact address and transactional delivery records.
					</li>
				</ul>
			</section>
			<section>
				<h2>3. How we collect information</h2>
				<p>
					We collect information you provide, information generated
					when you use the Service, information returned by payment
					and infrastructure providers, and information stored by your
					browser for local progress and session continuity.
				</p>
			</section>
			<section>
				<h2>4. Why we use information</h2>
				<ul>
					<li>create, authenticate, secure, and support accounts;</li>
					<li>sync progress and provide requested features;</li>
					<li>
						process and reconcile subscriptions, refunds, disputes,
						and complimentary access;
					</li>
					<li>
						send verification, password-reset, billing, security,
						and service messages;
					</li>
					<li>
						detect abuse, troubleshoot errors, measure reliability,
						and improve the Service; and
					</li>
					<li>
						comply with law, enforce agreements, and establish or
						defend legal claims.
					</li>
				</ul>
				<p>
					Where a legal basis is required, these uses rely as
					applicable on performance of a contract, legitimate
					interests in operating and securing the Service, legal
					obligations, or consent.
				</p>
			</section>
			<section>
				<h2>5. When information is disclosed</h2>
				<p>We disclose information only as reasonably needed to:</p>
				<ul>
					<li>
						hosting, database, storage, analytics, email, security,
						and support providers that process it for us;
					</li>
					<li>
						Stripe and, if enabled, PayPal to create and administer
						subscriptions and payment records;
					</li>
					<li>
						external data or asset services requested by the
						browser, which receive ordinary network information such
						as an IP address;
					</li>
					<li>
						professional advisers, insurers, authorities, or other
						parties when reasonably necessary for legal compliance,
						safety, fraud prevention, or claims; and
					</li>
					<li>
						a successor in a merger, financing, reorganization, or
						sale, subject to applicable law and this Policy’s
						protections.
					</li>
				</ul>
			</section>
			<section>
				<h2>6. No sale, targeted advertising, or marketing email</h2>
				<p>
					We do not sell or rent personal information. We do not share
					personal information for cross-context behavioral
					advertising, and we do not use personal information to send
					marketing email. We may send transactional account,
					security, subscription, and service communications.
				</p>
			</section>
			<section>
				<h2>7. Cookies and browser storage</h2>
				<p>
					PokemonPGC uses an authentication cookie needed to keep
					users signed in. It also uses local storage and session
					storage for local progress, interface state, pending
					checkout continuity, and related functions. Vercel Web
					Analytics is configured for aggregated site measurement and
					is described by Vercel as cookie-free; Vercel and other
					infrastructure providers may still process network and
					operational information under their own notices.
				</p>
			</section>
			<section>
				<h2>8. Retention</h2>
				<p>
					We retain account and progress information while needed to
					provide the Service and until deletion is requested or
					otherwise appropriate. Authentication tokens expire but may
					remain until cleanup. Billing, transaction, fraud, tax,
					dispute, and legal records may be retained as required by
					law or legitimate business needs. Provider and operational
					logs follow provider settings and retention practices.
					Backup copies may persist for a limited period after primary
					deletion.
				</p>
			</section>
			<section>
				<h2>9. Security</h2>
				<p>
					We use administrative, technical, and organizational
					safeguards designed for the nature of the Service and
					information. No storage or transmission method is guaranteed
					completely secure. Use a unique password and contact us if
					you suspect unauthorized access.
				</p>
			</section>
			<section>
				<h2>10. Children</h2>
				<p>
					Accounts are not intended for children under 13, and we do
					not knowingly seek their personal information. If we learn
					that personal information was collected from a child under
					13 without legally sufficient parental consent, we will take
					appropriate steps to delete it. Contact us if you believe
					this occurred.
				</p>
			</section>
			<section>
				<h2>11. Your choices and privacy rights</h2>
				<p>
					You may request access, correction, deletion, or a portable
					copy of personal information by emailing {contactLink}.
					Depending on where you live, you may have additional rights
					to restrict or object to processing, withdraw consent,
					appeal a decision, or complain to a regulator. We may verify
					your identity and may retain information where permitted or
					required. We will not discriminate against you for
					exercising applicable privacy rights.
				</p>
			</section>
			<section>
				<h2>12. United States processing</h2>
				<p>
					The Service is operated from the United States, and
					providers may process information in the United States and
					other countries. Those locations may have different
					data-protection laws than your location.
				</p>
			</section>
			<section>
				<h2>13. Changes and contact</h2>
				<p>
					We may update this Policy as the Service and law change. We
					will post a new effective date and provide additional notice
					when required. Contact {contactLink} with privacy questions or requests.
				</p>
			</section>
		</>
	);
}

function RefundContent() {
	return (
		<>
			<section>
				<h2>1. Recurring subscriptions</h2>
				<p>
					Great renews monthly at $5 and Ultra renews yearly at $50
					until canceled, unless checkout shows a different price
					before you confirm. Applicable taxes may be added. The
					payment provider charges the payment method on file at the
					start of each billing period.
				</p>
			</section>
			<section>
				<h2>2. Cancellation</h2>
				<p>
					You may cancel through the current-plan control and
					payment-provider billing portal. Cancellation normally takes
					effect at the end of the current paid period, and access
					continues until then. Cancel before the renewal date to
					avoid the next charge. Deleting the app, becoming inactive,
					or sending a general message does not automatically cancel a
					subscription.
				</p>
			</section>
			<section>
				<h2>3. Upgrades and downgrades</h2>
				<p>
					An upgrade may take effect immediately. The payment provider
					may apply a prorated credit for unused time and charge the
					difference. A downgrade normally begins after the current
					paid period, so you keep the current tier until then. The
					exact amount and effective date are shown by the provider or
					PokemonPGC before the change is finalized.
				</p>
			</section>
			<section>
				<h2>4. Refunds</h2>
				<p>
					Subscription charges are generally nonrefundable, and we do
					not automatically provide prorated refunds for unused time.
					We may approve a refund case by case for duplicate charges,
					material billing errors, or other circumstances we consider
					appropriate. Nothing in this Policy limits a refund,
					cancellation, or cooling-off right required by applicable
					law.
				</p>
			</section>
			<section>
				<h2>5. Failed payments and disputes</h2>
				<p>
					A failed or reversed payment may cause paid access to be
					limited or removed. Contact us before filing a chargeback
					when possible so we can review billing errors. This request
					does not waive your legal or provider rights.
				</p>
			</section>
			<section>
				<h2>6. Requesting help</h2>
				<p>
					Email {contactLink} from the address associated with the
					account. Include the charge date, amount, payment provider,
					and a description of the issue. Do not send full card
					numbers, passwords, or authentication secrets.
				</p>
			</section>
		</>
	);
}

function CopyrightContent() {
	return (
		<>
			<section>
				<h2>1. Strong unofficial-project notice</h2>
				<UnofficialProjectNotice />
				<p>
					PokemonPGC does not currently claim or advertise a license
					from Nintendo, The Pokemon Company, Game Freak, Creatures
					Inc., or their affiliates. A disclaimer, credit, or
					noninfringement belief is not a substitute for a license,
					permission, or fact-specific legal analysis.
				</p>
			</section>
			<section>
				<h2>2. PokemonPGC-owned material</h2>
				<p>
					Subject to third-party rights, {LEGAL_OPERATOR} owns or
					licenses the Service’s original software, site copy,
					arrangement, and original brand materials. These Terms do
					not transfer those rights. You may use the Service for
					personal, noncommercial purposes, but may not reproduce,
					resell, or distribute our original material except as law
					permits or we authorize in writing.
				</p>
			</section>
			<section>
				<h2>3. Third-party material</h2>
				<p>
					Third-party names, characters, artwork, screenshots, models,
					data, and other material remain the property of their
					respective owners. Their appearance does not imply
					sponsorship, endorsement, authorization, affiliation, or
					partnership. Any permitted use is limited by applicable law
					and the rights holder’s terms; this page grants no rights in
					that material.
				</p>
			</section>
			<section>
				<h2>4. Copyright or trademark complaints</h2>
				<p>
					A rights holder or authorized agent may send a complaint to {contactLink}.
					To help us evaluate it, identify the
					protected work or mark, the material at issue and its exact
					URL, your contact information, the basis for your rights and
					objection, and any requested action. Include statements that
					your complaint is accurate and made in good faith, and your
					physical or electronic signature.
				</p>
				<p>
					We may request more information, restrict material during
					review, forward the complaint to affected parties, and
					remove or modify material when appropriate. This email
					process is not a representation that the Service has
					registered a designated DMCA agent or qualifies for a
					particular safe harbor.
				</p>
			</section>
		</>
	);
}

const DOCUMENTS = {
	terms: { title: "Terms of Service", Content: TermsContent },
	privacy: { title: "Privacy Policy", Content: PrivacyContent },
	refunds: {
		title: "Refund and Cancellation Policy",
		Content: RefundContent,
	},
	copyright: {
		title: "Copyright and Trademark Notice",
		Content: CopyrightContent,
	},
};

/** Renders one of the versioned public policy documents. */
export function LegalPage({ document }) {
	const policy = DOCUMENTS[document] || DOCUMENTS.terms;
	const Content = policy.Content;

	return (
		<article className="legal-page">
			<header className="legal-page-header">
				<p className="legal-page-kicker">HeadInTheCloudsHaven LLC</p>
				<h1>{policy.title}</h1>
				<p>Effective {LEGAL_EFFECTIVE_DATE}</p>
			</header>
			<div className="legal-page-summary">
				<p>
					This is a public operational policy for PokemonPGC.
					Questions may be sent to {contactLink}.
				</p>
			</div>
			<div className="legal-page-content">
				<Content />
			</div>
		</article>
	);
}
