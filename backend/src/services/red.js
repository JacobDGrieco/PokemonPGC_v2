// backend/src/services/red.js

export const RED_SPEC = {
	validate: [
		// Later we can add a version signature check if needed
	],

	flags: [
		{
			id: "red-story-1",
			offset: 0x284e,     // Hall of Fame Record Count byte
			type: "nonzero-byte",
		},
	],
};
