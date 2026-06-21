'use client';

import { useState } from 'react';
import { Item } from '@/lib/types';

interface Props {
  mode: 'add' | 'edit';
  item?: Item;
  onClose: () => void;
  onSave: (data: { name: string; memo: string }) => Promise<void>;
}

export default function ItemModal({ mode, item, onClose, onSave }: Props) {
  const [name, setName] = useState(item?.name ?? '');
  const [memo, setMemo] = useState(item?.memo ?? '');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    await onSave({ name: name.trim(), memo: memo.trim() });
    setSaving(false);
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e1b4b' }}>
            {mode === 'add' ? '준비물 추가' : '준비물 수정'}
          </h3>
          <button
            onClick={onClose}
            style={{ color: '#9ca3af', fontSize: '1.2rem', lineHeight: 1, background: 'none', border: 'none', cursor: 'pointer' }}
          >✕</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: '#6b7280', display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              준비물 이름 *
            </label>
            <input
              type="text"
              className="app-input"
              placeholder="예) 산모 패드, 속싸개, 젖병..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              autoFocus
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: '#6b7280', display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              메모 (선택)
            </label>
            <input
              type="text"
              className="app-input"
              placeholder="예) 5개 필요, 특정 브랜드 구매 예정..."
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
          <button className="btn-ghost" style={{ flex: 1, padding: '10px' }} onClick={onClose}>
            취소
          </button>
          <button
            className="btn-primary"
            style={{ flex: 1, padding: '10px', textAlign: 'center' }}
            onClick={handleSave}
            disabled={saving || !name.trim()}
          >
            {saving ? '저장 중...' : mode === 'add' ? '추가' : '저장'}
          </button>
        </div>
      </div>
    </div>
  );
}
