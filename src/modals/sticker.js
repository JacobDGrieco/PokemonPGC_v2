/** Sticker collection adapter with persisted contract names preserved. */
import { createCollectibleAdapter } from "./collectible-adapter.js";

const stickerAdapter = createCollectibleAdapter({
	kind: "sticker",
	statusMapName: "stickerStatus",
	formsMapName: "stickerFormsStatus",
	meterFlagProperty: "__ppgcStickerMeter",
	percentageExportName: "stickerPctFor",
	scaleMode: "sandwich",
	formsImageWidth: "100%",
	singleItemActionLabel: "Collected",
});

export const stickerPctFor = stickerAdapter.percentageFor;
export const renderStickerCardsFor = stickerAdapter.renderCardsFor;
