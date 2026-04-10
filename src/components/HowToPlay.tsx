import { DoodleButton, DoodlePanel, MeemTitle } from './DoodleUI';

interface HowToPlayProps {
  onBack: () => void;
}

export function HowToPlay({ onBack }: HowToPlayProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 overflow-auto">
      <DoodlePanel bordered className="max-w-2xl w-full my-8">
        <MeemTitle size="lg">HOW TO PLAY</MeemTitle>

        <div className="space-y-4 text-black mt-6">
          <div className="bg-white p-4 border-3 border-black" style={{ borderRadius: '12px' }}>
            <h3 className="text-lg font-bold mb-2 text-black">meem move</h3>
            <div className="space-y-1 font-medium">
              <p>← / A = go left</p>
              <p>→ / D = go right</p>
              <p>SPACE / W = jump</p>
            </div>
          </div>

          <div className="bg-white p-4 border-3 border-black" style={{ borderRadius: '12px' }}>
            <h3 className="text-lg font-bold mb-2 text-black">goal</h3>
            <p className="font-medium">meem run. meem jump. meem get to end.</p>
          </div>

          <div className="bg-white p-4 border-3 border-black" style={{ borderRadius: '12px' }}>
            <h3 className="text-lg font-bold mb-2 text-black">coin good</h3>
            <p className="font-medium">collect coin. get rich. buy lambo.</p>
          </div>

          <div className="bg-white p-4 border-3 border-black" style={{ borderRadius: '12px' }}>
            <h3 className="text-lg font-bold mb-2 text-black">enemy bad</h3>
            <p className="font-medium">3 lives. enemy hit = lose life. no lives = rekt.</p>
          </div>

          <div className="bg-white p-4 border-3 border-black" style={{ borderRadius: '12px' }}>
            <h3 className="text-lg font-bold mb-2 text-black">pro tips</h3>
            <div className="space-y-1 font-medium">
              <p>timing is everything</p>
              <p>watch enemy patterns</p>
              <p>dont fall off map</p>
              <p>wagmi</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <DoodleButton onClick={onBack} size="md">
            back
          </DoodleButton>
        </div>
      </DoodlePanel>
    </div>
  );
}
