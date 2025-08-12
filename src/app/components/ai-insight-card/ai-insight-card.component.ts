import { Component, input, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MarketAnalysisService, MarketSentiment } from '../../services/ai.service';
import { PriceData } from '../../services/app-store.service';

@Component({
  selector: 'app-market-insights',
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
    <mat-card class="mb-4 sm:mb-6 bg-gradient-to-br from-slate-50 to-white border border-gray-200 relative overflow-hidden">
      <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-secondary-500"></div>
      
      <mat-card-header class="p-4 sm:p-6">
        <mat-card-title class="flex items-center gap-2 text-gray-900 font-semibold text-base sm:text-lg">
          <mat-icon class="text-xl sm:text-2xl bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">psychology</mat-icon>
          Market Analysis
        </mat-card-title>
        <div class="ml-auto">
          <button 
            mat-icon-button 
            (click)="refreshAnalysis()"
            [disabled]="isLoading()"
            matTooltip="Refresh analysis"
            class="text-gray-600 hover:text-gray-900"
          >
            <mat-icon [class.animate-spin]="isLoading()" class="text-lg sm:text-xl">refresh</mat-icon>
          </button>
        </div>
      </mat-card-header>

      <mat-card-content class="px-4 sm:px-6 pb-4 sm:pb-6">
        @if (isLoading()) {
          <div class="flex flex-col items-center p-6 sm:p-8 text-gray-600 bg-gray-50 rounded-lg my-4">
            <mat-progress-spinner diameter="32" mode="indeterminate" class="text-primary-500 sm:w-10 sm:h-10"></mat-progress-spinner>
            <p class="mt-3 sm:mt-4 italic text-sm sm:text-base">Analyzing market data...</p>
          </div>
        } @else {
          @if (marketSentiment()) {
            <div class="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 class="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">Market Sentiment</h4>
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-2 sm:gap-3">
                <mat-chip-set>
                  <mat-chip 
                    [class]="getSentimentClasses()"
                  >
                    <mat-icon matChipAvatar class="text-sm sm:text-base">
                      {{ getSentimentIcon() }}
                    </mat-icon>
                    <span class="text-sm sm:text-base">{{ marketSentiment()!.sentiment | titlecase }}</span>
                  </mat-chip>
                </mat-chip-set>
                <div class="text-xs sm:text-sm text-gray-600 font-medium bg-white px-2 py-1 rounded-md border border-gray-200">
                  Confidence: {{ marketSentiment()!.confidence | number:'1.0-0' }}%
                </div>
              </div>
              
              <div>
                <h5 class="text-sm sm:text-base font-semibold text-gray-700 mb-2">Key Points:</h5>
                <ul class="pl-4 sm:pl-5">
                  @for (point of marketSentiment()!.keyPoints; track point) {
                    <li class="my-1 text-xs sm:text-sm text-gray-600 leading-relaxed relative">
                      <span class="absolute -left-2 sm:-left-3 text-primary-500 font-bold">•</span>
                      {{ point }}
                    </li>
                  }
                </ul>
              </div>
            </div>
          }

          @if (technicalAnalysis()) {
            <div>
              <h4 class="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">Technical Analysis</h4>
              <p class="leading-relaxed text-gray-700 text-sm sm:text-base bg-white p-3 sm:p-4 rounded-lg border-l-4 border-primary-500 shadow-sm border border-gray-200">
                {{ technicalAnalysis() }}
              </p>
            </div>
          }

          @if (errorMessage()) {
            <div class="flex items-center gap-2 text-red-500 bg-gradient-to-br from-red-50 to-white p-3 rounded-md border border-red-500 my-4">
              <mat-icon class="text-lg sm:text-xl">warning</mat-icon>
              <p class="font-medium text-sm sm:text-base">{{ errorMessage() }}</p>
            </div>
          }
        }
      </mat-card-content>

      <mat-card-actions class="p-3 sm:p-4 bg-gray-50 border-t border-gray-200">
        <button 
          mat-button 
          color="primary" 
          (click)="refreshAnalysis()"
          [disabled]="isLoading()"
          class="bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-lg disabled:bg-gray-300 disabled:text-gray-500 disabled:transform-none disabled:shadow-none text-sm sm:text-base"
        >
          <mat-icon class="text-lg sm:text-xl">auto_awesome</mat-icon>
          <span class="hidden sm:inline">Generate New Analysis</span>
          <span class="sm:hidden">New Analysis</span>
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .bullish-chip {
      @apply bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold shadow-sm;
    }
    
    .bearish-chip {
      @apply bg-gradient-to-r from-red-500 to-rose-500 text-white font-semibold shadow-sm;
    }
    
    .neutral-chip {
      @apply bg-gradient-to-r from-gray-400 to-gray-500 text-white font-semibold shadow-sm;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketInsightsComponent {
  private marketAnalysisService = inject(MarketAnalysisService);
  
  symbol = input.required<string>();
  priceData = input.required<PriceData[]>();

  isLoading = signal(false);
  technicalAnalysis = signal<string | null>(null);
  marketSentiment = signal<MarketSentiment | null>(null);
  errorMessage = signal<string | null>(null);

  ngOnInit() {
    this.refreshAnalysis();
  }

  refreshAnalysis() {
    if (this.isLoading()) return;
    
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const analysisPromise = this.marketAnalysisService.generateTechnicalAnalysis(this.symbol(), this.priceData()).toPromise();
    const sentimentPromise = this.marketAnalysisService.analyzeMarketSentiment(this.symbol()).toPromise();

    Promise.all([analysisPromise, sentimentPromise])
      .then(([analysisResult, sentimentResult]) => {
        this.technicalAnalysis.set(analysisResult || null);
        this.marketSentiment.set(sentimentResult || null);
      })
      .catch(error => {
        console.error('Error loading market analysis:', error);
        this.errorMessage.set('Failed to load market analysis. Please try again.');
      })
      .finally(() => {
        this.isLoading.set(false);
      });
  }

  getSentimentIcon(): string {
    const sentiment = this.marketSentiment()?.sentiment;
    switch (sentiment) {
      case 'bullish': return 'trending_up';
      case 'bearish': return 'trending_down';
      default: return 'trending_flat';
    }
  }

  getSentimentClasses(): string {
    const sentiment = this.marketSentiment()?.sentiment;
    switch (sentiment) {
      case 'bullish': return 'bullish-chip';
      case 'bearish': return 'bearish-chip';
      default: return 'neutral-chip';
    }
  }
}