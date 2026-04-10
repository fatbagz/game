import { useState, useEffect } from 'react';
import { DoodleButton, DoodleCard, DoodleBadge, DoodlePanel, MeemTitle } from './DoodleUI';
import { CHARACTERS, SKINS } from '../game/characterData';
import type { Character, Skin, PlayerCustomization } from '../game/types';

interface CharacterSelectProps {
  onBack: () => void;
  currentScore: number;
}

export function CharacterSelect({ onBack, currentScore }: CharacterSelectProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<string>('meem_original');
  const [equippedSkins, setEquippedSkins] = useState<string[]>([]);
  const [characters, setCharacters] = useState<Character[]>(CHARACTERS);
  const [skins, setSkins] = useState<Skin[]>(SKINS);
  const [view, setView] = useState<'characters' | 'skins'>('characters');

  useEffect(() => {
    const savedCustomization = localStorage.getItem('meem_customization');
    if (savedCustomization) {
      const customization: PlayerCustomization = JSON.parse(savedCustomization);
      setSelectedCharacter(customization.characterId);
      setEquippedSkins(customization.equippedSkins);
    }

    const unlockedChars = localStorage.getItem('meem_unlocked_characters');
    if (unlockedChars) {
      const unlocked: string[] = JSON.parse(unlockedChars);
      setCharacters(prev => prev.map(c => ({
        ...c,
        unlocked: c.unlocked || unlocked.includes(c.id)
      })));
    }

    const unlockedSkins = localStorage.getItem('meem_unlocked_skins');
    if (unlockedSkins) {
      const unlocked: string[] = JSON.parse(unlockedSkins);
      setSkins(prev => prev.map(s => ({
        ...s,
        unlocked: s.unlocked || unlocked.includes(s.id)
      })));
    }
  }, []);

  const handleCharacterSelect = (characterId: string) => {
    const character = characters.find(c => c.id === characterId);
    if (!character) return;

    if (character.unlocked) {
      setSelectedCharacter(characterId);
      saveCustomization(characterId, equippedSkins);
    } else {
      if (currentScore >= character.cost) {
        const newUnlocked = [...characters.filter(c => c.unlocked).map(c => c.id), characterId];
        localStorage.setItem('meem_unlocked_characters', JSON.stringify(newUnlocked));
        setCharacters(prev => prev.map(c =>
          c.id === characterId ? { ...c, unlocked: true } : c
        ));
        setSelectedCharacter(characterId);
        saveCustomization(characterId, equippedSkins);
      }
    }
  };

  const handleSkinToggle = (skinId: string) => {
    const skin = skins.find(s => s.id === skinId);
    if (!skin) return;

    if (!skin.unlocked) {
      if (currentScore >= skin.cost) {
        const newUnlocked = [...skins.filter(s => s.unlocked).map(s => s.id), skinId];
        localStorage.setItem('meem_unlocked_skins', JSON.stringify(newUnlocked));
        setSkins(prev => prev.map(s =>
          s.id === skinId ? { ...s, unlocked: true } : s
        ));
        setEquippedSkins(prev => [...prev, skinId]);
        saveCustomization(selectedCharacter, [...equippedSkins, skinId]);
      }
      return;
    }

    if (equippedSkins.includes(skinId)) {
      const newEquipped = equippedSkins.filter(id => id !== skinId);
      setEquippedSkins(newEquipped);
      saveCustomization(selectedCharacter, newEquipped);
    } else {
      const newEquipped = [...equippedSkins, skinId];
      setEquippedSkins(newEquipped);
      saveCustomization(selectedCharacter, newEquipped);
    }
  };

  const saveCustomization = (charId: string, skins: string[]) => {
    const customization: PlayerCustomization = {
      characterId: charId,
      equippedSkins: skins
    };
    localStorage.setItem('meem_customization', JSON.stringify(customization));
  };

  return (
    <div className="min-h-screen p-4 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <DoodleButton onClick={onBack} size="sm">
            back
          </DoodleButton>
        </div>

        <DoodlePanel bordered className="mb-6">
          <MeemTitle size="lg">CHARACTER SELECT</MeemTitle>
          <div className="text-center mt-4">
            <DoodleBadge>your coins: {currentScore}</DoodleBadge>
          </div>
        </DoodlePanel>

        <div className="flex gap-3 mb-6">
          <DoodleButton
            onClick={() => setView('characters')}
            size="md"
          >
            {view === 'characters' ? '→ characters' : 'characters'}
          </DoodleButton>
          <DoodleButton
            onClick={() => setView('skins')}
            size="md"
          >
            {view === 'skins' ? '→ skins' : 'skins'}
          </DoodleButton>
        </div>

        {view === 'characters' && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {characters.map((character) => (
              <DoodleCard
                key={character.id}
                onClick={() => handleCharacterSelect(character.id)}
                selected={selectedCharacter === character.id}
                className="text-center"
              >
                <div
                  className="w-16 h-16 mx-auto mb-3 border-3 border-black rounded-full"
                  style={{ backgroundColor: character.color }}
                />
                <div className="font-bold text-sm mb-2">{character.name}</div>
                {!character.unlocked && (
                  <DoodleBadge>{character.cost} coins</DoodleBadge>
                )}
                {character.unlocked && selectedCharacter === character.id && (
                  <div className="text-sm font-medium text-green-600">selected</div>
                )}
              </DoodleCard>
            ))}
          </div>
        )}

        {view === 'skins' && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {skins.map((skin) => (
              <DoodleCard
                key={skin.id}
                onClick={() => handleSkinToggle(skin.id)}
                selected={equippedSkins.includes(skin.id)}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-3 border-3 border-black rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-2xl">{skin.type === 'chain' ? '⛓️' : skin.type === 'glasses' ? '🕶️' : skin.type === 'hat' ? '🧢' : '🚬'}</span>
                </div>
                <div className="font-bold text-sm mb-2">{skin.name}</div>
                {!skin.unlocked && (
                  <DoodleBadge>{skin.cost} coins</DoodleBadge>
                )}
                {skin.unlocked && equippedSkins.includes(skin.id) && (
                  <div className="text-sm font-medium text-green-600">equipped</div>
                )}
              </DoodleCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
