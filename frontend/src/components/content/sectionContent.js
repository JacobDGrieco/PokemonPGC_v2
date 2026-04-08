import { store } from '../../store.js';
import {
  dexSummaryCardFor,
  fashionSummaryCardFor,
  medalsSectionCardFor,
  renderCurryCardsFor,
  renderDistributionCardsFor,
  renderSandwichCardsFor,
  renderStickerCardsFor,
} from '../../react-bridge/modalApi.js';

function sectionTags(section) {
  return Array.isArray(section?.tags) ? section.tags : [];
}

function sectionTitleLower(section) {
  return String(section?.title || '').trim().toLowerCase();
}

function matchesSection(section, keyword, extraTitles = []) {
  const titleLower = sectionTitleLower(section);
  const tags = sectionTags(section);
  const needle = String(keyword || '').toLowerCase();
  if (!needle) return false;

  return (
    section?.id === needle ||
    tags.includes(needle) ||
    titleLower.includes(needle) ||
    extraTitles.some((value) => titleLower.includes(String(value).toLowerCase()))
  );
}

function collectDistributionRegions(distributions) {
  const regionMap = new Map();

  const addRegionValue = (raw) => {
    if (!raw) return;
    if (Array.isArray(raw)) {
      raw.forEach(addRegionValue);
      return;
    }

    String(raw)
      .split(/[,&/]/)
      .map((token) => token.trim())
      .filter(Boolean)
      .forEach((token) => {
        const key = token.toLowerCase();
        if (!regionMap.has(key)) regionMap.set(key, token);
      });
  };

  distributions.forEach((dist) => addRegionValue(dist.region || dist.regions));
  return Array.from(regionMap.entries()).sort(([a], [b]) => a.localeCompare(b));
}

function buildDistributionNode(state) {
  const allDists = (window.DATA?.distributions?.[state.gameKey] || []).filter(Boolean);
  const sortedRegions = collectDistributionRegions(allDists);

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
    const grid = renderDistributionCardsFor(state.gameKey, state.genKey, store, {
      region: regionKey || 'all',
    });
    if (grid) gridHolder.appendChild(grid);
  };

  select.addEventListener('change', () => renderGrid(select.value));
  renderGrid('all');

  sectionNode.appendChild(filterRow);
  sectionNode.appendChild(gridHolder);
  return sectionNode;
}

export function buildInjectedNodes(section, state) {
  const nodes = [];

  if (matchesSection(section, 'fashion')) {
    const categories = window.DATA?.fashion?.[state.gameKey]?.categories || [];
    categories.forEach((category) => {
      nodes.push(fashionSummaryCardFor(state.gameKey, state.genKey, category.id, store));
    });
  }

  if (matchesSection(section, 'curry')) {
    const curryGrid = renderCurryCardsFor(state.gameKey, state.genKey, store);
    if (curryGrid) nodes.push(curryGrid);
  }

  if (matchesSection(section, 'sandwich')) {
    const sandwichGrid = renderSandwichCardsFor(state.gameKey, state.genKey, store);
    if (sandwichGrid) nodes.push(sandwichGrid);
  }

  if (matchesSection(section, 'sticker', ['ball sticker', 'ball stickers'])) {
    const stickerGrid = renderStickerCardsFor(state.gameKey, state.genKey, store);
    if (stickerGrid) nodes.push(stickerGrid);
  }

  if (matchesSection(section, 'medals', ['medal'])) {
    const medalSections = window.DATA?.medals?.[state.gameKey]?.sections || [];
    for (const medalSection of medalSections) {
      nodes.push(medalsSectionCardFor(state.gameKey, state.genKey, medalSection.id, store));
    }
  }

  if (sectionTitleLower(section) === "gotta catch 'em all") {
    nodes.push(dexSummaryCardFor(state.gameKey, state.genKey, store));
  }

  if (sectionTitleLower(section) === 'distributions') {
    nodes.push(buildDistributionNode(state));
  }

  return nodes;
}
