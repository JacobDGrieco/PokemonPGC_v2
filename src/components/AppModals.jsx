import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { DexModalCompact } from './modals/DexModalCompact.jsx';
import { MonInfoModal } from './modals/MonInfoModal.jsx';
import { ModelViewerModal } from './modals/ModelViewerModal.jsx';
import { ResearchModal } from './modals/ResearchModal.jsx';
import { CollectionModal } from './modals/CollectionModal.jsx';
import { FormsModal } from './modals/FormsModal.jsx';
import { AuthModal } from './modals/AuthModal.jsx';

const MODAL_ROOT_IDS = {
  dex: 'modal',
  monInfo: 'monInfoModal',
  modelViewer: 'modelViewerModal',
  research: 'researchModal',
  collection: 'collectionModal',
  forms: 'formsModal',
  auth: 'ppgc-auth-overlay',
};

const MODAL_COMPONENTS = {
  dex: DexModalCompact,
  monInfo: MonInfoModal,
  modelViewer: ModelViewerModal,
  research: ResearchModal,
  collection: CollectionModal,
  forms: FormsModal,
  auth: AuthModal,
};

export function AppModals() {
  const [mountedKeys, setMountedKeys] = useState([]);
  const pendingResolversRef = useRef(new Map());

  const flushResolvers = useCallback((key) => {
    const rootId = MODAL_ROOT_IDS[key];
    if (!rootId || !document.getElementById(rootId)) return false;

    const resolvers = pendingResolversRef.current.get(key) || [];
    if (!resolvers.length) return true;

    pendingResolversRef.current.delete(key);
    resolvers.forEach((resolve) => resolve());
    return true;
  }, []);

  useEffect(() => {
    for (const key of mountedKeys) {
      if (flushResolvers(key)) continue;
      window.requestAnimationFrame(() => {
        flushResolvers(key);
      });
    }
  }, [flushResolvers, mountedKeys]);

  useLayoutEffect(() => {
    window.PPGC = window.PPGC || {};

    window.PPGC.ensureModalMounted = (key) => {
      if (!MODAL_COMPONENTS[key]) {
        return Promise.reject(new Error(`Unknown modal key: ${key}`));
      }

      if (document.getElementById(MODAL_ROOT_IDS[key])) {
        return Promise.resolve();
      }

      return new Promise((resolve) => {
        const pending = pendingResolversRef.current.get(key) || [];
        pending.push(resolve);
        pendingResolversRef.current.set(key, pending);

        setMountedKeys((prev) => (prev.includes(key) ? prev : [...prev, key]));
      });
    };

    return () => {
      if (window.PPGC?.ensureModalMounted) {
        delete window.PPGC.ensureModalMounted;
      }
    };
  }, []);

  return (
    <>
      {mountedKeys.map((key) => {
        const Component = MODAL_COMPONENTS[key];
        return <Component key={key} />;
      })}
    </>
  );
}
