import React from "react";
import { ModalShell } from "./ModalShell.jsx";
import { ModalCloseButton } from "./ModalCloseButton.jsx";

export function FormsModal() {
	return (
		<ModalShell id="formsModal" className="modal" hidden>
			<div className="modal-dialog">
				<div className="modal-hd">
					<h3 id="formsModalTitle">Select Forms</h3>
					<ModalCloseButton
						id="formsModalClose"
						label="Close forms dialog"
					/>
				</div>
				<div className="modal-bd">
					<div id="formsWheel" className="forms-wheel" />
				</div>
			</div>
		</ModalShell>
	);
}
