import { useState, useEffect } from 'react';
import { CHARACTERS, SKINS } from '../game/characterData';
import type { Character, Skin, PlayerCustomization } from '../game/types';

interface CharacterSelectProps {
  onBack: () => void;
  currentScore: number;
}

function CharacterCard({
  character,
  selected,
  onClick,
}: {
  character: Character;
  selected: boolean;
  onClick: () => void;
}) {
  const rot = ((character.id.length * 3) % 5) - 2;

  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "'Patrick Hand', cursive",
        background: selected ? '#333' : '#fff',
        color: selected ? '#fafaf5' : '#333',
        border: `2.5px solid #333`,
        borderRadius: 12,
        padding: '16px 12px',
        cursor: 'pointer',
        transform: `rotate(${rot * 0.5}deg)`,
        boxShadow: selected ? '4px 4px 0 rgba(0,0,0,0.22)' : '3px 3px 0 rgba(0,0,0,0.10)',
        transition: 'all 0.15s ease',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = `rotate(${rot * 0.5}deg) scale(1.04)`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = `rotate(${rot * 0.5}deg)`;
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: character.color,
          border: `2.5px solid ${selected ? '#fafaf5' : '#333'}`,
          flexShrink: 0,
        }}
      />
      <div style={{ fontSize: '0.85rem', fontWeight: 700, lineHeight: 1.2 }}>{character.name}</div>
      {!character.unlocked && (
        <div
          style={{
            fontSize: '0.72rem',
            background: selected ? 'rgba(255,255,255,0.2)' : '#f0f0e8',
            border: '1.5px solid #999',
            borderRadius: 4,
            padding: '2px 6px',
            color: selected ? '#fafaf5' : '#666',
          }}
        >
          {character.cost} coins
        </div>
      )}
      {character.unlocked && selected && (
        <div style={{ fontSize: '0.72rem', color: '#aaa' }}>selected</div>
      )}
    </button>
  );
}

function SkinCard({
  skin,
  equipped,
  onClick,
}: {
  skin: Skin;
  equipped: boolean;
  onClick: () => void;
}) {
  const skinEmoji: Record<string, string> = {
    chain: 'chain',
    glasses: 'glasses',
    hat: 'hat',
    cigar: 'cigar',
  };

  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "'Patrick Hand', cursive",
        background: equipped ? '#333' : '#fff',
        color: equipped ? '#fafaf5' : '#333',
        border: '2.5px solid #333',
        borderRadius: 12,
        padding: '16px 12px',
        cursor: 'pointer',
        transform: `rotate(${equipped ? -0.8 : 0.6}deg)`,
        boxShadow: equipped ? '4px 4px 0 rgba(0,0,0,0.22)' : '3px 3px 0 rgba(0,0,0,0.10)',
        transition: 'all 0.15s ease',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: equipped ? 'rgba(255,255,255,0.15)' : '#f0f0e8',
          border: `2.5px solid ${equipped ? 'rgba(255,255,255,0.4)' : '#ccc'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1rem',
          color: equipped ? '#fafaf5' : '#666',
          fontWeight: 700,
        }}
      >
        {skinEmoji[skin.type] || skin.type}
      </div>
      <div style={{ fontSize: '0.85rem', fontWeight: 700, lineHeight: 1.2 }}>{skin.name}</div>
      {!skin.unlocked && (
        <div
          style={{
            fontSize: '0.72rem',
            background: equipped ? 'rgba(255,255,255,0.2)' : '#f0f0e8',
            border: '1.5px solid #999',
            borderRadius: 4,
            padding: '2px 6px',
            color: equipped ? '#fafaf5' : '#666',
          }}
        >
          {skin.cost} coins
        </div>
      )}
      {skin.unlocked && equipped && (
        <div style={{ fontSize: '0.72rem', color: '#aaa' }}>equipped</div>
      )}
    </button>
  );
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
      setCharacters(prev => prev.map(c => ({ ...c, unlocked: c.unlocked || unlocked.includes(c.id) })));
    }

    const unlockedSkins = localStorage.getItem('meem_unlocked_skins');
    if (unlockedSkins) {
      const unlocked: string[] = JSON.parse(unlockedSkins);
      setSkins(prev => prev.map(s => ({ ...s, unlocked: s.unlocked || unlocked.includes(s.id) })));
    }
  }, []);

  const saveCustomization = (charId: string, sks: string[]) => {
    const customization: PlayerCustomization = { characterId: charId, equippedSkins: sks };
    localStorage.setItem('meem_customization', JSON.stringify(customization));
  };

  const handleCharacterSelect = (characterId: string) => {
    const character = characters.find(c => c.id === characterId);
    if (!character) return;
    if (character.unlocked) {
      setSelectedCharacter(characterId);
      saveCustomization(characterId, equippedSkins);
    } else if (currentScore >= character.cost) {
      const newUnlocked = [...characters.filter(c => c.unlocked).map(c => c.id), characterId];
      localStorage.setItem('meem_unlocked_characters', JSON.stringify(newUnlocked));
      setCharacters(prev => prev.map(c => c.id === characterId ? { ...c, unlocked: true } : c));
      setSelectedCharacter(characterId);
      saveCustomization(characterId, equippedSkins);
    }
  };

  const handleSkinToggle = (skinId: string) => {
    const skin = skins.find(s => s.id === skinId);
    if (!skin) return;
    if (!skin.unlocked) {
      if (currentScore >= skin.cost) {
        const newUnlocked = [...skins.filter(s => s.unlocked).map(s => s.id), skinId];
        localStorage.setItem('meem_unlocked_skins', JSON.stringify(newUnlocked));
        setSkins(prev => prev.map(s => s.id === skinId ? { ...s, unlocked: true } : s));
        const newEquipped = [...equippedSkins, skinId];
        setEquippedSkins(newEquipped);
        saveCustomization(selectedCharacter, newEquipped);
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

  return (
    <div
      className="fixed inset-0 overflow-auto"
      style={{ fontFamily: "'Patrick Hand', cursive", padding: '16px' }}
    >
      <div style={{ maxWidth: 680, margin: '0 auto', paddingBottom: 40 }}>
        <div style={{ marginBottom: 16 }}>
          <button
            onClick={onBack}
            className="sketch-btn"
            style={{ fontSize: '0.95rem', padding: '8px 20px', transform: 'rotate(-0.5deg)' }}
          >
            back
          </button>
        </div>

        <div
          style={{
            background: 'rgba(250,250,245,0.97)',
            border: '2.5px solid #333',
            borderRadius: 16,
            padding: '28px 28px 32px',
            boxShadow: '6px 6px 0 rgba(0,0,0,0.10)',
            transform: 'rotate(0.15deg)',
            marginBottom: 16,
            textAlign: 'center',
          }}
        >
          <h2
            className="hooey-title"
            style={{ fontSize: 'clamp(1.4rem, 5vw, 2rem)', marginBottom: 8 }}
          >
            CHARACTER SELECT
          </h2>
          <div
            style={{
              display: 'inline-block',
              background: '#fff',
              border: '2px solid #333',
              borderRadius: 8,
              padding: '4px 14px',
              fontSize: '0.85rem',
              color: '#555',
              transform: 'rotate(-0.3deg)',
              boxShadow: '2px 2px 0 rgba(0,0,0,0.08)',
            }}
          >
            your coins: {currentScore}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          {(['characters', 'skins'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setView(tab)}
              className="sketch-btn"
              style={{
                fontSize: '0.95rem',
                padding: '8px 20px',
                transform: view === tab ? 'rotate(-0.8deg) scale(1.03)' : 'rotate(0.5deg)',
                background: view === tab ? '#333' : '#fff',
                color: view === tab ? '#fafaf5' : '#333',
                boxShadow: view === tab ? '4px 4px 0 rgba(0,0,0,0.18)' : '2px 2px 0 rgba(0,0,0,0.08)',
              }}
            >
              {view === tab ? `> ${tab}` : tab}
            </button>
          ))}
        </div>

        {view === 'characters' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
              gap: 12,
            }}
          >
            {characters.map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
                selected={selectedCharacter === character.id}
                onClick={() => handleCharacterSelect(character.id)}
              />
            ))}
            {Array.from({ length: Math.max(0, 10 - characters.length) }).map((_, i) => (
              <div
                key={`placeholder-${i}`}
                style={{
                  background: '#f0f0e8',
                  border: '2px dashed #ccc',
                  borderRadius: 12,
                  padding: '16px 12px',
                  transform: `rotate(${((i * 3) % 5 - 2) * 0.4}deg)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  aspectRatio: '1',
                  color: '#bbb',
                  fontSize: '0.8rem',
                  textAlign: 'center',
                  fontFamily: "'Patrick Hand', cursive",
                }}
              >
                coming<br />soon
              </div>
            ))}
          </div>
        )}

        {view === 'skins' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: 12,
            }}
          >
            {skins.map((skin) => (
              <SkinCard
                key={skin.id}
                skin={skin}
                equipped={equippedSkins.includes(skin.id)}
                onClick={() => handleSkinToggle(skin.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
