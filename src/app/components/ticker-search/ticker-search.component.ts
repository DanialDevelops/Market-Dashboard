import { Component, inject, output, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { PricesService } from '../../services/prices.service';

@Component({
  selector: 'app-ticker-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatAutocompleteModule
  ],
  template: `
    <div class="ticker-search">
      <mat-form-field appearance="outline" class="search-field">
        <mat-label>Enter Ticker Symbol</mat-label>
        <input 
          matInput 
          [(ngModel)]="searchTerm"
          [matAutocomplete]="auto"
          placeholder="e.g., AAPL, GOOGL, MSFT"
          (keyup.enter)="onSearch()"
        >
        <button 
          matSuffix 
          mat-icon-button 
          (click)="onSearch()"
          [disabled]="!searchTerm().trim()"
        >
          <mat-icon>search</mat-icon>
        </button>
        <mat-autocomplete #auto="matAutocomplete">
          @for (symbol of availableSymbols(); track symbol) {
            <mat-option [value]="symbol">{{ symbol }}</mat-option>
          }
        </mat-autocomplete>
      </mat-form-field>
    </div>
  `,
  styles: [`
    .ticker-search {
      width: 100%;
      max-width: 400px;
    }
    
    .search-field {
      width: 100%;
    }
    
    .search-field ::ng-deep .mat-mdc-form-field-focus-overlay {
      background-color: rgba(63, 81, 181, 0.04);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TickerSearchComponent {
  private pricesService = inject(PricesService);
  
  searchTerm = signal('');
  availableSymbols = signal<string[]>([]);
  
  symbolSelected = output<string>();

  ngOnInit() {
    this.pricesService.getAvailableSymbols().subscribe(symbols => {
      this.availableSymbols.set(symbols);
    });
  }

  onSearch() {
    const term = this.searchTerm().trim().toUpperCase();
    if (term) {
      this.symbolSelected.emit(term);
    }
  }
}