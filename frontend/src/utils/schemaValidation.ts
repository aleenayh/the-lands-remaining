import type { $ZodCatchCtx } from "zod/v4/core";
import { defaultGameState } from "../context/defaults";
import { type GameState, gameStateSchema } from "../context/types";
import { atOrAfterVersion, getLocalSchemaVersion } from "./versionCheck";

/**
 * Schema validation utilities for handling data format changes during playtesting.
 * Uses Zod's .catch() to preserve valid data and only replace invalid nested fields with defaults.
 */

export type ValidationWarning = {
	field: string;
	expected: string;
	received: string;
};

/**
 * Module-level collector for warnings from .catch() callbacks.
 * Cleared before each validation run.
 */
let catchWarnings: ValidationWarning[] = [];

/**
 * Creates a .catch() callback that logs warnings when fallback values are used.
 * Use this instead of plain .catch(defaultValue) to track silent fallbacks.
 *
 * @example
 * // Instead of: z.boolean().catch(false)
 * // Use: z.boolean().catch(catchWithWarning("player.online", false))
 */
export function catchWithWarning<T>(field: string, defaultValue: T) {
	return (ctx: $ZodCatchCtx): T => {
		const errorMessages = ctx.error.issues.map((i) => i.message).join(", ");
		catchWarnings.push({
			field,
			expected: errorMessages,
			received: JSON.stringify(ctx.input),
		});
		return defaultValue;
	};
}

/**
 * Clears the catch warnings collector. Call before starting a new validation.
 */
export function clearCatchWarnings(): void {
	catchWarnings = [];
}

/**
 * Returns a copy of the current catch warnings.
 */
export function getCatchWarnings(): ValidationWarning[] {
	return [...catchWarnings];
}

/**
 * Firebase Realtime Database converts objects with sequential numeric keys to arrays.
 * This function converts those arrays back to Record<string, T> objects.
 * e.g., [null, true, false] -> {"1": true, "2": false}
 */
function arrayToRecord<T>(arr: T[]): Record<string, T> {
	const record: Record<string, T> = {};
	for (let i = 0; i < arr.length; i++) {
		if (arr[i] !== null && arr[i] !== undefined) {
			record[String(i)] = arr[i];
		}
	}
	return record;
}

/**
 * Recursively fix Firebase array-to-record issues in game state.
 * Firebase converts objects with numeric keys to arrays, which breaks our Record types.
 */
function fixFirebaseArrays(
	state: unknown,
	parentKey: string | null = null,
	grandparentKey: string | null = null,
): unknown {
	if (state === null || state === undefined) {
		return state;
	}

	// Check if this array should be converted to a record
	// (cinders, questions, advancements, candles, oldFire are the affected fields)
	// Note: mystery.questions is a legitimate array, only character.questions needs conversion
	if (Array.isArray(state)) {
		if (
			parentKey &&
			["cinders", "advancements", "candles", "oldFire"].includes(parentKey)
		) {
			return arrayToRecord(state);
		}
		// character.questions is Record<string, boolean>, but mystery.questions is Question[]
		if (parentKey === "questions" && grandparentKey === "character") {
			return arrayToRecord(state);
		}
		// Otherwise, recurse into array elements (e.g., players array, mysteries array)
		return state.map((item) => fixFirebaseArrays(item, null, null));
	}

	if (typeof state === "object") {
		const obj = state as Record<string, unknown>;
		const fixed: Record<string, unknown> = {};

		for (const key of Object.keys(obj)) {
			fixed[key] = fixFirebaseArrays(obj[key], key, parentKey);
		}

		return fixed;
	}

	return state;
}

export function validateGameState(state: unknown): {
	state: GameState;
	migrated: boolean;
	warnings: ValidationWarning[];
} {
	const warnings: ValidationWarning[] = [];
	let migrated = false;

	if (!state || typeof state !== "object") {
		warnings.push({
			field: "state",
			expected: "object",
			received: typeof state,
		});
		return { state: defaultGameState, migrated, warnings };
	}

	// Fix Firebase's array conversion for numeric-keyed records
	const fixedState = fixFirebaseArrays(state);

	// Clear catch warnings before parsing
	clearCatchWarnings();

	// Parse with the schema - .catch() callbacks will collect warnings
	const result = gameStateSchema.safeParse(fixedState);

	// Collect any warnings from .catch() callbacks
	warnings.push(...getCatchWarnings());

	if (result.success) {
		if (warnings.length > 0) {
			console.warn(
				"[Schema Validation] Data recovered with fallbacks:",
				warnings,
			);
		}

		//migrate relicAspects to relics.aspects - introduced 0.1.2
		if (!atOrAfterVersion(result.data.schemaVersion, "0.1.2")) {
			const newPlayers = [];
			for (const player of result.data.players) {
				if (!player.character) {
					newPlayers.push(player);
					continue;
				}
				//previous schema - one big array with all aspects
				const originalAspectArray = player.character.relicAspects;
				if (!originalAspectArray) {
					newPlayers.push(player);
					continue;
				}

				const relics = [];
				let startIndex = 0;
				//new schema - each relic owns its own aspect array
				for (let i = 0; i < player.character.relics.length; i++) {
					const relic = { ...player.character.relics[i] };
					const numberAspectsInRelic =
						relic.text.match(/<aspect>/g)?.length || 0;
					const newAspects = originalAspectArray.slice(
						startIndex,
						startIndex + numberAspectsInRelic,
					);
					relic.aspects = newAspects;
					relics.push(relic);
					startIndex += numberAspectsInRelic;
				}
				newPlayers.push({
					...player,
					character: {
						...player.character,
						relics,
					},
				});
			}
			result.data.players = newPlayers;
			result.data.schemaVersion = getLocalSchemaVersion();
			migrated = true;
		}

		return { state: result.data, migrated, warnings };
	}

	// If parsing still failed, collect the remaining errors
	for (const issue of result.error.issues) {
		const received =
			"received" in issue
				? JSON.stringify(issue.received).slice(0, 100)
				: "unknown";
		warnings.push({
			field: issue.path.join("."),
			expected: issue.message,
			received,
		});
	}

	console.error("[Schema Validation] Failed to parse game state:", warnings);
	return { state: defaultGameState, migrated, warnings };
}
