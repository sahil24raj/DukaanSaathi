export interface Product {
  id: number;
  name: string;
  hindi_name?: string;
  aliases: string;
  unit: string;
  price: number;
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
  customer_transcript?: string;
  hindi_response?: string;
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

export type ProcessingState = 
  | 'idle'
  | 'listening'
  | 'transcribing'
  | 'parsing'
  | 'checking_stock'
  | 'speaking'
  | 'ready'
  | 'error';

