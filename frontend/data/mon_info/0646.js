import { gameSearch,
  buildMonInfoByGame,
} from '../helpers/index.js';
import { PPGC } from '../../src/registry.js';

(() => {
	const natiId = 646;
	const nameVal = "Kyurem";
	const games = gameSearch("gen5", "gen6", "gen7", "swsh", "scvi");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
