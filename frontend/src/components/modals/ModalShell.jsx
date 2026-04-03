import React from 'react';

export function ModalShell({ id, className = 'modal', hidden = false, children, ...props }) {
  return (
    <div id={id} className={className} aria-hidden={hidden ? 'true' : undefined} hidden={hidden || undefined} {...props}>
      {children}
    </div>
  );
}
