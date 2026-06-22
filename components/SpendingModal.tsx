'use client';

import { Item } from '@/lib/types';
import { BIRTH_SUBS, BIRTH_PERSONS, PARENTING_SUBS } from '@/lib/constants';

interface Props {
  items: Item[];
  onClose: () => void;
}

function calcSpend(arr: Item[]) {
  return arr
    .filter((i) => (i.method === 'purchase' || i.method === 'daangn') && i.price)
    .reduce((s, i) => s + (i.price ?? 0), 0);
}

function Amt({ n, bold }: { n: number; bold?: boolean }) {
  return (
    <span style={{ color: n > 0 ? '#1e1b4b' : '#d1d5db', fontWeight: bold ? 700 : n > 0 ? 500 : 400 }}>
      {n.toLocaleString()}원
    </span>
  );
}

export default function SpendingModal({ items, onClose }: Props) {
  const birthItems = items.filter((i) => i.category_main === 'birth');
  const parentingItems = items.filter((i) => i.category_main === 'parenting');
  const birthTotal = calcSpend(birthItems);
  const parentingTotal = calcSpend(parentingItems);
  const grandTotal = birthTotal + parentingTotal;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-box"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: '80vh', overflowY: 'auto' }}
      >
        {/* 헤더 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e1b4b' }}>💰 지출 내역</h3>
          <button
            onClick={onClose}
            style={{ color: '#9ca3af', fontSize: '1.2rem', background: 'none', border: 'none', cursor: 'pointer' }}
          >✕</button>
        </div>

        {/* 출산용품 */}
        <section style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#7c3aed', marginBottom: '14px' }}>
            📦 출산용품
          </div>
          {BIRTH_SUBS.map((sub) => {
            const subItems = birthItems.filter((i) => i.category_sub === sub.value);
            const subTotal = calcSpend(subItems);
            return (
              <div key={sub.value} style={{ marginBottom: '14px', paddingLeft: '8px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '8px' }}>
                  {sub.icon} {sub.label}
                </div>
                {BIRTH_PERSONS.map((p) => {
                  const pItems = subItems.filter((i) => i.category_person === p.value);
                  return (
                    <div
                      key={p.value}
                      style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '12px', marginBottom: '4px', fontSize: '0.8rem', color: '#6b7280' }}
                    >
                      <span>{p.icon} {p.label}</span>
                      <Amt n={calcSpend(pItems)} />
                    </div>
                  );
                })}
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  paddingLeft: '12px', marginTop: '8px', paddingTop: '8px',
                  borderTop: '1px solid #f3f4f6',
                  fontSize: '0.8rem', fontWeight: 600,
                }}>
                  <span style={{ color: '#374151' }}>소계</span>
                  <span style={{ color: subTotal > 0 ? '#7c3aed' : '#d1d5db' }}>{subTotal.toLocaleString()}원</span>
                </div>
              </div>
            );
          })}
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            padding: '10px 12px', background: '#f5f3ff',
            borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, color: '#7c3aed',
          }}>
            <span>출산용품 소계</span>
            <span>{birthTotal.toLocaleString()}원</span>
          </div>
        </section>

        <div style={{ height: '1px', background: '#e5e7eb', margin: '4px 0 20px' }} />

        {/* 육아용품 */}
        <section style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#7c3aed', marginBottom: '14px' }}>
            👶 육아용품
          </div>
          <div style={{ paddingLeft: '8px', marginBottom: '12px' }}>
            {PARENTING_SUBS.map((sub) => {
              const subItems = parentingItems.filter((i) => i.category_sub === sub.value);
              return (
                <div
                  key={sub.value}
                  style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.8rem', color: '#6b7280' }}
                >
                  <span>{sub.icon} {sub.label}</span>
                  <Amt n={calcSpend(subItems)} />
                </div>
              );
            })}
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            padding: '10px 12px', background: '#f5f3ff',
            borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, color: '#7c3aed',
          }}>
            <span>육아용품 소계</span>
            <span>{parentingTotal.toLocaleString()}원</span>
          </div>
        </section>

        {/* 전체 합계 */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          padding: '14px 16px', background: '#7c3aed',
          borderRadius: '12px', fontSize: '0.95rem', fontWeight: 700, color: '#ffffff',
        }}>
          <span>전체 합계</span>
          <Amt n={grandTotal} bold />
        </div>
      </div>
    </div>
  );
}
