import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { HeaderPageNavigation } from "./HeaderPageNavigation.jsx";
import { buildAccountRoute } from "../../utils/accountRoute.js";
import { AccountMenuControl } from "./AccountMenuControl.jsx";

export function MarketingHeader() {
	const navigate = useNavigate();

	const handleAuthenticatedAccountClick = () => {
		navigate(buildAccountRoute("general"));
	};

	return (
		<header className="marketing-header">
			<div className="marketing-header-left">
				<Link
					to="/checklists"
					className="marketing-brand"
					aria-label="Open Checklists"
				>
					<img
						src="/cloud-ball-48.webp"
						srcSet="/cloud-ball-48.webp 1x, /cloud-ball-96.webp 2x"
						alt=""
						className="marketing-brand-icon"
						width="24"
						height="24"
					/>
					PokémonPGC
				</Link>
			</div>
			<HeaderPageNavigation />
			<AccountMenuControl
				onAuthenticatedClick={handleAuthenticatedAccountClick}
			/>
		</header>
	);
}
