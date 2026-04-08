import { gameSearch,
  buildMonInfoByGame,
} from '../helpers/index.js';
import { PPGC } from '../../src/registry.js';

(() => {
	const natiId = 359;
	const nameVal = "Absol";
	const games = gameSearch("gen3", "gen4", "gen5", "gen6", "gen7", "swsh", "bdsp", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
