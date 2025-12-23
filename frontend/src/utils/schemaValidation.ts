import { defaultGameState } from "../context/defaults";
import { type GameState, gameStateSchema } from "../context/types";

/**
 * Schema validation utilities for handling data format changes during playtesting.
 * Uses Zod's .catch() to preserve valid data and only replace invalid nested fields with defaults.
 */

type ValidationWarning = {
	field: string;
	expected: string;
	received: string;
};

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
): unknown {
	if (state === null || state === undefined) {
		return state;
	}

	// Check if this array should be converted to a record
	// (cinders, questions, advancements, candles are the affected fields)
	if (Array.isArray(state)) {
		if (
			parentKey &&
			["cinders", "questions", "advancements", "candles"].includes(parentKey)
		) {
			return arrayToRecord(state);
		}
		// Otherwise, recurse into array elements (e.g., players array)
		return state.map((item) => fixFirebaseArrays(item, null));
	}

	if (typeof state === "object") {
		const obj = state as Record<string, unknown>;
		const fixed: Record<string, unknown> = {};

		for (const key of Object.keys(obj)) {
			fixed[key] = fixFirebaseArrays(obj[key], key);
		}

		return fixed;
	}

	return state;
}

export function validateGameState(state: unknown): {
	state: GameState;
	warnings: ValidationWarning[];
} {
	const warnings: ValidationWarning[] = [];

	if (!state || typeof state !== "object") {
		warnings.push({
			field: "state",
			expected: "object",
			received: typeof state,
		});
		return { state: defaultGameState, warnings };
	}

	// Fix Firebase's array conversion for numeric-keyed records
	const fixedState = fixFirebaseArrays(state);

	// First, try strict validation to collect warnings
	const strictResult = gameStateSchema.safeParse(fixedState);

	if (strictResult.success) {
		return { state: strictResult.data, warnings };
	}

	// Collect warnings from the strict validation errors
	for (const issue of strictResult.error.issues) {
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

	// Use resilient schema to parse and preserve valid data
	const safeResult = gameStateSchema.safeParse(fixedState);
	return { state: safeResult.data ?? defaultGameState, warnings };
}
