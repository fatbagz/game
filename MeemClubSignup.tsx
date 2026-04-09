import { useState, useEffect, useRef } from 'react';
import { Gamepad2, Star, CheckCircle, Loader, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface MeemClubSignupProps {
  visible: boolean;
}

type FlowStatus = 'idle' | 'loading' | 'verify' | 'verifying' | 'success' | 'already' | 'error';

export default function MeemClubSignup({ visible }: MeemClubSignupProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<FlowStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [pendingMemberId, setPendingMemberId] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');
  const [fallbackCode, setFallbackCode] = useState<string | null>(null);
  const codeRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('meem_member_id');
    const verified = localStorage.getItem('meem_verified');
    if (stored && verified === 'true') setStatus('already');
  }, []);

  const sendVerification = async (memberId: string, memberEmail: string) => {
    const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-verification`;
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ memberId, email: memberEmail }),
    });

    if (!res.ok) throw new Error('Failed to send verification');
    const data = await res.json();
    return data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !name.trim()) return;

    setStatus('loading');
    setErrorMsg('');
    setFallbackCode(null);

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    const { data: existing } = await supabase
      .from('members')
      .select('id, verified')
      .eq('email', trimmedEmail)
      .maybeSingle();

    if (existing && existing.verified) {
      localStorage.setItem('meem_member_id', existing.id);
      localStorage.setItem('meem_member_name', trimmedName);
      localStorage.setItem('meem_verified', 'true');
      setStatus('success');
      return;
    }

    let memberId: string;

    if (existing) {
      memberId = existing.id;
      await supabase
        .from('members')
        .update({ display_name: trimmedName })
        .eq('id', memberId);
    } else {
      const { data, error } = await supabase
        .from('members')
        .insert({ email: trimmedEmail, display_name: trimmedName, verified: false })
        .select('id')
        .single();

      if (error || !data) {
        setStatus('error');
        setErrorMsg('something went wrong. try again?');
        return;
      }

      memberId = data.id;
      await supabase.from('login_streaks').insert({ member_id: memberId });
    }

    setPendingMemberId(memberId);
    setPendingEmail(trimmedEmail);
    localStorage.setItem('meem_member_id', memberId);
    localStorage.setItem('meem_member_name', trimmedName);

    try {
      const result = await sendVerification(memberId, trimmedEmail);
      if (result.sent === false && result.code) {
        setFallbackCode(result.code);
      }
      setStatus('verify');
      setCode(['', '', '', '', '', '']);
    } catch {
      setStatus('error');
      setErrorMsg('could not send verification email. try again?');
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 5) {
      codeRefs.current[index + 1]?.focus();
    }

    if (newCode.every(d => d !== '') && newCode.join('').length === 6) {
      verifyCode(newCode.join(''));
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      codeRefs.current[index - 1]?.focus();
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const newCode = pasted.split('');
      setCode(newCode);
      codeRefs.current[5]?.focus();
      verifyCode(pasted);
    }
  };

  const verifyCode = async (enteredCode: string) => {
    setStatus('verifying');
    setErrorMsg('');

    const { data } = await supabase
      .from('members')
      .select('id, verification_code')
      .eq('id', pendingMemberId)
      .maybeSingle();

    if (!data || data.verification_code !== enteredCode) {
      setStatus('verify');
      setErrorMsg('wrong code. check your email and try again.');
      setCode(['', '', '', '', '', '']);
      codeRefs.current[0]?.focus();
      return;
    }

    await supabase
      .from('members')
      .update({ verified: true, verification_code: null })
      .eq('id', pendingMemberId);

    localStorage.setItem('meem_verified', 'true');
    setStatus('success');
  };

  const handleResend = async () => {
    if (!pendingMemberId || !pendingEmail) return;
    setErrorMsg('');
    setFallbackCode(null);
    try {
      const result = await sendVerification(pendingMemberId, pendingEmail);
      if (result.sent === false && result.code) {
        setFallbackCode(result.code);
      }
      setCode(['', '', '', '', '', '']);
      setErrorMsg('new code sent!');
    } catch {
      setErrorMsg('failed to resend. try again.');
    }
  };

  if (!visible) return null;

  return (
    <div className="mt-16 w-full" id="meem-club">
      <div
        className="max-w-md mx-auto"
        style={{
          border: '3px solid #333',
          background: 'rgba(255, 255, 255, 0.7)',
          padding: '28px 24px',
          transform: 'rotate(-0.5deg)',
          boxShadow: '6px 6px 0 rgba(0,0,0,0.12)',
        }}
      >
        <div className="flex items-center gap-3 justify-center mb-2">
          <Gamepad2 size={28} style={{ color: '#333' }} />
          <h2
            className="hooey-title text-center"
            style={{
              fontSize: 'clamp(1.6rem, 5vw, 2.2rem)',
              textDecoration: 'underline',
              textDecorationStyle: 'wavy',
              textUnderlineOffset: '5px',
              textDecorationColor: '#000',
            }}
          >
            MEEM MEMEBERS CLUB
          </h2>
        </div>

        <p className="font-hand text-center mb-1" style={{ color: '#666', fontSize: '1rem' }}>
          join the club to unlock the game + leaderboard
        </p>
        <p className="font-hand text-center mb-5" style={{ color: '#999', fontSize: '0.85rem' }}>
          top players get rewards 1 month after launch
        </p>

        {status === 'success' || status === 'already' ? (
          <div className="flex flex-col items-center gap-3">
            <CheckCircle size={36} style={{ color: '#22aa44' }} />
            <p className="font-hand text-lg font-bold" style={{ color: '#22aa44' }}>
              {status === 'already' ? "you're already a memeber!" : "welcome to the club!"}
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href="/game"
                className="sketch-btn flex items-center gap-2"
                style={{ fontSize: '1rem', transform: 'rotate(0.5deg)', textDecoration: 'none' }}
              >
                <Gamepad2 size={18} />
                PLAY GAME
              </a>
              <a
                href="/memebers-club"
                className="sketch-btn flex items-center gap-2"
                style={{ fontSize: '1rem', transform: 'rotate(-0.5deg)', textDecoration: 'none' }}
              >
                <Star size={18} />
                MEMEBERS CLUB
              </a>
            </div>
          </div>
        ) : status === 'verify' || status === 'verifying' ? (
          <div className="flex flex-col items-center gap-3 fade-in-up">
            <Mail size={32} style={{ color: '#1a8cff' }} />
            <p className="font-hand text-center font-bold" style={{ color: '#333', fontSize: '1.1rem' }}>
              check your email!
            </p>
            <p className="font-hand text-center" style={{ color: '#888', fontSize: '0.9rem' }}>
              we sent a 6-digit code to your email
            </p>

            {fallbackCode && (
              <div
                className="w-full text-center"
                style={{
                  background: '#fffbe6',
                  border: '2px solid #e8c830',
                  padding: '10px 14px',
                  marginTop: 4,
                }}
              >
                <p className="font-hand" style={{ fontSize: '0.8rem', color: '#886a00' }}>
                  your code:
                </p>
                <p
                  className="font-hand font-bold"
                  style={{ fontSize: '1.6rem', letterSpacing: '6px', color: '#333' }}
                >
                  {fallbackCode}
                </p>
              </div>
            )}

            <div
              className="flex gap-2 justify-center mt-2"
              onPaste={handleCodePaste}
            >
              {code.map((digit, i) => (
                <input
                  key={i}
                  ref={el => { codeRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleCodeChange(i, e.target.value)}
                  onKeyDown={e => handleCodeKeyDown(i, e)}
                  disabled={status === 'verifying'}
                  className="font-hand text-center font-bold outline-none"
                  style={{
                    width: 42,
                    height: 50,
                    fontSize: '1.5rem',
                    border: '2.5px solid #333',
                    background: digit ? '#f0f8ff' : '#fff',
                    color: '#333',
                  }}
                />
              ))}
            </div>

            {status === 'verifying' && (
              <div className="flex items-center gap-2 mt-1">
                <Loader size={16} className="animate-spin" style={{ color: '#1a8cff' }} />
                <span className="font-hand" style={{ color: '#888' }}>verifying...</span>
              </div>
            )}

            {errorMsg && (
              <p
                className="font-hand text-center"
                style={{
                  color: errorMsg === 'new code sent!' ? '#22aa44' : '#dd3333',
                  fontSize: '0.9rem',
                }}
              >
                {errorMsg}
              </p>
            )}

            <button
              onClick={handleResend}
              className="font-hand mt-1"
              style={{
                background: 'none',
                border: 'none',
                color: '#1a8cff',
                fontSize: '0.9rem',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              resend code
            </button>

            <button
              onClick={() => { setStatus('idle'); setErrorMsg(''); setFallbackCode(null); }}
              className="font-hand"
              style={{
                background: 'none',
                border: 'none',
                color: '#999',
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              use a different email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="your meem name"
              required
              className="font-hand w-full px-4 py-3 outline-none"
              style={{
                fontSize: '1.1rem',
                border: '2.5px solid #333',
                background: '#fff',
                color: '#333',
              }}
            />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your email"
              required
              className="font-hand w-full px-4 py-3 outline-none"
              style={{
                fontSize: '1.1rem',
                border: '2.5px solid #333',
                background: '#fff',
                color: '#333',
              }}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="sketch-btn flex items-center gap-2 justify-center w-full"
              style={{ fontSize: '1.15rem' }}
            >
              {status === 'loading' ? (
                <Loader size={18} className="animate-spin" />
              ) : (
                <Star size={18} />
              )}
              {status === 'loading' ? 'JOINING...' : 'JOIN THE CLUB'}
            </button>
            {status === 'error' && (
              <p className="font-hand text-center" style={{ color: '#dd3333', fontSize: '0.9rem' }}>
                {errorMsg}
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
