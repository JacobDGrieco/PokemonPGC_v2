import { gameSearch,
  buildMonInfoByGame,
} from '../helpers/index.js';
import { PPGC } from '../../src/registry.js';

(() => {
	const natiId = 463;
	const nameVal = "Lickilicky";
	const games = gameSearch("gen4", "gen5", "gen6", "gen7", "swsh", "bdsp", "la");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
