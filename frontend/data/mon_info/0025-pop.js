import { gameSearch,
  buildMonInfoFormsByGame,
} from '../helpers/index.js';
import { PPGC } from '../../src/registry.js';

(() => {
	const natiId = 25;
	const form = "pop";
	const games = gameSearch("oras");

	const monInfoFormsByGame = buildMonInfoFormsByGame(natiId, form, games);

	PPGC.register({
		monInfoForms: monInfoFormsByGame,
	});
})();