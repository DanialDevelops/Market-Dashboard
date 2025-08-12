import { Component, input, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { AiService } from '../../services/ai.service';
import { PriceData } from '../../services/app-store.service';

@Component({
  selector: 'app-ai-insight-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  template: `
    <mat-card class="ai-insight-card">
      <mat-card-header>
        <mat-card-title class="card-title">
          <mat-icon class="ai-icon">psychology</mat-icon>
          AI Market Insights
        </mat-card-title>
        <div class="card-actions">
          <button 
            mat-icon-button 
            (click)="refreshInsights()"
            [disabled]="loading()"
            matTooltip="Refresh insights"
          >
            <mat-icon [class.spinning]="loading()">refresh</mat-icon>
          </button>
        </div>
      </mat-card-header>

      <mat-card-content>
        @if (loading()) {
          <div class="loading-container">
            <mat-progress-spinner diameter="40" mode="indeterminate"></mat-progress-spinner>
            <p>Analyzing market data...</p>
          </div>
        } @else {
          <!-- Market Sentiment -->
          @if (sentiment()) {
            <div class="sentiment-section">
              <h4>Market Sentiment</h4>
              <div class="sentiment-indicator">
                <mat-chip-set>
                  <mat-chip 
                    [class.bullish]="sentiment()!.sentiment === 'bullish'"
                    [class.bearish]="sentiment()!.sentiment === 'bearish'"
                    [class.neutral]="sentiment()!.sentiment === 'neutral'"
                  >
                    <mat-icon matChipAvatar>
                      {{ getSentimentIcon() }}
                    </mat-icon>
                    {{ sentiment()!.sentiment | titlecase }}
                  </mat-chip>
                </mat-chip-set>
                <div class="confidence">
                  Confidence: {{ sentiment()!.confidence | number:'1.0-0' }}%
                </div>
              </div>
              
              <div class="key-points">
                <h5>Key Points:</h5>
                <ul>
                  @for (point of sentiment()!.keyPoints; track point) {
                    <li>{{ point }}</li>
                  }
                </ul>
              </div>
            </div>
          }

          <!-- AI Summary -->
          @if (summary()) {
            <div class="summary-section">
              <h4>Analysis Summary</h4>
              <p class="summary-text">{{ summary() }}</p>
            </div>
          }

          @if (error()) {
            <div class="error-section">
              <mat-icon color="warn">warning</mat-icon>
              <p>{{ error() }}</p>
            </div>
          }
        }
      </mat-card-content>

      <mat-card-actions>
        <button 
          mat-button 
          color="primary" 
          (click)="refreshInsights()"
          [disabled]="loading()"
        >
          <mat-icon>auto_awesome</mat-icon>
          Generate New Insights
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .ai-insight-card {
      margin-bottom: 24px;
      background: linear-gradient(135deg, #f8f9ff 0%, #fff 100%);
      border: 1px solid #e3f2fd;
    }
    
    .card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #3f51b5;
    }
    
    .ai-icon {
      background: linear-gradient(45deg, #3f51b5, #ff4081);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .card-actions {
      margin-left: auto;
    }
    
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 32px;
      color: #666;
    }
    
    .loading-container p {
      margin-top: 16px;
      font-style: italic;
    }
    
    .spinning {
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    .sentiment-section {
      margin-bottom: 24px;
    }
    
    .sentiment-section h4 {
      margin: 0 0 12px 0;
      color: #333;
      font-size: 16px;
    }
    
    .sentiment-indicator {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }
    
    .confidence {
      font-size: 14px;
      color: #666;
      font-weight: 500;
    }
    
    mat-chip.bullish {
      background-color: #e8f5e8;
      color: #2e7d32;
    }
    
    mat-chip.bearish {
      background-color: #ffebee;
      color: #c62828;
    }
    
    mat-chip.neutral {
      background-color: #f5f5f5;
      color: #616161;
    }
    
    .key-points h5 {
      margin: 0 0 8px 0;
      color: #555;
      font-size: 14px;
    }
    
    .key-points ul {
      margin: 0;
      padding-left: 20px;
    }
    
    .key-points li {
      margin: 4px 0;
      color: #666;
      font-size: 14px;
    }
    
    .summary-section h4 {
      margin: 0 0 12px 0;
      color: #333;
      font-size: 16px;
    }
    
    .summary-text {
      line-height: 1.6;
      color: #555;
      font-size: 15px;
      background: white;
      padding: 16px;
      border-radius: 8px;
      border-left: 4px solid #3f51b5;
      margin: 0;
    }
    
    .error-section {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #d32f2f;
      background: #ffebee;
      padding: 12px;
      border-radius: 4px;
    }
    
    .error-section p {
      margin: 0;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiInsightCardComponent {
  private aiService = inject(AiService);
  
  symbol = input.required<string>();
  prices = input.required<PriceData[]>();

  loading = signal(false);
  summary = signal<string | null>(null);
  sentiment = signal<{
    sentiment: 'bullish' | 'bearish' | 'neutral';
    confidence: number;
    keyPoints: string[];
  } | null>(null);
  error = signal<string | null>(null);

  ngOnInit() {
    this.refreshInsights();
  }

  refreshInsights() {
    if (this.loading()) return;
    
    this.loading.set(true);
    this.error.set(null);

    // Load both insights in parallel
    const summaryPromise = this.aiService.summarizeStock(this.symbol(), this.prices()).toPromise();
    const sentimentPromise = this.aiService.getMarketSentiment(this.symbol()).toPromise();

    Promise.all([summaryPromise, sentimentPromise])
      .then(([summaryResult, sentimentResult]) => {
        this.summary.set(summaryResult || null);
        this.sentiment.set(sentimentResult || null);
      })
      .catch(error => {
        console.error('Error loading AI insights:', error);
        this.error.set('Failed to load AI insights. Please try again.');
      })
      .finally(() => {
        this.loading.set(false);
      });
  }

  getSentimentIcon(): string {
    const sentimentValue = this.sentiment()?.sentiment;
    switch (sentimentValue) {
      case 'bullish': return 'trending_up';
      case 'bearish': return 'trending_down';
      default: return 'trending_flat';
    }
  }
}