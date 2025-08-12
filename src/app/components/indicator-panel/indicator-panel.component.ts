import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TechnicalIndicators, IndicatorSettings } from '../../services/app-store.service';

@Component({
  selector: 'app-indicator-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatSlideToggleModule,
    MatIconModule,
    MatTooltipModule
  ],
  template: `
    <mat-card class="mb-6 relative">
      <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary-500 to-primary-500"></div>
      
      <mat-card-header class="p-4 sm:p-6">
        <mat-card-title class="flex items-center gap-2 text-gray-900 text-lg sm:text-xl font-semibold mb-4">
          <mat-icon class="text-xl sm:text-2xl bg-gradient-to-r from-secondary-500 to-primary-500 bg-clip-text text-transparent">timeline</mat-icon>
          Technical Indicators
        </mat-card-title>
      </mat-card-header>
      
      <mat-card-content>
        <div class="grid gap-4 sm:gap-8 mt-4 grid-cols-1 lg:grid-cols-3">
          <div class="border border-gray-200 rounded-xl p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-white shadow-sm transition-all duration-300 relative overflow-hidden group hover:shadow-xl hover:scale-105 min-h-[240px] sm:min-h-[280px]">
            <div class="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></div>
            
            <h4 class="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide bg-gray-200 px-2 sm:px-3 py-1 sm:py-2 rounded-md inline-block mb-4 sm:mb-6">
              Moving Averages
            </h4>
            
            <div class="space-y-3 sm:space-y-4">
              <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 sm:py-4 border-b border-gray-200 transition-all duration-200 hover:bg-gray-50 hover:px-2 sm:hover:px-3 hover:rounded-md group/item">
                <div class="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-0">
                  <mat-slide-toggle 
                    [checked]="enabledIndicators().sma20"
                    (change)="onToggle('sma20')"
                    color="primary"
                  >
                    <span class="text-sm sm:text-base">SMA 20</span>
                  </mat-slide-toggle>
                  <mat-icon 
                    matTooltip="Simple Moving Average (20 periods)

Purpose: Identifies short-term trend direction
Usage: Price above SMA = bullish, below = bearish
Best for: Short-term trading decisions"
                    [matTooltipClass]="'custom-tooltip'"
                    matTooltipPosition="right"
                    class="text-lg sm:text-xl text-gray-400 cursor-pointer hover:text-primary-500 transition-colors flex-shrink-0"
                  >
                    info_outline
                  </mat-icon>
                </div>
                @if (enabledIndicators().sma20 && technicalIndicators().sma20) {
                  <div class="font-bold text-gray-900 text-right bg-white px-3 sm:px-4 py-1 sm:py-2 rounded-md border border-gray-200 min-w-20 sm:min-w-24 flex-shrink-0 text-sm sm:text-base">
                    {{ getLatestValue(technicalIndicators().sma20!) | number:'1.2-2' }}
                  </div>
                }
              </div>

              <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 sm:py-4 transition-all duration-200 hover:bg-gray-50 hover:px-2 sm:hover:px-3 hover:rounded-md group/item">
                <div class="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-0">
                  <mat-slide-toggle 
                    [checked]="enabledIndicators().sma50"
                    (change)="onToggle('sma50')"
                    color="primary"
                  >
                    <span class="text-sm sm:text-base">SMA 50</span>
                  </mat-slide-toggle>
                  <mat-icon 
                    matTooltip="Simple Moving Average (50 periods)

Purpose: Identifies medium-term trend direction
Usage: Price above SMA = bullish trend, below = bearish
Best for: Medium-term trend analysis"
                    [matTooltipClass]="'custom-tooltip'"
                    matTooltipPosition="right"
                    class="text-lg sm:text-xl text-gray-400 cursor-pointer hover:text-primary-500 transition-colors flex-shrink-0"
                  >
                    info_outline
                  </mat-icon>
                </div>
                @if (enabledIndicators().sma50 && technicalIndicators().sma50) {
                  <div class="font-bold text-gray-900 text-right bg-white px-3 sm:px-4 py-1 sm:py-2 rounded-md border border-gray-200 min-w-20 sm:min-w-24 flex-shrink-0 text-sm sm:text-base">
                    {{ getLatestValue(technicalIndicators().sma50!) | number:'1.2-2' }}
                  </div>
                }
              </div>
            </div>
          </div>

          <div class="border border-gray-200 rounded-xl p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-white shadow-sm transition-all duration-300 relative overflow-hidden group hover:shadow-xl hover:scale-105 min-h-[240px] sm:min-h-[280px]">
            <div class="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></div>
            
            <h4 class="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide bg-gray-200 px-2 sm:px-3 py-1 sm:py-2 rounded-md inline-block mb-4 sm:mb-6">
              Exponential Moving Averages
            </h4>
            
            <div class="space-y-3 sm:space-y-4">
              <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 sm:py-4 border-b border-gray-200 transition-all duration-200 hover:bg-gray-50 hover:px-2 sm:hover:px-3 hover:rounded-md group/item">
                <div class="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-0">
                  <mat-slide-toggle 
                    [checked]="enabledIndicators().ema12"
                    (change)="onToggle('ema12')"
                    color="accent"
                  >
                    <span class="text-sm sm:text-base">EMA 12</span>
                  </mat-slide-toggle>
                  <mat-icon 
                    matTooltip="Exponential Moving Average (12 periods)

Purpose: Faster response to price changes than SMA
Usage: More weight to recent prices
Best for: Short-term momentum trading"
                    [matTooltipClass]="'custom-tooltip'"
                    matTooltipPosition="right"
                    class="text-lg sm:text-xl text-gray-400 cursor-pointer hover:text-primary-500 transition-colors flex-shrink-0"
                  >
                    info_outline
                  </mat-icon>
                </div>
                @if (enabledIndicators().ema12 && technicalIndicators().ema12) {
                  <div class="font-bold text-gray-900 text-right bg-white px-3 sm:px-4 py-1 sm:py-2 rounded-md border border-gray-200 min-w-20 sm:min-w-24 flex-shrink-0 text-sm sm:text-base">
                    {{ getLatestValue(technicalIndicators().ema12!) | number:'1.2-2' }}
                  </div>
                }
              </div>

              <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 sm:py-4 transition-all duration-200 hover:bg-gray-50 hover:px-2 sm:hover:px-3 hover:rounded-md group/item">
                <div class="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-0">
                  <mat-slide-toggle 
                    [checked]="enabledIndicators().ema26"
                    (change)="onToggle('ema26')"
                    color="accent"
                  >
                    <span class="text-sm sm:text-base">EMA 26</span>
                  </mat-slide-toggle>
                  <mat-icon 
                    matTooltip="Exponential Moving Average (26 periods)

Purpose: Medium-term trend following
Usage: Often used with EMA 12 for MACD calculation
Best for: Trend confirmation and MACD signals"
                    [matTooltipClass]="'custom-tooltip'"
                    matTooltipPosition="right"
                    class="text-lg sm:text-xl text-gray-400 cursor-pointer hover:text-primary-500 transition-colors flex-shrink-0"
                  >
                    info_outline
                  </mat-icon>
                </div>
                @if (enabledIndicators().ema26 && technicalIndicators().ema26) {
                  <div class="font-bold text-gray-900 text-right bg-white px-3 sm:px-4 py-1 sm:py-2 rounded-md border border-gray-200 min-w-20 sm:min-w-24 flex-shrink-0 text-sm sm:text-base">
                    {{ getLatestValue(technicalIndicators().ema26!) | number:'1.2-2' }}
                  </div>
                }
              </div>
            </div>
          </div>

          <div class="border border-gray-200 rounded-xl p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-white shadow-sm transition-all duration-300 relative overflow-hidden group hover:shadow-xl hover:scale-105 min-h-[280px] sm:min-h-[320px] lg:col-span-1">
            <div class="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></div>
            
            <h4 class="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide bg-gray-200 px-2 sm:px-3 py-1 sm:py-2 rounded-md inline-block mb-4 sm:mb-6">
              Oscillators
            </h4>
            
            <div class="space-y-3 sm:space-y-4">
              <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 sm:py-4 border-b border-gray-200 transition-all duration-200 hover:bg-gray-50 hover:px-2 sm:hover:px-3 hover:rounded-md group/item">
                <div class="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-0">
                  <mat-slide-toggle 
                    [checked]="enabledIndicators().rsi"
                    (change)="onToggle('rsi')"
                    color="warn"
                  >
                    <span class="text-sm sm:text-base">RSI (14)</span>
                  </mat-slide-toggle>
                  <mat-icon 
                    matTooltip="Relative Strength Index (14 periods)

Purpose: Measures overbought/oversold conditions
Usage: Above 70 = overbought, below 30 = oversold
Best for: Identifying potential reversals"
                    [matTooltipClass]="'custom-tooltip'"
                    matTooltipPosition="right"
                    class="text-lg sm:text-xl text-gray-400 cursor-pointer hover:text-primary-500 transition-colors flex-shrink-0"
                  >
                    info_outline
                  </mat-icon>
                </div>
                @if (enabledIndicators().rsi && technicalIndicators().rsi) {
                  <div class="font-bold text-right px-3 sm:px-4 py-1 sm:py-2 rounded-md border min-w-24 sm:min-w-28 flex-shrink-0 text-sm sm:text-base" 
                       [class]="getRSIClasses()">
                    {{ getLatestValue(technicalIndicators().rsi!) | number:'1.2-2' }}
                    <span class="text-xs font-medium opacity-80 ml-1">({{ getRSIStatus() }})</span>
                  </div>
                }
              </div>

              <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start py-3 sm:py-4 transition-all duration-200 hover:bg-gray-50 hover:px-2 sm:hover:px-3 hover:rounded-md group/item">
                <div class="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-0">
                  <mat-slide-toggle 
                    [checked]="enabledIndicators().macd"
                    (change)="onToggle('macd')"
                    color="warn"
                  >
                    <span class="text-sm sm:text-base">MACD</span>
                  </mat-slide-toggle>
                  <mat-icon 
                    matTooltip="Moving Average Convergence Divergence

Purpose: Trend-following momentum indicator
Usage: MACD line crossing signal line = buy/sell signal
Best for: Trend changes and momentum analysis"
                    [matTooltipClass]="'custom-tooltip'"
                    matTooltipPosition="right"
                    class="text-lg sm:text-xl text-gray-400 cursor-pointer hover:text-primary-500 transition-colors flex-shrink-0"
                  >
                    info_outline
                  </mat-icon>
                </div>
                @if (enabledIndicators().macd && technicalIndicators().macd) {
                  <div class="text-right flex flex-col gap-1 sm:gap-2 w-full sm:w-auto">
                    <div class="font-bold text-gray-900 bg-white px-3 sm:px-4 py-1 sm:py-2 rounded-md border border-gray-200 text-xs sm:text-sm min-w-32 sm:min-w-36 flex-shrink-0">
                      MACD: {{ getLatestValue(technicalIndicators().macd!.macd) | number:'1.2-2' }}
                    </div>
                    <div class="font-bold text-gray-900 bg-white px-3 sm:px-4 py-1 sm:py-2 rounded-md border border-gray-200 text-xs sm:text-sm min-w-32 sm:min-w-36 flex-shrink-0">
                      Signal: {{ getLatestValue(technicalIndicators().macd!.signal) | number:'1.2-2' }}
                    </div>
                    <div class="font-bold text-gray-900 bg-white px-3 sm:px-4 py-1 sm:py-2 rounded-md border border-gray-200 text-xs sm:text-sm min-w-32 sm:min-w-36 flex-shrink-0">
                      Histogram: {{ getLatestValue(technicalIndicators().macd!.histogram) | number:'1.2-2' }}
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    ::ng-deep .mat-mdc-slide-toggle {
      --mdc-switch-selected-track-color: theme('colors.primary.500') !important;
      --mdc-switch-selected-handle-color: white !important;
      --mdc-switch-selected-focus-track-color: theme('colors.primary.700') !important;
      --mdc-switch-selected-hover-track-color: theme('colors.primary.400') !important;
    }
    
    ::ng-deep .mat-mdc-slide-toggle .mdc-switch {
      margin-right: 0.5rem;
    }
    
    .rsi-overbought {
      @apply text-white bg-gradient-to-r from-red-500 to-rose-500 border-red-500 shadow-sm;
    }
    
    .rsi-oversold {
      @apply text-white bg-gradient-to-r from-green-500 to-emerald-500 border-green-500 shadow-sm;
    }
    
    .rsi-neutral {
      @apply text-gray-900 bg-white border-gray-200;
    }

    ::ng-deep .custom-tooltip {
      background: rgba(0, 0, 0, 0.9) !important;
      color: white !important;
      font-size: 14px !important;
      line-height: 1.6 !important;
      padding: 16px 20px !important;
      border-radius: 12px !important;
      max-width: 320px !important;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4) !important;
      backdrop-filter: blur(15px) !important;
      border: 1px solid rgba(255, 255, 255, 0.15) !important;
      white-space: pre-line !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
    }

    ::ng-deep .custom-tooltip::before {
      content: '' !important;
      position: absolute !important;
      top: -6px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      width: 0 !important;
      height: 0 !important;
      border-left: 6px solid transparent !important;
      border-right: 6px solid transparent !important;
      border-bottom: 6px solid rgba(0, 0, 0, 0.9) !important;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndicatorPanelComponent {
  technicalIndicators = input.required<TechnicalIndicators>();
  enabledIndicators = input.required<IndicatorSettings>();

  indicatorToggled = output<keyof IndicatorSettings>();

  onToggle(indicator: keyof IndicatorSettings) {
    this.indicatorToggled.emit(indicator);
  }

  getLatestValue(values: number[]): number {
    if (!values || values.length === 0) return 0;
    for (let i = values.length - 1; i >= 0; i--) {
      if (!isNaN(values[i])) {
        return values[i];
      }
    }
    return 0;
  }

  getRSIStatus(): string {
    const rsi = this.technicalIndicators().rsi;
    if (!rsi) return 'neutral';
    
    const latestRSI = this.getLatestValue(rsi);
    if (latestRSI > 70) return 'overbought';
    if (latestRSI < 30) return 'oversold';
    return 'neutral';
  }

  getRSIClasses(): string {
    const status = this.getRSIStatus();
    switch (status) {
      case 'overbought': return 'rsi-overbought';
      case 'oversold': return 'rsi-oversold';
      default: return 'rsi-neutral';
    }
  }
}