import { gameSearch,
  buildMonInfoByGame,
} from '../helpers/index.js';
import { PPGC } from '../../src/registry.js';

(() => {
	const natiId = 169;
	const nameVal = "Crobat";
	const games = gameSearch("gen2", "gen3", "gen4", "gen5", "gen6", "gen7", "swsh", "bdsp", "la", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
