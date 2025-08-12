import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TimePeriod } from '../../services/app-store.service';

@Component({
  selector: 'app-time-period-selector',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonToggleModule
  ],
  template: `
    <div class="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
      <span class="text-xs sm:text-sm font-semibold text-gray-700">Time Period:</span>
      <mat-button-toggle-group 
        [value]="selectedPeriod()" 
        (change)="onPeriodChange($event.value)"
        class="bg-white border border-gray-200 rounded-lg shadow-sm"
      >
        <mat-button-toggle 
          value="1D" 
          class="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium transition-all duration-200 hover:bg-gray-50"
        >
          1D
        </mat-button-toggle>
        <mat-button-toggle 
          value="1W" 
          class="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium transition-all duration-200 hover:bg-gray-50"
        >
          1W
        </mat-button-toggle>
        <mat-button-toggle 
          value="1M" 
          class="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium transition-all duration-200 hover:bg-gray-50"
        >
          1M
        </mat-button-toggle>
        <mat-button-toggle 
          value="3M" 
          class="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium transition-all duration-200 hover:bg-gray-50"
        >
          3M
        </mat-button-toggle>
        <mat-button-toggle 
          value="6M" 
          class="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium transition-all duration-200 hover:bg-gray-50"
        >
          6M
        </mat-button-toggle>
        <mat-button-toggle 
          value="1Y" 
          class="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium transition-all duration-200 hover:bg-gray-50"
        >
          1Y
        </mat-button-toggle>
      </mat-button-toggle-group>
    </div>
  `,
  styles: [`
    ::ng-deep .mat-button-toggle-group {
      border: none !important;
    }
    
    ::ng-deep .mat-button-toggle {
      border: none !important;
      border-radius: 6px !important;
      margin: 2px !important;
    }
    
    ::ng-deep .mat-button-toggle-checked {
      background: linear-gradient(135deg, #6366f1 0%, #ec4899 100%) !important;
      color: white !important;
    }
    
    ::ng-deep .mat-button-toggle-checked .mat-button-toggle-label-content {
      color: white !important;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimePeriodSelectorComponent {
  selectedPeriod = input.required<TimePeriod>();
  
  periodChanged = output<TimePeriod>();

  onPeriodChange(period: TimePeriod) {
    this.periodChanged.emit(period);
  }
}
