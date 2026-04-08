import { gameSearch,
  buildMonInfoFormsByGame,
} from '../helpers/index.js';
import { PPGC } from '../../src/registry.js';

(() => {
	const natiId = 201;
	const form = "c";
	const games = gameSearch("gen2", "gen3", "gen4", "gen5", "gen6", "gen7", "bdsp", "la");

	const monInfoFormsByGame = buildMonInfoFormsByGame(natiId, form, games);

	PPGC.register({
		monInfoForms: monInfoFormsByGame,
	});
})();