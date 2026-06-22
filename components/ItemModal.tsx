'use client';

import { useState } from 'react';
import { Item, MainType } from '@/lib/types';
import { BIRTH_SUBS, BIRTH_PERSONS, PARENTING_SUBS, TODO_PERSONS } from '@/lib/constants';

interface SaveData {
  name: string;
  memo: string;
  priority: number;
  category_main?: MainType;
  category_sub?: string;
  category_person?: string | null;
}

interface Props {
  mode: 'add' | 'edit';
  item?: Item;
  babyName?: string;
  context?: { main: MainType; sub: string; person?: string };
  onClose: () => void;
  onSave: (data: SaveData) => Promise<void>;
}

const SEL_STYLE = (active: boolean) => ({
  padding: '6px 12px',
  borderRadius: '8px',
  fontSize: '0.8rem',
  fontWeight: active ? 600 : 400,
  background: active ? '#ede9fe' : '#f9fafb',
  color: active ? '#7c3aed' : '#6b7280',
  border: `1px solid ${active ? '#c4b5fd' : '#e5e7eb'}`,
  cursor: 'pointer' as const,
});

export default function ItemModal({ mode, item, babyName, context, onClose, onSave }: Props) {
  const [name, setName] = useState(item?.name ?? '');
  const [memo, setMemo] = useState(item?.memo ?? '');
  const [priority, setPriority] = useState(item?.priority ?? 0);
  const [catMain, setCatMain] = useState<MainType>(item?.category_main ?? 'birth');
  const [catSub, setCatSub] = useState<string>(item?.category_sub ?? 'hospital');
  const [catPerson, setCatPerson] = useState<string | null>(item?.category_person ?? null);
  const [saving, setSaving] = useState(false);

  const isTodoItem = mode === 'edit' ? catMain === 'todo' : context?.main === 'todo';

  function handleMainChange(main: MainType) {
    setCatMain(main);
    if (main === 'birth') {
      setCatSub('hospital');
      setCatPerson('mom');
    } else if (main === 'parenting') {
      setCatSub('eat');
      setCatPerson(null);
    } else {
      setCatSub('todo');
      setCatPerson(null);
    }
  }

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    const saveData: SaveData = { name: name.trim(), memo: memo.trim(), priority };
    if (mode === 'edit') {
      saveData.category_main = catMain;
      saveData.category_sub = catMain === 'todo' ? 'todo' : catSub;
      saveData.category_person = catMain === 'birth' ? catPerson : catMain === 'todo' ? catPerson : null;
    } else if (isTodoItem) {
      saveData.category_person = catPerson;
    }
    await onSave(saveData);
    setSaving(false);
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e1b4b' }}>
            {isTodoItem
              ? mode === 'add' ? '할 일 추가' : '할 일 수정'
              : mode === 'add' ? '준비물 추가' : '준비물 수정'}
          </h3>
          <button
            onClick={onClose}
            style={{ color: '#9ca3af', fontSize: '1.2rem', lineHeight: 1, background: 'none', border: 'none', cursor: 'pointer' }}
          >✕</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: '#6b7280', display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              {isTodoItem ? '할 일 이름 *' : '준비물 이름 *'}
            </label>
            <input
              type="text"
              className="app-input"
              placeholder={isTodoItem ? '예) 커튼 세탁, 세탁기 청소...' : '예) 산모 패드, 속싸개, 젖병...'}
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

          <div>
            <label style={{ fontSize: '0.8rem', color: '#6b7280', display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              중요도 <span style={{ color: '#d1d5db', fontWeight: 400 }}>(선택 · 높을수록 상단 노출)</span>
            </label>
            <div style={{ display: 'flex', gap: '4px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setPriority(priority === star ? 0 : star)}
                  style={{
                    fontSize: '1.6rem',
                    lineHeight: 1,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '2px 4px',
                    color: star <= priority ? '#f59e0b' : '#d1d5db',
                    transition: 'color 0.15s',
                  }}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* 담당 — 해야할일 추가/수정 시 */}
          {isTodoItem && (
            <div>
              <label style={{ fontSize: '0.8rem', color: '#6b7280', display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                담당 <span style={{ color: '#d1d5db', fontWeight: 400 }}>(선택)</span>
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {TODO_PERSONS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    style={SEL_STYLE(catPerson === p.value)}
                    onClick={() => setCatPerson(catPerson === p.value ? null : p.value)}
                  >
                    {p.icon} {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {mode === 'edit' && (
            <div>
              <label style={{ fontSize: '0.8rem', color: '#6b7280', display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                분류 변경
              </label>

              {/* 대분류 */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                {([
                  { value: 'birth', label: '🤰 출산용품' },
                  { value: 'parenting', label: '👶 육아용품' },
                  { value: 'todo', label: '✅ 해야할 일' },
                ] as { value: MainType; label: string }[]).map((opt) => (
                  <button key={opt.value} type="button" style={SEL_STYLE(catMain === opt.value)} onClick={() => handleMainChange(opt.value)}>
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* 소분류 — 해야할일이 아닐 때만 */}
              {catMain !== 'todo' && (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: catMain === 'birth' ? '8px' : '0' }}>
                  {(catMain === 'birth' ? BIRTH_SUBS : PARENTING_SUBS).map((sub) => (
                    <button key={sub.value} type="button" style={SEL_STYLE(catSub === sub.value)} onClick={() => setCatSub(sub.value)}>
                      {sub.icon} {sub.label}
                    </button>
                  ))}
                </div>
              )}

              {/* 산모/아기 (출산용품만) */}
              {catMain === 'birth' && (
                <div style={{ display: 'flex', gap: '6px' }}>
                  {BIRTH_PERSONS.map((p) => (
                    <button key={p.value} type="button" style={SEL_STYLE(catPerson === p.value)} onClick={() => setCatPerson(p.value)}>
                      {p.icon} {p.value === 'baby' && babyName ? babyName : p.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
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
            {saving ? '저장 중...' : mode === 'add' ? (isTodoItem ? '추가' : '추가') : '저장'}
          </button>
        </div>
      </div>
    </div>
  );
}
