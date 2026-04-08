import { gameSearch,
  buildMonInfoByGame,
} from '../helpers/index.js';
import { PPGC } from '../../src/registry.js';

(() => {
	const natiId = 323;
	const nameVal = "Camerupt";
	const games = gameSearch("gen3", "gen4", "gen5", "gen6", "gen7", "bdsp", "scvi", "lza");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
