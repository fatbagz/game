import { useEffect, useRef, useState } from 'react';
import { GameEngine } from '../game/GameEngine';
import { loadGameAssets } from '../game/assetLoader';
import { GameAssets, GameState } from '../game/types';
import { MainMenu } from './MainMenu';
import { LevelSelect } from './LevelSelect';
import { HowToPlay } from './HowToPlay';
import { GameHUD } from './GameHUD';
import { LevelComplete } from './LevelComplete';
import { GameOver } from './GameOver';
import { Leaderboard } from './Leaderboard';
import { CharacterSelect } from './CharacterSelect';
import { loadSave, updateLevelUnlocked, updateScore } from '../game/saveSystem';

export function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState<GameAssets | null>(null);
  const [gameState, setGameState] = useState<GameState>(() => {
    const save = loadSave();
    return {
      currentLevel: 1,
      score: 0,
      lives: 3,
      screen: 'menu',
      levelUnlocked: save.levelUnlocked,
    };
  });

  useEffect(() => {
    loadGameAssets().then((loadedAssets) => {
      setAssets(loadedAssets);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !assets) return;

    const handleResize = () => {
      if (!canvasRef.current) return;

      const container = canvasRef.current.parentElement;
      if (!container) return;

      canvasRef.current.width = container.clientWidth;
      canvasRef.current.height = container.clientHeight;

      if (engineRef.current) {
        engineRef.current.resize(container.clientWidth, container.clientHeight);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (engineRef.current) {
        engineRef.current.stop();
      }
    };
  }, [assets]);

  const handleStateChange = (newState: GameState) => {
    if (newState.levelUnlocked > gameState.levelUnlocked) {
      updateLevelUnlocked(newState.levelUnlocked);
    }
    updateScore(newState.score, newState.currentLevel);
    setGameState({ ...newState });
  };

  const startLevel = (levelId: number) => {
    if (!canvasRef.current || !assets) return;

    if (engineRef.current) {
      engineRef.current.stop();
    }

    const newState: GameState = {
      ...gameState,
      currentLevel: levelId,
      lives: 3,
      screen: 'playing',
    };

    setGameState(newState);

    engineRef.current = new GameEngine(
      canvasRef.current,
      assets,
      newState,
      handleStateChange
    );

    engineRef.current.start(levelId);
  };

  const handleStartGame = () => {
    startLevel(1);
  };

  const handleLevelSelect = (levelId: number) => {
    startLevel(levelId);
  };

  const handleNextLevel = () => {
    const nextLevel = gameState.currentLevel + 1;
    if (nextLevel <= 50) {
      startLevel(nextLevel);
    } else {
      setGameState({ ...gameState, screen: 'menu' });
    }
  };

  const handleRetry = () => {
    startLevel(gameState.currentLevel);
  };

  const handleMainMenu = () => {
    if (engineRef.current) {
      engineRef.current.stop();
    }
    setGameState({ ...gameState, screen: 'menu' });
  };

  const handleShowLevelSelect = () => {
    setGameState({ ...gameState, screen: 'levelSelect' });
  };

  const handleShowHowToPlay = () => {
    setGameState({ ...gameState, screen: 'howToPlay' });
  };

  const handleShowLeaderboard = () => {
    setGameState({ ...gameState, screen: 'leaderboard' as GameState['screen'] });
  };

  const handleShowCharacterSelect = () => {
    setGameState({ ...gameState, screen: 'characterSelect' as GameState['screen'] });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="text-center">
          <div className="text-white text-4xl font-bold mb-4">Loading Game...</div>
          <div className="w-64 h-2 bg-white/30 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black">
      <div className="w-full h-full">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>

      {gameState.screen === 'menu' && (
        <MainMenu
          onStartGame={handleStartGame}
          onLevelSelect={handleShowLevelSelect}
          onHowToPlay={handleShowHowToPlay}
          onLeaderboard={handleShowLeaderboard}
          onCharacterSelect={handleShowCharacterSelect}
        />
      )}

      {gameState.screen === 'levelSelect' && (
        <LevelSelect
          levelUnlocked={gameState.levelUnlocked}
          onSelectLevel={handleLevelSelect}
          onBack={handleMainMenu}
        />
      )}

      {gameState.screen === 'howToPlay' && (
        <HowToPlay onBack={handleMainMenu} />
      )}

      {gameState.screen === 'playing' && (
        <GameHUD
          score={gameState.score}
          lives={gameState.lives}
          level={gameState.currentLevel}
        />
      )}

      {gameState.screen === 'levelComplete' && (
        <LevelComplete
          level={gameState.currentLevel}
          score={gameState.score}
          onNextLevel={handleNextLevel}
          onMainMenu={handleMainMenu}
          hasNextLevel={gameState.currentLevel < 50}
        />
      )}

      {gameState.screen === 'gameOver' && (
        <GameOver
          level={gameState.currentLevel}
          score={gameState.score}
          onRetry={handleRetry}
          onMainMenu={handleMainMenu}
        />
      )}

      {gameState.screen === 'leaderboard' && (
        <Leaderboard onBack={handleMainMenu} />
      )}

      {gameState.screen === 'characterSelect' && (
        <CharacterSelect
          onBack={handleMainMenu}
          currentScore={gameState.score}
        />
      )}
    </div>
  );
}
