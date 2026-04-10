import { DoodleButton, DoodlePanel, MeemTitle } from './DoodleUI';

interface LevelCompleteProps {
  level: number;
  score: number;
  onNextLevel: () => void;
  onMainMenu: () => void;
  hasNextLevel: boolean;
}

export function LevelComplete({ level, score, onNextLevel, onMainMenu, hasNextLevel }: LevelCompleteProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-20 p-4">
      <DoodlePanel bordered className="max-w-md w-full text-center">
        <div className="text-6xl mb-4">{level === 50 ? '🏆' : '⭐'}</div>
        <MeemTitle size="md">
          {level === 50 ? 'LEGEND!' : 'LEVEL COMPLETE'}
        </MeemTitle>
        <p className="text-black text-base font-medium mb-6 mt-2">
          {level === 50 ? 'all 50 levels! wagmi' : `level ${level} cleared`}
        </p>

        <div className="bg-white border-3 border-black p-6 mb-6" style={{ borderRadius: '12px' }}>
          <div className="text-sm font-bold mb-1">total score</div>
          <div className="text-5xl font-bold meem-text-blue">{score}</div>
        </div>

        <div className="space-y-3">
          {hasNextLevel && (
            <DoodleButton onClick={onNextLevel} size="md">
              next level
            </DoodleButton>
          )}

          <DoodleButton onClick={onMainMenu} size="sm">
            main menu
          </DoodleButton>
        </div>
      </DoodlePanel>
    </div>
  );
}
