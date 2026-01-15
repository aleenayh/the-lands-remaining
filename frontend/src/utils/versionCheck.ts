/**
 * Version checking utilities for schema version protection
 */

/**
 * Get the local schema version from environment variable
 * Falls back to empty string if not set
 */
export function getLocalSchemaVersion(): string {
	return process.env.REACT_APP_SCHEMA_VERSION || "";
}

/**
 * Compare two semantic versions
 * Returns true if versions match exactly, false otherwise
 * Any mismatch (even patch level) triggers protection
 */
export function compareVersions(local: string, remote: string): boolean {
	if (!local || !remote) {
		// If either version is missing, consider it a mismatch for safety
		return false;
	}
	return local === remote;
}

/**
 * Check if versions match
 * Returns object with match status and version details
 */
export function checkVersionMatch(
	localVersion: string,
	remoteVersion: string,
): {
	match: boolean;
	localVersion: string;
	remoteVersion: string;
} {
	const match = compareVersions(localVersion, remoteVersion);
	return {
		match,
		localVersion,
		remoteVersion,
	};
}

/**
 * Determine if we should block updates due to version mismatch
 * Returns true if local version is older than remote (should block/show modal)
 * Returns false if local version is newer or equal (allow overwrite)
 * Returns true (default to blocking) if versions cannot be parsed
 *
 * @param local - Local schema version (e.g., "0.1.1")
 * @param remote - Remote schema version (e.g., "0.1.0")
 * @returns true if should block, false if should allow
 */
export function shouldBlockVersionMismatch(
	local: string,
	remote: string,
): boolean {
	// Default to blocking if either version is empty or missing
	if (!local || !remote) {
		return true;
	}

	// Parse semantic versions by splitting on dots
	const localParts = local.split(".").map((part) => {
		const num = Number.parseInt(part, 10);
		return Number.isNaN(num) ? -1 : num;
	});

	const remoteParts = remote.split(".").map((part) => {
		const num = Number.parseInt(part, 10);
		return Number.isNaN(num) ? -1 : num;
	});

	// If parsing failed (contains non-numeric parts), default to blocking
	if (
		localParts.some((part) => part === -1) ||
		remoteParts.some((part) => part === -1)
	) {
		return true;
	}

	// If versions have different segment counts, default to blocking
	if (localParts.length !== remoteParts.length) {
		return true;
	}

	// Compare versions segment by segment
	for (let i = 0; i < localParts.length; i++) {
		if (localParts[i] < remoteParts[i]) {
			// Local is older, should block
			return true;
		}
		if (localParts[i] > remoteParts[i]) {
			// Local is newer, allow overwrite
			return false;
		}
	}

	// Versions are equal, allow (no blocking needed)
	return false;
}
