import { gameSearch,
  buildMonInfoByGame,
} from '../helpers/index.js';
import { PPGC } from '../../src/registry.js';

(() => {
	const natiId = 47;
	const nameVal = "Parasect";
	const games = gameSearch("gen1", "gen2", "gen3", "gen4", "gen5", "gen6", "gen7", "lgpe", "bdsp", "la");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
