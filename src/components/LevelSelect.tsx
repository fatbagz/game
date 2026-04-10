import { DoodleButton, DoodlePanel, DoodleBadge, MeemTitle } from './DoodleUI';

interface LevelSelectProps {
  levelUnlocked: number;
  onSelectLevel: (level: number) => void;
  onBack: () => void;
}

const TOTAL_LEVELS = 50;

export function LevelSelect({ levelUnlocked, onSelectLevel, onBack }: LevelSelectProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 overflow-auto">
      <DoodlePanel bordered className="max-w-4xl w-full my-8">
        <MeemTitle size="lg">LEVEL SELECT</MeemTitle>

        <div className="text-center mb-6 mt-4">
          <DoodleBadge>unlocked: {levelUnlocked} / {TOTAL_LEVELS}</DoodleBadge>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 md:gap-3 mb-6 max-h-96 overflow-y-auto p-2">
          {Array.from({ length: TOTAL_LEVELS }, (_, i) => i + 1).map((levelId) => {
            const isUnlocked = levelId <= levelUnlocked;

            return (
              <button
                key={levelId}
                onClick={() => isUnlocked && onSelectLevel(levelId)}
                disabled={!isUnlocked}
                className={`aspect-square p-2 md:p-3 font-bold text-base md:text-lg transition-all border-3 border-black ${
                  isUnlocked
                    ? 'bg-white text-black meem-button'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                style={{ borderRadius: '12px' }}
              >
                <div className="text-lg md:text-xl">{levelId}</div>
                {!isUnlocked && <div className="text-xs mt-1">🔒</div>}
              </button>
            );
          })}
        </div>

        <DoodleButton onClick={onBack} size="md">
          back
        </DoodleButton>
      </DoodlePanel>
    </div>
  );
}
