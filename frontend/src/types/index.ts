export interface Product {
  id: number;
  name: string;
  hindi_name?: string;
  aliases: string;
  unit: string;
  price: number;
  cost_price?: number;
  category?: string;
  stock: number;
  created_at: string;
  updated_at: string;
}

export interface ParsedOrderItem {
  raw_item: string;
  matched_product: string;
  quantity: number;
  unit: string;
  unit_price: number;
  line_total: number;
  in_stock: boolean;
  available_stock: number;
}

export interface ParsedOrderResponse {
  items: ParsedOrderItem[];
  total: number;
  status: 'ready_for_confirmation' | 'partial' | 'empty' | 'stock_issue' | 'unknown_items_only';
  unknown_items: string[];
  hindi_reply: string;
  transcript: string;
  parse_method: 'evon_llm' | 'fallback_rules';
  confidence: number;
  source?: string;
}

export interface TranscribeResponse {
  transcript: string;
  language: string;
  confidence: number;
  processing_time_ms: number;
  source: string;
}

export interface OrderItem {
  id: number;
  raw_item: string;
  matched_product: string;
  quantity: number;
  unit: string;
  unit_price: number;
  line_total: number;
}

export interface Order {
  id: number;
  customer_name?: string;
  customer_phone?: string;
  customer_transcript?: string;
  hindi_response?: string;
  payment_method?: 'cash' | 'upi' | 'udhaar';
  discount?: number;
  gst?: number;
  total_amount: number;
  status: string;
  created_at: string;
  items: OrderItem[];
}

export interface TopProductStat {
  name: string;
  units_sold: number;
  revenue: number;
  unit: string;
}

export interface DashboardStats {
  total_orders: number;
  total_revenue: number;
  today_sales: number;
  today_profit: number;
  total_expenses: number;
  pending_udhaar: number;
  top_selling_items: TopProductStat[];
  low_stock_products: Product[];
  recent_orders: Order[];
}

export interface SystemStatus {
  app_name: string;
  version: string;
  gnani_api_key_configured: boolean;
  evon_api_key_configured: boolean;
  mock_mode_active: boolean;
  stt_engine: string;
  tts_engine: string;
  parser_engine: string;
  endpoints: {
    stt: string;
    tts: string;
    evon: string;
  };
}

export interface DemoSample {
  id: string;
  title: string;
  title_hi: string;
  description: string;
  sample_text: string;
  audio_url: string;
  category: string;
  expected_items: {
    product: string;
    qty: number;
    unit: string;
  }[];
}

export interface CustomerUdhaarRecord {
  id: number;
  customer_name: string;
  customer_name_hi?: string;
  phone: string;
  total_due: number;
  last_transaction_date: string;
  transactions: {
    id: number;
    type: 'given' | 'received'; // given = udhaar diya, received = jama kiya
    amount: number;
    description: string;
    date: string;
  }[];
}

export interface CustomerProfile {
  id: number;
  name: string;
  phone: string;
  address?: string;
  total_orders: number;
  total_spent: number;
  outstanding_udhaar: number;
  recent_activity: string;
}

export type ProcessingState = 
  | 'idle'
  | 'listening'
  | 'transcribing'
  | 'parsing'
  | 'checking_stock'
  | 'speaking'
  | 'ready'
  | 'error';
