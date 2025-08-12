import { Component, inject, output, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MarketDataService } from '../../services/prices.service';

@Component({
  selector: 'app-ticker-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule
  ],
  template: `
    <div class="w-full max-w-2xl mx-auto">
      <div class="relative">
        <div class="relative">
          <input 
            type="text"
            [(ngModel)]="searchTerm"
            (keyup.enter)="performSearch()"
            placeholder="Search for a stock symbol (e.g., AAPL, GOOGL, MSFT)"
            class="w-full px-6 py-4 pl-14 pr-6 text-lg font-medium text-gray-900 bg-white/90 backdrop-blur-sm border-2 border-white/50 rounded-2xl shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 hover:shadow-2xl hover:bg-white/95 placeholder:text-gray-500"
          >
          
          <div class="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center justify-center text-gray-400 cursor-pointer hover:text-primary-500 transition-colors duration-200" (click)="performSearch()">
            <mat-icon class="text-2xl leading-none">search</mat-icon>
          </div>
        </div>
        
        @if (showSuggestions() && filteredSymbols().length > 0) {
          <div class="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto">
            @for (symbol of filteredSymbols(); track symbol) {
              <button 
                type="button"
                (click)="selectSymbol(symbol)"
                class="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center gap-3 group first:rounded-t-xl last:rounded-b-xl"
              >
                <div class="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span class="text-white font-bold text-sm leading-none">{{ symbol.charAt(0) }}</span>
                </div>
                <span class="font-semibold text-gray-900 flex-1">{{ symbol }}</span>
                <span class="text-sm text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-shrink-0">
                  Press to select
                </span>
              </button>
            }
          </div>
        }
      </div>
      
      <div class="mt-6 flex flex-wrap justify-center items-center gap-3">
        <span class="text-sm text-gray-900 font-bold bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm">Popular:</span>
        <div class="flex flex-wrap gap-2">
          @for (symbol of popularSymbols; track symbol) {
            <button 
              type="button"
              (click)="selectSymbol(symbol)"
              class="px-4 py-2 bg-white/90 backdrop-blur-sm border border-white/50 rounded-lg text-sm font-semibold text-gray-900 hover:bg-white hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center justify-center"
            >
              {{ symbol }}
            </button>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    ::ng-deep .mat-mdc-form-field {
      display: none !important;
    }
    
    .overflow-y-auto::-webkit-scrollbar {
      width: 6px;
    }
    
    .overflow-y-auto::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.05);
      border-radius: 3px;
    }
    
    .overflow-y-auto::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.2);
      border-radius: 3px;
    }
    
    .overflow-y-auto::-webkit-scrollbar-thumb:hover {
      background: rgba(0, 0, 0, 0.3);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TickerSearchComponent {
  private marketDataService = inject(MarketDataService);
  
  searchTerm = signal('');
  availableSymbols = signal<string[]>([]);
  
  symbolSelected = output<string>();

  popularSymbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'META', 'NVDA'];

  ngOnInit() {
    this.marketDataService.getAvailableSymbols().subscribe(symbols => {
      this.availableSymbols.set(symbols);
    });
  }

  showSuggestions = () => {
    return this.searchTerm().length > 0;
  };

  filteredSymbols = () => {
    const term = this.searchTerm().toUpperCase();
    return this.availableSymbols().filter(symbol => 
      symbol.includes(term)
    ).slice(0, 8);
  };

  performSearch() {
    const term = this.searchTerm().trim().toUpperCase();
    if (term) {
      const availableSymbols = this.availableSymbols();
      const foundSymbol = availableSymbols.find(symbol => symbol === term);
      
      if (foundSymbol) {
        this.symbolSelected.emit(foundSymbol);
      } else {
        this.symbolSelected.emit(term);
      }
    }
  }

  selectSymbol(symbol: string) {
    this.searchTerm.set(symbol);
    this.symbolSelected.emit(symbol);
  }
}