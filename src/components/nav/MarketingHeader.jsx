import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PagesDropdown } from "./PagesDropdown.jsx";
import { buildAccountRoute } from "../../utils/accountRoute.js";
import { AccountMenuControl } from "./AccountMenuControl.jsx";

export function MarketingHeader() {
	const location = useLocation();
	const navigate = useNavigate();
	const showPages = location.pathname !== "/";

	const handleAuthenticatedAccountClick = () => {
		navigate(buildAccountRoute("general"));
	};

	return (
		<header className="marketing-header">
			<div className="marketing-header-left">
				<Link to="/" className="marketing-brand">
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
				{showPages && <PagesDropdown />}
			</div>
			<AccountMenuControl
				onAuthenticatedClick={handleAuthenticatedAccountClick}
			/>
		</header>
	);
}
