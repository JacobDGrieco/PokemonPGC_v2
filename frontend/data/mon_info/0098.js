import { gameSearch,
  buildMonInfoByGame,
} from '../helpers/index.js';
import { PPGC } from '../../src/registry.js';

(() => {
	const natiId = 98;
	const nameVal = "Krabby";
	const games = gameSearch("gen1", "gen2", "gen3", "gen4", "gen5", "gen6", "gen7", "lgpe", "swsh", "bdsp");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
