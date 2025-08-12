import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IndicatorData, AppState } from '../../services/app-store.service';

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
    <mat-card class="indicator-panel">
      <mat-card-header>
        <mat-card-title class="panel-title">
          <mat-icon>timeline</mat-icon>
          Technical Indicators
        </mat-card-title>
      </mat-card-header>
      
      <mat-card-content>
        <div class="indicators-grid">
          <!-- Moving Averages -->
          <div class="indicator-group">
            <h4 class="group-title">Moving Averages</h4>
            
            <div class="indicator-item">
              <div class="indicator-info">
                <mat-slide-toggle 
                  [checked]="enabledIndicators().sma20"
                  (change)="onToggle('sma20')"
                  color="primary"
                >
                  SMA 20
                </mat-slide-toggle>
                <mat-icon 
                  matTooltip="20-period Simple Moving Average" 
                  matTooltipPosition="right"
                  class="info-icon"
                >
                  info_outline
                </mat-icon>
              </div>
              @if (enabledIndicators().sma20 && indicators().sma20) {
                <div class="indicator-value">
                  {{ getLatestValue(indicators().sma20!) | number:'1.2-2' }}
                </div>
              }
            </div>

            <div class="indicator-item">
              <div class="indicator-info">
                <mat-slide-toggle 
                  [checked]="enabledIndicators().sma50"
                  (change)="onToggle('sma50')"
                  color="primary"
                >
                  SMA 50
                </mat-slide-toggle>
                <mat-icon 
                  matTooltip="50-period Simple Moving Average" 
                  matTooltipPosition="right"
                  class="info-icon"
                >
                  info_outline
                </mat-icon>
              </div>
              @if (enabledIndicators().sma50 && indicators().sma50) {
                <div class="indicator-value">
                  {{ getLatestValue(indicators().sma50!) | number:'1.2-2' }}
                </div>
              }
            </div>
          </div>

          <!-- Exponential Moving Averages -->
          <div class="indicator-group">
            <h4 class="group-title">Exponential Moving Averages</h4>
            
            <div class="indicator-item">
              <div class="indicator-info">
                <mat-slide-toggle 
                  [checked]="enabledIndicators().ema12"
                  (change)="onToggle('ema12')"
                  color="accent"
                >
                  EMA 12
                </mat-slide-toggle>
                <mat-icon 
                  matTooltip="12-period Exponential Moving Average" 
                  matTooltipPosition="right"
                  class="info-icon"
                >
                  info_outline
                </mat-icon>
              </div>
              @if (enabledIndicators().ema12 && indicators().ema12) {
                <div class="indicator-value">
                  {{ getLatestValue(indicators().ema12!) | number:'1.2-2' }}
                </div>
              }
            </div>

            <div class="indicator-item">
              <div class="indicator-info">
                <mat-slide-toggle 
                  [checked]="enabledIndicators().ema26"
                  (change)="onToggle('ema26')"
                  color="accent"
                >
                  EMA 26
                </mat-slide-toggle>
                <mat-icon 
                  matTooltip="26-period Exponential Moving Average" 
                  matTooltipPosition="right"
                  class="info-icon"
                >
                  info_outline
                </mat-icon>
              </div>
              @if (enabledIndicators().ema26 && indicators().ema26) {
                <div class="indicator-value">
                  {{ getLatestValue(indicators().ema26!) | number:'1.2-2' }}
                </div>
              }
            </div>
          </div>

          <!-- Oscillators -->
          <div class="indicator-group">
            <h4 class="group-title">Oscillators</h4>
            
            <div class="indicator-item">
              <div class="indicator-info">
                <mat-slide-toggle 
                  [checked]="enabledIndicators().rsi"
                  (change)="onToggle('rsi')"
                  color="warn"
                >
                  RSI (14)
                </mat-slide-toggle>
                <mat-icon 
                  matTooltip="Relative Strength Index - measures overbought/oversold conditions" 
                  matTooltipPosition="right"
                  class="info-icon"
                >
                  info_outline
                </mat-icon>
              </div>
              @if (enabledIndicators().rsi && indicators().rsi) {
                <div class="indicator-value" [class.overbought]="getRSIStatus() === 'overbought'" [class.oversold]="getRSIStatus() === 'oversold'">
                  {{ getLatestValue(indicators().rsi!) | number:'1.2-2' }}
                  <span class="rsi-status">({{ getRSIStatus() }})</span>
                </div>
              }
            </div>

            <div class="indicator-item">
              <div class="indicator-info">
                <mat-slide-toggle 
                  [checked]="enabledIndicators().macd"
                  (change)="onToggle('macd')"
                  color="warn"
                >
                  MACD
                </mat-slide-toggle>
                <mat-icon 
                  matTooltip="Moving Average Convergence Divergence - trend following momentum indicator" 
                  matTooltipPosition="right"
                  class="info-icon"
                >
                  info_outline
                </mat-icon>
              </div>
              @if (enabledIndicators().macd && indicators().macd) {
                <div class="macd-values">
                  <div class="indicator-value">
                    MACD: {{ getLatestValue(indicators().macd!.macd) | number:'1.2-2' }}
                  </div>
                  <div class="indicator-value">
                    Signal: {{ getLatestValue(indicators().macd!.signal) | number:'1.2-2' }}
                  </div>
                  <div class="indicator-value">
                    Histogram: {{ getLatestValue(indicators().macd!.histogram) | number:'1.2-2' }}
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .indicator-panel {
      margin-bottom: 24px;
    }
    
    .panel-title {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #3f51b5;
      font-size: 18px;
    }
    
    .indicators-grid {
      display: grid;
      gap: 24px;
      margin-top: 16px;
    }
    
    .indicator-group {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 16px;
      background: #fafafa;
    }
    
    .group-title {
      margin: 0 0 16px 0;
      color: #666;
      font-size: 14px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .indicator-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #eee;
    }
    
    .indicator-item:last-child {
      border-bottom: none;
    }
    
    .indicator-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .info-icon {
      font-size: 18px;
      color: #999;
      cursor: pointer;
    }
    
    .indicator-value {
      font-weight: 600;
      color: #333;
      text-align: right;
    }
    
    .indicator-value.overbought {
      color: #f44336;
    }
    
    .indicator-value.oversold {
      color: #4caf50;
    }
    
    .rsi-status {
      font-size: 12px;
      font-weight: 400;
      opacity: 0.7;
    }
    
    .macd-values {
      text-align: right;
    }
    
    .macd-values .indicator-value {
      margin: 2px 0;
      font-size: 13px;
    }
    
    @media (min-width: 768px) {
      .indicators-grid {
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndicatorPanelComponent {
  indicators = input.required<IndicatorData>();
  enabledIndicators = input.required<{
    sma20: boolean;
    sma50: boolean;
    ema12: boolean;
    ema26: boolean;
    rsi: boolean;
    macd: boolean;
  }>();

  indicatorToggled = output<keyof AppState['enabledIndicators']>();

  onToggle(indicator: keyof AppState['enabledIndicators']) {
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
    const rsi = this.indicators().rsi;
    if (!rsi) return 'neutral';
    
    const latestRSI = this.getLatestValue(rsi);
    if (latestRSI > 70) return 'overbought';
    if (latestRSI < 30) return 'oversold';
    return 'neutral';
  }
}