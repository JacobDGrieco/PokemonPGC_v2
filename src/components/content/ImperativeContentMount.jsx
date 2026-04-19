import React, { useEffect, useRef } from 'react';
import { elements } from '../../ui/dom.js';

export function ImperativeContentMount({ render, renderKey, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof render !== 'function') return;
    el.innerHTML = '';
    render({ ...elements, elContent: el });
    return () => {
      if (ref.current) ref.current.innerHTML = '';
    };
  }, [render, renderKey]);

  return <div ref={ref} className={className} />;
}
