export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          role: 'employee' | 'manager';
          updated_at: string | null;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          role?: 'employee' | 'manager';
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          role?: 'employee' | 'manager';
          updated_at?: string | null;
        };
      };
      expenses: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          category: string;
          description: string | null;
          date: string;
          status: 'pending' | 'approved' | 'rejected';
          receipt_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          category: string;
          description?: string | null;
          date: string;
          status?: 'pending' | 'approved' | 'rejected';
          receipt_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          category?: string;
          description?: string | null;
          date?: string;
          status?: 'pending' | 'approved' | 'rejected';
          receipt_url?: string | null;
          created_at?: string;
        };
      };
    };
  };
};