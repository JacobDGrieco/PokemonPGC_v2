/** Localized Mon Info labels and safe source-language fallbacks. */
const LANGUAGE_LABELS = Object.freeze({
	en: "English",
	"ja-hrkt": "日本語（かな）",
	"ja-roma": "Nihongo (Rōmaji)",
	ja: "日本語",
	ko: "한국어",
	"zh-hant": "繁體中文",
	"zh-hans": "简体中文",
	fr: "Français",
	de: "Deutsch",
	es: "Español",
	it: "Italiano",
	"es-419": "Español (Latinoamérica)",
});

const LANGUAGE_ORDER = Object.keys(LANGUAGE_LABELS);

export function monInfoLanguageLabel(languageCode) {
	return LANGUAGE_LABELS[languageCode] || String(languageCode || "Unknown");
}

export function monInfoLanguageOptions(info = {}) {
	const languages = new Set(["en"]);
	for (const source of [
		info.localizedNames,
		info.localizedFormNames,
		info.localizedFormLabels,
		info.localizedGenera,
		info.localizedFlavor,
	]) {
		for (const languageCode of Object.keys(source || {})) {
			languages.add(languageCode);
		}
	}
	return [...languages]
		.sort((left, right) => {
			const leftIndex = LANGUAGE_ORDER.indexOf(left);
			const rightIndex = LANGUAGE_ORDER.indexOf(right);
			return (
				(leftIndex < 0 ? Number.MAX_SAFE_INTEGER : leftIndex) -
					(rightIndex < 0 ? Number.MAX_SAFE_INTEGER : rightIndex) ||
				left.localeCompare(right)
			);
		})
		.map((languageCode) => ({
			code: languageCode,
			label: monInfoLanguageLabel(languageCode),
		}));
}

/** Infer the language of the stored source entry instead of labelling Japanese Green text as English. */
export function defaultMonInfoLanguage(info = {}) {
	const flavor = String(info.flavor || "").trim();
	if (!flavor) return "en";
	for (const [languageCode, localizedFlavor] of Object.entries(
		info.localizedFlavor || {},
	)) {
		if (String(localizedFlavor || "").trim() === flavor)
			return languageCode;
	}
	return "en";
}

export function resolveLocalizedMonInfo(info = {}, languageCode = "en") {
	const sourceLanguage = defaultMonInfoLanguage(info);
	const localizedFlavor = info.localizedFlavor?.[languageCode] || "";
	const sourceFlavor = info.flavor || "";
	return {
		languageCode,
		sourceLanguage,
		displayName:
			info.localizedNames?.[languageCode] ||
			info.displayName ||
			info.name ||
			"",
		formName:
			info.localizedFormLabels?.[languageCode] ||
			info.localizedFormNames?.[languageCode] ||
			info.formName ||
			"",
		genus: info.localizedGenera?.[languageCode] || info.genus || "",
		flavor: localizedFlavor || sourceFlavor,
		flavorLanguage: localizedFlavor ? languageCode : sourceLanguage,
		hasLocalizedFlavor:
			Boolean(localizedFlavor) || languageCode === sourceLanguage,
	};
}
