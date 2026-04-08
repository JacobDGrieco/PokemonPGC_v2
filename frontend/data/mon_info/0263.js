import { gameSearch,
  buildMonInfoByGame,
} from '../helpers/index.js';
import { PPGC } from '../../src/registry.js';

(() => {
	const natiId = 263;
	const nameVal = "Zigzagoon";
	const games = gameSearch("gen3", "gen4", "gen5", "gen6", "gen7", "swsh", "bdsp");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
