export type MainType = 'birth' | 'parenting';
export type BirthSubType = 'hospital' | 'postpartum';
export type ParentingSubType = 'eat' | 'play' | 'sleep' | 'wash' | 'poop';
export type PersonType = 'mom' | 'baby';
export type CheckMethod = 'purchase' | 'sharing' | 'daangn' | 'gift';

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
  is_ready: number | null;
  method: CheckMethod | null;
  price: number | null;
  store: string | null;
  from_whom: string | null;
  status_updated: string | null;
}
