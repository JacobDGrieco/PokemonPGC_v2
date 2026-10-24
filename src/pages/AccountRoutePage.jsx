import React, { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { AccountPage } from "../components/content/AccountPage.jsx";
import { save, store } from "../store.js";
import {
	buildAccountRoute,
	normalizeAccountTab,
} from "../utils/accountRoute.js";

export function AccountRoutePage() {
	const params = useParams();
	const rawTab = params.tab;
	const activeTab = normalizeAccountTab(rawTab);

	useEffect(() => {
		store.state.accountTab = activeTab;
		save();
	}, [activeTab]);

	if (!rawTab) {
		return <Navigate to={buildAccountRoute(activeTab)} replace />;
	}

	if (rawTab && rawTab !== activeTab) {
		return <Navigate to={buildAccountRoute(activeTab)} replace />;
	}

	return <AccountPage activeTab={activeTab} />;
}
