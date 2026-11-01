import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { MarketingShell } from "./components/shells/MarketingShell.jsx";
import { useLegacyBootstrap } from "./hooks/useLegacyBootstrap.js";

const AppShell = lazy(() =>
	import("./components/shells/AppShell.jsx").then((module) => ({
		default: module.AppShell,
	})),
);
const HomePage = lazy(() =>
	import("./pages/HomePage.jsx").then((module) => ({
		default: module.HomePage,
	})),
);
const PricingPage = lazy(() =>
	import("./pages/PricingPage.jsx").then((module) => ({
		default: module.PricingPage,
	})),
);
const SubscriptionSuccessPage = lazy(() =>
	import("./pages/SubscriptionSuccessPage.jsx").then((module) => ({
		default: module.SubscriptionSuccessPage,
	})),
);
const PlaceholderPage = lazy(() =>
	import("./pages/PlaceholderPage.jsx").then((module) => ({
		default: module.PlaceholderPage,
	})),
);
const AccountRoutePage = lazy(() =>
	import("./pages/AccountRoutePage.jsx").then((module) => ({
		default: module.AccountRoutePage,
	})),
);
const AuthActionPage = lazy(() =>
	import("./pages/AuthActionPage.jsx").then((module) => ({
		default: module.AuthActionPage,
	})),
);
const LegalPage = lazy(() =>
	import("./pages/LegalPage.jsx").then((module) => ({
		default: module.LegalPage,
	})),
);

function RouteLoading() {
	return (
		<div className="route-loading" role="status" aria-live="polite">
			Loading page…
		</div>
	);
}

export default function App() {
	const location = useLocation();
	const isHomeRoute = location.pathname === "/";
	useLegacyBootstrap({ immediate: !isHomeRoute });

	return (
		<>
			<Suspense fallback={<RouteLoading />}>
				<Routes>
					<Route
						path="/"
						element={
							<MarketingShell>
								<HomePage />
							</MarketingShell>
						}
					/>
					<Route
						path="/pricing"
						element={
							<MarketingShell>
								<PricingPage />
							</MarketingShell>
						}
					/>
					<Route
						path="/subscription/success"
						element={
							<MarketingShell>
								<SubscriptionSuccessPage />
							</MarketingShell>
						}
					/>
					<Route
						path="/auth/verify-email"
						element={
							<MarketingShell>
								<AuthActionPage action="verify-email" />
							</MarketingShell>
						}
					/>
					<Route
						path="/auth/reset-password"
						element={
							<MarketingShell>
								<AuthActionPage action="reset-password" />
							</MarketingShell>
						}
					/>
					{["terms", "privacy", "refunds", "copyright"].map(
						(document) => (
							<Route
								key={document}
								path={`/${document}`}
								element={
									<MarketingShell>
										<LegalPage document={document} />
									</MarketingShell>
								}
							/>
						),
					)}

					<Route path="/checklists" element={<AppShell />} />
					<Route
						path="/account"
						element={
							<AppShell routeLevelOverride="account">
								<AccountRoutePage />
							</AppShell>
						}
					/>
					<Route
						path="/account/:tab"
						element={
							<AppShell routeLevelOverride="account">
								<AccountRoutePage />
							</AppShell>
						}
					/>

					<Route
						path="/pokemon-info"
						element={<PlaceholderPage feature="pokemon-info" />}
					/>
					<Route
						path="/guides"
						element={<PlaceholderPage feature="guides" />}
					/>
					<Route
						path="/tools"
						element={<PlaceholderPage feature="tools" />}
					/>
					<Route
						path="/global-stats"
						element={<PlaceholderPage feature="global-stats" />}
					/>
					<Route
						path="/model-viewer"
						element={<PlaceholderPage feature="model-viewer" />}
					/>

					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</Suspense>
			<Analytics debug={false} />
		</>
	);
}
