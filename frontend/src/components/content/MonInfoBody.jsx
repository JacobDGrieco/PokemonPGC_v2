import React, { useEffect, useState } from 'react';
import { pad4 } from '../../react-bridge/monInfo.js';
import { resolveMonInfoData } from '../../react-bridge/monInfoData.js';

function TypePill({ type }) {
  return <span className={`type-pill type-${String(type).toLowerCase()}`}>{type}</span>;
}

function ProfileCard({ profile }) {
  const rows = [
    ['Abilities', profile.abilities],
    ['Egg Groups', profile.eggGroups],
    ['Exp Growth', profile.expGroup],
    ['Base Egg Steps', profile.baseEggSteps],
    ['Height', profile.height],
    ['Weight', profile.weight],
    ['Gender Ratio', profile.genderRatio],
    ['Base Friendship', profile.baseFriendship != null ? `${profile.baseFriendship} / 255` : null],
    ['Capture Rate', profile.captureRate],
    ['Base Experience', profile.baseExperience],
    ['Habitat', profile.habitat],
    ['Shape', profile.shape],
    ['Color', profile.color],
    ['Species', profile.genus],
  ].filter(([, value]) => value != null && value !== '' && (!Array.isArray(value) || value.length));

  if (!rows.length) return null;

  return (
    <div className="mon-info-block mon-info-profile">
      <h3>Profile</h3>
      <div className="mon-info-profile-grid">
        {rows.map(([label, value]) => (
          <div key={label} className="mon-info-profile-item">
            <div className="label">{label}</div>
            {Array.isArray(value) ? (
              <div className="value value--stacked">{value.map((item) => <span key={`${label}-${item}`} className="value-line">{item}</span>)}</div>
            ) : (
              <div className="value">{value}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function StatsRadar({ stats }) {
  const labels = ['HP', 'Atk', 'Def', 'Spe', 'SpD', 'SpA'];
  const order = ['hp', 'atk', 'def', 'spe', 'spd', 'spa'];
  const values = order.map((key) => Number(stats?.[key] ?? 0));
  if (!values.some((v) => Number.isFinite(v) && v > 0)) return null;
  const maxVal = Math.max(...values, 1);
  const total = values.reduce((sum, v) => sum + v, 0);
  const center = 50;
  const radius = 65;
  const points = values.map((v, idx) => {
    const ratio = v / maxVal;
    const r = radius * ratio;
    const angle = -Math.PI / 2 + (idx * 2 * Math.PI) / order.length;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
      angle,
      r,
      value: v,
      label: labels[idx],
    };
  });
  const gridLevels = [0.33, 0.66, 1];
  return (
    <div className="mon-info-block mon-info-stats">
      <h3>Base Stats</h3>
      <div className="mon-info-stats-graph">
        <svg viewBox="-25 -25 150 150" className="mon-info-stats-radar" aria-hidden="true">
          {gridLevels.map((lvl) => {
            const pts = order.map((_, i) => {
              const r = radius * lvl;
              const angle = -Math.PI / 2 + (i * 2 * Math.PI) / order.length;
              return `${(center + r * Math.cos(angle)).toFixed(1)},${(center + r * Math.sin(angle)).toFixed(1)}`;
            }).join(' ');
            return <polygon key={lvl} points={pts} className="stat-grid-ring" />;
          })}
          <polygon points={points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')} className="stat-radar-fill" />
          {points.map((p) => <circle key={`dot-${p.label}`} cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r="1.6" className="stat-vertex-dot" />)}
          {points.map((p) => {
            const lx = center + (radius + 12) * Math.cos(p.angle);
            const ly = center + (radius + 12) * Math.sin(p.angle);
            return <text key={`lbl-${p.label}`} x={lx.toFixed(1)} y={ly.toFixed(1)} className="stat-label" textAnchor="middle" dominantBaseline="central">{p.label}</text>;
          })}
          {points.map((p) => {
            const nx = center + (p.r * 0.7) * Math.cos(p.angle);
            const ny = center + (p.r * 0.7) * Math.sin(p.angle);
            return <text key={`val-${p.label}`} x={nx.toFixed(1)} y={ny.toFixed(1)} className="stat-value" textAnchor="middle" dominantBaseline="central">{p.value}</text>;
          })}
          <text x={center} y={center} className="stat-total" textAnchor="middle" dominantBaseline="central">{total}</text>
        </svg>
      </div>
    </div>
  );
}

function TypeDefenseCard({ rows }) {
  if (!rows?.length) return null;
  const groups = [rows.slice(0, 6), rows.slice(6, 12), rows.slice(12, 18)];
  const clsFor = (mult) => {
    if (mult === 4) return 'type-fx-400';
    if (mult === 2) return 'type-fx-200';
    if (mult === 1.5) return 'type-fx-150';
    if (mult === 0.5) return 'type-fx-50';
    if (mult === 0.25) return 'type-fx-25';
    if (mult === 0) return 'type-fx-0';
    return 'type-fx-100';
  };
  const labelFor = (mult) => {
    if (mult === 4) return '4';
    if (mult === 2) return '2';
    if (mult === 1.5) return '1½';
    if (mult === 0.5) return '½';
    if (mult === 0.25) return '¼';
    if (mult === 0) return '0';
    return '';
  };
  const abbr = { Normal: 'Nor', Fire: 'Fir', Water: 'Wat', Electric: 'Ele', Grass: 'Gra', Ice: 'Ice', Fighting: 'Fig', Poison: 'Poi', Ground: 'Gro', Flying: 'Fly', Psychic: 'Psy', Bug: 'Bug', Rock: 'Roc', Ghost: 'Gho', Dragon: 'Dra', Dark: 'Dar', Steel: 'Ste', Fairy: 'Fai' };
  return (
    <div className="mon-info-block mon-info-typechart">
      <h3>Type Defenses</h3>
      <div className="typechart-matrix">
        {groups.map((group, idx) => (
          <table key={idx} className="type-table-pokedex">
            <thead><tr>{group.map((row) => <th key={row.type}><span className={`type-abbr type-${row.type.toLowerCase()}`}>{abbr[row.type] || row.type.slice(0, 3)}</span></th>)}</tr></thead>
            <tbody><tr>{group.map((row) => <td key={row.type} className={`type-fx-cell ${clsFor(row.mult)}`}>{labelFor(row.mult)}</td>)}</tr></tbody>
          </table>
        ))}
      </div>
    </div>
  );
}

function EvolutionCard({ paths }) {
  if (!paths?.length) return null;
  const methodLabel = (step) => {
    if (!step) return '';
    const m = step.method != null ? String(step.method) : '';
    const v = step.value != null ? step.value : null;
    if (!m && step.level != null) return `Lv. ${step.level}`;
    if (!m) return step.trigger || '';
    if (m.toLowerCase() === 'level') return v != null ? `Lv. ${v}` : 'Level';
    if (v == null || v === '') return m;
    return `${m}: ${v}`;
  };

  return (
    <div className="mon-info-block mon-info-evolution">
      <h3>Evolution</h3>
      <div className="react-evo-list">
        {paths.map((path, pathIndex) => (
          <div key={`path-${pathIndex}`} className="react-evo-path">
            {path.map((step, idx) => (
              <React.Fragment key={`${pathIndex}-${step?.id || step?.name || idx}`}>
                {idx > 0 ? <div className="react-evo-link">{methodLabel(step)}</div> : null}
                <div className="react-evo-node">
                  <img src={_assetPath(`sprites/pokemon_home/menu_sprites/${pad4(step?.natiId || step?.id || 0)}.png`)} alt="" />
                  <div className="react-evo-name">{step?.name || `#${step?.id || '?'}`}</div>
                </div>
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function LocationsCard({ locations }) {
  if (!locations?.length) return null;
  return (
    <div className="mon-info-block mon-info-locations">
      <h3>Locations</h3>
      <ul className="react-moninfo-list">
        {locations.map((loc) => (
          <li key={loc.key}>
            {loc.area ? <strong>{loc.area}</strong> : null}
            {loc.area && loc.notes ? ' — ' : ''}
            {loc.notes}
            {loc.extra ? <span className="small"> ({loc.extra})</span> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

function MovesCard({ moves }) {
  if (!moves?.length) return null;
  return (
    <div className="mon-info-block mon-info-moves-react">
      <h3>Moves</h3>
      <div className="react-moves-groups">
        {moves.map((group) => (
          <div key={group.learnMethod} className="react-moves-group">
            <h4>{group.learnMethod}</h4>
            <div className="react-moves-chips">
              {group.entries.map((entry, index) => {
                const label = typeof entry === 'string' ? entry : (entry?.name || entry?.move || `Move ${index + 1}`);
                const meta = typeof entry === 'object' ? [entry?.level != null ? `Lv. ${entry.level}` : '', entry?.type || '', entry?.power != null ? `Pow ${entry.power}` : ''].filter(Boolean).join(' • ') : '';
                return (
                  <div key={`${group.learnMethod}-${label}-${index}`} className="react-move-chip">
                    <span>{label}</span>
                    {meta ? <small>{meta}</small> : null}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MonInfoBody({ gameKey, mon, formKey, onFormChange }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    resolveMonInfoData({ gameKey, mon, formKey }).then((next) => {
      if (!cancelled) {
        setData(next);
        setLoading(false);
      }
    }).catch(() => {
      if (!cancelled) {
        setData(null);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [gameKey, mon?.id, mon?.natiId, formKey]);

  const flavor = data?.resolvedInfo?.flavor || '';
  const displayName = data?.resolvedInfo?.displayName || mon?.name || `#${pad4(data?.natId || mon?.id || 0)}`;
  const infoNotice = data && !data.hasLocalInfo;

  if (loading) return <div className="moninfo-body">Loading…</div>;
  if (!data) return <div className="moninfo-body"><div className="mon-info-empty">Unable to load Mon Info.</div></div>;

  return (
    <div className="moninfo-body react-moninfo-body">
      <div className="mon-info-header">
        {data.spriteSrc ? <div className="mon-info-sprite"><img src={data.spriteSrc} alt={displayName} loading="lazy" /></div> : null}
        <div className="mon-info-main">
          <div className="mon-info-topline">
            <div className="mon-info-basic">
              <div className="mon-info-name">#{pad4(data.natId || mon?.id || 0)} — {displayName}</div>
              <div className="mon-info-types">{(data.types || []).map((type) => <TypePill key={type} type={type} />)}</div>
              {data.formOptions?.length ? (
                <div className="mon-info-form">
                  <select className="mon-info-form-select" value={formKey || ''} onChange={(event) => onFormChange?.(event.target.value || null)}>
                    <option value=""></option>
                    {data.formOptions.map((option) => <option key={option.key} value={option.key}>{option.label}</option>)}
                  </select>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {flavor ? <div className="mon-info-block mon-info-flavor">{flavor}</div> : null}

      <div className="mon-info-layout">
        <aside className="mon-info-col mon-info-col--summary">
          <TypeDefenseCard rows={data.typeDefenses} />
          <StatsRadar stats={data.baseStats} />
        </aside>

        <section className="mon-info-col mon-info-col--details">
          <ProfileCard profile={data.profile} />
          <EvolutionCard paths={data.evolutionPaths} />
          <LocationsCard locations={data.locations} />
          <MovesCard moves={data.moves} />
        </section>
      </div>

      {infoNotice ? (
        <div className="mon-info-empty">
          No local <code>monInfo</code> entry is configured yet for this Pokémon in <strong>{gameKey}</strong>. Showing PokéAPI fallback data when available.
        </div>
      ) : null}
    </div>
  );
}
