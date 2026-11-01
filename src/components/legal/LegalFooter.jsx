import React from "react";
import { Link } from "react-router-dom";
import {
	LEGAL_CONTACT_EMAIL,
	LEGAL_OPERATOR,
	UNOFFICIAL_PROJECT_NOTICE,
} from "../../../shared/legal.js";

const LEGAL_LINKS = [
	{ to: "/terms", label: "Terms" },
	{ to: "/privacy", label: "Privacy" },
	{ to: "/refunds", label: "Refunds & cancellation" },
	{ to: "/copyright", label: "Copyright & trademarks" },
];

/** Shared public footer for marketing, account-entry, and legal routes. */
export function LegalFooter() {
	return (
		<footer className="legal-footer">
			<div className="legal-footer-inner">
				<p className="legal-footer-notice">
					<strong>Unofficial fan project.</strong>{" "}
					{UNOFFICIAL_PROJECT_NOTICE}
				</p>
				<nav aria-label="Legal and support">
					{LEGAL_LINKS.map((link) => (
						<Link key={link.to} to={link.to}>
							{link.label}
						</Link>
					))}
					<a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>Contact</a>
				</nav>
				<p className="legal-footer-copyright">
					&copy; 2026 {LEGAL_OPERATOR}. All rights reserved.
				</p>
			</div>
		</footer>
	);
}
