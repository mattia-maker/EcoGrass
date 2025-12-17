export enum GrassCondition {
  MAINTAINED = 'Regolare (Manutenzione)',
  TALL = 'Alto (15-30cm)',
  OVERGROWN = 'Incolto / Erbacce (>30cm)'
}

export interface FormData {
  address: string;
  city: string;
  sqm: number; // metri quadri
  condition: GrassCondition;
  includeDisposal: boolean; // Smaltimento erba
}

export interface CostBreakdown {
  labor: number;     // Manodopera taglio
  machinery: number; // Uso macchinari/benzina
  disposal: number;  // Smaltimento
  travel: number;    // Trasferta
  total: number;
}

export interface QuoteResult {
  breakdown: CostBreakdown;
  aiAdvice: string;
  distanceKm: number;
}

export interface GeminiResponse {
  advice: string;
  distanceKm: number;
}