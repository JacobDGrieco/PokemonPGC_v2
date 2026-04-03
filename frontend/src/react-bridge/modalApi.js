import * as Dex from "../modals/dex.js";
import * as Fashion from "../modals/fashion.js";
import * as Distributions from "../modals/distributions.js";
import * as Curry from "../modals/curry.js";
import * as Sandwich from "../modals/sandwich.js";
import * as Sticker from "../modals/sticker.js";
import * as Medals from "../modals/medal.js";

export const dexPctFor = (...args) => Dex.dexPctFor?.(...args);
export const dexSummaryCardFor = (...args) => Dex.dexSummaryCardFor?.(...args);
export const fashionSummaryCardFor = (...args) => Fashion.fashionSummaryCardFor?.(...args);
export const renderDistributionCardsFor = (...args) => Distributions.renderDistributionCardsFor?.(...args);
export const renderCurryCardsFor = (...args) => Curry.renderCurryCardsFor?.(...args);
export const renderSandwichCardsFor = (...args) => Sandwich.renderSandwichCardsFor?.(...args);
export const renderStickerCardsFor = (...args) => Sticker.renderStickerCardsFor?.(...args);
export const medalsSectionCardFor = (...args) => Medals.medalsSectionCardFor?.(...args);
