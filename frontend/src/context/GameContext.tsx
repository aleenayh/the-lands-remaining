import React, {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { useFirebase } from "../hooks/useFirebase";
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

	const [gameState, setGameState] = useState<GameState>(defaultGameState);
	const [firebaseInitialized, setFirebaseInitialized] = useState(false);

	/**
	 * Firebase connection with state sync callback
	 */
	const {
		status,
		gameState: firebaseState,
		updateGameState: firebaseUpdateState,
		initializeGame,
	} = useFirebase({
		gameHash,
		onStateSync: (state: GameState) => {
			const mergedState: GameState = {
				...defaultGameState,
				...state,
			};
			setGameState(mergedState);
			setFirebaseInitialized(true);
		},
	});

	/**
	 * On Firebase connect: Initialize game if it doesn't exist
	 */
	useEffect(() => {
		if (
			status === "connected" &&
			!firebaseInitialized &&
			firebaseState === null
		) {
			initializeGame({ ...defaultGameState, gameHash })
				.then(() => {
					setFirebaseInitialized(true);
				})
				.catch((error) => {
					console.error("Failed to initialize game:", error);
				});
		}
	}, [status, firebaseInitialized, firebaseState, gameHash, initializeGame]);

	/**
	 * Update game state locally AND send to Firebase
	 */
	const updateGameState = (updates: Partial<GameState>) => {
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
			console.error("Failed to sync state to Firebase:", error);
		});
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
			online: true,
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

	return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
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
