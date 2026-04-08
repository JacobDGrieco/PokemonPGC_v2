import { gameSearch,
  buildMonInfoFormsByGame,
} from '../helpers/index.js';
import { PPGC } from '../../src/registry.js';

(() => {
	const natiId = 550;
	const form = "blue-striped";
	const games = gameSearch("gen5", "gen6", "gen7", "swsh", "la", "scvi");

	const monInfoFormsByGame = buildMonInfoFormsByGame(natiId, form, games);

	PPGC.register({
		monInfoForms: monInfoFormsByGame,
	});
})();