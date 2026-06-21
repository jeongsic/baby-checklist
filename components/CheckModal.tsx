'use client';

import { useState } from 'react';
import { Item, CheckMethod } from '@/lib/types';
import { CHECK_METHODS } from '@/lib/constants';

interface Props {
  item: Item;
  onClose: () => void;
  onSave: (itemId: string, data: {
    is_ready: boolean;
    method?: CheckMethod;
    price?: number;
    from_whom?: string;
  }) => Promise<void>;
}

export default function CheckModal({ item, onClose, onSave }: Props) {
  const [isReady, setIsReady] = useState(!!item.is_ready);
  const [method, setMethod] = useState<CheckMethod | null>(item.method ?? null);
  const [price, setPrice] = useState(item.price?.toString() ?? '');
  const [fromWhom, setFromWhom] = useState(item.from_whom ?? '');
  const [saving, setSaving] = useState(false);

  const selectedMethodInfo = CHECK_METHODS.find((m) => m.value === method);

  async function handleSave() {
    setSaving(true);
    await onSave(item.id, {
      is_ready: isReady,
      method: isReady ? (method ?? undefined) : undefined,
      price: isReady && selectedMethodInfo?.hasPrice && price ? Number(price) : undefined,
      from_whom: isReady && selectedMethodInfo?.hasFromWhom && fromWhom ? fromWhom : undefined,
    });
    setSaving(false);
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <p style={{ fontSize: '0.78rem', color: '#9ca3af', marginBottom: '4px' }}>준비 상태 업데이트</p>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e1b4b' }}>{item.name}</h3>
          </div>
          <button
            onClick={onClose}
            style={{ color: '#9ca3af', fontSize: '1.2rem', lineHeight: 1, background: 'none', border: 'none', cursor: 'pointer' }}
          >✕</button>
        </div>

        {/* 준비 여부 토글 */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
          <button
            style={{
              flex: 1, padding: '12px', borderRadius: '10px', fontWeight: 600, fontSize: '0.9rem',
              border: !isReady ? '2px solid #7c3aed' : '2px solid #e5e7eb',
              background: !isReady ? '#ede9fe' : '#fafafa',
              color: !isReady ? '#7c3aed' : '#9ca3af',
              cursor: 'pointer', transition: 'all 0.15s',
            }}
            onClick={() => setIsReady(false)}
          >
            미준비
          </button>
          <button
            style={{
              flex: 1, padding: '12px', borderRadius: '10px', fontWeight: 600, fontSize: '0.9rem',
              border: isReady ? '2px solid #7c3aed' : '2px solid #e5e7eb',
              background: isReady ? '#7c3aed' : '#fafafa',
              color: isReady ? '#ffffff' : '#9ca3af',
              cursor: 'pointer', transition: 'all 0.15s',
            }}
            onClick={() => setIsReady(true)}
          >
            ✓ 준비 완료
          </button>
        </div>

        {/* 방법 선택 */}
        {isReady && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 500 }}>어떻게 준비했나요?</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              {CHECK_METHODS.map((m) => (
                <button
                  key={m.value}
                  className={`method-btn ${method === m.value ? 'selected' : ''}`}
                  onClick={() => setMethod(m.value)}
                >
                  <div style={{ fontSize: '1.3rem', marginBottom: '4px' }}>{m.icon}</div>
                  <div>{m.label}</div>
                </button>
              ))}
            </div>

            {method && selectedMethodInfo?.hasPrice && (
              <div>
                <label style={{ fontSize: '0.8rem', color: '#6b7280', display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                  가격
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    className="app-input"
                    style={{ paddingRight: '36px' }}
                    placeholder="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                  <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '0.875rem' }}>원</span>
                </div>
              </div>
            )}

            {method && selectedMethodInfo?.hasFromWhom && (
              <div>
                <label style={{ fontSize: '0.8rem', color: '#6b7280', display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                  누구에게 나눔받았나요?
                </label>
                <input
                  type="text"
                  className="app-input"
                  placeholder="예) 언니, 친구 홍길동"
                  value={fromWhom}
                  onChange={(e) => setFromWhom(e.target.value)}
                />
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
          <button className="btn-ghost" style={{ flex: 1, padding: '10px' }} onClick={onClose}>
            취소
          </button>
          <button
            className="btn-primary"
            style={{ flex: 1, padding: '10px', textAlign: 'center' }}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </div>
  );
}
