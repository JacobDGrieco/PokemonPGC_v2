import { gameSearch,
  buildMonInfoFormsByGame,
} from '../helpers/index.js';
import { PPGC } from '../../src/registry.js';

(() => {
	const natiId = 493;
	const form = "electric";
	const games = gameSearch("gen4", "gen5", "gen6", "gen7", "bdsp", "la", "scvi");

	const monInfoFormsByGame = buildMonInfoFormsByGame(natiId, form, games);

	PPGC.register({
		monInfoForms: monInfoFormsByGame,
	});
})();