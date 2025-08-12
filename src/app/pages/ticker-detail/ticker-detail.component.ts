import { Component, inject, OnInit, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MarketDataService } from '../../services/prices.service';
import { TechnicalIndicatorService } from '../../services/indicator.service';
import { MarketStoreService, IndicatorSettings, TimePeriod } from '../../services/app-store.service';
import { PriceChartComponent } from '../../components/price-chart/price-chart.component';
import { IndicatorPanelComponent } from '../../components/indicator-panel/indicator-panel.component';
import { MarketInsightsComponent } from '../../components/ai-insight-card/ai-insight-card.component';
import { TimePeriodSelectorComponent } from '../../components/time-period-selector/time-period-selector.component';

@Component({
  selector: 'app-ticker-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    PriceChartComponent,
    IndicatorPanelComponent,
    MarketInsightsComponent,
    TimePeriodSelectorComponent
  ],
  template: `
    <div class="min-h-screen bg-gray-50 relative">
      <div class="absolute top-0 left-0 right-0 h-48 bg-gradient-to-br from-primary-500 to-secondary-500 opacity-5 pointer-events-none"></div>

      <mat-toolbar color="primary" class="relative z-10 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg px-2 sm:px-4">
        <button mat-icon-button (click)="navigateBack()" class="text-gray-600 hover:text-gray-900">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div class="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <mat-icon class="text-xl sm:text-2xl bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent flex-shrink-0">trending_up</mat-icon>
          <span class="text-sm sm:text-xl font-semibold text-gray-900 truncate">Technical Analysis</span>
        </div>
        @if (currentSymbol()) {
          <div class="flex items-center gap-2 sm:gap-4 p-1 sm:p-2 bg-gray-100 rounded-lg sm:rounded-xl border border-gray-200 flex-shrink-0">
            <span class="text-sm sm:text-lg font-bold px-2 sm:px-3 py-1 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-md sm:rounded-lg shadow-sm">
              {{ currentSymbol()?.toUpperCase() }}
            </span>
            @if (latestPrice()) {
              <span class="text-xs sm:text-base font-semibold text-gray-700 hidden sm:block">\${{ latestPrice()!.close | number:'1.2-2' }}</span>
            }
          </div>
        }
      </mat-toolbar>

      <div class="p-3 sm:p-6 max-w-7xl mx-auto relative z-5">
        @if (isLoading()) {
          <div class="flex flex-col items-center justify-center min-h-[400px] sm:min-h-[500px] text-gray-600 bg-white rounded-xl shadow-lg my-4 sm:my-8">
            <mat-progress-spinner diameter="40" mode="indeterminate" class="text-primary-500 sm:w-12 sm:h-12"></mat-progress-spinner>
            <p class="mt-4 italic text-base sm:text-lg">Loading market data...</p>
          </div>
        } @else if (errorMessage()) {
          <mat-card class="my-6 sm:my-10 mx-auto max-w-2xl border border-red-200 bg-gradient-to-br from-red-50 to-white">
            <mat-card-content>
              <div class="flex flex-col items-center text-center p-6 sm:p-8">
                <mat-icon color="warn" class="text-4xl sm:text-6xl mb-4 text-red-500">error</mat-icon>
                <h3 class="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">Data Not Available</h3>
                <p class="text-base sm:text-lg text-gray-600 leading-relaxed mb-6">{{ errorMessage() }}</p>
                <button mat-button color="primary" (click)="navigateBack()" class="bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:shadow-lg transition-all duration-200">
                  <mat-icon>arrow_back</mat-icon>
                  <span class="hidden sm:inline">Back to Dashboard</span>
                  <span class="sm:hidden">Back</span>
                </button>
              </div>
            </mat-card-content>
          </mat-card>
        } @else if (priceData().length > 0) {
          <div class="mb-4 sm:mb-6 animate-fade-in-up">
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-4">
              <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Price Chart</h2>
              <app-time-period-selector 
                [selectedPeriod]="selectedTimePeriod()"
                (periodChanged)="onTimePeriodChanged($event)"
              />
            </div>
            <app-price-chart 
              [priceData]="priceData()"
              [technicalIndicators]="technicalIndicators()"
              [enabledIndicators]="enabledIndicators()"
            />
          </div>

          <div class="space-y-4 sm:space-y-6 animate-fade-in-up animation-delay-200">
            <div>
              <app-indicator-panel
                [technicalIndicators]="technicalIndicators()"
                [enabledIndicators]="enabledIndicators()"
                (indicatorToggled)="onIndicatorToggled($event)"
              />
            </div>

            <div>
              <app-market-insights
                [symbol]="currentSymbol()!"
                [priceData]="priceData()"
              />
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .animation-delay-200 {
      animation-delay: 0.2s;
    }
    
    @media (max-width: 640px) {
      .mat-toolbar {
        padding-left: 8px !important;
        padding-right: 8px !important;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TickerDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private marketDataService = inject(MarketDataService);
  private technicalIndicatorService = inject(TechnicalIndicatorService);
  private marketStore = inject(MarketStoreService);

  currentSymbol = this.marketStore.currentSymbol;
  priceData = this.marketStore.priceData;
  technicalIndicators = this.marketStore.technicalIndicators;
  enabledIndicators = this.marketStore.enabledIndicators;
  selectedTimePeriod = this.marketStore.selectedTimePeriod;
  isLoading = this.marketStore.isLoading;
  errorMessage = this.marketStore.errorMessage;
  latestPrice = this.marketStore.latestPrice;

  ngOnInit() {
    this.route.params.subscribe(params => {
      const symbol = params['symbol']?.toUpperCase();
      if (symbol) {
        this.loadTickerData(symbol);
      }
    });
  }

  private loadTickerData(symbol: string) {
    this.marketStore.setCurrentSymbol(symbol);
    this.marketStore.setLoading(true);
    this.marketStore.setError(null);

    this.marketDataService.loadPriceData(symbol, this.selectedTimePeriod()).subscribe({
      next: (prices) => {
        if (prices.length === 0) {
          this.marketStore.setError(`No data available for symbol: ${symbol}. Please try another symbol.`);
        } else {
          this.marketStore.setPriceData(prices);
          const indicators = this.technicalIndicatorService.calculateAllIndicators(prices);
          this.marketStore.setTechnicalIndicators(indicators);
        }
        this.marketStore.setLoading(false);
      },
      error: (err) => {
        console.error('Error loading prices:', err);
        this.marketStore.setError(`Failed to load data for ${symbol}. Please check the symbol and try again.`);
        this.marketStore.setLoading(false);
      }
    });
  }

  onTimePeriodChanged(period: TimePeriod) {
    this.marketStore.setTimePeriod(period);
    if (this.currentSymbol()) {
      this.loadTickerData(this.currentSymbol()!);
    }
  }

  onIndicatorToggled(indicator: keyof IndicatorSettings) {
    this.marketStore.toggleIndicator(indicator);
  }

  navigateBack() {
    this.router.navigate(['/']);
  }
}