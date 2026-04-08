import { DoodleButton, DoodlePanel, MeemTitle } from './DoodleUI';

interface MainMenuProps {
  onStartGame: () => void;
  onLevelSelect: () => void;
  onHowToPlay: () => void;
  onLeaderboard: () => void;
  onCharacterSelect: () => void;
}

export function MainMenu({ onStartGame, onLevelSelect, onHowToPlay, onLeaderboard, onCharacterSelect }: MainMenuProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <DoodlePanel bordered className="text-center space-y-6 max-w-md w-full mx-4">
        <div className="mb-4">
          <MeemTitle size="xl">
            MEEM RUNNER
          </MeemTitle>
          <p className="text-black text-lg font-medium mt-2">to the moon</p>
        </div>

        <div className="space-y-3 pt-4">
          <DoodleButton onClick={onStartGame} size="lg">
            START GAME
          </DoodleButton>

          <DoodleButton onClick={onLevelSelect} size="md">
            level select
          </DoodleButton>

          <DoodleButton onClick={onCharacterSelect} size="md">
            character select
          </DoodleButton>

          <DoodleButton onClick={onLeaderboard} size="md">
            leaderboard
          </DoodleButton>

          <DoodleButton onClick={onHowToPlay} size="md">
            how to play
          </DoodleButton>
        </div>
      </DoodlePanel>
    </div>
  );
}
