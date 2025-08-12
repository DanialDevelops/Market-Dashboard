import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriceData, IndicatorData } from '../../services/app-store.service';

@Component({
  selector: 'app-price-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container">
      <svg [attr.viewBox]="viewBox()" class="price-chart">
        <!-- Background grid -->
        <defs>
          <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        <!-- Price line -->
        <path 
          [attr.d]="pricePath()" 
          fill="none" 
          stroke="#3f51b5" 
          stroke-width="2"
          class="price-line"
        />
        
        <!-- SMA 20 line -->
        @if (showSMA20()) {
          <path 
            [attr.d]="sma20Path()" 
            fill="none" 
            stroke="#ff4081" 
            stroke-width="1.5"
            stroke-dasharray="5,5"
            class="sma-line"
          />
        }
        
        <!-- SMA 50 line -->
        @if (showSMA50()) {
          <path 
            [attr.d]="sma50Path()" 
            fill="none" 
            stroke="#ff9800" 
            stroke-width="1.5"
            stroke-dasharray="10,5"
            class="sma-line"
          />
        }
        
        <!-- EMA 12 line -->
        @if (showEMA12()) {
          <path 
            [attr.d]="ema12Path()" 
            fill="none" 
            stroke="#4caf50" 
            stroke-width="1.5"
            class="ema-line"
          />
        }
        
        <!-- EMA 26 line -->
        @if (showEMA26()) {
          <path 
            [attr.d]="ema26Path()" 
            fill="none" 
            stroke="#9c27b0" 
            stroke-width="1.5"
            class="ema-line"
          />
        }
        
        <!-- Price points -->
        @for (point of pricePoints(); track $index) {
          <circle 
            [attr.cx]="point.x" 
            [attr.cy]="point.y" 
            r="3" 
            fill="#3f51b5"
            class="price-point"
            [attr.data-price]="point.price"
            [attr.data-date]="point.date"
          />
        }
      </svg>
      
      <!-- Legend -->
      <div class="legend">
        <div class="legend-item">
          <div class="legend-color price-color"></div>
          <span>Price</span>
        </div>
        @if (showSMA20()) {
          <div class="legend-item">
            <div class="legend-color sma20-color"></div>
            <span>SMA 20</span>
          </div>
        }
        @if (showSMA50()) {
          <div class="legend-item">
            <div class="legend-color sma50-color"></div>
            <span>SMA 50</span>
          </div>
        }
        @if (showEMA12()) {
          <div class="legend-item">
            <div class="legend-color ema12-color"></div>
            <span>EMA 12</span>
          </div>
        }
        @if (showEMA26()) {
          <div class="legend-item">
            <div class="legend-color ema26-color"></div>
            <span>EMA 26</span>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .chart-container {
      width: 100%;
      height: 400px;
      position: relative;
      background: white;
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .price-chart {
      width: 100%;
      height: 350px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
    }
    
    .price-line {
      filter: drop-shadow(0 2px 4px rgba(63, 81, 181, 0.2));
    }
    
    .price-point {
      transition: r 0.2s ease;
      cursor: pointer;
    }
    
    .price-point:hover {
      r: 5;
      filter: drop-shadow(0 2px 8px rgba(63, 81, 181, 0.4));
    }
    
    .legend {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin-top: 12px;
      padding: 8px;
      background: #fafafa;
      border-radius: 4px;
    }
    
    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #666;
    }
    
    .legend-color {
      width: 20px;
      height: 3px;
      border-radius: 2px;
    }
    
    .price-color { background: #3f51b5; }
    .sma20-color { background: #ff4081; }
    .sma50-color { background: #ff9800; }
    .ema12-color { background: #4caf50; }
    .ema26-color { background: #9c27b0; }
    
    .sma20-color, .sma50-color {
      background-image: repeating-linear-gradient(90deg, transparent, transparent 5px, white 5px, white 10px);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PriceChartComponent {
  prices = input.required<PriceData[]>();
  indicators = input.required<IndicatorData>();
  enabledIndicators = input.required<{
    sma20: boolean;
    sma50: boolean;
    ema12: boolean;
    ema26: boolean;
    rsi: boolean;
    macd: boolean;
  }>();

  private readonly chartWidth = 800;
  private readonly chartHeight = 300;
  private readonly padding = 40;

  viewBox = computed(() => `0 0 ${this.chartWidth} ${this.chartHeight}`);
  
  showSMA20 = computed(() => this.enabledIndicators().sma20);
  showSMA50 = computed(() => this.enabledIndicators().sma50);
  showEMA12 = computed(() => this.enabledIndicators().ema12);
  showEMA26 = computed(() => this.enabledIndicators().ema26);

  private priceRange = computed(() => {
    const prices = this.prices();
    if (prices.length === 0) return { min: 0, max: 100 };
    
    const allPrices = prices.map(p => p.close);
    const min = Math.min(...allPrices);
    const max = Math.max(...allPrices);
    const padding = (max - min) * 0.1;
    
    return { 
      min: min - padding, 
      max: max + padding 
    };
  });

  pricePath = computed(() => {
    const prices = this.prices();
    if (prices.length === 0) return '';
    
    const range = this.priceRange();
    const points = prices.map((price, index) => {
      const x = this.padding + (index / (prices.length - 1)) * (this.chartWidth - 2 * this.padding);
      const y = this.padding + (1 - (price.close - range.min) / (range.max - range.min)) * (this.chartHeight - 2 * this.padding);
      return `${x},${y}`;
    });
    
    return `M${points.join('L')}`;
  });

  sma20Path = computed(() => {
    const sma20 = this.indicators().sma20;
    if (!sma20 || sma20.length === 0) return '';
    
    const range = this.priceRange();
    const prices = this.prices();
    const points = sma20.map((value, index) => {
      if (isNaN(value)) return null;
      const x = this.padding + (index / (prices.length - 1)) * (this.chartWidth - 2 * this.padding);
      const y = this.padding + (1 - (value - range.min) / (range.max - range.min)) * (this.chartHeight - 2 * this.padding);
      return `${x},${y}`;
    }).filter(p => p !== null);
    
    return points.length > 0 ? `M${points.join('L')}` : '';
  });

  sma50Path = computed(() => {
    const sma50 = this.indicators().sma50;
    if (!sma50 || sma50.length === 0) return '';
    
    const range = this.priceRange();
    const prices = this.prices();
    const points = sma50.map((value, index) => {
      if (isNaN(value)) return null;
      const x = this.padding + (index / (prices.length - 1)) * (this.chartWidth - 2 * this.padding);
      const y = this.padding + (1 - (value - range.min) / (range.max - range.min)) * (this.chartHeight - 2 * this.padding);
      return `${x},${y}`;
    }).filter(p => p !== null);
    
    return points.length > 0 ? `M${points.join('L')}` : '';
  });

  ema12Path = computed(() => {
    const ema12 = this.indicators().ema12;
    if (!ema12 || ema12.length === 0) return '';
    
    const range = this.priceRange();
    const prices = this.prices();
    const points = ema12.map((value, index) => {
      if (isNaN(value)) return null;
      const x = this.padding + (index / (prices.length - 1)) * (this.chartWidth - 2 * this.padding);
      const y = this.padding + (1 - (value - range.min) / (range.max - range.min)) * (this.chartHeight - 2 * this.padding);
      return `${x},${y}`;
    }).filter(p => p !== null);
    
    return points.length > 0 ? `M${points.join('L')}` : '';
  });

  ema26Path = computed(() => {
    const ema26 = this.indicators().ema26;
    if (!ema26 || ema26.length === 0) return '';
    
    const range = this.priceRange();
    const prices = this.prices();
    const points = ema26.map((value, index) => {
      if (isNaN(value)) return null;
      const x = this.padding + (index / (prices.length - 1)) * (this.chartWidth - 2 * this.padding);
      const y = this.padding + (1 - (value - range.min) / (range.max - range.min)) * (this.chartHeight - 2 * this.padding);
      return `${x},${y}`;
    }).filter(p => p !== null);
    
    return points.length > 0 ? `M${points.join('L')}` : '';
  });

  pricePoints = computed(() => {
    const prices = this.prices();
    const range = this.priceRange();
    
    return prices.map((price, index) => ({
      x: this.padding + (index / (prices.length - 1)) * (this.chartWidth - 2 * this.padding),
      y: this.padding + (1 - (price.close - range.min) / (range.max - range.min)) * (this.chartHeight - 2 * this.padding),
      price: price.close,
      date: price.date
    }));
  });
}