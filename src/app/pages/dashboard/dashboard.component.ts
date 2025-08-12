import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TickerSearchComponent } from '../../components/ticker-search/ticker-search.component';
import { AppStoreService } from '../../services/app-store.service';

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
    <div class="dashboard">
      <mat-toolbar color="primary" class="main-toolbar">
        <mat-icon class="app-icon">trending_up</mat-icon>
        <span class="app-title">Indicator Explainer</span>
      </mat-toolbar>

      <div class="dashboard-content">
        <div class="hero-section">
          <div class="hero-content">
            <h1 class="hero-title">
              Technical Analysis Made Simple
            </h1>
            <p class="hero-subtitle">
              Enter a stock symbol to visualize price charts with technical indicators and get AI-powered insights
            </p>
            
            <div class="search-container">
              <app-ticker-search (symbolSelected)="onSymbolSelected($event)"></app-ticker-search>
            </div>
          </div>
        </div>

        <div class="features-section">
          <h2 class="section-title">Features</h2>
          <div class="features-grid">
            <mat-card class="feature-card">
              <mat-card-header>
                <mat-card-title>
                  <mat-icon color="primary">show_chart</mat-icon>
                  Interactive Charts
                </mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p>Visualize stock prices with customizable technical indicators including SMA, EMA, RSI, and MACD</p>
              </mat-card-content>
            </mat-card>

            <mat-card class="feature-card">
              <mat-card-header>
                <mat-card-title>
                  <mat-icon color="primary">psychology</mat-icon>
                  AI Insights
                </mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p>Get intelligent analysis and market sentiment powered by AI to help understand price movements</p>
              </mat-card-content>
            </mat-card>

            <mat-card class="feature-card">
              <mat-card-header>
                <mat-card-title>
                  <mat-icon color="primary">tune</mat-icon>
                  Customizable Indicators
                </mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p>Toggle different technical indicators on and off to focus on the metrics that matter to your analysis</p>
              </mat-card-content>
            </mat-card>

            <mat-card class="feature-card">
              <mat-card-header>
                <mat-card-title>
                  <mat-icon color="primary">speed</mat-icon>
                  Real-time Analysis
                </mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p>All calculations are performed in real-time as you toggle indicators for immediate feedback</p>
              </mat-card-content>
            </mat-card>
          </div>
        </div>

        <div class="popular-stocks">
          <h3 class="section-title">Popular Stocks</h3>
          <div class="stock-chips">
            @for (symbol of popularStocks; track symbol) {
              <button 
                mat-button 
                class="stock-chip"
                (click)="onSymbolSelected(symbol)"
              >
                {{ symbol }}
              </button>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .main-toolbar {
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .app-icon {
      margin-right: 12px;
      font-size: 28px;
    }
    
    .app-title {
      font-size: 24px;
      font-weight: 500;
    }
    
    .dashboard-content {
      padding: 0;
    }
    
    .hero-section {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%);
      color: white;
      padding: 80px 20px;
      text-align: center;
    }
    
    .hero-content {
      max-width: 800px;
      margin: 0 auto;
    }
    
    .hero-title {
      font-size: 3rem;
      font-weight: 300;
      margin: 0 0 20px 0;
      text-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .hero-subtitle {
      font-size: 1.2rem;
      opacity: 0.9;
      margin: 0 0 40px 0;
      line-height: 1.6;
    }
    
    .search-container {
      display: flex;
      justify-content: center;
      margin-top: 40px;
    }
    
    .features-section {
      padding: 80px 20px;
      background: #fafafa;
    }
    
    .section-title {
      text-align: center;
      color: #333;
      font-size: 2.5rem;
      font-weight: 300;
      margin: 0 0 50px 0;
    }
    
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .feature-card {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      cursor: default;
    }
    
    .feature-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }
    
    .feature-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #333;
    }
    
    .feature-card mat-icon {
      font-size: 28px;
    }
    
    .popular-stocks {
      padding: 60px 20px;
      background: white;
      text-align: center;
    }
    
    .stock-chips {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 12px;
      max-width: 600px;
      margin: 0 auto;
    }
    
    .stock-chip {
      background: #f5f5f5;
      border: 1px solid #ddd;
      border-radius: 20px;
      padding: 8px 16px;
      transition: all 0.3s ease;
    }
    
    .stock-chip:hover {
      background: #3f51b5;
      color: white;
      transform: translateY(-2px);
    }
    
    @media (max-width: 768px) {
      .hero-title {
        font-size: 2rem;
      }
      
      .hero-subtitle {
        font-size: 1rem;
      }
      
      .features-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }
      
      .features-section {
        padding: 40px 20px;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  private router = inject(Router);
  private appStore = inject(AppStoreService);

  popularStocks = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'META', 'NVDA'];

  onSymbolSelected(symbol: string) {
    this.appStore.setCurrentSymbol(symbol);
    this.router.navigate(['/t', symbol.toLowerCase()]);
  }
}