export default async function handler(req, res) {
	const raw = process.env.DB_DATABASE_URL ?? null;

	return res.status(200).json({
		hasDatabaseUrl: !!raw,
		startsWithPostgres:
			typeof raw === "string" &&
			(raw.startsWith("postgresql://") || raw.startsWith("postgres://")),
		length: typeof raw === "string" ? raw.length : 0,
		prefix:
			typeof raw === "string"
				? raw.slice(0, 20)
				: null,
	});
}