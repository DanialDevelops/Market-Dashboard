import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { PriceData, TimePeriod } from './app-store.service';

@Injectable({
  providedIn: 'root'
})
export class MarketDataService {
  private http = inject(HttpClient);

  loadPriceData(symbol: string, timePeriod: TimePeriod = '1M'): Observable<PriceData[]> {
    // For demo purposes, generate realistic price data
    return of(this.generateRealisticPriceData(symbol, timePeriod));
  }

  getAvailableSymbols(): Observable<string[]> {
    return of(['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'META', 'NVDA']);
  }

  private generateRealisticPriceData(symbol: string, timePeriod: TimePeriod): PriceData[] {
    const basePrice = this.getBasePrice(symbol);
    const days = this.getDaysForPeriod(timePeriod);
    const volatility = this.getVolatilityForPeriod(timePeriod);
    
    const prices: PriceData[] = [];
    let currentPrice = basePrice;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      
      // Generate realistic price movement
      const changePercent = (Math.random() - 0.5) * volatility;
      const change = currentPrice * changePercent;
      const open = currentPrice;
      const close = currentPrice + change;
      
      // Ensure price doesn't go negative
      if (close <= 0) continue;
      
      const high = Math.max(open, close) + Math.random() * Math.abs(change) * 0.5;
      const low = Math.min(open, close) - Math.random() * Math.abs(change) * 0.5;
      const volume = Math.floor(Math.random() * 50000000) + 10000000;

      prices.push({
        date: date.toISOString().split('T')[0],
        open,
        high,
        low,
        close,
        volume
      });

      currentPrice = close;
    }

    return prices;
  }

  private getBasePrice(symbol: string): number {
    const basePrices: { [key: string]: number } = {
      'AAPL': 150,
      'GOOGL': 140,
      'MSFT': 300,
      'TSLA': 200,
      'AMZN': 130,
      'META': 350,
      'NVDA': 400
    };
    return basePrices[symbol] || 100;
  }

  private getDaysForPeriod(timePeriod: TimePeriod): number {
    const periods: { [key in TimePeriod]: number } = {
      '1D': 1,
      '1W': 7,
      '1M': 30,
      '3M': 90,
      '6M': 180,
      '1Y': 365
    };
    return periods[timePeriod];
  }

  private getVolatilityForPeriod(timePeriod: TimePeriod): number {
    const volatilities: { [key in TimePeriod]: number } = {
      '1D': 0.02,  // 2% daily volatility
      '1W': 0.015, // 1.5% weekly volatility
      '1M': 0.012, // 1.2% monthly volatility
      '3M': 0.01,  // 1% quarterly volatility
      '6M': 0.008, // 0.8% semi-annual volatility
      '1Y': 0.006  // 0.6% annual volatility
    };
    return volatilities[timePeriod];
  }
}