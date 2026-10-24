/** Shared semantic close control; callers retain legacy IDs and classes. */
export function ModalCloseButton({
	id,
	className = "modal-close",
	label = "Close dialog",
}) {
	return (
		<button id={id} className={className} type="button" aria-label={label}>
			<span aria-hidden="true">×</span>
		</button>
	);
}
