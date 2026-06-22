'use client';

import { useState, useEffect, useCallback } from 'react';
import { Item, MainType, CheckMethod } from '@/lib/types';
import { BIRTH_SUBS, BIRTH_PERSONS, PARENTING_SUBS, CHECK_METHODS } from '@/lib/constants';
import { SAMPLE_ITEMS } from '@/lib/sampleData';
import ItemModal from './ItemModal';
import CheckModal from './CheckModal';
import SpendingModal from './SpendingModal';

type BirthSub = 'hospital' | 'postpartum';
type ParentingSub = 'eat' | 'play' | 'sleep' | 'wash' | 'poop' | 'outing' | 'parent';
type Person = 'mom' | 'baby';

function MethodBadge({ method }: { method: CheckMethod | null }) {
  if (!method) return null;
  const info = CHECK_METHODS.find((m) => m.value === method);
  if (!info) return null;
  const cls = method === 'purchase' ? 'badge-purchase' : method === 'daangn' ? 'badge-daangn' : method === 'gift' ? 'badge-gift' : 'badge-sharing';
  return <span className={`method-badge ${cls}`}>{info.icon} {info.label}</span>;
}

function ItemList({
  items,
  onCheckClick,
  onEditClick,
  onDeleteClick,
  readOnly,
}: {
  items: Item[];
  onCheckClick: (item: Item) => void;
  onEditClick: (item: Item) => void;
  onDeleteClick: (item: Item) => void;
  readOnly?: boolean;
}) {
  if (items.length === 0) {
    return (
      <div className="text-center py-10" style={{ color: '#d1d5db', fontSize: '0.875rem' }}>
        아직 준비물이 없어요
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {items.map((item) => (
        <div
          key={item.id}
          className={`item-row ${item.is_ready ? 'checked' : ''}`}
          onClick={readOnly ? undefined : () => onCheckClick(item)}
          style={{ cursor: readOnly ? 'default' : 'pointer' }}
        >
          <div className={`check-circle ${item.is_ready ? 'checked' : ''}`}>
            {item.is_ready && <span style={{ color: '#fff', fontSize: '12px' }}>✓</span>}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{
                fontSize: '0.9rem',
                fontWeight: 500,
                color: item.is_ready ? '#d1d5db' : '#1e1b4b',
                textDecoration: item.is_ready ? 'line-through' : 'none',
              }}>
                {item.name}
              </span>
              {!item.is_ready && item.priority > 0 && (
                <span style={{ fontSize: '0.7rem', letterSpacing: '-1px', color: '#f59e0b' }}>
                  {'★'.repeat(item.priority)}
                </span>
              )}
              {item.is_ready && <MethodBadge method={item.method} />}
            </div>
            {item.memo && (
              <p style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: '2px' }}>{item.memo}</p>
            )}
            {item.is_ready && item.price && (
              <p style={{ fontSize: '0.78rem', color: '#7c3aed', marginTop: '2px', fontWeight: 500 }}>
                {item.price.toLocaleString()}원{item.store ? ` · ${item.store}` : ''}
              </p>
            )}
            {item.is_ready && item.from_whom && (
              <p style={{ fontSize: '0.78rem', color: item.method === 'gift' ? '#a21caf' : '#16a34a', marginTop: '2px' }}>
                {item.method === 'gift' ? '선물' : '나눔'}: {item.from_whom}
              </p>
            )}
          </div>
          {!readOnly && (
            <div style={{ display: 'flex', gap: '6px' }} onClick={(e) => e.stopPropagation()}>
              <button className="btn-ghost" onClick={() => onEditClick(item)}>수정</button>
              <button className="btn-danger" onClick={() => onDeleteClick(item)}>삭제</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function MainClient({
  accountId,
  babyName,
  readOnly,
}: {
  accountId?: string;
  babyName?: string;
  readOnly?: boolean;
} = {}) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [mainTab, setMainTab] = useState<MainType>('birth');
  const [birthSub, setBirthSub] = useState<BirthSub>('hospital');
  const [parentingSub, setParentingSub] = useState<ParentingSub>('eat');
  const [person, setPerson] = useState<Person>('mom');

  const [itemModal, setItemModal] = useState<{
    open: boolean;
    mode: 'add' | 'edit';
    item?: Item;
    context?: { main: MainType; sub: string; person?: Person };
  }>({ open: false, mode: 'add' });

  const [checkModal, setCheckModal] = useState<{ open: boolean; item?: Item }>({ open: false });
  const [spendingModal, setSpendingModal] = useState(false);

  const fetchItems = useCallback(async () => {
    if (readOnly) {
      setItems(SAMPLE_ITEMS);
      setLoading(false);
      return;
    }
    setLoading(true);
    const res = await fetch('/api/items');
    const data = await res.json();
    setItems(data);
    setLoading(false);
  }, [readOnly]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  }

  function filterItems(main: MainType, sub: string, p?: Person) {
    const filtered = items.filter(
      (i) =>
        i.category_main === main &&
        i.category_sub === sub &&
        (p ? i.category_person === p : !i.category_person)
    );
    const incomplete = filtered.filter((i) => !i.is_ready).sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
    const complete = filtered.filter((i) => i.is_ready);
    return [...incomplete, ...complete];
  }

  function openAddModal(main: MainType, sub: string, p?: Person) {
    setItemModal({ open: true, mode: 'add', context: { main, sub, person: p } });
  }

  function openEditModal(item: Item) {
    setItemModal({ open: true, mode: 'edit', item });
  }

  async function handleItemSave(data: { name: string; memo: string; priority: number; category_main?: MainType; category_sub?: string; category_person?: string | null }) {
    if (itemModal.mode === 'add' && itemModal.context) {
      const { main, sub, person: p } = itemModal.context;
      await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category_main: main,
          category_sub: sub,
          category_person: p ?? null,
          name: data.name,
          memo: data.memo || null,
          priority: data.priority,
        }),
      });
    } else if (itemModal.mode === 'edit' && itemModal.item) {
      await fetch(`/api/items/${itemModal.item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          memo: data.memo || null,
          priority: data.priority,
          category_main: data.category_main,
          category_sub: data.category_sub,
          category_person: data.category_person ?? null,
        }),
      });
    }
    await fetchItems();
  }

  async function handleDelete(item: Item) {
    if (!confirm(`"${item.name}"을(를) 삭제할까요?`)) return;
    await fetch(`/api/items/${item.id}`, { method: 'DELETE' });
    await fetchItems();
  }

  async function handleStatusSave(
    itemId: string,
    data: { is_ready: boolean; method?: CheckMethod; price?: number; store?: string; from_whom?: string }
  ) {
    await fetch(`/api/status/${itemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    await fetchItems();
  }

  const currentTabItems =
    mainTab === 'birth'
      ? items.filter((i) => i.category_main === 'birth')
      : items.filter((i) => i.category_main === 'parenting');
  const tabDone = currentTabItems.filter((i) => i.is_ready).length;
  const tabTotal = currentTabItems.length;
  const tabPct = tabTotal === 0 ? 0 : Math.round((tabDone / tabTotal) * 100);
  const totalSpend = items
    .filter((i) => (i.method === 'purchase' || i.method === 'daangn') && i.price)
    .reduce((s, i) => s + (i.price ?? 0), 0);

  return (
    <div className="main-container" style={{
      padding: `40px 20px ${readOnly ? '88px' : '40px'}`,
    }}>

      {/* 헤더 */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <span className="animate-float">🪄</span>
          <span className="brand-text">
            {babyName ? `${babyName}의 체크리스트` : '출산/육아용품 체크리스트'}
          </span>
        </h1>
      </div>

      {/* 메인 탭 */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '28px' }}>
        {[
          { value: 'birth', label: '출산용품', icon: '🤰' },
          { value: 'parenting', label: '육아용품', icon: '👶' },
        ].map((tab) => (
          <button
            key={tab.value}
            className={`main-tab ${mainTab === tab.value ? 'active' : ''}`}
            onClick={() => setMainTab(tab.value as MainType)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* 진행률 + 지출 */}
      {items.length > 0 && (
        <div style={{ marginBottom: '28px', padding: '16px 20px', background: '#ffffff', borderRadius: '12px', border: '1px solid #ede9fe' }}>
          {tabTotal > 0 && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '10px' }}>
                <span style={{ color: '#7c3aed', fontWeight: 600 }}>{tabPct}% 준비 완료</span>
                <span style={{ color: '#6b7280' }}>{tabDone}/{tabTotal}</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${tabPct}%` }} />
              </div>
            </>
          )}
          <button
            onClick={() => setSpendingModal(true)}
            style={{
              marginTop: tabTotal > 0 ? '12px' : '0',
              display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '0.8rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              color: totalSpend > 0 ? '#7c3aed' : '#9ca3af',
            }}
          >
            <span>💰</span>
            <span>총 지출</span>
            <span style={{ fontWeight: 700 }}>{totalSpend.toLocaleString()}원</span>
            <span style={{ opacity: 0.4, fontSize: '0.7rem' }}>›</span>
          </button>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '64px 0', color: '#d1d5db', fontSize: '0.9rem' }}>
          불러오는 중...
        </div>
      ) : (
        <>
          {/* 출산용품 */}
          {mainTab === 'birth' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {BIRTH_SUBS.map((sub) => (
                <div key={sub.value} className="card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                    <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e1b4b' }}>
                      {sub.icon} {sub.label}
                    </h2>
                    <button
                      onClick={() => openAddModal('birth', sub.value, person)}
                      style={{
                        width: '30px', height: '30px', borderRadius: '50%',
                        background: '#ede9fe', color: '#7c3aed',
                        fontSize: '1.3rem', border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, lineHeight: 1, flexShrink: 0,
                      }}
                    >+</button>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                    {BIRTH_PERSONS.map((p) => {
                      const filtered = filterItems('birth', sub.value, p.value as Person);
                      const done = filtered.filter((i) => i.is_ready).length;
                      const total = filtered.length;
                      return (
                        <button
                          key={p.value}
                          className={`sub-tab ${birthSub === sub.value && person === p.value ? 'active' : ''}`}
                          onClick={() => {
                            setBirthSub(sub.value as BirthSub);
                            setPerson(p.value as Person);
                          }}
                        >
                          {p.icon} {p.label}
                          {total > 0 && birthSub === sub.value && person === p.value && (
                            <span style={{ marginLeft: '6px', opacity: 0.6, fontSize: '0.75rem' }}>
                              {done}/{total}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {BIRTH_PERSONS.map((p) => {
                    if (!(birthSub === sub.value && person === p.value)) return null;
                    const filtered = filterItems('birth', sub.value, p.value as Person);
                    return (
                      <div key={p.value}>
                        <ItemList
                          items={filtered}
                          onCheckClick={(item) => !readOnly && setCheckModal({ open: true, item })}
                          onEditClick={openEditModal}
                          onDeleteClick={handleDelete}
                          readOnly={readOnly}
                        />
                        {!readOnly && (
                          <button
                            className="add-btn"
                            onClick={() => openAddModal('birth', sub.value, p.value as Person)}
                          >
                            + 준비물 추가
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}

          {/* 육아용품 */}
          {mainTab === 'parenting' && (
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' as const, paddingBottom: '4px', flex: 1 }}>
                {PARENTING_SUBS.map((sub) => {
                  const filtered = filterItems('parenting', sub.value);
                  const done = filtered.filter((i) => i.is_ready).length;
                  const total = filtered.length;
                  return (
                    <button
                      key={sub.value}
                      className={`sub-tab ${parentingSub === sub.value ? 'active' : ''}`}
                      style={{ flexShrink: 0 }}
                      onClick={() => setParentingSub(sub.value as ParentingSub)}
                    >
                      {sub.icon} {sub.label}
                      {total > 0 && parentingSub === sub.value && (
                        <span style={{ marginLeft: '6px', opacity: 0.6, fontSize: '0.75rem' }}>
                          {done}/{total}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              {!readOnly && (
                <button
                  onClick={() => openAddModal('parenting', parentingSub)}
                  style={{
                    width: '30px', height: '30px', borderRadius: '50%',
                    background: '#ede9fe', color: '#7c3aed',
                    fontSize: '1.3rem', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, lineHeight: 1, flexShrink: 0,
                  }}
                >+</button>
              )}
              </div>

              {PARENTING_SUBS.map((sub) => {
                if (parentingSub !== sub.value) return null;
                const filtered = filterItems('parenting', sub.value);
                return (
                  <div key={sub.value}>
                    <ItemList
                      items={filtered}
                      onCheckClick={(item) => !readOnly && setCheckModal({ open: true, item })}
                      onEditClick={openEditModal}
                      onDeleteClick={handleDelete}
                      readOnly={readOnly}
                    />
                    {!readOnly && (
                      <button
                        className="add-btn"
                        onClick={() => openAddModal('parenting', sub.value)}
                      >
                        + 준비물 추가
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {itemModal.open && (
        <ItemModal
          mode={itemModal.mode}
          item={itemModal.item}
          onClose={() => setItemModal({ open: false, mode: 'add' })}
          onSave={handleItemSave}
        />
      )}

      {checkModal.open && checkModal.item && (
        <CheckModal
          item={checkModal.item}
          onClose={() => setCheckModal({ open: false })}
          onSave={handleStatusSave}
        />
      )}

      {spendingModal && (
        <SpendingModal
          items={items}
          onClose={() => setSpendingModal(false)}
        />
      )}

      {/* FAB */}
      {!readOnly && (
        <button
          onClick={() => {
            if (mainTab === 'birth') openAddModal('birth', birthSub, person);
            else openAddModal('parenting', parentingSub);
          }}
          style={{
            position: 'fixed',
            bottom: '28px',
            right: '24px',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: '#7c3aed',
            color: '#ffffff',
            fontSize: '1.8rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(124, 58, 237, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 30,
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.08)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 24px rgba(124, 58, 237, 0.5)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 20px rgba(124, 58, 237, 0.4)';
          }}
        >+</button>
      )}

      {/* 로그아웃 */}
      {!readOnly && (
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button
            onClick={handleLogout}
            className="btn-ghost"
            style={{ fontSize: '0.8rem', padding: '8px 20px', color: '#9ca3af' }}
          >
            로그아웃
          </button>
        </div>
      )}

      {/* 둘러보기 모드 배너 */}
      {readOnly && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#1e1b4b',
          color: '#ffffff',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 40,
          fontSize: '0.85rem',
        }}>
          <span>👀 둘러보기 중이에요</span>
          <button
            onClick={() => (window.location.href = '/')}
            style={{
              background: '#7c3aed',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 16px',
              fontSize: '0.8rem',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            로그인 / 계정 만들기
          </button>
        </div>
      )}
    </div>
  );
}
