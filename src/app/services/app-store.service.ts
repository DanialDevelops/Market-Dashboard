import { Injectable, signal, computed } from '@angular/core';

export interface PriceData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TechnicalIndicators {
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

export interface IndicatorSettings {
  sma20: boolean;
  sma50: boolean;
  ema12: boolean;
  ema26: boolean;
  rsi: boolean;
  macd: boolean;
}

export type TimePeriod = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y';

export interface MarketState {
  currentSymbol: string | null;
  priceData: PriceData[];
  technicalIndicators: TechnicalIndicators;
  enabledIndicators: IndicatorSettings;
  selectedTimePeriod: TimePeriod;
  isLoading: boolean;
  errorMessage: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class MarketStoreService {
  private state = signal<MarketState>({
    currentSymbol: null,
    priceData: [],
    technicalIndicators: {},
    enabledIndicators: {
      sma20: true,
      sma50: true,
      ema12: false,
      ema26: false,
      rsi: false,
      macd: false
    },
    selectedTimePeriod: '1M',
    isLoading: false,
    errorMessage: null
  });

  readonly currentSymbol = computed(() => this.state().currentSymbol);
  readonly priceData = computed(() => this.state().priceData);
  readonly technicalIndicators = computed(() => this.state().technicalIndicators);
  readonly enabledIndicators = computed(() => this.state().enabledIndicators);
  readonly selectedTimePeriod = computed(() => this.state().selectedTimePeriod);
  readonly isLoading = computed(() => this.state().isLoading);
  readonly errorMessage = computed(() => this.state().errorMessage);
  
  readonly latestPrice = computed(() => {
    const prices = this.state().priceData;
    return prices.length > 0 ? prices[prices.length - 1] : null;
  });

  setCurrentSymbol(symbol: string) {
    this.state.update(state => ({ ...state, currentSymbol: symbol }));
  }

  setPriceData(prices: PriceData[]) {
    this.state.update(state => ({ ...state, priceData: prices }));
  }

  setTechnicalIndicators(indicators: TechnicalIndicators) {
    this.state.update(state => ({ ...state, technicalIndicators: indicators }));
  }

  setTimePeriod(period: TimePeriod) {
    this.state.update(state => ({ ...state, selectedTimePeriod: period }));
  }

  toggleIndicator(indicator: keyof IndicatorSettings) {
    this.state.update(state => ({
      ...state,
      enabledIndicators: {
        ...state.enabledIndicators,
        [indicator]: !state.enabledIndicators[indicator]
      }
    }));
  }

  setLoading(loading: boolean) {
    this.state.update(state => ({ ...state, isLoading: loading }));
  }

  setError(error: string | null) {
    this.state.update(state => ({ ...state, errorMessage: error }));
  }

  reset() {
    this.state.update(state => ({
      ...state,
      currentSymbol: null,
      priceData: [],
      technicalIndicators: {},
      errorMessage: null
    }));
  }
}