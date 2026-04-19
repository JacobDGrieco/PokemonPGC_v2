const POKEAPI_BASE = 'https://pokeapi.co/api/v2';
const speciesCache = new Map();
const pokemonCache = new Map();

function titleCase(value) {
  return String(value || '')
    .split(/[-\s]+/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function pickEnglishFlavor(entries = []) {
  const match = entries.find((entry) => entry?.language?.name === 'en' && entry.flavor_text);
  return match?.flavor_text?.replace(/\f|\n|\r/g, ' ') || '';
}

function pickEnglishGenus(entries = []) {
  const match = entries.find((entry) => entry?.language?.name === 'en' && entry.genus);
  return match?.genus || '';
}

async function fetchJson(url, cache) {
  if (cache.has(url)) return cache.get(url);

  const promise = fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`PokeAPI request failed: ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      cache.delete(url);
      throw error;
    });

  cache.set(url, promise);
  return promise;
}

export async function fetchPokeApiMonInfo(nationalId) {
  const id = Number(nationalId);
  if (!Number.isFinite(id) || id <= 0) return null;

  try {
    const [pokemon, species] = await Promise.all([
      fetchJson(`${POKEAPI_BASE}/pokemon/${id}`, pokemonCache),
      fetchJson(`${POKEAPI_BASE}/pokemon-species/${id}`, speciesCache),
    ]);

    const abilities = (pokemon.abilities || []).map((entry) => titleCase(entry?.ability?.name)).filter(Boolean);
    const eggGroups = (species.egg_groups || []).map((entry) => titleCase(entry?.name)).filter(Boolean);
    const types = (pokemon.types || [])
      .sort((a, b) => (a.slot || 0) - (b.slot || 0))
      .map((entry) => titleCase(entry?.type?.name))
      .filter(Boolean);

    return {
      displayName: titleCase(species.name || pokemon.name),
      flavor: pickEnglishFlavor(species.flavor_text_entries),
      genus: pickEnglishGenus(species.genera),
      abilities,
      eggGroups,
      types,
      height: pokemon.height ? `${(pokemon.height / 10).toFixed(1)} m` : null,
      weight: pokemon.weight ? `${(pokemon.weight / 10).toFixed(1)} kg` : null,
      baseExperience: pokemon.base_experience ?? null,
      baseHappiness: species.base_happiness ?? null,
      captureRate: species.capture_rate ?? null,
      hatchCounter: species.hatch_counter ?? null,
      growthRate: titleCase(species.growth_rate?.name),
      habitat: titleCase(species.habitat?.name),
      shape: titleCase(species.shape?.name),
      color: titleCase(species.color?.name),
      baseStats: {
        hp: pokemon.stats?.find((s) => s.stat?.name === 'hp')?.base_stat ?? null,
        atk: pokemon.stats?.find((s) => s.stat?.name === 'attack')?.base_stat ?? null,
        def: pokemon.stats?.find((s) => s.stat?.name === 'defense')?.base_stat ?? null,
        spa: pokemon.stats?.find((s) => s.stat?.name === 'special-attack')?.base_stat ?? null,
        spd: pokemon.stats?.find((s) => s.stat?.name === 'special-defense')?.base_stat ?? null,
        spe: pokemon.stats?.find((s) => s.stat?.name === 'speed')?.base_stat ?? null,
      },
      pokedexSource: 'pokeapi',
    };
  } catch (error) {
    console.debug('[pokeapi] fallback fetch failed:', error);
    return null;
  }
}
