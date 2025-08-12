import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TickerSearchComponent } from '../../components/ticker-search/ticker-search.component';
import { MarketStoreService } from '../../services/app-store.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    TickerSearchComponent
  ],
  template: `
    <div class="min-h-screen bg-gray-50 relative overflow-x-hidden">
      <div class="absolute top-0 left-0 right-0 h-48 bg-gradient-to-br from-primary-500 to-secondary-500 opacity-5 pointer-events-none"></div>

      <mat-toolbar color="primary" class="relative z-10 bg-white/95 backdrop-blur-md border-b border-purple-200 shadow-lg">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
            <mat-icon class="text-white text-2xl">trending_up</mat-icon>
          </div>
          <span class="text-2xl font-bold text-gray-900">Technical Analysis Dashboard</span>
        </div>
      </mat-toolbar>

      <div class="relative z-5">
        <div class="bg-white py-20 px-6 text-center relative border-b border-purple-200 overflow-hidden">
          <div class="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90" style="background-image: url('/assets/images/citysky.jpg');"></div>
          
          <div class="absolute inset-0 bg-white/60"></div>
          
          <div class="max-w-4xl mx-auto relative z-10">
            <h1 class="text-5xl md:text-6xl font-extrabold mb-6 text-gray-900">
              Technical Analysis Made Simple
            </h1>
            <p class="text-xl text-gray-600 mb-10 leading-relaxed font-normal">
              Enter a stock symbol to visualize price charts with technical indicators and get intelligent insights
            </p>
            
            <div class="flex justify-center mt-10">
              <app-ticker-search (symbolSelected)="onSymbolSelected($event)"></app-ticker-search>
            </div>
          </div>
        </div>

        <div class="py-20 px-6 bg-purple-50 relative">
          <h2 class="text-center text-gray-900 text-4xl font-bold mb-12 relative z-10">
            Features
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            <mat-card class="transition-all duration-300 cursor-default border border-purple-200 bg-white relative overflow-hidden group hover:-translate-y-2 hover:shadow-2xl">
              <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-purple-600 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></div>
              <mat-card-header>
                <mat-card-title class="flex items-center gap-3 text-gray-900 font-semibold">
                  <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <mat-icon class="text-white text-lg">trending_up</mat-icon>
                  </div>
                  Interactive Charts
                </mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p class="text-gray-600 leading-relaxed mt-4">Visualize stock prices with customizable technical indicators including SMA, EMA, RSI, and MACD</p>
              </mat-card-content>
            </mat-card>

            <mat-card class="transition-all duration-300 cursor-default border border-purple-200 bg-white relative overflow-hidden group hover:-translate-y-2 hover:shadow-2xl">
              <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-purple-600 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></div>
              <mat-card-header>
                <mat-card-title class="flex items-center gap-3 text-gray-900 font-semibold">
                  <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <mat-icon class="text-white text-lg">psychology</mat-icon>
                  </div>
                  Smart Insights
                </mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p class="text-gray-600 leading-relaxed mt-4">Get intelligent analysis and market sentiment to help understand price movements</p>
              </mat-card-content>
            </mat-card>

            <mat-card class="transition-all duration-300 cursor-default border border-purple-200 bg-white relative overflow-hidden group hover:-translate-y-2 hover:shadow-2xl">
              <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-purple-600 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></div>
              <mat-card-header>
                <mat-card-title class="flex items-center gap-3 text-gray-900 font-semibold">
                  <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <mat-icon class="text-white text-lg">tune</mat-icon>
                  </div>
                  Customizable Indicators
                </mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p class="text-gray-600 leading-relaxed mt-4">Toggle different technical indicators on and off to focus on the metrics that matter to your analysis</p>
              </mat-card-content>
            </mat-card>

            <mat-card class="transition-all duration-300 cursor-default border border-purple-200 bg-white relative overflow-hidden group hover:-translate-y-2 hover:shadow-2xl">
              <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-purple-600 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></div>
              <mat-card-header>
                <mat-card-title class="flex items-center gap-3 text-gray-900 font-semibold">
                  <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <mat-icon class="text-white text-lg">speed</mat-icon>
                  </div>
                  Real-time Analysis
                </mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p class="text-gray-600 leading-relaxed mt-4">All calculations are performed in real-time as you toggle indicators for immediate feedback</p>
              </mat-card-content>
            </mat-card>
          </div>
        </div>

        <div class="py-20 px-6 bg-gradient-to-br from-purple-50 via-white to-blue-50 text-center relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-full opacity-5">
            <div class="absolute top-10 left-10 w-20 h-20 bg-purple-400 rounded-full blur-xl"></div>
            <div class="absolute top-32 right-20 w-16 h-16 bg-blue-400 rounded-full blur-xl"></div>
            <div class="absolute bottom-20 left-1/4 w-24 h-24 bg-purple-300 rounded-full blur-xl"></div>
            <div class="absolute bottom-10 right-1/3 w-12 h-12 bg-blue-300 rounded-full blur-xl"></div>
          </div>
          
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500"></div>
          
          <div class="relative z-10">
            <h3 class="text-4xl font-bold mb-4 text-gray-900 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Popular Stocks
            </h3>
            <p class="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
              Discover trending stocks and start your analysis journey
            </p>
            
            <div class="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
              @for (symbol of popularStocks; track symbol) {
                <button 
                  mat-button 
                  class="group relative bg-white/80 backdrop-blur-sm border-2 border-purple-200 rounded-2xl px-6 py-4 transition-all duration-300 font-bold text-gray-800 cursor-pointer hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 hover:text-white hover:border-purple-500 hover:shadow-2xl hover:-translate-y-2 hover:scale-105 transform"
                  (click)="onSymbolSelected(symbol)"
                >
                  <div class="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <span class="relative z-10 flex items-center gap-2">
                    <div class="w-6 h-6 bg-gradient-to-r from-purple-400 to-blue-400 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300">
                      <span class="text-white font-bold text-xs">{{ symbol.charAt(0) }}</span>
                    </div>
                    {{ symbol }}
                    <mat-icon class="text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">trending_up</mat-icon>
                  </span>
                  
                  <div class="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10"></div>
                </button>
              }
            </div>
            
            <div class="mt-16 flex justify-center">
              <div class="w-32 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  private router = inject(Router);
  private marketStore = inject(MarketStoreService);

  popularStocks = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'META', 'NVDA'];

  onSymbolSelected(symbol: string) {
    this.marketStore.setCurrentSymbol(symbol);
    this.router.navigate(['/t', symbol.toLowerCase()]);
  }
}