import React from "react";
import { ModalShell } from "./ModalShell.jsx";
import { ModalCloseButton } from "./ModalCloseButton.jsx";

export function ModelViewerModal() {
	return (
		<ModalShell id="modelViewerModal" className="modal">
			<div className="modal-dialog" style={{ overflowY: "hidden" }}>
				<header className="modal-hd">
					<h2 id="modelViewerTitle">Model Viewer</h2>
					<ModalCloseButton
						id="modelViewerClose"
						label="Close model viewer"
					/>
				</header>
				<div className="modal-bd">
					<div id="modelViewerBody" />
				</div>
			</div>
		</ModalShell>
	);
}
