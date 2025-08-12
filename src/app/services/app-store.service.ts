import { Injectable, signal, computed } from '@angular/core';

export interface PriceData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface IndicatorData {
  sma20?: number[];
  sma50?: number[];
  ema12?: number[];
  ema26?: number[];
  rsi?: number[];
  macd?: {
    macd: number[];
    signal: number[];
    histogram: number[];
  };
}

export interface AppState {
  currentSymbol: string | null;
  prices: PriceData[];
  indicators: IndicatorData;
  enabledIndicators: {
    sma20: boolean;
    sma50: boolean;
    ema12: boolean;
    ema26: boolean;
    rsi: boolean;
    macd: boolean;
  };
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AppStoreService {
  private state = signal<AppState>({
    currentSymbol: null,
    prices: [],
    indicators: {},
    enabledIndicators: {
      sma20: true,
      sma50: true,
      ema12: false,
      ema26: false,
      rsi: false,
      macd: false
    },
    loading: false,
    error: null
  });

  // Computed selectors
  readonly currentSymbol = computed(() => this.state().currentSymbol);
  readonly prices = computed(() => this.state().prices);
  readonly indicators = computed(() => this.state().indicators);
  readonly enabledIndicators = computed(() => this.state().enabledIndicators);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);
  
  readonly latestPrice = computed(() => {
    const prices = this.state().prices;
    return prices.length > 0 ? prices[prices.length - 1] : null;
  });

  // State mutations
  setCurrentSymbol(symbol: string) {
    this.state.update(state => ({ ...state, currentSymbol: symbol }));
  }

  setPrices(prices: PriceData[]) {
    this.state.update(state => ({ ...state, prices }));
  }

  setIndicators(indicators: IndicatorData) {
    this.state.update(state => ({ ...state, indicators }));
  }

  toggleIndicator(indicator: keyof AppState['enabledIndicators']) {
    this.state.update(state => ({
      ...state,
      enabledIndicators: {
        ...state.enabledIndicators,
        [indicator]: !state.enabledIndicators[indicator]
      }
    }));
  }

  setLoading(loading: boolean) {
    this.state.update(state => ({ ...state, loading }));
  }

  setError(error: string | null) {
    this.state.update(state => ({ ...state, error }));
  }

  reset() {
    this.state.update(state => ({
      ...state,
      currentSymbol: null,
      prices: [],
      indicators: {},
      error: null
    }));
  }
}