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

