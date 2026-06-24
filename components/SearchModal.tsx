'use client';

import { useState, useRef, useEffect } from 'react';
import { Item, CheckMethod } from '@/lib/types';
import { BIRTH_SUBS, PARENTING_SUBS, CHECK_METHODS } from '@/lib/constants';

interface Props {
  items: Item[];
  onClose: () => void;
  onCheckClick: (item: Item) => void;
  onEditClick: (item: Item) => void;
  readOnly?: boolean;
}

function getCategoryLabel(item: Item): string {
  if (item.category_main === 'todo') return '✅ 해야할 일';
  if (item.category_main === 'birth') {
    const sub = BIRTH_SUBS.find((s) => s.value === item.category_sub);
    const person =
      item.category_person === 'mom' ? '👩 엄마' :
      item.category_person === 'dad' ? '👨 아빠' :
      item.category_person === 'baby' ? '👶 아기' : '';
    return `🤰 ${sub?.label ?? '출산용품'}${person ? ' · ' + person : ''}`;
  }
  if (item.category_main === 'parenting') {
    const sub = PARENTING_SUBS.find((s) => s.value === item.category_sub);
    return `👶 ${sub?.label ?? '육아용품'}`;
  }
  return '';
}

function highlight(text: string, query: string) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark style={{ background: '#ede9fe', color: '#7c3aed', borderRadius: '2px', padding: '0 1px' }}>
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export default function SearchModal({ items, onClose, onCheckClick, onEditClick, readOnly }: Props) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = query.trim()
    ? items.filter(
        (i) =>
          i.name.toLowerCase().includes(query.toLowerCase()) ||
          (i.memo ?? '').toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex', flexDirection: 'column',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '0 0 20px 20px',
          padding: '16px 16px 20px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.1rem', color: '#7c3aed' }}>🔍</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="항목 이름으로 검색..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1, fontSize: '1rem', border: 'none', outline: 'none',
              color: '#1e1b4b', background: 'transparent',
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{ color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', padding: '2px 4px' }}
            >✕</button>
          )}
          <button
            onClick={onClose}
            style={{ color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500 }}
          >닫기</button>
        </div>
      </div>

      {/* 결과 */}
      <div
        style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {!query.trim() && (
          <p style={{ textAlign: 'center', color: '#d1d5db', fontSize: '0.9rem', marginTop: '40px' }}>
            검색어를 입력하세요
          </p>
        )}

        {query.trim() && results.length === 0 && (
          <p style={{ textAlign: 'center', color: '#d1d5db', fontSize: '0.9rem', marginTop: '40px' }}>
            "{query}"에 해당하는 항목이 없어요
          </p>
        )}

        {results.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {results.map((item) => {
              const isTodo = item.category_main === 'todo';
              const methodInfo = CHECK_METHODS.find((m) => m.value === item.method);
              return (
                <div
                  key={item.id}
                  style={{
                    background: '#fff',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                    border: item.is_ready ? '1px solid #e5e7eb' : '1px solid #ede9fe',
                    cursor: readOnly ? 'default' : 'pointer',
                    opacity: item.is_ready ? 0.7 : 1,
                  }}
                  onClick={() => !readOnly && onCheckClick(item)}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div
                      style={{
                        width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0, marginTop: '1px',
                        border: item.is_ready ? 'none' : '2px solid #c4b5fd',
                        background: item.is_ready ? '#7c3aed' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      {item.is_ready && <span style={{ color: '#fff', fontSize: '11px' }}>✓</span>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <span style={{
                          fontSize: '0.9rem', fontWeight: 500,
                          color: item.is_ready ? '#9ca3af' : '#1e1b4b',
                          textDecoration: item.is_ready ? 'line-through' : 'none',
                        }}>
                          {highlight(item.name, query)}
                        </span>
                        {!item.is_ready && item.priority > 0 && (
                          <span style={{ fontSize: '0.7rem', color: '#f59e0b', letterSpacing: '-1px' }}>
                            {'★'.repeat(item.priority)}
                          </span>
                        )}
                        {item.is_ready && isTodo && (
                          <span style={{ fontSize: '0.72rem', color: '#7c3aed', fontWeight: 500 }}>완료</span>
                        )}
                        {item.is_ready && !isTodo && methodInfo && (
                          <span style={{ fontSize: '0.72rem', color: '#6b7280' }}>{methodInfo.icon} {methodInfo.label}</span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.73rem', color: '#a78bfa', marginTop: '3px' }}>
                        {getCategoryLabel(item)}
                      </div>
                      {item.memo && (
                        <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '2px' }}>
                          {highlight(item.memo, query)}
                        </div>
                      )}
                    </div>
                    {!readOnly && (
                      <button
                        style={{ color: '#9ca3af', fontSize: '0.78rem', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, padding: '2px 4px' }}
                        onClick={(e) => { e.stopPropagation(); onEditClick(item); onClose(); }}
                      >수정</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
