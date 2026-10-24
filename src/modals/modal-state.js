/**
 * Synchronize the visual and accessibility state of legacy modal roots.
 * Imperative controllers must update all three signals together because React
 * mounts many roots with `hidden` before handing behavior to legacy modules.
 */
export function showModalElement(modalElement) {
	if (!modalElement) return;
	modalElement.hidden = false;
	modalElement.setAttribute("aria-hidden", "false");
	modalElement.classList.add("open");
}

export function hideModalElement(modalElement) {
	if (!modalElement) return;
	modalElement.classList.remove("open");
	modalElement.setAttribute("aria-hidden", "true");
	modalElement.hidden = true;
}
