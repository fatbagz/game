import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: 'what even is meem?',
    a: 'meem is what happens when you try to make a meme coin but spell it wrong. instead of fixing it, we decided this is better. it lives on Solana and has its own little guy with a blue beanie.',
  },
  {
    q: 'is this a real crypto project?',
    a: 'meem is as real as any other meme coin, which is to say: it exists, you can buy it, and nobody really knows what will happen. we are just vibing.',
  },
  {
    q: 'why is it called meem and not meme?',
    a: 'typo. but honestly meem sounds cuter. say it out loud. see? you smiled. that is the entire value proposition.',
  },
  {
    q: 'what blockchain is meem on?',
    a: 'Solana. fast, cheap, and the meem guy can walk across the screen without paying $50 in gas fees.',
  },
  {
    q: 'what is the tokenomics?',
    a: '100% meem. no presale, no team allocation, no complicated vesting schedule. just meem. the pie chart on this page is accurate.',
  },
  {
    q: 'will meem hit 1 billion market cap?',
    a: 'the meem guy believes so. he already has a lambo picked out. whether the market agrees is a different conversation.',
  },
  {
    q: 'what happens if meem goes to zero?',
    a: 'it was performance art the whole time. we are all artists. also the meem guy will probably just scratch his head and walk off screen.',
  },
  {
    q: 'is this financial advice?',
    a: 'absolutely not. this is a website with a little dude in a beanie. please do not make life decisions based on meem.',
  },
];

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="faq-item"
      style={{
        border: '3px solid #444',
        background: 'rgba(255, 255, 255, 0.5)',
        marginBottom: '12px',
        overflow: 'hidden',
        transition: 'transform 0.15s ease',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-5 py-4 flex items-center justify-between gap-3 cursor-pointer"
        style={{
          fontFamily: "'Patrick Hand', 'Comic Sans MS', cursive",
          fontSize: '1.15rem',
          color: '#333',
          background: 'transparent',
          border: 'none',
        }}
      >
        <span>{question}</span>
        <ChevronDown
          size={22}
          style={{
            flexShrink: 0,
            transition: 'transform 0.25s ease',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            color: '#666',
          }}
        />
      </button>
      <div
        style={{
          maxHeight: open ? '300px' : '0px',
          transition: 'max-height 0.3s ease, opacity 0.25s ease, padding 0.3s ease',
          opacity: open ? 1 : 0,
          paddingLeft: '20px',
          paddingRight: '20px',
          paddingBottom: open ? '16px' : '0px',
          paddingTop: '0px',
          overflow: 'hidden',
        }}
      >
        <p
          className="font-hand"
          style={{
            color: '#555',
            fontSize: '1.05rem',
            lineHeight: '1.6',
          }}
        >
          {answer}
        </p>
      </div>
    </div>
  );
}

interface FaqSectionProps {
  visible: boolean;
}

export default function FaqSection({ visible }: FaqSectionProps) {
  if (!visible) return null;

  return (
    <div className="mt-16 w-full max-w-3xl mx-auto">

      <h2
        className="hooey-title text-4xl md:text-5xl mb-8 text-center"
        style={{
          transform: 'rotate(0.5deg)',
          textDecoration: 'underline',
          textDecorationStyle: 'wavy',
          textUnderlineOffset: '6px',
          textDecorationColor: '#000',
        }}
      >
        FREQUENTLY ASKED QUESTIONS
      </h2>
      <p
        className="font-hand text-center mb-8"
        style={{ color: '#888', fontSize: '1.1rem' }}
      >
        (that nobody actually asked but we answered anyway)
      </p>
      <div>
        {FAQ_ITEMS.map((item, i) => (
          <FaqItem key={i} question={item.q} answer={item.a} />
        ))}
      </div>
    </div>
  );
}
