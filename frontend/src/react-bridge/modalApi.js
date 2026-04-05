import * as Dex from "../modals/dex.js";
import { dexPctFor as _dexPctFor, dexSummaryCardFor as _dexSummaryCardFor } from "../modals/dex-summary.js";
import * as Fashion from "../modals/fashion.js";
import { fashionSummaryCardFor as _fashionSummaryCardFor } from "../modals/fashion-summary.js";
import * as Distributions from "../modals/distributions.js";
import * as Curry from "../modals/curry.js";
import * as Sandwich from "../modals/sandwich.js";
import * as Sticker from "../modals/sticker.js";
import * as Medals from "../modals/medal.js";

export const dexPctFor = (...args) => _dexPctFor?.(...args);
export const dexSummaryCardFor = (...args) => _dexSummaryCardFor?.(...args);
export const fashionSummaryCardFor = (...args) => _fashionSummaryCardFor?.(...args);
export const renderDistributionCardsFor = (...args) => Distributions.renderDistributionCardsFor?.(...args);
export const renderCurryCardsFor = (...args) => Curry.renderCurryCardsFor?.(...args);
export const renderSandwichCardsFor = (...args) => Sandwich.renderSandwichCardsFor?.(...args);
export const renderStickerCardsFor = (...args) => Sticker.renderStickerCardsFor?.(...args);
export const medalsSectionCardFor = (...args) => Medals.medalsSectionCardFor?.(...args);
