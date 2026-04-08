import { gameSearch,
  buildMonInfoFormsByGame,
} from '../helpers/index.js';
import { PPGC } from '../../src/registry.js';

(() => {
	const natiId = 128;
	const form = "paldea-aqua-breed";
	const games = gameSearch("scvi", "lza");

	const monInfoFormsByGame = buildMonInfoFormsByGame(natiId, form, games);

	PPGC.register({
		monInfoForms: monInfoFormsByGame,
	});
})();