import { gameSearch,
  buildMonInfoByGame,
} from '../helpers/index.js';
import { PPGC } from '../../src/registry.js';

(() => {
	const natiId = 363;
	const nameVal = "Spheal";
	const games = gameSearch("gen3", "gen4", "gen5", "gen6", "gen7", "swsh", "bdsp", "la");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
