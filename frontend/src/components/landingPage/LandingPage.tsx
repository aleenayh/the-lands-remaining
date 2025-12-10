import { useState } from "react";
import {
	checkGameExists,
	createNewGame,
	generateGameHash,
	nameToPlayerId,
} from "../../lib/firebase";

type LandingStep =
	| "name"
	| "choose"
	| "join-from-query"
	| "join-enter-hash"
	| "join-confirm-name"
	| "creating"
	| "joining";

export function LandingPage({
	setGameHash,
	userName,
	userId,
	setUserName,
	setUserId,
}: {
	setGameHash: (hash: string) => void;
	userName: string | null;
	userId: string | null;
	setUserName: (name: string) => void;
	setUserId: (id: string) => void;
}) {
	const firstStep = userName && userId ? "choose" : "name";
	const [step, setStep] = useState<LandingStep>(firstStep);
	const [playerName, setPlayerName] = useState(
		localStorage.getItem("playerName") || "",
	);
	//pull query param if available
	const searchParams = new URLSearchParams(window.location.search);
	const hash = searchParams.get("gameHash");
	const [gameHashInput, setGameHashInput] = useState(hash || "");
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	// For the name confirmation flow
	const [existingPlayers, setExistingPlayers] = useState<
		{ id: string; name: string }[]
	>([]);
	const [pendingGameHash, setPendingGameHash] = useState<string | null>(null);

	const playerId = nameToPlayerId(playerName);

	const handleNameSubmit = () => {
		if (!playerName.trim()) {
			setError("Please enter your name");
			return;
		}
		localStorage.setItem("playerName", playerName.trim());
		setError(null);
		setStep(gameHashInput.trim() ? "join-from-query" : "choose");
	};

	const handleCreateGame = async () => {
		setIsLoading(true);
		setError(null);
		setStep("creating");

		try {
			const newHash = generateGameHash();
			await createNewGame(newHash, { id: playerId, name: playerName });

			// Update URL with the game hash for easy sharing
			const newUrl = `${window.location.origin}${window.location.pathname}?gameHash=${newHash}`;
			window.history.pushState({}, "", newUrl);

			setUserId(playerId);
			setUserName(playerName.trim());
			setGameHash(newHash);
		} catch (err) {
			console.error("Failed to create game:", err);
			setError("Failed to create game. Please try again.");
			setStep("choose");
		} finally {
			setIsLoading(false);
		}
	};

	const handleJoinGame = async () => {
		if (!gameHashInput.trim()) {
			setError("Please enter a game code");
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const result = await checkGameExists(gameHashInput.trim());

			if (!result.exists || !result.gameState) {
				setError("Game not found. Please check the code and try again.");
				setIsLoading(false);
				return;
			}

			const players = result.gameState.players
				? result.gameState.players.map((p) => ({
						id: p.id,
						name: p.name,
					}))
				: [];

			// Check if player is already in the game
			const isPlayerInGame = players.some((p) => p.id === playerId);

			if (isPlayerInGame || players.length === 0) {
				// Player exists or game has no players yet - join directly
				joinGame(gameHashInput.trim());
			} else {
				// Player not in game - show confirmation
				setExistingPlayers(players);
				setPendingGameHash(gameHashInput.trim());
				setStep("join-confirm-name");
			}
		} catch (err) {
			console.error("Failed to check game:", err);
			setError("Failed to connect. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const joinGame = (hash: string) => {
		// Update URL
		const newUrl = `${window.location.origin}${window.location.pathname}?gameHash=${hash}`;
		window.history.pushState({}, "", newUrl);

		setUserId(playerId);
		setUserName(playerName.trim());
		setGameHash(hash);
	};

	const handleConfirmJoinAsNew = () => {
		if (pendingGameHash) {
			joinGame(pendingGameHash);
		}
	};

	const handleJoinAsExisting = (existingPlayer: {
		id: string;
		name: string;
	}) => {
		// Update their name to match the existing player
		setPlayerName(existingPlayer.name);
		localStorage.setItem("playerName", existingPlayer.name);

		if (pendingGameHash) {
			setUserId(existingPlayer.id);
			setUserName(existingPlayer.name);
			const newUrl = `${window.location.origin}${window.location.pathname}?gameHash=${pendingGameHash}`;
			window.history.pushState({}, "", newUrl);
			setGameHash(pendingGameHash);
		}
	};

	return (
		<div className="App flex items-center justify-center p-8">
			<div className="max-w-md w-full flex flex-col gap-6">
				<h1 className="text-3xl font-bold text-center text-theme-text-accent">
					The Lands Remaining
				</h1>

				{error && (
					<div className="bg-red-900/30 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-center">
						{error}
					</div>
				)}

				{step === "name" && (
					<NameStep
						playerName={playerName}
						setPlayerName={setPlayerName}
						onSubmit={handleNameSubmit}
					/>
				)}

				{step === "choose" && (
					<ChooseStep
						playerName={playerName}
						onBack={() => setStep("name")}
						onCreateGame={handleCreateGame}
						onJoinGame={() => setStep("join-enter-hash")}
					/>
				)}

				{step === "join-from-query" && (
					<JoinFromQueryParams
						hash={gameHashInput}
						onJoinGame={handleJoinGame}
						onBack={() => setStep("choose")}
					/>
				)}

				{step === "join-enter-hash" && (
					<JoinHashStep
						gameHashInput={gameHashInput}
						setGameHashInput={setGameHashInput}
						isLoading={isLoading}
						onBack={() => setStep("choose")}
						onSubmit={handleJoinGame}
					/>
				)}

				{step === "join-confirm-name" && (
					<ConfirmNameStep
						playerName={playerName}
						existingPlayers={existingPlayers}
						onBack={() => setStep("join-enter-hash")}
						onJoinAsNew={handleConfirmJoinAsNew}
						onJoinAsExisting={handleJoinAsExisting}
						onEditName={() => setStep("name")}
					/>
				)}

				{step === "creating" && (
					<div className="text-center text-theme-text-secondary">
						<p className="animate-pulse">Creating your game...</p>
					</div>
				)}
			</div>
		</div>
	);
}

function NameStep({
	playerName,
	setPlayerName,
	onSubmit,
}: {
	playerName: string;
	setPlayerName: (name: string) => void;
	onSubmit: () => void;
}) {
	return (
		<div className="flex flex-col gap-4">
			<p className="text-center text-theme-text-secondary">
				What shall we call you?
			</p>
			<input
				type="text"
				placeholder="Enter your name"
				value={playerName}
				onChange={(e) => setPlayerName(e.target.value)}
				onKeyDown={(e) => e.key === "Enter" && onSubmit()}
				className="px-4 py-3 rounded-lg bg-theme-bg-secondary border border-theme-border text-theme-text-primary placeholder:text-theme-text-muted focus:outline-none focus:border-theme-border-accent"
			/>
			<button
				type="button"
				onClick={onSubmit}
				disabled={!playerName.trim()}
				className="px-4 py-3 rounded-lg bg-theme-bg-accent text-theme-text-accent hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
			>
				Continue
			</button>
		</div>
	);
}

function ChooseStep({
	playerName,
	onBack,
	onCreateGame,
	onJoinGame,
}: {
	playerName: string;
	onBack: () => void;
	onCreateGame: () => void;
	onJoinGame: () => void;
}) {
	return (
		<div className="flex flex-col gap-4">
			<p className="text-center text-theme-text-secondary">
				Welcome, <span className="text-theme-text-accent">{playerName}</span>
			</p>
			<p className="text-center text-theme-text-muted text-sm">
				Would you like to start a new game or join an existing one?
			</p>

			<button
				type="button"
				onClick={onCreateGame}
				className="px-4 py-4 rounded-lg bg-theme-bg-accent text-theme-text-accent hover:opacity-90 transition-opacity flex flex-col items-center gap-1"
			>
				<span className="font-bold">Start New Game</span>
				<span className="text-sm opacity-70">
					Create a game and invite others
				</span>
			</button>

			<button
				type="button"
				onClick={onJoinGame}
				className="px-4 py-4 rounded-lg bg-theme-bg-secondary border border-theme-border text-theme-text-primary hover:bg-theme-bg-secondary transition-colors flex flex-col items-center gap-1"
			>
				<span className="font-bold">Join Existing Game</span>
				<span className="text-sm opacity-70">Enter a game code to join</span>
			</button>

			<button
				type="button"
				onClick={onBack}
				className="text-theme-text-muted hover:text-theme-text-secondary text-sm transition-colors"
			>
				← Change name
			</button>
		</div>
	);
}

function JoinFromQueryParams({
	hash,
	onJoinGame,
	onBack,
}: {
	hash: string;
	onJoinGame: () => void;
	onBack: () => void;
}) {
	return (
		<div className="flex flex-col gap-4">
			<p className="text-center text-theme-text-secondary">
				Would you like to join game {hash}?
			</p>
			<button
				type="button"
				onClick={onJoinGame}
				className="px-4 py-3 rounded-lg bg-theme-bg-accent text-theme-text-accent hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
			>
				Join Game
			</button>
			<button
				type="button"
				onClick={onBack}
				className="text-theme-text-muted hover:text-theme-text-secondary text-sm transition-colors"
			>
				← No, go back
			</button>
		</div>
	);
}

function JoinHashStep({
	gameHashInput,
	setGameHashInput,
	isLoading,
	onBack,
	onSubmit,
}: {
	gameHashInput: string;
	setGameHashInput: (hash: string) => void;
	isLoading: boolean;
	onBack: () => void;
	onSubmit: () => void;
}) {
	return (
		<div className="flex flex-col gap-4">
			<p className="text-center text-theme-text-secondary">
				Enter the game code shared by your Keeper
			</p>
			<input
				type="text"
				placeholder="Game code (e.g. abc123)"
				value={gameHashInput}
				onChange={(e) => setGameHashInput(e.target.value)}
				onKeyDown={(e) => e.key === "Enter" && onSubmit()}
				className="px-4 py-3 rounded-lg bg-theme-bg-secondary border border-theme-border text-theme-text-primary placeholder:text-theme-text-muted focus:outline-none focus:border-theme-border-accent font-mono text-center"
			/>
			<button
				type="button"
				onClick={onSubmit}
				disabled={!gameHashInput.trim() || isLoading}
				className="px-4 py-3 rounded-lg bg-theme-bg-accent text-theme-text-accent hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
			>
				{isLoading ? "Checking..." : "Join Game"}
			</button>
			<button
				type="button"
				onClick={onBack}
				className="text-theme-text-muted hover:text-theme-text-secondary text-sm transition-colors"
			>
				← Back
			</button>
		</div>
	);
}

function ConfirmNameStep({
	playerName,
	existingPlayers,
	onBack,
	onJoinAsNew,
	onJoinAsExisting,
	onEditName,
}: {
	playerName: string;
	existingPlayers: { id: string; name: string }[];
	onBack: () => void;
	onJoinAsNew: () => void;
	onJoinAsExisting: (player: { id: string; name: string }) => void;
	onEditName: () => void;
}) {
	return (
		<div className="flex flex-col gap-4">
			<div className="text-center">
				<p className="text-theme-text-secondary mb-2">
					You're joining as{" "}
					<span className="text-theme-text-accent font-bold">{playerName}</span>
				</p>
				<p className="text-theme-text-muted text-sm">
					This name isn't in the game yet. Are you a new player, or did you mean
					one of these?
				</p>
			</div>

			<div className="border border-theme-border rounded-lg p-3 bg-theme-bg-secondary">
				<p className="text-xs text-theme-text-muted mb-2 uppercase tracking-wide">
					Current Players
				</p>
				<div className="flex flex-wrap gap-2">
					{existingPlayers.map((player) => (
						<button
							key={player.id}
							type="button"
							onClick={() => onJoinAsExisting(player)}
							className="px-3 py-2 rounded-lg bg-theme-bg-secondary border border-theme-border hover:border-theme-border-accent text-theme-text-primary text-sm transition-colors"
						>
							Join as <span className="font-bold">{player.name}</span>
						</button>
					))}
				</div>
			</div>

			<button
				type="button"
				onClick={onJoinAsNew}
				className="px-4 py-3 rounded-lg bg-theme-bg-accent text-theme-text-accent hover:opacity-90 transition-opacity"
			>
				Join as new player "{playerName}"
			</button>

			<div className="flex justify-between text-sm">
				<button
					type="button"
					onClick={onBack}
					className="text-theme-text-muted hover:text-theme-text-secondary transition-colors"
				>
					← Different game
				</button>
				<button
					type="button"
					onClick={onEditName}
					className="text-theme-text-muted hover:text-theme-text-secondary transition-colors"
				>
					Edit my name
				</button>
			</div>
		</div>
	);
}
