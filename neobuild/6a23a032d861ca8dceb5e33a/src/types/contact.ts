export type ContactType = 'customer' | 'supplier' | 'employee' | 'partner';

export interface Contact {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  type: ContactType;
  company: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}