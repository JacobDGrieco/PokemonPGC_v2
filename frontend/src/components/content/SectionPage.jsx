import React, { useEffect, useMemo, useRef, useState } from 'react';
import { store } from '../../store.js';
import { elements } from '../../ui/dom.js';
import { ensureSections } from '../../react-bridge/taskApi.js';
import { bootstrapTasksForGame, computeSectionPct } from '../../react-bridge/contentApi.js';
import {
  dexSummaryCardFor,
  fashionSummaryCardFor,
  medalsSectionCardFor,
  renderCurryCardsFor,
  renderDistributionCardsFor,
  renderSandwichCardsFor,
  renderStickerCardsFor,
} from '../../react-bridge/modalApi.js';
import { navigateToState } from '../../react-bridge/navigation.js';
import { TaskTree } from '../tasks/TaskTree.jsx';

function useImperativeChildren(build, deps) {
  const ref = useRef(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return undefined;

    host.innerHTML = '';
    const nodes = build?.() || [];
    const list = Array.isArray(nodes) ? nodes : [nodes];
    for (const node of list) {
      if (node instanceof Node) host.appendChild(node);
    }

    return () => {
      if (host) host.innerHTML = '';
    };
  }, deps);

  return ref;
}

async function ensureSectionModalApis() {
  window.PPGC = window.PPGC || {};

  if (!window.PPGC.dexApi) {
    const { wireDexModal } = await import('../../modals/dex.js');
    window.PPGC.dexApi = wireDexModal(store, elements);
  }

  if (!window.PPGC.fashionApi) {
    const { wireFashionModal } = await import('../../modals/fashion.js');
    window.PPGC.fashionApi = wireFashionModal(store, elements);
  }

  if (!window.PPGC.medalsApi) {
    const { wireMedalsModal } = await import('../../modals/medal.js');
    window.PPGC.medalsApi = wireMedalsModal(store, elements);
  }
}

function buildInjectedNodes(section, state) {
  const titleLower = (section.title || '').trim().toLowerCase();
  const tags = Array.isArray(section.tags) ? section.tags : [];
  const nodes = [];

  const isFashion = section.id === 'fashion' || tags.includes('fashion') || titleLower.includes('fashion');
  if (isFashion) {
    const cats = window.DATA?.fashion?.[state.gameKey]?.categories || [];
    cats.forEach((cat) => nodes.push(fashionSummaryCardFor(state.gameKey, state.genKey, cat.id, store)));
  }

  const isCurry = section.id === 'curry' || tags.includes('curry') || titleLower.includes('curry');
  if (isCurry) {
    const curryGrid = renderCurryCardsFor(state.gameKey, state.genKey, store);
    if (curryGrid) nodes.push(curryGrid);
  }

  const isSandwich = section.id === 'sandwich' || tags.includes('sandwich') || titleLower.includes('sandwich');
  if (isSandwich) {
    const sandwichGrid = renderSandwichCardsFor(state.gameKey, state.genKey, store);
    if (sandwichGrid) nodes.push(sandwichGrid);
  }

  const isSticker = section.id === 'sticker' || tags.includes('sticker') || titleLower.includes('sticker') || titleLower.includes('ball sticker') || titleLower.includes('ball stickers');
  if (isSticker) {
    const stickerGrid = renderStickerCardsFor(state.gameKey, state.genKey, store);
    if (stickerGrid) nodes.push(stickerGrid);
  }

  const isMedals = section.id === 'medals' || tags.includes('medals') || titleLower.includes('medals') || titleLower.includes('medal');
  if (isMedals) {
    const sections = window.DATA?.medals?.[state.gameKey]?.sections || [];
    for (const medalSection of sections) {
      nodes.push(medalsSectionCardFor(state.gameKey, state.genKey, medalSection.id, store));
    }
  }

  const isGottaCatchEmAll = titleLower === "gotta catch 'em all";
  if (isGottaCatchEmAll) {
    nodes.push(dexSummaryCardFor(state.gameKey, state.genKey, store));
  }

  const isDistributions = titleLower === 'distributions';
  if (isDistributions) {
    const allDists = (window.DATA?.distributions?.[state.gameKey] || []).filter(Boolean);
    const regionMap = new Map();
    const addRegionValue = (raw) => {
      if (!raw) return;
      if (Array.isArray(raw)) return raw.forEach(addRegionValue);
      String(raw)
        .split(/[,&/]/)
        .map((token) => token.trim())
        .filter(Boolean)
        .forEach((token) => {
          const key = token.toLowerCase();
          if (!regionMap.has(key)) regionMap.set(key, token);
        });
    };

    allDists.forEach((dist) => addRegionValue(dist.region || dist.regions));

    const sectionNode = document.createElement('div');
    sectionNode.className = 'dist-section';

    const filterRow = document.createElement('div');
    filterRow.className = 'dist-filters-row';

    const label = document.createElement('label');
    label.className = 'dist-filter-label';
    label.textContent = 'Region:';

    const select = document.createElement('select');
    select.className = 'dist-filter-select';
    select.id = 'distRegionSelect';

    const allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.textContent = 'All';
    select.appendChild(allOption);

    const sortedRegions = Array.from(regionMap.entries()).sort(([a], [b]) => a.localeCompare(b));
    for (const [key, labelText] of sortedRegions) {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = labelText;
      select.appendChild(option);
    }

    label.htmlFor = select.id;
    filterRow.appendChild(label);
    filterRow.appendChild(select);

    const gridHolder = document.createElement('div');
    gridHolder.className = 'dist-grid-holder';

    const renderGrid = (regionKey) => {
      gridHolder.innerHTML = '';
      const grid = renderDistributionCardsFor(state.gameKey, state.genKey, store, { region: regionKey || 'all' });
      if (grid) gridHolder.appendChild(grid);
    };

    select.addEventListener('change', () => renderGrid(select.value));
    renderGrid('all');

    sectionNode.appendChild(filterRow);
    sectionNode.appendChild(gridHolder);
    nodes.push(sectionNode);
  }

  return nodes;
}

export function SectionPage({ state, refreshKey }) {
  const [sectionVersion, setSectionVersion] = useState(0);
  const section = useMemo(
    () => ensureSections(state.gameKey).find((entry) => entry.id === state.sectionId) || null,
    [state.gameKey, state.sectionId]
  );

  useEffect(() => {
    if (!section) {
      navigateToState({ level: 'game', genKey: state.genKey, gameKey: null, sectionId: null });
      return;
    }

    ensureSectionModalApis().catch((error) => {
      console.debug('[section-page] failed to initialize modal APIs:', error);
    });

    bootstrapTasksForGame(state.gameKey, store);
    setSectionVersion((v) => v + 1);
  }, [section, state.gameKey, state.genKey]);

  const pct = useMemo(() => {
    if (!section) return 0;
    return computeSectionPct(section, state.gameKey, state.genKey, store);
  }, [section, state.gameKey, state.genKey, refreshKey, sectionVersion]);

  const gameMeta = useMemo(
    () => (window.DATA?.games?.[state.genKey] || []).find((game) => game.key === state.gameKey) || null,
    [state.genKey, state.gameKey]
  );

  const injectedRef = useImperativeChildren(
    () => (section ? buildInjectedNodes(section, state) : []),
    [section, state.gameKey, state.genKey, refreshKey, sectionVersion]
  );

  if (!section) {
    return <div className="react-loading-state">Loading section…</div>;
  }

  return (
    <section className="card react-content-card" style={gameMeta?.color ? { '--accent': gameMeta.color } : undefined}>
      <div className="card-hd section-hd" style={{ '--progress': pct.toFixed(2) }}>
        <h3>{section.title}</h3>
        <div className="pct">{pct.toFixed(2)}%</div>
        <div className="row react-section-actions">
          <button
            className="button"
            type="button"
            onClick={() => window.PPGC?.dexApi?.openDexModal?.(state.gameKey, state.genKey)}
          >
            Open Dex
          </button>
        </div>
      </div>
      <div className="card-bd react-section-body">
        <div ref={injectedRef} className="react-section-injected" />
        <TaskTree sectionId={section.id} refreshKey={`${refreshKey}:${sectionVersion}`} onMutate={() => setSectionVersion((value) => value + 1)} />
      </div>
    </section>
  );
}
