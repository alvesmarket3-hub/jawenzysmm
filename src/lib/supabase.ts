import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = supabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : (null as any);

export type Service = {
  id: string;
  name: string;
  category: string;
  platform: string;
  price_per_1000: number;
  min_order: number;
  max_order: number;
  average_time: string;
  description: string;
  is_active: boolean;
  created_at: string;
};

export type Order = {
  id: string;
  user_id: string;
  service_id: string;
  link: string;
  quantity: number;
  charge: number;
  start_count: number;
  status: string;
  created_at: string;
  updated_at: string;
  service?: Service;
};

export type Transaction = {
  id: string;
  user_id: string;
  amount: number;
  type: string;
  description: string;
  created_at: string;
};

export type Ticket = {
  id: string;
  user_id: string;
  subject: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
  replies?: TicketReply[];
};

export type TicketReply = {
  id: string;
  ticket_id: string;
  user_id: string;
  message: string;
  is_staff: boolean;
  created_at: string;
};

export type ApiKey = {
  id: string;
  user_id: string;
  key_value: string;
  label: string;
  created_at: string;
  last_used_at: string | null;
};

export type Profile = {
  id: string;
  username: string;
  email: string;
  balance: number;
  role: string;
  created_at: string;
};
