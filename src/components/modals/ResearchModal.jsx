import React from "react";
import { ModalShell } from "./ModalShell.jsx";
import { ModalCloseButton } from "./ModalCloseButton.jsx";

export function ResearchModal() {
	return (
		<ModalShell id="researchModal" className="modal" hidden>
			<div className="modal-dialog">
				<header className="modal-hd">
					<h2 id="researchTitle">Research Tasks</h2>
					<ModalCloseButton
						id="researchModalClose"
						label="Close research tasks"
					/>
				</header>
				<div className="modal-bd">
					<div id="researchGrid" className="research-grid" />
				</div>
			</div>
		</ModalShell>
	);
}
