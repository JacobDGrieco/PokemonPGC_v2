/** Curry collection adapter with persisted contract names preserved. */
import { createCollectibleAdapter } from "./collectible-adapter.js";

const curryAdapter = createCollectibleAdapter({
	kind: "curry",
	statusMapName: "curryStatus",
	formsMapName: "curryFormsStatus",
	meterFlagProperty: "__ppgcCurryMeter",
	percentageExportName: "curryPctFor",
	scaleMode: "curry",
	formsImageWidth: "100px",
	singleItemActionLabel: "Cooked",
});

export const curryPctFor = curryAdapter.percentageFor;
export const renderCurryCardsFor = curryAdapter.renderCardsFor;
