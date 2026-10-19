import nodemailer from "nodemailer";

const DEFAULT_FROM_NAME = "PokemonPGC";
let cachedTransport = null;
let cachedTransportKey = null;

function cleanEnvValue(value) {
	return String(value || "").trim();
}

function requiredEnv(env, name) {
	const value = cleanEnvValue(env[name]);
	if (!value) throw new Error(`Missing ${name} environment variable.`);
	return value;
}

function parseBoolean(value, fallback) {
	const normalized = cleanEnvValue(value).toLowerCase();
	if (!normalized) return fallback;
	if (["true", "1", "yes"].includes(normalized)) return true;
	if (["false", "0", "no"].includes(normalized)) return false;
	throw new Error("SMTP boolean values must be true or false.");
}

function assertSafeHeaderValue(value, name) {
	if (/\r|\n/.test(value)) throw new Error(`${name} contains invalid characters.`);
}

export function getSmtpConfig(env = process.env) {
	const host = requiredEnv(env, "SMTP_HOST");
	const port = Number.parseInt(requiredEnv(env, "SMTP_PORT"), 10);
	const user = requiredEnv(env, "SMTP_USER");
	const pass = requiredEnv(env, "SMTP_PASS");
	const fromEmail = cleanEnvValue(env.SMTP_FROM_EMAIL) || user;
	const fromName = cleanEnvValue(env.SMTP_FROM_NAME) || DEFAULT_FROM_NAME;

	if (!Number.isInteger(port) || port < 1 || port > 65535) {
		throw new Error("SMTP_PORT must be an integer between 1 and 65535.");
	}
	assertSafeHeaderValue(fromEmail, "SMTP_FROM_EMAIL");
	assertSafeHeaderValue(fromName, "SMTP_FROM_NAME");
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fromEmail)) {
		throw new Error("SMTP_FROM_EMAIL must be a valid email address.");
	}

	const secure = parseBoolean(env.SMTP_SECURE, port === 465);
	const requireTls = secure
		? false
		: parseBoolean(env.SMTP_REQUIRE_TLS, env.NODE_ENV === "production");

	return { host, port, secure, requireTls, user, pass, fromEmail, fromName };
}

export function escapeEmailHtml(value) {
	return String(value || "")
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

export function renderAuthEmail(kind, actionUrl) {
	const escapedUrl = escapeEmailHtml(actionUrl);
	if (kind === "verify") {
		return {
			subject: "Verify your PokemonPGC email",
			text: `Verify your PokemonPGC email by opening this link:\n\n${actionUrl}\n\nThis link expires in 24 hours. If you did not create this account, you can ignore this email.`,
			html: `<p>Verify your PokemonPGC email to activate your account.</p><p><a href="${escapedUrl}">Verify email</a></p><p>This link expires in 24 hours. If you did not create this account, you can ignore this email.</p>`,
		};
	}
	if (kind === "reset") {
		return {
			subject: "Reset your PokemonPGC password",
			text: `Reset your PokemonPGC password by opening this link:\n\n${actionUrl}\n\nThis link expires in 1 hour. If you did not request a reset, you can ignore this email.`,
			html: `<p>We received a request to reset your PokemonPGC password.</p><p><a href="${escapedUrl}">Reset password</a></p><p>This link expires in 1 hour. If you did not request a reset, you can ignore this email.</p>`,
		};
	}
	throw new Error("Unknown authentication email type.");
}

function getTransport(config) {
	const transportKey = JSON.stringify([
		config.host,
		config.port,
		config.secure,
		config.requireTls,
		config.user,
		config.pass,
	]);
	if (cachedTransport && cachedTransportKey === transportKey) return cachedTransport;

	cachedTransport = nodemailer.createTransport({
		host: config.host,
		port: config.port,
		secure: config.secure,
		requireTLS: config.requireTls,
		auth: { user: config.user, pass: config.pass },
		connectionTimeout: 10_000,
		greetingTimeout: 10_000,
		socketTimeout: 20_000,
		disableFileAccess: true,
		disableUrlAccess: true,
		tls: { minVersion: "TLSv1.2" },
	});
	cachedTransportKey = transportKey;
	return cachedTransport;
}

/** Sends a security email without logging recipient addresses, tokens, or URLs. */
export async function sendAuthEmail({ to, kind, actionUrl }) {
	const recipient = cleanEnvValue(to);
	assertSafeHeaderValue(recipient, "Recipient email");
	if (!recipient) throw new Error("Recipient email is required.");

	const config = getSmtpConfig();
	const message = renderAuthEmail(kind, actionUrl);
	return getTransport(config).sendMail({
		from: { name: config.fromName, address: config.fromEmail },
		to: recipient,
		subject: message.subject,
		text: message.text,
		html: message.html,
	});
}
