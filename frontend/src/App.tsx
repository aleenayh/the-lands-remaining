import "./App.css";
import { useState } from "react";
import { Game } from "./components/Game";
import { LandingPage } from "./components/landingPage/LandingPage";
import { GameProvider } from "./context/GameContext";
import type { PlayerRole, UserInfo } from "./context/types";
import { nameToPlayerId } from "./lib/firebase";

function App() {
	const searchParams = new URLSearchParams(window.location.search);
	const initialGameHash = searchParams.get("gameHash");
	const [gameHash, setGameHash] = useState<string | null>(initialGameHash);

	const savedTheme = localStorage.getItem("theme") || "forest";
	document.documentElement.setAttribute("data-theme", savedTheme);

	// Get saved user info if returning to a game via URL
	const savedName = localStorage.getItem("playerName") || "";
	const savedRole = localStorage.getItem("playerRole") as PlayerRole | null;
	const [userInfo, setUserInfo] = useState<UserInfo | null>(
		initialGameHash && savedName && savedRole
			? { id: nameToPlayerId(savedName), name: savedName, role: savedRole }
			: null,
	);

	if (!gameHash || !userInfo) {
		return <LandingPage setGameHash={setGameHash} setUserInfo={setUserInfo} />;
	}

	return (
		<div className="App">
			<GameProvider gameHash={gameHash} userInfo={userInfo}>
				<Game />
			</GameProvider>
		</div>
	);
}

export default App;
