export const BIRTH_SUBS = [
  { value: 'hospital', label: '병원 준비물', icon: '🏥' },
  { value: 'postpartum', label: '조리원 준비물', icon: '🏨' },
] as const;

export const BIRTH_PERSONS = [
  { value: 'mom', label: '산모용', icon: '👩' },
  { value: 'baby', label: '아기용', icon: '👶' },
] as const;

export const PARENTING_SUBS = [
  { value: 'eat', label: '먹', icon: '🍼' },
  { value: 'play', label: '놀', icon: '🧸' },
  { value: 'sleep', label: '잠', icon: '🌙' },
] as const;

export const CHECK_METHODS = [
  { value: 'purchase', label: '구매', icon: '🛒', hasPrice: true, hasFromWhom: false },
  { value: 'daangn', label: '당근', icon: '🥕', hasPrice: true, hasFromWhom: false },
  { value: 'sharing', label: '나눔', icon: '🤝', hasPrice: false, hasFromWhom: true },
] as const;
