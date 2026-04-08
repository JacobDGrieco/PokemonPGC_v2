import React, { useEffect, useMemo, useRef, useState } from 'react';
import { store } from '../../store.js';
import { elements } from '../../ui/dom.js';
import { ensureSections } from '../../react-bridge/taskApi.js';
import { bootstrapTasksForGame, computeSectionPct } from '../../react-bridge/contentApi.js';
import { navigateToState } from '../../react-bridge/navigation.js';
import { getVisibleSections, isTemporarilyHiddenSection } from '../../utils/sectionVisibility.js';
import { buildInjectedNodes } from './sectionContent.js';
import { TaskTree } from '../tasks/TaskTree.jsx';
import { DexOpenButton } from '../common/DexOpenButton.jsx';

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

export function SectionPage({ state, refreshKey }) {
  const [sectionVersion, setSectionVersion] = useState(0);
  const section = useMemo(
    () => getVisibleSections(state.gameKey, ensureSections).find((entry) => entry.id === state.sectionId) || null,
    [state.gameKey, state.sectionId]
  );
  const fallbackSectionId = useMemo(
    () => getVisibleSections(state.gameKey, ensureSections)[0]?.id || null,
    [state.gameKey]
  );

  useEffect(() => {
    if (!section) {
      const selectedSection = (ensureSections(state.gameKey) || []).find((entry) => entry.id === state.sectionId) || null;
      if (selectedSection && isTemporarilyHiddenSection(selectedSection) && fallbackSectionId) {
        navigateToState({ level: 'section', genKey: state.genKey, gameKey: state.gameKey, sectionId: fallbackSectionId });
        return;
      }
      navigateToState({ level: 'game', genKey: state.genKey, gameKey: null, sectionId: null });
      return;
    }

    ensureSectionModalApis().catch((error) => {
      console.debug('[section-page] failed to initialize modal APIs:', error);
    });

    bootstrapTasksForGame(state.gameKey, store);
    setSectionVersion((v) => v + 1);
  }, [fallbackSectionId, section, state.gameKey, state.genKey, state.sectionId]);

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
          <DexOpenButton
            gameKey={state.gameKey}
            genKey={state.genKey}
            onOpen={() => window.PPGC?.dexApi?.openDexModal?.(state.gameKey, state.genKey)}
          />
        </div>
      </div>
      <div className="card-bd react-section-body">
        <div ref={injectedRef} className="react-section-injected" />
        <TaskTree sectionId={section.id} refreshKey={`${refreshKey}:${sectionVersion}`} onMutate={() => setSectionVersion((value) => value + 1)} />
      </div>
    </section>
  );
}
