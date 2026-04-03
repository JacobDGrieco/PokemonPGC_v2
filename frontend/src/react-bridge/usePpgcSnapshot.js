import { useEffect, useState } from 'react';
import { getPpgcUiSnapshot, subscribeToPpgcUiSync } from './storeBridge.js';

export function usePpgcSnapshot() {
  const [snapshot, setSnapshot] = useState(() => getPpgcUiSnapshot());

  useEffect(() => {
    setSnapshot(getPpgcUiSnapshot());
    return subscribeToPpgcUiSync(setSnapshot);
  }, []);

  return snapshot;
}
