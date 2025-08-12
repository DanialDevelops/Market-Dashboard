import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { PriceData } from './app-store.service';

@Injectable({
  providedIn: 'root'
})
export class PricesService {
  private http = inject(HttpClient);

  loadPrices(symbol: string): Observable<PriceData[]> {
    const url = `/assets/prices/${symbol.toLowerCase()}.json`;
    
    return this.http.get<{ data: PriceData[] }>(url).pipe(
      map(response => response.data),
      catchError(error => {
        console.error(`Failed to load prices for ${symbol}:`, error);
        return of([]);
      })
    );
  }

  getAvailableSymbols(): Observable<string[]> {
    // In a real app, this would come from an API
    return of(['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'META', 'NVDA']);
  }
}