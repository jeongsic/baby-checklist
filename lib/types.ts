export type MainType = 'birth' | 'parenting' | 'todo';
export type BirthSubType = 'hospital' | 'postpartum';
export type ParentingSubType = 'eat' | 'play' | 'sleep' | 'wash' | 'poop';
export type PersonType = 'mom' | 'baby' | 'dad';
export type TodoPersonType = 'mom' | 'dad';
export type CheckMethod = 'purchase' | 'sharing' | 'daangn' | 'gift';

export interface Account {
  id: string;
  baby_name: string;
  created_at: string;
}

export interface Item {
  id: string;
  category_main: MainType;
  category_sub: string;
  category_person: PersonType | null;
  name: string;
  memo: string | null;
  priority: number;
  created_at: string;
  status_id: string | null;
  is_ready: boolean | null;
  method: CheckMethod | null;
  price: number | null;
  store: string | null;
  from_whom: string | null;
  status_updated: string | null;
}
