/**
 * Owner-only complimentary tier grant administration.
 *
 * This intentionally has no HTTP counterpart. Database credentials, exact
 * account confirmation, and an explicit --execute flag form the mutation
 * boundary; every change records who performed it and why.
 */
import "dotenv/config";
import {
	getActiveTierGrant,
	getAutomaticTierIconUpdate,
	getEffectiveAccountTier,
	normalizeTierKey,
} from "../api/_lib/subscription.js";
import { validateEmail } from "../api/_lib/validation.js";

const MUTATING_ACTIONS = new Set(["grant", "revoke"]);
const SUPPORTED_ACTIONS = new Set([...MUTATING_ACTIONS, "history"]);
const VALUE_FLAGS = new Set([
	"actor",
	"confirm",
	"email",
	"expires",
	"reason",
	"tier",
]);
const BOOLEAN_FLAGS = new Set(["allow-existing-billing", "execute", "help"]);

function usage() {
	return `Owner-only complimentary tier access

Dry-run a permanent Master grant:
  npm run admin:tier-access -- grant --email person@example.com --tier master --reason "Giveaway winner" --actor owner

Execute after reviewing the dry run:
  npm run admin:tier-access -- grant --email person@example.com --tier master --reason "Giveaway winner" --actor owner --confirm person@example.com --execute

Revoke access:
  npm run admin:tier-access -- revoke --email person@example.com --reason "Giveaway ended" --actor owner --confirm person@example.com --execute

Review grant history:
  npm run admin:tier-access -- history --email person@example.com

Options:
  --expires <ISO date>          Optional future expiration for a grant
  --allow-existing-billing     Permit a grant while Stripe/PayPal is attached
  --execute                    Apply the mutation; otherwise grant/revoke is dry-run
  --confirm <exact email>      Required with --execute`;
}

function parseArguments(argv) {
	if (argv[0] === "--help") return { action: null, options: { help: true } };
	const [action, ...tokens] = argv;
	const options = {};

	for (let index = 0; index < tokens.length; index += 1) {
		const token = tokens[index];
		if (!token.startsWith("--")) {
			throw new Error(`Unexpected argument: ${token}`);
		}

		const name = token.slice(2);
		if (Object.hasOwn(options, name)) {
			throw new Error(`Duplicate option: --${name}`);
		}
		if (BOOLEAN_FLAGS.has(name)) {
			options[name] = true;
			continue;
		}
		if (!VALUE_FLAGS.has(name)) {
			throw new Error(`Unknown option: --${name}`);
		}

		const value = tokens[index + 1];
		if (!value || value.startsWith("--")) {
			throw new Error(`Missing value for --${name}.`);
		}
		options[name] = value;
		index += 1;
	}

	return { action, options };
}

function requireBoundedText(value, label, minimum, maximum) {
	const normalized = String(value || "").trim();
	if (normalized.length < minimum || normalized.length > maximum) {
		throw new Error(
			`${label} must be between ${minimum} and ${maximum} characters.`,
		);
	}
	return normalized;
}

function parseExpiration(value, now = new Date()) {
	if (!value) return null;
	const expiresAt = new Date(value);
	if (!Number.isFinite(expiresAt.getTime()) || expiresAt <= now) {
		throw new Error("--expires must be a valid future ISO date.");
	}
	return expiresAt;
}

function getValidatedInput(action, options) {
	if (!SUPPORTED_ACTIONS.has(action)) throw new Error("Unknown action.");
	const emailResult = validateEmail(options.email);
	if (!emailResult.ok) throw new Error(emailResult.error);

	if (action === "history") {
		const unsupportedHistoryOptions = Object.keys(options).filter(
			(name) => name !== "email",
		);
		if (unsupportedHistoryOptions.length) {
			throw new Error(
				`history does not accept --${unsupportedHistoryOptions[0]}.`,
			);
		}
		return { action, email: emailResult.email };
	}
	if (
		action === "revoke" &&
		(options.tier || options.expires || options["allow-existing-billing"])
	) {
		throw new Error(
			"revoke does not accept --tier, --expires, or --allow-existing-billing.",
		);
	}

	const actor = requireBoundedText(options.actor, "--actor", 2, 120);
	const reason = requireBoundedText(options.reason, "--reason", 3, 500);
	const tier = action === "grant" ? normalizeTierKey(options.tier) : null;
	if (action === "grant" && !tier) {
		throw new Error("--tier must be great, ultra, or master.");
	}
	if (options.execute && options.confirm !== emailResult.email) {
		throw new Error(
			"--confirm must exactly match the normalized target email.",
		);
	}

	return {
		action,
		actor,
		allowExistingBilling: !!options["allow-existing-billing"],
		email: emailResult.email,
		execute: !!options.execute,
		expiresAt: action === "grant" ? parseExpiration(options.expires) : null,
		reason,
		tier,
	};
}

function printGrantSummary(input, user, currentTier, nextTier) {
	console.log(`${input.execute ? "Executing" : "Dry run"}: ${input.action}`);
	console.log(`Account: ${user.email}`);
	console.log(`Current effective tier: ${currentTier}`);
	console.log(`Next effective tier: ${nextTier}`);
	if (input.tier) console.log(`Grant tier: ${input.tier}`);
	if (input.expiresAt)
		console.log(`Expires: ${input.expiresAt.toISOString()}`);
	console.log(`Actor: ${input.actor}`);
	console.log(`Reason: ${input.reason}`);
}

async function loadTargetUser(prisma, email, includeHistory = false) {
	return prisma.user.findUnique({
		where: { email },
		select: {
			id: true,
			email: true,
			emailVerifiedAt: true,
			icon: true,
			tier: true,
			stripeSubscriptionId: true,
			paypalSubscriptionId: true,
			tierGrants: {
				where: includeHistory ? undefined : { revokedAt: null },
				orderBy: { grantedAt: "desc" },
				...(includeHistory ? { take: 50 } : {}),
			},
		},
	});
}

async function showHistory(prisma, input) {
	const user = await loadTargetUser(prisma, input.email, true);
	if (!user) throw new Error("No account exists for that exact email.");

	console.log(`Complimentary tier history for ${user.email}:`);
	if (!user.tierGrants.length) {
		console.log("No grants found.");
		return;
	}
	console.table(
		user.tierGrants.map((grant) => ({
			id: grant.id,
			tier: grant.tier,
			grantedAt: grant.grantedAt.toISOString(),
			expiresAt: grant.expiresAt?.toISOString() || "permanent",
			grantedBy: grant.grantedBy,
			reason: grant.reason,
			revokedAt: grant.revokedAt?.toISOString() || "active",
			revokedBy: grant.revokedBy || "-",
			revokeReason: grant.revokeReason || "-",
		})),
	);
}

async function changeGrant(prisma, input) {
	const user = await loadTargetUser(prisma, input.email);
	if (!user) throw new Error("No account exists for that exact email.");
	if (!user.emailVerifiedAt) {
		throw new Error("Complimentary access requires a verified account.");
	}

	const hasExistingBilling = !!(
		user.stripeSubscriptionId || user.paypalSubscriptionId
	);
	if (
		input.action === "grant" &&
		hasExistingBilling &&
		!input.allowExistingBilling
	) {
		throw new Error(
			"This account has existing billing. Cancel it first or rerun with --allow-existing-billing after reviewing the overlap.",
		);
	}

	const currentTier = getEffectiveAccountTier(user);
	const nextTier =
		input.action === "grant"
			? getEffectiveAccountTier({
					...user,
					tierGrants: [
						{ tier: input.tier, expiresAt: input.expiresAt },
					],
				})
			: getEffectiveAccountTier({ ...user, tierGrants: [] });
	printGrantSummary(input, user, currentTier, nextTier);

	if (!input.execute) {
		console.log(
			`No changes made. Add --confirm ${user.email} --execute to apply.`,
		);
		return;
	}

	const now = new Date();
	// Expiring grants do not change the stored icon because there is no background
	// job to restore it at expiration. Permanent grants and explicit revocations
	// can safely keep tier-managed icons synchronized.
	const nextIcon =
		input.action === "grant" && input.expiresAt
			? undefined
			: getAutomaticTierIconUpdate({
					currentIcon: user.icon,
					currentTier,
					nextTier,
				});

	await prisma.$transaction(async (transaction) => {
		await transaction.tierGrant.updateMany({
			where: { userId: user.id, revokedAt: null },
			data: {
				revokedAt: now,
				revokedBy: input.actor,
				revokeReason:
					input.action === "grant"
						? "Superseded by a new complimentary tier grant."
						: input.reason,
			},
		});

		if (input.action === "grant") {
			await transaction.tierGrant.create({
				data: {
					userId: user.id,
					tier: input.tier,
					reason: input.reason,
					grantedBy: input.actor,
					grantedAt: now,
					expiresAt: input.expiresAt,
				},
			});
		}

		if (nextIcon !== undefined) {
			await transaction.user.update({
				where: { id: user.id },
				data: { icon: nextIcon },
			});
		}
	});

	console.log(
		input.action === "grant"
			? "Complimentary access granted. The recipient should refresh or sign in again."
			: "Complimentary access revoked. The recipient should refresh or sign in again.",
	);
}

async function main() {
	const { action, options } = parseArguments(process.argv.slice(2));
	if (options.help || !action) {
		console.log(usage());
		return;
	}

	const input = getValidatedInput(action, options);
	const { prisma } = await import("../api/_lib/db.js");
	try {
		if (input.action === "history") {
			await showHistory(prisma, input);
		} else {
			await changeGrant(prisma, input);
		}
	} finally {
		await prisma.$disconnect();
	}
}

main().catch((error) => {
	console.error(`Admin tier access failed: ${error.message}`);
	process.exitCode = 1;
});
