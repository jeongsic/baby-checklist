'use client';

import { useState } from 'react';

type View = 'welcome' | 'login' | 'signup';

export default function AuthScreen() {
  const [view, setView] = useState<View>('welcome');
  const [babyName, setBabyName] = useState('');
  const [pin, setPin] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function resetForm() {
    setBabyName('');
    setPin('');
    setPinConfirm('');
    setError('');
  }

  async function handleLogin() {
    if (!babyName.trim() || pin.length !== 4) {
      setError('아기 이름과 4자리 PIN을 입력해주세요.');
      return;
    }
    setLoading(true);
    setError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ baby_name: babyName, pin }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      setLoading(false);
    } else {
      window.location.href = '/';
    }
  }

  async function handleSignup() {
    if (!babyName.trim() || pin.length !== 4) {
      setError('아기 이름과 4자리 PIN을 입력해주세요.');
      return;
    }
    if (pin !== pinConfirm) {
      setError('PIN이 일치하지 않아요.');
      return;
    }
    setLoading(true);
    setError('');
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ baby_name: babyName, pin }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      setLoading(false);
    } else {
      window.location.href = '/';
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>
            <span className="animate-float" style={{ display: 'inline-block' }}>🪄</span>
          </div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700 }}>
            <span className="brand-text">출산/육아용품 체크리스트</span>
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '8px' }}>
            우리 아기 준비를 함께해요 💜
          </p>
        </div>

        {view === 'welcome' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              className="btn-primary"
              style={{ padding: '16px', fontSize: '1rem', borderRadius: '14px' }}
              onClick={() => setView('login')}
            >
              🔐 로그인
            </button>
            <button
              style={{
                padding: '16px', fontSize: '1rem', borderRadius: '14px',
                background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
                color: '#ffffff', fontWeight: 600, border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(168, 85, 247, 0.3)',
              }}
              onClick={() => setView('signup')}
            >
              ✨ 계정 만들기
            </button>
            <button
              className="btn-ghost"
              style={{ padding: '16px', fontSize: '0.95rem', borderRadius: '14px' }}
              onClick={() => (window.location.href = '/?mode=browse')}
            >
              👀 먼저 둘러보기
            </button>
          </div>
        )}

        {(view === 'login' || view === 'signup') && (
          <div className="card" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '24px', color: '#1e1b4b' }}>
              {view === 'login' ? '🔐 로그인' : '✨ 계정 만들기'}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#6b7280', display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                  아기 이름
                </label>
                <input
                  className="app-input"
                  placeholder="예) 하준, 서아..."
                  value={babyName}
                  onChange={(e) => setBabyName(e.target.value)}
                  autoFocus
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#6b7280', display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                  PIN 4자리
                </label>
                <input
                  className="app-input"
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="숫자 4자리"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  onKeyDown={(e) => e.key === 'Enter' && view === 'login' && handleLogin()}
                />
              </div>
              {view === 'signup' && (
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#6b7280', display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                    PIN 확인
                  </label>
                  <input
                    className="app-input"
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="PIN 다시 입력"
                    value={pinConfirm}
                    onChange={(e) => setPinConfirm(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    onKeyDown={(e) => e.key === 'Enter' && handleSignup()}
                  />
                </div>
              )}
              {error && (
                <p style={{
                  color: '#ef4444', fontSize: '0.82rem',
                  background: '#fef2f2', padding: '10px 12px',
                  borderRadius: '8px', border: '1px solid #fee2e2',
                }}>
                  {error}
                </p>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
              <button
                className="btn-ghost"
                style={{ flex: 1, padding: '11px' }}
                onClick={() => { setView('welcome'); resetForm(); }}
              >
                뒤로
              </button>
              <button
                className="btn-primary"
                style={{ flex: 2, padding: '11px' }}
                disabled={loading}
                onClick={view === 'login' ? handleLogin : handleSignup}
              >
                {loading ? '처리 중...' : view === 'login' ? '로그인' : '계정 만들기'}
              </button>
            </div>

            {view === 'login' && (
              <p style={{ textAlign: 'center', marginTop: '18px', fontSize: '0.8rem', color: '#9ca3af' }}>
                계정이 없으신가요?{' '}
                <button
                  style={{ color: '#7c3aed', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                  onClick={() => { setView('signup'); setPin(''); setError(''); }}
                >
                  계정 만들기
                </button>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
