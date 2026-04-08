import { gameSearch,
  buildMonInfoByGame,
} from '../helpers/index.js';
import { PPGC } from '../../src/registry.js';

(() => {
	const natiId = 435;
	const nameVal = "Skuntank";
	const games = gameSearch("gen4", "gen5", "gen6", "gen7", "swsh", "bdsp", "la", "scvi");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
