/**
 * Provides a React-owned modal root whose visibility signals can also be
 * synchronized by legacy imperative callers. `hidden`, `aria-hidden`, and the
 * `open` class must not diverge; use modal-state helpers outside React.
 */
import React from "react";

export function ModalShell({
	id,
	className = "modal",
	hidden = false,
	children,
	...props
}) {
	return (
		<div
			id={id}
			className={className}
			aria-hidden={hidden ? "true" : undefined}
			hidden={hidden || undefined}
			{...props}
		>
			{children}
		</div>
	);
}
