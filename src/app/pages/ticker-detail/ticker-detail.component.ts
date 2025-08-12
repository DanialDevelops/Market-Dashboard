import { Component, inject, OnInit, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PricesService } from '../../services/prices.service';
import { IndicatorService } from '../../services/indicator.service';
import { AppStoreService, AppState } from '../../services/app-store.service';
import { PriceChartComponent } from '../../components/price-chart/price-chart.component';
import { IndicatorPanelComponent } from '../../components/indicator-panel/indicator-panel.component';
import { AiInsightCardComponent } from '../../components/ai-insight-card/ai-insight-card.component';

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
    AiInsightCardComponent
  ],
  template: `
    <div class="ticker-detail">
      <mat-toolbar color="primary" class="detail-toolbar">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <mat-icon class="app-icon">trending_up</mat-icon>
        <span class="app-title">Indicator Explainer</span>
        <span class="spacer"></span>
        @if (currentSymbol()) {
          <div class="symbol-info">
            <span class="current-symbol">{{ currentSymbol()?.toUpperCase() }}</span>
            @if (latestPrice()) {
              <span class="current-price">\${{ latestPrice()!.close | number:'1.2-2' }}</span>
            }
          </div>
        }
      </mat-toolbar>

      <div class="detail-content">
        @if (loading()) {
          <div class="loading-container">
            <mat-progress-spinner diameter="50" mode="indeterminate"></mat-progress-spinner>
            <p>Loading market data...</p>
          </div>
        } @else if (error()) {
          <mat-card class="error-card">
            <mat-card-content>
              <div class="error-content">
                <mat-icon color="warn" class="error-icon">error</mat-icon>
                <h3>Data Not Available</h3>
                <p>{{ error() }}</p>
                <button mat-button color="primary" (click)="goBack()">
                  <mat-icon>arrow_back</mat-icon>
                  Back to Dashboard
                </button>
              </div>
            </mat-card-content>
          </mat-card>
        } @else if (prices().length > 0) {
          <div class="chart-section">
            <app-price-chart 
              [prices]="prices()"
              [indicators]="indicators()"
              [enabledIndicators]="enabledIndicators()"
            />
          </div>

          <div class="controls-insights-section">
            <div class="controls-column">
              <app-indicator-panel
                [indicators]="indicators()"
                [enabledIndicators]="enabledIndicators()"
                (indicatorToggled)="onIndicatorToggled($event)"
              />
            </div>

            <div class="insights-column">
              <app-ai-insight-card
                [symbol]="currentSymbol()!"
                [prices]="prices()"
              />
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .ticker-detail {
      min-height: 100vh;
      background: #f5f5f5;
    }
    
    .detail-toolbar {
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .app-icon {
      margin: 0 12px 0 16px;
      font-size: 24px;
    }
    
    .app-title {
      font-size: 20px;
      font-weight: 500;
    }
    
    .spacer {
      flex: 1;
    }
    
    .symbol-info {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .current-symbol {
      font-size: 18px;
      font-weight: 600;
      padding: 4px 12px;
      background: rgba(255,255,255,0.2);
      border-radius: 16px;
    }
    
    .current-price {
      font-size: 16px;
      font-weight: 500;
      opacity: 0.9;
    }
    
    .detail-content {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }
    
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      color: #666;
    }
    
    .loading-container p {
      margin-top: 16px;
      font-style: italic;
    }
    
    .error-card {
      margin: 40px auto;
      max-width: 500px;
    }
    
    .error-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 24px;
    }
    
    .error-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }
    
    .error-content h3 {
      margin: 0 0 12px 0;
      color: #333;
    }
    
    .error-content p {
      margin: 0 0 24px 0;
      color: #666;
    }
    
    .chart-section {
      margin-bottom: 24px;
    }
    
    .controls-insights-section {
      display: grid;
      gap: 24px;
      grid-template-columns: 1fr;
    }
    
    @media (min-width: 1024px) {
      .controls-insights-section {
        grid-template-columns: 1fr 1fr;
      }
      
      .controls-column {
        order: 1;
      }
      
      .insights-column {
        order: 2;
      }
    }
    
    @media (max-width: 768px) {
      .symbol-info {
        flex-direction: column;
        gap: 8px;
        align-items: flex-end;
      }
      
      .current-symbol {
        font-size: 16px;
      }
      
      .current-price {
        font-size: 14px;
      }
      
      .detail-content {
        padding: 16px;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TickerDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private pricesService = inject(PricesService);
  private indicatorService = inject(IndicatorService);
  private appStore = inject(AppStoreService);

  // Store selectors
  currentSymbol = this.appStore.currentSymbol;
  prices = this.appStore.prices;
  indicators = this.appStore.indicators;
  enabledIndicators = this.appStore.enabledIndicators;
  loading = this.appStore.loading;
  error = this.appStore.error;
  latestPrice = this.appStore.latestPrice;

  ngOnInit() {
    this.route.params.subscribe(params => {
      const symbol = params['symbol']?.toUpperCase();
      if (symbol) {
        this.loadTickerData(symbol);
      }
    });
  }

  private loadTickerData(symbol: string) {
    this.appStore.setCurrentSymbol(symbol);
    this.appStore.setLoading(true);
    this.appStore.setError(null);

    this.pricesService.loadPrices(symbol).subscribe({
      next: (prices) => {
        if (prices.length === 0) {
          this.appStore.setError(`No data available for symbol: ${symbol}. Please try another symbol.`);
        } else {
          this.appStore.setPrices(prices);
          const indicators = this.indicatorService.calculateAllIndicators(prices);
          this.appStore.setIndicators(indicators);
        }
        this.appStore.setLoading(false);
      },
      error: (err) => {
        console.error('Error loading prices:', err);
        this.appStore.setError(`Failed to load data for ${symbol}. Please check the symbol and try again.`);
        this.appStore.setLoading(false);
      }
    });
  }

  onIndicatorToggled(indicator: keyof AppState['enabledIndicators']) {
    this.appStore.toggleIndicator(indicator);
  }

  goBack() {
    this.router.navigate(['/']);
  }
}