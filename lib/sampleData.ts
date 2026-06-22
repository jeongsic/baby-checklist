import { Item } from './types';

export const SAMPLE_ITEMS: Item[] = [
  // 병원 준비물 - 산모
  { id: 's1', category_main: 'birth', category_sub: 'hospital', category_person: 'mom', name: '산모 패드', memo: '대형 20개 이상 준비', priority: 5, created_at: '', status_id: 's1s', is_ready: true, method: 'purchase', price: 15800, store: '쿠팡', from_whom: null, status_updated: '' },
  { id: 's2', category_main: 'birth', category_sub: 'hospital', category_person: 'mom', name: '미역국 재료', memo: null, priority: 3, created_at: '', status_id: null, is_ready: false, method: null, price: null, store: null, from_whom: null, status_updated: null },
  { id: 's3', category_main: 'birth', category_sub: 'hospital', category_person: 'mom', name: '간식 · 음료수', memo: null, priority: 2, created_at: '', status_id: null, is_ready: false, method: null, price: null, store: null, from_whom: null, status_updated: null },
  // 병원 준비물 - 아기
  { id: 's4', category_main: 'birth', category_sub: 'hospital', category_person: 'baby', name: '속싸개', memo: '2장 준비', priority: 4, created_at: '', status_id: 's4s', is_ready: true, method: 'purchase', price: 22000, store: '마켓컬리', from_whom: null, status_updated: '' },
  { id: 's5', category_main: 'birth', category_sub: 'hospital', category_person: 'baby', name: '배냇저고리', memo: null, priority: 4, created_at: '', status_id: null, is_ready: false, method: null, price: null, store: null, from_whom: null, status_updated: null },
  { id: 's6', category_main: 'birth', category_sub: 'hospital', category_person: 'baby', name: '신생아 모자', memo: null, priority: 2, created_at: '', status_id: null, is_ready: false, method: null, price: null, store: null, from_whom: null, status_updated: null },
  // 조리원 준비물 - 산모
  { id: 's7', category_main: 'birth', category_sub: 'postpartum', category_person: 'mom', name: '산후조리원 예약', memo: null, priority: 5, created_at: '', status_id: 's7s', is_ready: true, method: 'purchase', price: 3200000, store: null, from_whom: null, status_updated: '' },
  { id: 's8', category_main: 'birth', category_sub: 'postpartum', category_person: 'mom', name: '개인 세면도구', memo: null, priority: 3, created_at: '', status_id: null, is_ready: false, method: null, price: null, store: null, from_whom: null, status_updated: null },
  // 조리원 준비물 - 아기
  { id: 's9', category_main: 'birth', category_sub: 'postpartum', category_person: 'baby', name: '신생아 내복', memo: '5벌 준비', priority: 3, created_at: '', status_id: null, is_ready: false, method: null, price: null, store: null, from_whom: null, status_updated: null },
  // 먹
  { id: 's10', category_main: 'parenting', category_sub: 'eat', category_person: null, name: '젖병 (160mL × 3개)', memo: null, priority: 4, created_at: '', status_id: 's10s', is_ready: true, method: 'purchase', price: 35000, store: '아이허브', from_whom: null, status_updated: '' },
  { id: 's11', category_main: 'parenting', category_sub: 'eat', category_person: null, name: '젖병 세척솔', memo: null, priority: 3, created_at: '', status_id: 's11s', is_ready: true, method: 'purchase', price: 20110, store: '쿠팡', from_whom: null, status_updated: '' },
  { id: 's12', category_main: 'parenting', category_sub: 'eat', category_person: null, name: '분유', memo: '모유 수유 안 될 경우를 대비', priority: 2, created_at: '', status_id: null, is_ready: false, method: null, price: null, store: null, from_whom: null, status_updated: null },
  // 잠
  { id: 's13', category_main: 'parenting', category_sub: 'sleep', category_person: null, name: '아기 침대', memo: null, priority: 5, created_at: '', status_id: null, is_ready: false, method: null, price: null, store: null, from_whom: null, status_updated: null },
  { id: 's14', category_main: 'parenting', category_sub: 'sleep', category_person: null, name: '신생아 이불 세트', memo: null, priority: 3, created_at: '', status_id: 's14s', is_ready: true, method: 'gift', price: null, store: null, from_whom: '외할머니', status_updated: '' },
  // 놀
  { id: 's15', category_main: 'parenting', category_sub: 'play', category_person: null, name: '딸랑이', memo: null, priority: 1, created_at: '', status_id: null, is_ready: false, method: null, price: null, store: null, from_whom: null, status_updated: null },
  // 씻
  { id: 's16', category_main: 'parenting', category_sub: 'wash', category_person: null, name: '아기 욕조', memo: null, priority: 4, created_at: '', status_id: null, is_ready: false, method: null, price: null, store: null, from_whom: null, status_updated: null },
  { id: 's17', category_main: 'parenting', category_sub: 'wash', category_person: null, name: '아기 세제 · 섬유유연제', memo: null, priority: 3, created_at: '', status_id: null, is_ready: false, method: null, price: null, store: null, from_whom: null, status_updated: null },
  // 싸
  { id: 's18', category_main: 'parenting', category_sub: 'poop', category_person: null, name: '기저귀 (신생아용 1팩)', memo: null, priority: 5, created_at: '', status_id: null, is_ready: false, method: null, price: null, store: null, from_whom: null, status_updated: null },
  { id: 's19', category_main: 'parenting', category_sub: 'poop', category_person: null, name: '물티슈 10팩', memo: null, priority: 4, created_at: '', status_id: null, is_ready: false, method: null, price: null, store: null, from_whom: null, status_updated: null },
];
