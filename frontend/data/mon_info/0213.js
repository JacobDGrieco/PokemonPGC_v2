import { gameSearch,
  buildMonInfoByGame,
} from '../helpers/index.js';
import { PPGC } from '../../src/registry.js';

(() => {
	const natiId = 213;
	const nameVal = "Shuckle";
	const games = gameSearch("gen2", "gen3", "gen4", "gen5", "gen6", "gen7", "swsh", "bdsp");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
