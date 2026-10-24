import React from "react";
import { ModalShell } from "./ModalShell.jsx";
import { ModalCloseButton } from "./ModalCloseButton.jsx";

export function MonInfoModal() {
	return (
		<ModalShell id="monInfoModal" className="modal" hidden>
			<div className="modal-dialog">
				<header className="modal-hd">
					<h2 id="monInfoTitle">Pokémon Info</h2>
					<ModalCloseButton
						id="monInfoClose"
						label="Close Pokémon information"
					/>
				</header>
				<div className="modal-bd">
					<div id="monInfoBody" className="mon-info-body" />
				</div>
			</div>
		</ModalShell>
	);
}
