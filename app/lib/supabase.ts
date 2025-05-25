import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or Anon Key');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface MenuItem {
  id: string;
  name: string;
  name_tr: string;
  description: string | null;
  description_tr: string | null;
  price: number;
  image_url?: string | null;
  is_vegetarian?: boolean;
  is_vegan?: boolean;
}

export interface Category {
  id: string;
  name: string;
  name_tr: string;
  description?: string | null;
  description_tr?: string | null;
  items: MenuItem[];
}

export interface MenuData {
  categories: Category[];
}
 