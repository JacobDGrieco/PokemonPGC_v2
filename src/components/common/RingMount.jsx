import React, { useEffect, useRef } from "react";
import { ring } from "../../ui/rings.js";

export function RingMount({
	pct,
	label,
	img,
	accent,
	className = "",
	onClick,
}) {
	const ref = useRef(null);

	useEffect(() => {
		const host = ref.current;
		if (!host) return;

		host.innerHTML = "";
		const node = ring(pct, label, { img });
		if (accent) node.style.setProperty("--accent", accent);
		if (className) node.className += ` ${className}`;
		if (typeof onClick === "function") {
			node.style.cursor = "pointer";
			node.setAttribute("role", "button");
			node.setAttribute("tabindex", "0");
			node.setAttribute("aria-label", `Open ${label}`);
			node.addEventListener("click", onClick);
			const handleKeyDown = (event) => {
				if (event.key !== "Enter" && event.key !== " ") return;
				event.preventDefault();
				onClick(event);
			};
			node.addEventListener("keydown", handleKeyDown);
			host._ringKeyDownHandler = handleKeyDown;
		}

		host.appendChild(node);
		return () => {
			if (typeof onClick === "function")
				node.removeEventListener("click", onClick);
			if (host._ringKeyDownHandler)
				node.removeEventListener("keydown", host._ringKeyDownHandler);
			host.innerHTML = "";
		};
	}, [pct, label, img, accent, className, onClick]);

	return <div ref={ref} />;
}
