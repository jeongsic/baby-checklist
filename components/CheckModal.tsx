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
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-xs text-purple-300/50 mb-1">준비 상태 업데이트</p>
            <h3 className="text-lg font-semibold text-purple-100">{item.name}</h3>
          </div>
          <button onClick={onClose} className="text-purple-400/50 hover:text-purple-300 text-xl leading-none">✕</button>
        </div>

        {/* 준비 여부 토글 */}
        <div className="flex gap-3 mb-6">
          <button
            className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all border ${
              !isReady
                ? 'bg-purple-900/40 border-purple-500/40 text-purple-300'
                : 'bg-transparent border-purple-700/20 text-purple-500/40'
            }`}
            onClick={() => setIsReady(false)}
          >
            아직 미준비
          </button>
          <button
            className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all border ${
              isReady
                ? 'border-yellow-400/50 text-yellow-300'
                : 'bg-transparent border-purple-700/20 text-purple-500/40'
            }`}
            style={isReady ? { background: 'linear-gradient(135deg, #78350f, #92400e)' } : {}}
            onClick={() => setIsReady(true)}
          >
            ✨ 준비 완료
          </button>
        </div>

        {/* 방법 선택 (준비됨일 때만) */}
        {isReady && (
          <div className="space-y-4">
            <p className="text-xs text-purple-300/60 font-medium">어떻게 준비했나요?</p>
            <div className="flex gap-2">
              {CHECK_METHODS.map((m) => (
                <button
                  key={m.value}
                  className={`method-btn ${method === m.value ? 'selected' : ''}`}
                  onClick={() => setMethod(m.value)}
                >
                  <div className="text-lg mb-1">{m.icon}</div>
                  <div>{m.label}</div>
                </button>
              ))}
            </div>

            {/* 가격 입력 (구매/당근) */}
            {method && selectedMethodInfo?.hasPrice && (
              <div>
                <label className="text-xs text-purple-300/60 block mb-2">가격</label>
                <div className="relative">
                  <input
                    type="number"
                    className="genie-input pr-10"
                    placeholder="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400/50 text-sm">원</span>
                </div>
              </div>
            )}

            {/* 나눔자 입력 */}
            {method && selectedMethodInfo?.hasFromWhom && (
              <div>
                <label className="text-xs text-purple-300/60 block mb-2">누구에게 나눔받았나요?</label>
                <input
                  type="text"
                  className="genie-input"
                  placeholder="예) 언니, 친구 홍길동"
                  value={fromWhom}
                  onChange={(e) => setFromWhom(e.target.value)}
                />
              </div>
            )}
          </div>
        )}

        {/* 저장 버튼 */}
        <div className="flex gap-3 mt-6">
          <button className="btn-ghost flex-1 py-2 text-center" onClick={onClose}>
            취소
          </button>
          <button
            className="btn-primary flex-1 py-2 text-center"
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
