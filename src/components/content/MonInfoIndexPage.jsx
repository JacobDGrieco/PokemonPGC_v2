import { useMemo, useState } from "react";
import { assetPath } from "../../utils/assetPath.js";
import { navigateToState } from "../../react-bridge/navigation.js";
import {
	getHomeDexMons,
	pad4,
	pickPreferredGameForMon,
} from "../../react-bridge/monInfo.js";

const INITIAL_MON_COUNT = 120;
const MON_COUNT_INCREMENT = 120;

export function MonInfoIndexPage() {
	const mons = useMemo(() => getHomeDexMons(), []);
	const [searchQuery, setSearchQuery] = useState("");
	const [visibleMonCount, setVisibleMonCount] = useState(INITIAL_MON_COUNT);
	const normalizedQuery = searchQuery.trim().toLowerCase();
	const filteredMons = useMemo(() => {
		if (!normalizedQuery) return mons;
		return mons.filter((mon) => {
			const nationalId = String(mon.natiId || "");
			const paddedId = pad4(mon.natiId);
			return (
				nationalId.includes(normalizedQuery) ||
				paddedId.includes(normalizedQuery) ||
				String(mon.name || "")
					.toLowerCase()
					.includes(normalizedQuery)
			);
		});
	}, [mons, normalizedQuery]);
	const visibleMons = filteredMons.slice(0, visibleMonCount);
	const hasMoreMons = visibleMons.length < filteredMons.length;

	const handleSearchChange = (event) => {
		setSearchQuery(event.target.value);
		setVisibleMonCount(INITIAL_MON_COUNT);
	};

	return (
		<div className="page react-moninfo-page">
			<div className="moninfo-index-header">
				<h2 className="page-title">Mon Info</h2>
				<label className="moninfo-index-search">
					<span>Search Pokémon</span>
					<input
						type="search"
						value={searchQuery}
						onChange={handleSearchChange}
						placeholder="Name or National Dex number"
						autoComplete="off"
					/>
				</label>
			</div>

			<p className="moninfo-index-count" role="status">
				Showing {visibleMons.length} of {filteredMons.length} Pokémon
			</p>

			<div className="moninfo-grid">
				{visibleMons.map((mon) => {
					const paddedId = pad4(mon.natiId);
					const displayName = mon.name || `#${paddedId}`;
					return (
						<button
							key={mon.natiId}
							type="button"
							className="moninfo-card"
							onClick={() =>
								navigateToState({
									level: "moninfo",
									genKey: null,
									gameKey: null,
									sectionId: null,
									monInfoId: mon.natiId,
									monInfoGameKey: pickPreferredGameForMon(
										mon.natiId,
										null,
									),
									monInfoForm: null,
									toolsKey: "info",
								})
							}
						>
							<div className="moninfo-card-id">#{paddedId}</div>
							<img
								className="moninfo-card-img"
								src={assetPath(
									`sprites/pokemon_home/base-front/${paddedId}.png`,
								)}
								alt={`${displayName}, National Dex ${mon.natiId}`}
								width="128"
								height="128"
								loading="lazy"
								decoding="async"
							/>
							<div className="moninfo-card-name">
								{displayName}
							</div>
						</button>
					);
				})}
			</div>

			{hasMoreMons && (
				<button
					type="button"
					className="button moninfo-load-more"
					onClick={() =>
						setVisibleMonCount(
							(currentCount) =>
								currentCount + MON_COUNT_INCREMENT,
						)
					}
				>
					Show{" "}
					{Math.min(
						MON_COUNT_INCREMENT,
						filteredMons.length - visibleMons.length,
					)}{" "}
					more
				</button>
			)}
		</div>
	);
}
