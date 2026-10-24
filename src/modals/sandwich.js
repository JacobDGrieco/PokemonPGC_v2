/** Sandwich collection adapter with persisted contract names preserved. */
import { createCollectibleAdapter } from "./collectible-adapter.js";

const sandwichAdapter = createCollectibleAdapter({
	kind: "sandwich",
	statusMapName: "sandwichStatus",
	formsMapName: "sandwichFormsStatus",
	meterFlagProperty: "__ppgcSandwichMeter",
	percentageExportName: "sandwichPctFor",
	scaleMode: "sandwich",
	formsImageWidth: "100%",
	singleItemActionLabel: "Made",
});

export const sandwichPctFor = sandwichAdapter.percentageFor;
export const renderSandwichCardsFor = sandwichAdapter.renderCardsFor;
