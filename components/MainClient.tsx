'use client';

import { useState, useEffect, useCallback } from 'react';
import { Item, MainType, CheckMethod } from '@/lib/types';
import { BIRTH_SUBS, BIRTH_PERSONS, PARENTING_SUBS, CHECK_METHODS } from '@/lib/constants';
import ItemModal from './ItemModal';
import CheckModal from './CheckModal';

type BirthSub = 'hospital' | 'postpartum';
type ParentingSub = 'eat' | 'play' | 'sleep';
type Person = 'mom' | 'baby';

function ProgressBadge({ items }: { items: Item[] }) {
  const done = items.filter((i) => i.is_ready).length;
  const total = items.length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <span className="text-xs text-purple-400/60">
      {done}/{total} ({pct}%)
    </span>
  );
}

function MethodBadge({ method }: { method: CheckMethod | null }) {
  if (!method) return null;
  const info = CHECK_METHODS.find((m) => m.value === method);
  if (!info) return null;
  const cls = method === 'purchase' ? 'badge-purchase' : method === 'daangn' ? 'badge-daangn' : 'badge-sharing';
  return <span className={`method-badge ${cls}`}>{info.icon} {info.label}</span>;
}

function ItemList({
  items,
  onCheckClick,
  onEditClick,
  onDeleteClick,
}: {
  items: Item[];
  onCheckClick: (item: Item) => void;
  onEditClick: (item: Item) => void;
  onDeleteClick: (item: Item) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-purple-400/30 text-sm">
        아직 준비물이 없어요. 추가해보세요 ✨
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div
          key={item.id}
          className={`item-row ${item.is_ready ? 'checked' : ''}`}
          onClick={() => onCheckClick(item)}
        >
          <div className={`check-circle ${item.is_ready ? 'checked' : ''}`}>
            {item.is_ready && <span className="text-white text-xs">✓</span>}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-sm font-medium ${item.is_ready ? 'line-through text-purple-300/40' : 'text-purple-100'}`}
              >
                {item.name}
              </span>
              {item.is_ready && <MethodBadge method={item.method} />}
            </div>
            {item.memo && (
              <p className="text-xs text-purple-400/40 mt-0.5 truncate">{item.memo}</p>
            )}
            {item.is_ready && item.price && (
              <p className="text-xs text-yellow-500/50 mt-0.5">
                {item.price.toLocaleString()}원
              </p>
            )}
            {item.is_ready && item.from_whom && (
              <p className="text-xs text-green-400/50 mt-0.5">나눔: {item.from_whom}</p>
            )}
          </div>
          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
            <button className="btn-ghost" onClick={() => onEditClick(item)}>수정</button>
            <button className="btn-danger" onClick={() => onDeleteClick(item)}>삭제</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MainClient() {
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

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/items');
    const data = await res.json();
    setItems(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  function filterItems(main: MainType, sub: string, p?: Person) {
    return items.filter(
      (i) =>
        i.category_main === main &&
        i.category_sub === sub &&
        (p ? i.category_person === p : !i.category_person)
    );
  }

  function openAddModal(main: MainType, sub: string, p?: Person) {
    setItemModal({ open: true, mode: 'add', context: { main, sub, person: p } });
  }

  function openEditModal(item: Item) {
    setItemModal({ open: true, mode: 'edit', item });
  }

  async function handleItemSave(data: { name: string; memo: string }) {
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
        }),
      });
    } else if (itemModal.mode === 'edit' && itemModal.item) {
      await fetch(`/api/items/${itemModal.item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.name, memo: data.memo || null }),
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
    data: { is_ready: boolean; method?: CheckMethod; price?: number; from_whom?: string }
  ) {
    await fetch(`/api/status/${itemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    await fetchItems();
  }

  function calcProgress(filtered: Item[]) {
    const done = filtered.filter((i) => i.is_ready).length;
    return { done, total: filtered.length };
  }

  // 현재 탭 전체 진행률
  const currentTabItems =
    mainTab === 'birth'
      ? items.filter((i) => i.category_main === 'birth')
      : items.filter((i) => i.category_main === 'parenting');
  const { done: tabDone, total: tabTotal } = calcProgress(currentTabItems);
  const tabPct = tabTotal === 0 ? 0 : Math.round((tabDone / tabTotal) * 100);

  return (
    <div className="relative z-10 max-w-2xl mx-auto px-4 py-8 min-h-screen">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold gold-text flex items-center justify-center gap-2">
          <span className="animate-float">🪄</span>
          출산/육아용품 체크리스트
        </h1>
      </div>

      {/* 메인 탭 */}
      <div className="flex gap-2 justify-center mb-6">
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

      {/* 탭 전체 진행률 */}
      {tabTotal > 0 && (
        <div className="mb-6">
          <div className="flex justify-between text-xs text-purple-400/50 mb-2">
            <span>{tabDone}/{tabTotal} 준비 완료</span>
            <span>{tabPct}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${tabPct}%` }} />
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 text-purple-400/40 text-sm">
          <div className="text-3xl mb-3 animate-twinkle">✨</div>
          불러오는 중...
        </div>
      ) : (
        <>
          {/* 출산용품 탭 */}
          {mainTab === 'birth' && (
            <div className="space-y-6">
              {BIRTH_SUBS.map((sub) => (
                <div key={sub.value} className="genie-card p-5">
                  <h2 className="text-base font-semibold text-purple-200 mb-4">
                    {sub.icon} {sub.label}
                  </h2>

                  {/* 산모/아기 서브탭 */}
                  <div className="flex gap-2 mb-4">
                    {BIRTH_PERSONS.map((p) => {
                      const filtered = filterItems('birth', sub.value, p.value as Person);
                      const { done, total } = calcProgress(filtered);
                      return (
                        <button
                          key={p.value}
                          className={`sub-tab ${
                            birthSub === sub.value && person === p.value ? 'active' : ''
                          }`}
                          onClick={() => {
                            setBirthSub(sub.value as BirthSub);
                            setPerson(p.value as Person);
                          }}
                        >
                          {p.icon} {p.label}
                          {total > 0 && (
                            <span className="ml-1 opacity-60 text-xs">
                              {done}/{total}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* 현재 선택된 섹션 아이템 */}
                  {BIRTH_PERSONS.map((p) => {
                    if (!(birthSub === sub.value && person === p.value)) return null;
                    const filtered = filterItems('birth', sub.value, p.value as Person);
                    return (
                      <div key={p.value}>
                        <ItemList
                          items={filtered}
                          onCheckClick={(item) => setCheckModal({ open: true, item })}
                          onEditClick={openEditModal}
                          onDeleteClick={handleDelete}
                        />
                        <button
                          className="mt-3 w-full py-2.5 rounded-xl border border-dashed border-purple-600/30 text-purple-400/50 text-sm hover:border-purple-500/50 hover:text-purple-300/70 transition-all"
                          onClick={() => openAddModal('birth', sub.value, p.value as Person)}
                        >
                          + 준비물 추가
                        </button>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}

          {/* 육아용품 탭 */}
          {mainTab === 'parenting' && (
            <div className="genie-card p-5">
              {/* 먹/놀/잠 탭 */}
              <div className="flex gap-2 mb-5">
                {PARENTING_SUBS.map((sub) => {
                  const filtered = filterItems('parenting', sub.value);
                  const { done, total } = calcProgress(filtered);
                  return (
                    <button
                      key={sub.value}
                      className={`sub-tab ${parentingSub === sub.value ? 'active' : ''}`}
                      onClick={() => setParentingSub(sub.value as ParentingSub)}
                    >
                      {sub.icon} {sub.label}
                      {total > 0 && (
                        <span className="ml-1 opacity-60 text-xs">
                          {done}/{total}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {PARENTING_SUBS.map((sub) => {
                if (parentingSub !== sub.value) return null;
                const filtered = filterItems('parenting', sub.value);
                return (
                  <div key={sub.value}>
                    <ItemList
                      items={filtered}
                      onCheckClick={(item) => setCheckModal({ open: true, item })}
                      onEditClick={openEditModal}
                      onDeleteClick={handleDelete}
                    />
                    <button
                      className="mt-3 w-full py-2.5 rounded-xl border border-dashed border-purple-600/30 text-purple-400/50 text-sm hover:border-purple-500/50 hover:text-purple-300/70 transition-all"
                      onClick={() => openAddModal('parenting', sub.value)}
                    >
                      + 준비물 추가
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* 아이템 추가/수정 모달 */}
      {itemModal.open && (
        <ItemModal
          mode={itemModal.mode}
          item={itemModal.item}
          onClose={() => setItemModal({ open: false, mode: 'add' })}
          onSave={handleItemSave}
        />
      )}

      {/* 체크 모달 */}
      {checkModal.open && checkModal.item && (
        <CheckModal
          item={checkModal.item}
          onClose={() => setCheckModal({ open: false })}
          onSave={handleStatusSave}
        />
      )}
    </div>
  );
}
