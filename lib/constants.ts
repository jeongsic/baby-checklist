export const BIRTH_SUBS = [
  { value: 'hospital', label: '병원 준비물', icon: '🏥' },
  { value: 'postpartum', label: '조리원 준비물', icon: '🏨' },
] as const;

export const BIRTH_PERSONS = [
  { value: 'mom', label: '산모용', icon: '👩' },
  { value: 'baby', label: '아기용', icon: '👶' },
] as const;

export const PARENTING_SUBS = [
  { value: 'eat', label: '수유', icon: '🍼' },
  { value: 'play', label: '놀이', icon: '🧸' },
  { value: 'sleep', label: '수면', icon: '🌙' },
  { value: 'wash', label: '목욕', icon: '🛁' },
  { value: 'poop', label: '배변', icon: '🚼' },
  { value: 'outing', label: '외출', icon: '🚗' },
  { value: 'parent', label: '부모', icon: '🙋' },
] as const;

export const CHECK_METHODS = [
  { value: 'purchase', label: '구매', icon: '🛒', hasPrice: true, hasStore: true, hasFromWhom: false, fromWhomLabel: '' },
  { value: 'daangn', label: '당근', icon: '🥕', hasPrice: true, hasStore: true, hasFromWhom: false, fromWhomLabel: '' },
  { value: 'sharing', label: '나눔', icon: '🤝', hasPrice: false, hasStore: false, hasFromWhom: true, fromWhomLabel: '누구에게 나눔받았나요?' },
  { value: 'gift', label: '선물', icon: '🎁', hasPrice: false, hasStore: false, hasFromWhom: true, fromWhomLabel: '누구에게 선물받았나요?' },
] as const;
