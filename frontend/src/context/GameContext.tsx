import React, {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import toast from "react-hot-toast";
import { VersionMismatchModal } from "../components/shared/VersionMismatchModal";
import { useFirebase, VersionMismatchError } from "../hooks/useFirebase";
import { validateGameState } from "../utils/schemaValidation";
import { getLocalSchemaVersion } from "../utils/versionCheck";
import { defaultGameState } from "./defaults";
import type { GameState, UserInfo } from "./types";

// Context value includes state AND actions
interface GameContextValue {
	user: UserInfo;
	gameHash: string;
	sessionKey: string;
	gameState: GameState;

	// Actions
	updateGameState: (updates: Partial<GameState>) => void;
}

// Create context
const GameContext = createContext<GameContextValue | undefined>(undefined);

// Provider props
interface GameProviderProps {
	children: ReactNode;
	gameHash: string;
	userInfo: UserInfo;
	startingState: GameState | null;
}

/**
 * GameProvider - Manages game state with Firebase Realtime Database
 *
 * Flow:
 * 1. Load game state from localStorage as initial state
 * 2. Connect to Firebase and subscribe to game updates
 * 3. If Firebase has state, use it (Firebase is source of truth)
 * 4. If no Firebase state, initialize with local/default state
 * 5. Keep state synced via Firebase listeners
 */
export const GameProvider: React.FC<GameProviderProps> = ({
	children,
	gameHash,
	userInfo: initialUserInfo,
	startingState,
}) => {
	const [userInfo, setUserInfo] = useState<UserInfo>(initialUserInfo);
	// Session key - unique identifier for this user/browser
	const [sessionKey] = useState<string>(() => {
		const storageKey = `session_${gameHash}`;
		const existing = localStorage.getItem(storageKey);
		if (existing) return existing;

		// Generate new session key
		const newKey = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
		localStorage.setItem(storageKey, newKey);
		return newKey;
	});

	const [gameState, setGameState] = useState<GameState>(
		startingState || defaultGameState,
	);
	const [firebaseInitialized, setFirebaseInitialized] = useState(false);
	const [warningsShown, setWarningsShown] = useState<string[]>([]);
	const [showVersionMismatchModal, setShowVersionMismatchModal] =
		useState(false);
	const localSchemaVersion = getLocalSchemaVersion();
	// Track if we've migrated schemaVersion for this game to avoid multiple writes
	const schemaVersionMigratedRef = React.useRef(false);
	// Store update function in ref so it can be accessed in callbacks
	const firebaseUpdateStateRef = React.useRef<
		((updates: Partial<GameState>) => Promise<void>) | null
	>(null);

	/**
	 * Firebase connection with state sync callback
	 */
	const {
		status,
		gameState: firebaseState,
		updateGameState: firebaseUpdateState,
		initializeGame,
		isPaused,
		firebaseSchemaVersion,
	} = useFirebase({
		gameHash,
		onStateSync: (state: GameState) => {
			const { state: validatedState, warnings } = validateGameState(state);
			if (warnings.length > 0) {
				const newWarnings = warnings.filter(
					(w) => !warningsShown.includes(w.field),
				);
				if (newWarnings.length > 0) {
					toast.error(
						`The expected game state did not match your last synced state. Some default values have been applied. 
				
				${warnings.length} default fields used: ${warnings.map((w) => w.field).join(", ")}`,
						{ id: "schema-warnings" },
					);
					setWarningsShown((prev) => [
						...prev,
						...newWarnings.map((w) => w.field),
					]);
				}
				console.error(
					`Game state schema warnings: ${warnings.map((w) => `${w.field}: Expected ${w.expected} -> Received ${w.received}`).join(", ")}`,
				);
			}

			const mergedState: GameState = {
				...defaultGameState,
				...validatedState,
			};

			setGameState(mergedState);
			setFirebaseInitialized(true);

			// Migrate existing games: set schemaVersion if missing or empty
			// Only do this once per game session to avoid unnecessary writes
			if (
				localSchemaVersion &&
				(!validatedState.schemaVersion ||
					validatedState.schemaVersion === "") &&
				!schemaVersionMigratedRef.current &&
				firebaseUpdateStateRef.current
			) {
				schemaVersionMigratedRef.current = true;
				// Update Firebase with current schema version
				// This happens asynchronously and won't block the UI
				firebaseUpdateStateRef
					.current({ schemaVersion: localSchemaVersion })
					.catch((error) => {
						console.error(
							"Failed to migrate schemaVersion for existing game:",
							error,
						);
						// Reset flag so we can retry on next sync
						schemaVersionMigratedRef.current = false;
					});
			}

			// Check version on sync
			if (validatedState.schemaVersion && localSchemaVersion) {
				if (validatedState.schemaVersion !== localSchemaVersion) {
					setShowVersionMismatchModal(true);
				}
			}
		},
	});

	// Keep the update function ref in sync
	useEffect(() => {
		firebaseUpdateStateRef.current = firebaseUpdateState;
	}, [firebaseUpdateState]);

	/**
	 * Check version mismatch and show modal if needed
	 */
	const checkVersionMismatch = useCallback(() => {
		if (firebaseSchemaVersion && localSchemaVersion) {
			if (firebaseSchemaVersion !== localSchemaVersion) {
				setShowVersionMismatchModal(true);
				return true;
			}
		}
		return false;
	}, [firebaseSchemaVersion, localSchemaVersion]);

	/**
	 * Tab visibility handler - check version on focus
	 */
	useEffect(() => {
		const handleVisibilityChange = () => {
			if (document.visibilityState === "visible" && !isPaused) {
				// Tab became visible, check version
				checkVersionMismatch();
			}
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);

		return () => {
			document.removeEventListener("visibilitychange", handleVisibilityChange);
		};
	}, [checkVersionMismatch, isPaused]);

	/**
	 * On Firebase connect: Initialize game if it doesn't exist
	 */
	useEffect(() => {
		if (
			status === "connected" &&
			!firebaseInitialized &&
			firebaseState === null
		) {
			const initialState: GameState = {
				...gameState,
				gameHash,
				schemaVersion: localSchemaVersion,
			};
			initializeGame(initialState)
				.then(() => {
					setFirebaseInitialized(true);
				})
				.catch((error) => {
					console.error("Failed to initialize game:", error);
				});
		}
	}, [
		status,
		firebaseInitialized,
		firebaseState,
		gameHash,
		initializeGame,
		gameState,
		localSchemaVersion,
	]);

	/**
	 * Update game state locally AND send to Firebase
	 */
	const updateGameState = (updates: Partial<GameState>) => {
		// Check version before allowing updates
		if (checkVersionMismatch()) {
			return;
		}

		try {
			const newState = { ...gameState, ...updates };

			if (updates.players) {
				for (const player of updates.players) {
					if (player.id === userInfo.id && player.role !== userInfo.role) {
						localStorage.setItem("playerRole", player.role);
						setUserInfo({ ...userInfo, role: player.role });
					}
				}
			}

			// Update local state immediately (optimistic update)
			setGameState(newState);

			// Send to Firebase
			firebaseUpdateState(updates).catch((error) => {
				if (error instanceof VersionMismatchError) {
					setShowVersionMismatchModal(true);
				} else {
					console.error("Failed to sync state to Firebase:", error);
				}
			});
		} catch (error) {
			console.error("Error updating game state:", error);
		}
	};

	/**
	 * Add current user to players list after Firebase syncs
	 * This must wait for firebaseInitialized to avoid overwriting existing players
	 */
	useEffect(() => {
		if (!firebaseInitialized) return;

		const userAlreadyExists = gameState.players.some(
			(player) => player.id === userInfo.id,
		);
		if (userAlreadyExists) return;

		const newPlayer = {
			id: userInfo.id,
			name: userInfo.name,
			role: userInfo.role,
			character: null,
			lastRoll: null,
		};

		const updatedPlayers = [...gameState.players, newPlayer];

		// Update local state
		setGameState((prev) => ({ ...prev, players: updatedPlayers }));

		// Send to Firebase
		firebaseUpdateState({ players: updatedPlayers }).catch((error) => {
			console.error("Failed to add player to Firebase:", error);
		});
	}, [firebaseInitialized, gameState.players, userInfo, firebaseUpdateState]);

	// Context value
	const value: GameContextValue = {
		gameHash,
		sessionKey,
		gameState,
		updateGameState,
		user: userInfo,
	};

	if (!firebaseInitialized) {
		return <div>Loading...</div>;
	}

	return (
		<>
			<GameContext.Provider value={value}>{children}</GameContext.Provider>
			<VersionMismatchModal
				isOpen={showVersionMismatchModal}
				localVersion={localSchemaVersion}
				remoteVersion={firebaseSchemaVersion || ""}
			/>
		</>
	);
};

/**
 * Custom hook to access game context
 */
export const useGame = (): GameContextValue => {
	const context = useContext(GameContext);

	if (!context) {
		throw new Error("useGame must be used within a GameProvider");
	}

	return context;
};
