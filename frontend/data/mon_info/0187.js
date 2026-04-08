import { gameSearch,
  buildMonInfoByGame,
} from '../helpers/index.js';
import { PPGC } from '../../src/registry.js';

(() => {
	const natiId = 187;
	const nameVal = "Hoppip";
	const games = gameSearch("gen2", "gen3", "gen4", "gen5", "gen6", "gen7", "bdsp", "scvi");

	const monInfoByGame = buildMonInfoByGame(natiId, nameVal, games);

	PPGC.register([
		{ monInfo: monInfoByGame, },
	]);
})();
