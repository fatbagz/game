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
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
      if (engineRef.current) {
        engineRef.current.resize(window.innerWidth, window.innerHeight);
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

  const handleStartGame = () => startLevel(1);
  const handleLevelSelect = (levelId: number) => startLevel(levelId);

  const handleNextLevel = () => {
    const nextLevel = gameState.currentLevel + 1;
    if (nextLevel <= 50) {
      startLevel(nextLevel);
    } else {
      setGameState({ ...gameState, screen: 'menu' });
    }
  };

  const handleRetry = () => startLevel(gameState.currentLevel);

  const handleMainMenu = () => {
    if (engineRef.current) {
      engineRef.current.stop();
    }
    setGameState({ ...gameState, screen: 'menu' });
  };

  const handleShowLevelSelect = () => setGameState({ ...gameState, screen: 'levelSelect' });
  const handleShowHowToPlay = () => setGameState({ ...gameState, screen: 'howToPlay' });
  const handleShowLeaderboard = () => setGameState({ ...gameState, screen: 'leaderboard' as GameState['screen'] });
  const handleShowCharacterSelect = () => setGameState({ ...gameState, screen: 'characterSelect' as GameState['screen'] });

  if (loading) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center notebook"
        style={{ fontFamily: "'Patrick Hand', cursive" }}
      >
        <div className="text-center" style={{ zIndex: 1, position: 'relative' }}>
          <div
            style={{
              background: 'rgba(255,255,255,0.9)',
              border: '2.5px solid #333',
              borderRadius: 12,
              padding: '32px 48px',
              boxShadow: '6px 6px 0 rgba(0,0,0,0.12)',
              transform: 'rotate(-0.5deg)',
            }}
          >
            <p
              className="hooey-title"
              style={{ fontSize: '2.5rem', marginBottom: 12 }}
            >
              MEEM RUNNER
            </p>
            <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: 20 }}>
              loading assets...
            </p>
            <div
              style={{
                width: 200,
                height: 8,
                background: '#e8e8e0',
                border: '2px solid #333',
                borderRadius: 4,
                overflow: 'hidden',
                margin: '0 auto',
              }}
            >
              <div
                style={{
                  height: '100%',
                  background: '#333',
                  borderRadius: 2,
                  animation: 'loadingBar 1.2s ease-in-out infinite',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 notebook" style={{ overflow: 'hidden' }}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          imageRendering: 'pixelated',
        }}
      />

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
