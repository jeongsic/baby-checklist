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
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold gold-text">
            {mode === 'add' ? '✨ 준비물 추가' : '준비물 수정'}
          </h3>
          <button onClick={onClose} className="text-purple-400/50 hover:text-purple-300 text-xl leading-none">✕</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-purple-300/60 block mb-2">준비물 이름 *</label>
            <input
              type="text"
              className="genie-input"
              placeholder="예) 산모 패드, 속싸개, 젖병..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              autoFocus
            />
          </div>

          <div>
            <label className="text-xs text-purple-300/60 block mb-2">메모 (선택)</label>
            <input
              type="text"
              className="genie-input"
              placeholder="예) 5개 필요, 특정 브랜드 구매 예정..."
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button className="btn-ghost flex-1 py-2 text-center" onClick={onClose}>
            취소
          </button>
          <button
            className="btn-primary flex-1 py-2 text-center"
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
