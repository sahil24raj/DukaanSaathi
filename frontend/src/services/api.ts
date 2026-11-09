import {
  Product,
  ParsedOrderResponse,
  TranscribeResponse,
  Order,
  DashboardStats,
  SystemStatus,
  DemoSample,
  ParsedOrderItem
} from '../types';

const API_BASE = (import.meta as any).env?.VITE_API_URL || '/api';

export const api = {
  // System Status
  async getSystemStatus(): Promise<SystemStatus> {
    const res = await fetch(`${API_BASE}/system-status`);
    if (!res.ok) throw new Error('Failed to fetch system status');
    return res.json();
  },

  // Products & Inventory
  async getProducts(): Promise<Product[]> {
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) throw new Error('Failed to fetch product catalog');
    return res.json();
  },

  async updateProduct(id: number, data: { stock?: number; price?: number }): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update product');
    return res.json();
  },

  async seedProducts(): Promise<{ status: string; message: string }> {
    const res = await fetch(`${API_BASE}/products/seed`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to seed catalog');
    return res.json();
  },

  // Voice & Parsing
  async transcribeAudio(audioBlob: Blob, filename = 'recording.wav'): Promise<TranscribeResponse> {
    const formData = new FormData();
    formData.append('file', audioBlob, filename);

    const res = await fetch(`${API_BASE}/transcribe`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Transcription failed');
    return res.json();
  },

  async parseOrder(transcript: string): Promise<ParsedOrderResponse> {
    const res = await fetch(`${API_BASE}/parse-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript })
    });
    if (!res.ok) throw new Error('Order parsing failed');
    return res.json();
  },

  async speakText(text: string): Promise<{ audio_base64?: string; audio_url?: string; source: string }> {
    const res = await fetch(`${API_BASE}/speak`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, language: 'hi' })
    });
    if (!res.ok) throw new Error('TTS synthesis failed');
    return res.json();
  },

  // Orders
  async createOrder(payload: {
    customer_transcript?: string;
    hindi_response?: string;
    items: ParsedOrderItem[];
  }): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to place order');
    }
    return res.json();
  },

  async getOrders(): Promise<Order[]> {
    const res = await fetch(`${API_BASE}/orders`);
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
  },

  // Dashboard
  async getDashboard(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE}/dashboard`);
    if (!res.ok) throw new Error('Failed to fetch dashboard data');
    return res.json();
  },

  // Demo Samples
  async getDemoSamples(): Promise<DemoSample[]> {
    const res = await fetch(`${API_BASE}/demo-samples`);
    if (!res.ok) throw new Error('Failed to fetch demo samples');
    return res.json();
  }
};

/**
 * Audio playback utility:
 * Plays audio from base64/URL, with fallback to browser Hindi Web Speech synthesis
 * so user always hears natural Hindi audio even without external headphones/files!
 */
export async function playHindiAudio(
  text: string,
  audioBase64?: string,
  onFinish?: () => void
): Promise<void> {
  // If we have base64 audio from backend (either live Gnani Timbre or synthetic speech generator)
  if (audioBase64) {
    try {
      const audio = new Audio(`data:audio/wav;base64,${audioBase64}`);
      audio.onended = () => {
        if (onFinish) onFinish();
      };
      await audio.play();
      return;
    } catch (e) {
      console.warn('Audio element play failed, falling back to speech synthesis:', e);
    }
  }

  // Fallback to Web Speech API (Hindi voice)
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel(); // Clear any ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.95;

    // Pick a Hindi voice if available in browser
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('IN'));
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }

    utterance.onend = () => {
      if (onFinish) onFinish();
    };
    utterance.onerror = () => {
      if (onFinish) onFinish();
    };

    window.speechSynthesis.speak(utterance);
  } else {
    if (onFinish) onFinish();
  }
}

