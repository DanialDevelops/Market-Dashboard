import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriceData, TechnicalIndicators, IndicatorSettings } from '../../services/app-store.service';

@Component({
  selector: 'app-price-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full h-[350px] sm:h-[450px] relative bg-white rounded-xl p-3 sm:p-4 shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <svg [attr.viewBox]="viewBox()" class="w-full h-[280px] sm:h-[380px] border border-gray-200 rounded-lg bg-gradient-to-br from-gray-50 to-white relative">
        <defs>
          <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        <defs>
          <radialGradient id="bgGradient1" cx="20%" cy="80%" r="50%">
            <stop offset="0%" stop-color="rgba(99, 102, 241, 0.05)"/>
            <stop offset="100%" stop-color="transparent"/>
          </radialGradient>
          <radialGradient id="bgGradient2" cx="80%" cy="20%" r="50%">
            <stop offset="0%" stop-color="rgba(236, 72, 153, 0.05)"/>
            <stop offset="100%" stop-color="transparent"/>
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#bgGradient1)" />
        <rect width="100%" height="100%" fill="url(#bgGradient2)" />
        
        <path 
          [attr.d]="pricePath()" 
          fill="none" 
          stroke="#3f51b5" 
          stroke-width="2"
          class="drop-shadow-lg stroke-linecap-round stroke-linejoin-round"
        />
        
        @if (showSMA20()) {
          <path 
            [attr.d]="sma20Path()" 
            fill="none" 
            stroke="#ff4081" 
            stroke-width="1.5"
            stroke-dasharray="5,5"
            class="drop-shadow-md stroke-linecap-round stroke-linejoin-round"
          />
        }
        
        @if (showSMA50()) {
          <path 
            [attr.d]="sma50Path()" 
            fill="none" 
            stroke="#ff9800" 
            stroke-width="1.5"
            stroke-dasharray="10,5"
            class="drop-shadow-md stroke-linecap-round stroke-linejoin-round"
          />
        }
        
        @if (showEMA12()) {
          <path 
            [attr.d]="ema12Path()" 
            fill="none" 
            stroke="#4caf50" 
            stroke-width="1.5"
            class="drop-shadow-md stroke-linecap-round stroke-linejoin-round"
          />
        }
        
        @if (showEMA26()) {
          <path 
            [attr.d]="ema26Path()" 
            fill="none" 
            stroke="#9c27b0" 
            stroke-width="1.5"
            class="drop-shadow-md stroke-linecap-round stroke-linejoin-round"
          />
        }
        
        @for (point of pricePoints(); track $index) {
          <circle 
            [attr.cx]="point.x" 
            [attr.cy]="point.y" 
            r="3" 
            fill="#3f51b5"
            class="transition-all duration-200 cursor-pointer drop-shadow-md hover:r-6 hover:drop-shadow-lg hover:stroke-white hover:stroke-2"
            [attr.data-price]="point.price"
            [attr.data-date]="point.date"
          />
        }
      </svg>
      
      <div class="flex flex-wrap gap-2 sm:gap-4 mt-3 p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div class="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-700 font-medium px-2 py-1 rounded-md bg-white border border-gray-200 transition-all duration-200 hover:bg-gray-100 hover:-translate-y-1 hover:shadow-sm">
          <div class="w-4 sm:w-6 h-1 rounded-sm bg-primary-500 shadow-sm"></div>
          <span>Price</span>
        </div>
        @if (showSMA20()) {
          <div class="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-700 font-medium px-2 py-1 rounded-md bg-white border border-gray-200 transition-all duration-200 hover:bg-gray-100 hover:-translate-y-1 hover:shadow-sm">
            <div class="w-4 sm:w-6 h-1 rounded-sm bg-secondary-500 shadow-sm" style="background-image: repeating-linear-gradient(90deg, transparent, transparent 6px, white 6px, white 12px);"></div>
            <span>SMA 20</span>
          </div>
        }
        @if (showSMA50()) {
          <div class="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-700 font-medium px-2 py-1 rounded-md bg-white border border-gray-200 transition-all duration-200 hover:bg-gray-100 hover:-translate-y-1 hover:shadow-sm">
            <div class="w-4 sm:w-6 h-1 rounded-sm bg-orange-500 shadow-sm" style="background-image: repeating-linear-gradient(90deg, transparent, transparent 6px, white 6px, white 12px);"></div>
            <span>SMA 50</span>
          </div>
        }
        @if (showEMA12()) {
          <div class="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-700 font-medium px-2 py-1 rounded-md bg-white border border-gray-200 transition-all duration-200 hover:bg-gray-100 hover:-translate-y-1 hover:shadow-sm">
            <div class="w-4 sm:w-6 h-1 rounded-sm bg-green-500 shadow-sm"></div>
            <span>EMA 12</span>
          </div>
        }
        @if (showEMA26()) {
          <div class="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-700 font-medium px-2 py-1 rounded-md bg-white border border-gray-200 transition-all duration-200 hover:bg-gray-100 hover:-translate-y-1 hover:shadow-sm">
            <div class="w-4 sm:w-6 h-1 rounded-sm bg-purple-500 shadow-sm"></div>
            <span>EMA 26</span>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .stroke-linecap-round {
      stroke-linecap: round;
    }
    
    .stroke-linejoin-round {
      stroke-linejoin: round;
    }
    
    .drop-shadow-lg {
      filter: drop-shadow(0 4px 8px rgba(99, 102, 241, 0.3));
    }
    
    .drop-shadow-md {
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    }
    
    .hover\:r-6:hover {
      r: 6;
    }
    
    .hover\:drop-shadow-lg:hover {
      filter: drop-shadow(0 4px 12px rgba(99, 102, 241, 0.5));
    }
    
    .hover\:stroke-white:hover {
      stroke: white;
    }
    
    .hover\:stroke-2:hover {
      stroke-width: 2;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PriceChartComponent {
  priceData = input.required<PriceData[]>();
  technicalIndicators = input.required<TechnicalIndicators>();
  enabledIndicators = input.required<IndicatorSettings>();

  private readonly chartWidth = 800;
  private readonly chartHeight = 300;
  private readonly padding = 40;

  viewBox = computed(() => `0 0 ${this.chartWidth} ${this.chartHeight}`);
  
  showSMA20 = computed(() => this.enabledIndicators().sma20);
  showSMA50 = computed(() => this.enabledIndicators().sma50);
  showEMA12 = computed(() => this.enabledIndicators().ema12);
  showEMA26 = computed(() => this.enabledIndicators().ema26);

  private priceRange = computed(() => {
    const prices = this.priceData();
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
    const prices = this.priceData();
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
    const sma20 = this.technicalIndicators().sma20;
    if (!sma20 || sma20.length === 0) return '';
    
    const range = this.priceRange();
    const prices = this.priceData();
    const points = sma20.map((value, index) => {
      if (isNaN(value)) return null;
      const x = this.padding + (index / (prices.length - 1)) * (this.chartWidth - 2 * this.padding);
      const y = this.padding + (1 - (value - range.min) / (range.max - range.min)) * (this.chartHeight - 2 * this.padding);
      return `${x},${y}`;
    }).filter(p => p !== null);
    
    return points.length > 0 ? `M${points.join('L')}` : '';
  });

  sma50Path = computed(() => {
    const sma50 = this.technicalIndicators().sma50;
    if (!sma50 || sma50.length === 0) return '';
    
    const range = this.priceRange();
    const prices = this.priceData();
    const points = sma50.map((value, index) => {
      if (isNaN(value)) return null;
      const x = this.padding + (index / (prices.length - 1)) * (this.chartWidth - 2 * this.padding);
      const y = this.padding + (1 - (value - range.min) / (range.max - range.min)) * (this.chartHeight - 2 * this.padding);
      return `${x},${y}`;
    }).filter(p => p !== null);
    
    return points.length > 0 ? `M${points.join('L')}` : '';
  });

  ema12Path = computed(() => {
    const ema12 = this.technicalIndicators().ema12;
    if (!ema12 || ema12.length === 0) return '';
    
    const range = this.priceRange();
    const prices = this.priceData();
    const points = ema12.map((value, index) => {
      if (isNaN(value)) return null;
      const x = this.padding + (index / (prices.length - 1)) * (this.chartWidth - 2 * this.padding);
      const y = this.padding + (1 - (value - range.min) / (range.max - range.min)) * (this.chartHeight - 2 * this.padding);
      return `${x},${y}`;
    }).filter(p => p !== null);
    
    return points.length > 0 ? `M${points.join('L')}` : '';
  });

  ema26Path = computed(() => {
    const ema26 = this.technicalIndicators().ema26;
    if (!ema26 || ema26.length === 0) return '';
    
    const range = this.priceRange();
    const prices = this.priceData();
    const points = ema26.map((value, index) => {
      if (isNaN(value)) return null;
      const x = this.padding + (index / (prices.length - 1)) * (this.chartWidth - 2 * this.padding);
      const y = this.padding + (1 - (value - range.min) / (range.max - range.min)) * (this.chartHeight - 2 * this.padding);
      return `${x},${y}`;
    }).filter(p => p !== null);
    
    return points.length > 0 ? `M${points.join('L')}` : '';
  });

  pricePoints = computed(() => {
    const prices = this.priceData();
    const range = this.priceRange();
    
    return prices.map((price, index) => ({
      x: this.padding + (index / (prices.length - 1)) * (this.chartWidth - 2 * this.padding),
      y: this.padding + (1 - (price.close - range.min) / (range.max - range.min)) * (this.chartHeight - 2 * this.padding),
      price: price.close,
      date: price.date
    }));
  });
}