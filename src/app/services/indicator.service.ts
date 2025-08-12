import { Injectable } from '@angular/core';
import { PriceData, IndicatorData } from './app-store.service';

@Injectable({
  providedIn: 'root'
})
export class IndicatorService {

  calculateAllIndicators(prices: PriceData[]): IndicatorData {
    if (prices.length === 0) return {};

    const closePrices = prices.map(p => p.close);
    
    return {
      sma20: this.calculateSMA(closePrices, 20),
      sma50: this.calculateSMA(closePrices, 50),
      ema12: this.calculateEMA(closePrices, 12),
      ema26: this.calculateEMA(closePrices, 26),
      rsi: this.calculateRSI(closePrices, 14),
      macd: this.calculateMACD(closePrices)
    };
  }

  private calculateSMA(prices: number[], period: number): number[] {
    const sma: number[] = [];
    
    for (let i = 0; i < prices.length; i++) {
      if (i < period - 1) {
        sma.push(NaN);
      } else {
        const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
        sma.push(sum / period);
      }
    }
    
    return sma;
  }

  private calculateEMA(prices: number[], period: number): number[] {
    const ema: number[] = [];
    const multiplier = 2 / (period + 1);
    
    ema[0] = prices[0];
    
    for (let i = 1; i < prices.length; i++) {
      ema[i] = (prices[i] * multiplier) + (ema[i - 1] * (1 - multiplier));
    }
    
    return ema;
  }

  private calculateRSI(prices: number[], period: number): number[] {
    const rsi: number[] = [];
    const gains: number[] = [];
    const losses: number[] = [];
    
    for (let i = 1; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1];
      gains.push(change > 0 ? change : 0);
      losses.push(change < 0 ? -change : 0);
    }
    
    for (let i = 0; i < gains.length; i++) {
      if (i < period - 1) {
        rsi.push(NaN);
      } else {
        const avgGain = gains.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
        const avgLoss = losses.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
        
        if (avgLoss === 0) {
          rsi.push(100);
        } else {
          const rs = avgGain / avgLoss;
          rsi.push(100 - (100 / (1 + rs)));
        }
      }
    }
    
    // Add NaN for first price since RSI starts from second price
    return [NaN, ...rsi];
  }

  private calculateMACD(prices: number[]) {
    const ema12 = this.calculateEMA(prices, 12);
    const ema26 = this.calculateEMA(prices, 26);
    const macd = ema12.map((val, i) => val - ema26[i]);
    const signal = this.calculateEMA(macd, 9);
    const histogram = macd.map((val, i) => val - signal[i]);
    
    return { macd, signal, histogram };
  }
}